-- Drop existing tables if they exist to prevent errors on re-run
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS visit_requests CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS property_type CASCADE;
DROP TYPE IF EXISTS target_category CASCADE;
DROP TYPE IF EXISTS gas_type CASCADE;
DROP TYPE IF EXISTS property_status CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;

-- Create custom types for our enums
CREATE TYPE user_role AS ENUM ('TENANT', 'LANDLORD', 'ADMIN');
CREATE TYPE property_type AS ENUM ('FLAT', 'ROOM', 'STORE');
CREATE TYPE target_category AS ENUM ('FAMILY', 'BACHELOR_STUDENT', 'FEMALE_STUDENT', 'COMMERCIAL', 'ANY');
CREATE TYPE gas_type AS ENUM ('TITAS_LINE', 'CYLINDER', 'NONE');
CREATE TYPE property_status AS ENUM ('ACTIVE', 'PENDING', 'RENTED', 'REJECTED');
CREATE TYPE request_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- USERS TABLE
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'TENANT',
  full_name TEXT NOT NULL,
  phone_number TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  nid_front_url TEXT,
  nid_back_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- Trigger to automatically create a user profile when they sign up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User'),
    CASE 
      WHEN new.raw_user_meta_data->>'role' = 'ADMIN' THEN 'ADMIN'::user_role
      WHEN new.raw_user_meta_data->>'role' = 'LANDLORD' THEN 'LANDLORD'::user_role
      ELSE 'TENANT'::user_role
    END
  );
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- PROPERTIES TABLE
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  landlord_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  title_bn TEXT,
  property_type property_type NOT NULL,
  category target_category NOT NULL,
  division TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT NOT NULL,
  address_bn TEXT,
  rent_amount NUMERIC NOT NULL,
  advance_amount NUMERIC NOT NULL,
  service_charge NUMERIC NOT NULL,
  gas_type gas_type NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  balconies INTEGER,
  square_feet NUMERIC NOT NULL,
  floor_number INTEGER NOT NULL,
  total_floors INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  available_from TEXT NOT NULL,
  available_from_bn TEXT,
  is_verified BOOLEAN DEFAULT false,
  status property_status DEFAULT 'PENDING',
  house_rules TEXT[] DEFAULT '{}',
  house_rules_bn TEXT[] DEFAULT '{}',
  description TEXT,
  description_bn TEXT,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active properties" ON properties FOR SELECT USING (status = 'ACTIVE' OR status = 'RENTED');
CREATE POLICY "Landlords can view their own properties" ON properties FOR SELECT USING (auth.uid() = landlord_id);
CREATE POLICY "Landlords can insert properties" ON properties FOR INSERT WITH CHECK (
  auth.uid() = landlord_id AND 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'LANDLORD')
);
CREATE POLICY "Landlords can update their own properties" ON properties FOR UPDATE USING (
  auth.uid() = landlord_id AND 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'LANDLORD')
);
CREATE POLICY "Admins have full access to properties" ON properties FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- VISIT REQUESTS TABLE
CREATE TABLE visit_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) NOT NULL,
  tenant_id UUID REFERENCES users(id) NOT NULL,
  preferred_date TEXT NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  status request_status DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for visit requests
ALTER TABLE visit_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants can view their own requests" ON visit_requests FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Landlords can view requests for their properties" ON visit_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM properties WHERE id = visit_requests.property_id AND landlord_id = auth.uid())
);
CREATE POLICY "Tenants can insert requests" ON visit_requests FOR INSERT WITH CHECK (
  auth.uid() = tenant_id AND 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'TENANT')
);
CREATE POLICY "Landlords can update request status" ON visit_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM properties WHERE id = visit_requests.property_id AND landlord_id = auth.uid())
);
CREATE POLICY "Admins have full access to requests" ON visit_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- CHAT MESSAGES TABLE
CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES properties(id) NOT NULL,
  sender_id UUID REFERENCES users(id) NOT NULL,
  receiver_id UUID REFERENCES users(id) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for chat messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own messages" ON chat_messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Users can insert messages" ON chat_messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id
);
CREATE POLICY "Admins have full access to chats" ON chat_messages FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

-- FAVORITES TABLE
CREATE TABLE favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  property_id UUID REFERENCES properties(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, property_id)
);

-- RLS for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- STORAGE CONFIGURATION
-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true) 
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('verification-documents', 'verification-documents', false) 
ON CONFLICT (id) DO NOTHING;

-- RLS for storage.objects
-- Drop existing policies if they exist to prevent errors on re-run
DROP POLICY IF EXISTS "Anyone can view property images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

DROP POLICY IF EXISTS "Admins can view verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Landlords can upload verification documents" ON storage.objects;
DROP POLICY IF EXISTS "Landlords can view own verification documents" ON storage.objects;

-- Enable RLS for objects if not already enabled (Supabase often does this by default, but to be safe)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Note: In older Supabase versions, 'owner' column exists in storage.objects and tracks the uploader UID. 
CREATE POLICY "Anyone can view property images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'property-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'property-images' AND 
  auth.uid() = owner
);

CREATE POLICY "Users can delete their own images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'property-images' AND 
  auth.uid() = owner
);

-- Policies for verification-documents bucket (Private)
CREATE POLICY "Admins can view verification documents" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'verification-documents' AND 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN')
);

CREATE POLICY "Landlords can upload verification documents" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'verification-documents' AND 
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'LANDLORD')
);

CREATE POLICY "Landlords can view own verification documents" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'verification-documents' AND 
  auth.uid() = owner
);
