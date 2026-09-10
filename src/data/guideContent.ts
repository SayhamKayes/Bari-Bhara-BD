export interface GuideSection {
  id: string;
  stepNumber: number;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  badge: string;
  content: {
    descriptionBn: string;
    keyPointsBn: string[];
    codeSnippets?: {
      language: string;
      fileName: string;
      code: string;
    }[];
    tipsBn?: string[];
  };
}

export const BANGLA_STEP_BY_STEP_GUIDE: GuideSection[] = [
  {
    id: 'roles-and-architecture',
    stepNumber: 1,
    titleBn: '১. সিস্টেম পরিচিতি, রোল ও উপযুক্ত নামকরণ',
    titleEn: '1. System Roles & Architecture Overview',
    summaryBn: '৩টি ইউজার রোলের সঠিক টার্মিনোলজি ও পূর্ণাঙ্গ সিস্টেম স্ট্রাকচার',
    badge: 'আর্কিটেকচার',
    content: {
      descriptionBn: `বাংলাদেশে ভাড়া ও আবাসন সংক্রান্ত প্ল্যাটফর্মের ক্ষেত্রে ৩টি রোল রাখার সবচেয়ে প্রফেশনাল ও স্ট্যান্ডার্ড নামকরণ হলো:
1. **Tenant (ভাড়াটিয়া / রেন্টার)**: যারা ফ্ল্যাট, স্টুডেন্ট মেস/রুম অথবা বাণিজ্যিক দোকান বা শোরুম ভাড়া নিতে খুঁজছেন।
2. **Landlord / Property Owner (বাড়িওয়ালা / মালিক / ল্যান্ডলর্ড)**: "Supplier" শব্দের চেয়ে **"Landlord"** বা **"Property Owner" (বাড়িওয়ালা / প্রপার্টি ওনার)** বলা বেশি যুক্তিযুক্ত ও স্থানীয়ভাবে গ্রহণযোগ্য। তারা তাদের ফ্ল্যাট, সিঙ্গেল রুম, বা দোকান লিস্টিং করবেন।
3. **Super Admin (সিস্টেম অ্যাডমিন)**: যিনি ভেরিফিকেশন, রিপোর্ট ও প্ল্যাটফর্ম নিয়ন্ত্রণ করবেন।

**প্রপার্টি ক্যাটাগরি ও সাব-ক্যাটাগরি:**
- **ফ্ল্যাট / বাসা (Residential Flat)**: ফ্যামিলি ফ্ল্যাট, সাবলেট, ডুপ্লেক্স।
- **রুম / মেস (Student / Bachelor Room)**: ছাত্র মেস, ছাত্রী হোস্টেল, কর্মজীবী রুম।
- **বাণিজ্যিক স্পেস (Commercial Store / Shop)**: গ্রোসারি শপ, ফার্মেসি, শোরুম, অফিস স্পেস।`,
      keyPointsBn: [
        'ফ্রন্টএন্ড: React.js (বা Next.js) + Tailwind CSS + Lucide Icons + Motion',
        'ব্যাকএন্ড: Django + Django REST Framework (DRF) + Django Channels (WebSockets)',
        'ডেটাবেজ: PostgreSQL (রিলেশনাল ডেটা ও জিও-লোকেশন কোয়েরির জন্য সেরা)',
        'রিয়েল-টাইম ইঞ্জিন: Redis + Daphne (ASGI) - ইনস্ট্যান্ট নোটিফিকেশন ও চ্যাটের জন্য',
        'ভবিষ্যতের মোবাইল অ্যাপ: React Native (Expo) - একই Django API ব্যবহার করবে',
        'ভবিষ্যতের পিসি সফটওয়্যার: Electron বা Tauri (React কোডবেস রিউজ হবে)'
      ],
      codeSnippets: [
        {
          language: 'bash',
          fileName: 'project-structure.txt',
          code: `rent_bd_backend/
├── manage.py
├── rent_core/            # Main Django project settings & ASGI
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py           # WebSockets configuration
│   └── routing.py
├── apps/
│   ├── users/            # Custom User, Role (Tenant, Landlord, Admin), Auth
│   ├── properties/       # Flat, Room, Store listings, Amenities, Images
│   ├── bookings/         # Visit scheduling & rental requests
│   ├── chat/             # Real-time WebSockets messaging
│   └── payments/         # bKash / Nagad / SSLCOMMERZ integration
└── media/ & static/`
        }
      ]
    }
  },
  {
    id: 'database-design',
    stepNumber: 2,
    titleBn: '২. PostgreSQL ডেটাবেজ ও Django Models ডিজাইন',
    titleEn: '2. PostgreSQL Database Schema & Django Models',
    summaryBn: 'ইউজার, প্রপার্টি, ক্যাটাগরি, ইমেজ ও বুকিংয়ের জন্য কমপ্লিট রিলেশনাল মডেল',
    badge: 'ডেটাবেজ',
    content: {
      descriptionBn: 'সিস্টেমে দ্রুত ফিল্টারিং এবং নিখুঁত রিলেশনশিপ বজায় রাখতে PostgreSQL এর রিলেশনাল স্কিমা তৈরি করতে হবে। নিচে Django এর জন্য অপ্টিমাইজড `models.py` কোড দেওয়া হলো:',
      keyPointsBn: [
        'Custom User Model যেখানে `role` (TENANT, LANDLORD, ADMIN) ডিফাইন করা থাকবে',
        'Property Model যাতে ফ্ল্যাট, রুম ও স্টোর-এর জন্য ভিন্ন ভিন্ন ফিল্ড ও ইউটিলিটি (তিতাস গ্যাস/সিলিন্ডার) সাপোর্ট করে',
        'PropertyImage মডেল (Multiple Image Upload এর জন্য One-to-Many রিলেশন)',
        'VisitRequest / Booking মডেল (ভাড়ার আবেদন ও ভিজিট শিডিউল ট্র্যাকিং)',
        'Review & Rating মডেল (ভাড়াটিয়াদের রিভিউয়ের জন্য)'
      ],
      codeSnippets: [
        {
          language: 'python',
          fileName: 'apps/users/models.py',
          code: `from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class RoleChoices(models.TextChoices):
        TENANT = 'TENANT', 'Tenant (ভাড়াটিয়া)'
        LANDLORD = 'LANDLORD', 'Landlord (বাড়িওয়ালা / মালিক)'
        ADMIN = 'ADMIN', 'Super Admin (অ্যাডমিন)'

    role = models.CharField(max_length=20, choices=RoleChoices.choices, default=RoleChoices.TENANT)
    phone = models.CharField(max_length=15, unique=True)
    nid_number = models.CharField(max_length=30, blank=True, null=True)
    is_nid_verified = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"`
        },
        {
          language: 'python',
          fileName: 'apps/properties/models.py',
          code: `from django.db import models
from django.conf import settings

class Property(models.Model):
    class PropertyType(models.TextChoices):
        FLAT = 'FLAT', 'Flat (ফ্ল্যাট/বাসা)'
        ROOM = 'ROOM', 'Room (সিঙ্গেল/শেয়ারড রুম)'
        STORE = 'STORE', 'Store / Commercial Shop (দোকান/বাণিজ্যিক)'

    class TargetCategory(models.TextChoices):
        FAMILY = 'FAMILY', 'Family (পরিবার)'
        BACHELOR_STUDENT = 'BACHELOR_STUDENT', 'Male Student / Bachelor (ছাত্র/ব্যাচেলর)'
        FEMALE_STUDENT = 'FEMALE_STUDENT', 'Female Student / Working Women (ছাত্রী/মহিলা)'
        COMMERCIAL = 'COMMERCIAL', 'Commercial / Shop (দোকান/শোরুম)'
        ANY = 'ANY', 'Any Category'

    class GasType(models.TextChoices):
        TITAS_LINE = 'TITAS_LINE', 'Titas Line Gas'
        CYLINDER = 'CYLINDER', 'LPG Cylinder'
        NONE = 'NONE', 'No Gas (Commercial)'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Admin Approval'
        ACTIVE = 'ACTIVE', 'Active / Available'
        RENTED = 'RENTED', 'Rented Out'
        REJECTED = 'REJECTED', 'Rejected'

    landlord = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties')
    title = models.CharField(max_length=255)
    property_type = models.CharField(max_length=20, choices=PropertyType.choices)
    category = models.CharField(max_length=30, choices=TargetCategory.choices)
    
    # Location
    division = models.CharField(max_length=50, default='Dhaka')
    city = models.CharField(max_length=50, default='Dhaka')
    area = models.CharField(max_length=100)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Pricing in BDT
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    advance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    service_charge = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    # Specs
    gas_type = models.CharField(max_length=20, choices=GasType.choices, default=GasType.TITAS_LINE)
    bedrooms = models.PositiveIntegerField(null=True, blank=True)
    bathrooms = models.PositiveIntegerField(null=True, blank=True)
    square_feet = models.PositiveIntegerField()
    floor_number = models.PositiveIntegerField(default=1)
    total_floors = models.PositiveIntegerField(default=1)
    
    amenities = models.JSONField(default=list, blank=True)  # ['Lift', 'Generator', '24/7 Guard']
    house_rules = models.JSONField(default=list, blank=True)
    available_from = models.CharField(max_length=50, default='Immediate')
    
    description = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    is_verified = models.BooleanField(default=False)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_photos/')
    is_primary = models.BooleanField(default=False)`
        }
      ]
    }
  },
  {
    id: 'drf-api-setup',
    stepNumber: 3,
    titleBn: '৩. Django REST Framework (DRF) ও JWT অথেনটিকেশন',
    titleEn: '3. Django REST Framework & JWT Authentication',
    summaryBn: 'সিকিউর RESTful API, ফিল্টারিং, পারমিশন ক্লাস ও টোকেন অথেনটিকেশন',
    badge: 'API & ব্যাকএন্ড',
    content: {
      descriptionBn: 'Django REST Framework এবং `djangorestframework-simplejwt` ব্যবহার করে নিরাপদ লগইন, সাইন-আপ এবং ফিল্টারিং API তৈরি করুন।',
      keyPointsBn: [
        'JWT Token Based Login (Access Token & Refresh Token)',
        'Custom Permissions: `IsLandlordOrReadOnly`, `IsAdminUser`',
        'Django Filter Backend: শহর, এলাকা, ভাড়ার রেঞ্জ, বেডরুম ও গ্যাস টাইপ দিয়ে দ্রুত ফিল্টার'
      ],
      codeSnippets: [
        {
          language: 'python',
          fileName: 'apps/properties/views.py',
          code: `from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property
from .serializers import PropertySerializer

class IsLandlordOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in ['LANDLORD', 'ADMIN']

class PropertyViewSet(viewsets.ModelViewSet):
    queryset = Property.objects.filter(status='ACTIVE').order_by('-created_at')
    serializer_class = PropertySerializer
    permission_classes = [IsLandlordOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['property_type', 'category', 'division', 'area', 'gas_type', 'bedrooms']
    search_fields = ['title', 'address', 'area', 'description']
    ordering_fields = ['rent_amount', 'created_at', 'views_count']

    def perform_create(self, serializer):
        # Automatically assign logged in landlord
        serializer.save(landlord=self.request.user)`
        }
      ]
    }
  },
  {
    id: 'realtime-channels',
    stepNumber: 4,
    titleBn: '৪. রিয়েল-টাইম আর্কিটেকচার (Django Channels + WebSockets + Redis)',
    titleEn: '4. Real-time Architecture with Channels & WebSockets',
    summaryBn: 'রিয়েল-টাইম চ্যাট, নতুন লিস্টিং এলার্ট ও ইনস্ট্যান্ট বুকিং নোটিফিকেশন',
    badge: 'রিয়েল-টাইম',
    content: {
      descriptionBn: 'বাড়িওয়ালা ও ভাড়াটিয়ার মধ্যে তাত্ক্ষণিক চ্যাট (Realtime Chat) এবং বুকিং রিকোয়েস্টের নোটিফিকেশন পেতে Django Channels এবং Redis ব্যবহার করা হয়।',
      keyPointsBn: [
        'ASGI সার্ভার হিসেবে Daphne বা Uvicorn ব্যবহার করা হয়',
        'Redis Channel Layer দিয়ে মাল্টিপল কানেকশন সিঙ্ক রাখা হয়',
        'WebSockets এর মাধ্যমে রিলোড ছাড়াই নতুন মেসেজ পৌঁছায়'
      ],
      codeSnippets: [
        {
          language: 'python',
          fileName: 'apps/chat/consumers.py',
          code: `import json
from channels.generic.websocket import AsyncWebsocketConsumer

class PropertyChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.property_id = self.scope['url_route']['kwargs']['property_id']
        self.room_group_name = f'chat_property_{self.property_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_name = data['sender_name']
        sender_role = data['sender_role']

        # Broadcast to room
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_name': sender_name,
                'sender_role': sender_role,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender_name': event['sender_name'],
            'sender_role': event['sender_role']
        }))`
        }
      ]
    }
  },
  {
    id: 'react-frontend',
    stepNumber: 5,
    titleBn: '৫. React ফ্রন্টএন্ড স্ট্রাকচার ও স্টেট ম্যানেজমেন্ট',
    titleEn: '5. Modern React Frontend & State Architecture',
    summaryBn: 'কম্পোনেন্ট ডিজাইন, রেসপনসিভ ফিল্টার ও API হ্যান্ডলিং',
    badge: 'ফ্রন্টএন্ড',
    content: {
      descriptionBn: 'React 18+ এ Tailwind CSS ও Lucide Icons দিয়ে ক্লিন, মডার্ন ও মোবাইল-ফ্রেন্ডলি UI তৈরি করতে হবে। ইউজার রোল অনুযায়ী ভিউ রেন্ডার হবে।',
      keyPointsBn: [
        'Role-based Routing: Protected Routes (ভাড়াটিয়া ড্যাশবোর্ড, বাড়িওয়ালা প্রোপার্টি ম্যানেজার, অ্যাডমিন প্যানেল)',
        'Zustand বা TanStack Query (React Query) দিয়ে API কল ও ক্যাশিং',
        'ইমেজ প্রিভিউ ও ড্র্যাগ-অ্যান্ড-ড্রপ আপলোড হ্যান্ডলার'
      ],
      codeSnippets: [
        {
          language: 'typescript',
          fileName: 'src/api/client.ts',
          code: `import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Automatically inject JWT Token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default API;`
        }
      ]
    }
  },
  {
    id: 'mobile-and-pc',
    stepNumber: 6,
    titleBn: '৬. মোবাইল ও পিসি অ্যাপ স্ট্র্যাটেজি (Future Roadmap)',
    titleEn: '6. Mobile (React Native) & Desktop (Tauri/Electron) Strategy',
    summaryBn: 'একই Django ব্যাকএন্ড ব্যবহার করে অ্যান্ড্রয়েড, আইওএস এবং ডেস্কটপ অ্যাপ তৈরি',
    badge: 'ক্রস প্ল্যাটফর্ম',
    content: {
      descriptionBn: 'যেহেতু ব্যাকএন্ড সম্পূর্ণ RESTful API এবং WebSockets নির্ভর, তাই একই ব্যাকএন্ডকে কাজে লাগিয়ে পরবর্তীতে খুব সহজে মোবাইল ও পিসি অ্যাপ তৈরি করা সম্ভব:',
      keyPointsBn: [
        'মোবাইল অ্যাপ (Android & iOS): React Native (Expo) দিয়ে তৈরি করবেন। এতে React এর কোড লজিক এবং কম্পোনেন্ট স্ট্রাকচার সরাসরি কাজে লাগবে।',
        'পুশ নোটিফিকেশন: Firebase Cloud Messaging (FCM) দিয়ে নতুন বাড়ি ভাড়া রিকোয়েস্টের সরাসরি নোটিফিকেশন পাঠানো যাবে।',
        'পিসি অ্যাপ (Windows & Mac Desktop): Tauri (লাইটওয়েট ও সুপার ফাস্ট) অথবা Electron ব্যবহার করবেন।'
      ]
    }
  },
  {
    id: 'bangladesh-features',
    stepNumber: 7,
    titleBn: '৭. বাংলাদেশি বিশেষ ফিচার ও পেমেন্ট গেটওয়ে',
    titleEn: '7. Bangladesh Local Features & Payment Gateway',
    summaryBn: 'বিকাশ/নগদ পেমেন্ট, তিতাস/সিলিন্ডার গ্যাস ফিল্টার এবং জাতীয় পরিচয়পত্র ভেরিফিকেশন',
    badge: 'লোকালাইজেশন',
    content: {
      descriptionBn: 'বাংলাদেশের প্রেক্ষাপটে সফল হতে হলে নিচের বিশেষ ফিচারগুলো ব্যাকএন্ডে অন্তর্ভুক্ত রাখতে হবে:',
      keyPointsBn: [
        'পেমেন্ট গেটওয়ে (bKash, Nagad, Rocket, SSLCOMMERZ): সাবস্ক্রিপশন বা প্রোপার্টি ফিচারিং ফি নেওয়ার জন্য।',
        'ইউটিলিটি ফিল্টার: তিতাস পাইপলাইন গ্যাস নাকি সিলিন্ডার, ওয়াসা পানির সাপ্লাই, প্রিপেইড বিদ্যুৎ মিটার ইত্যাদি নির্দিষ্ট করার সুযোগ।',
        'জাতীয় পরিচয়পত্র (NID) ভেরিফিকেশন: ভুয়া বাড়িওয়ালা ও স্ক্যাম প্রতিরোধে অ্যাডমিন প্যানেলে NID ইমেজ রিভিউ ও ভেরিফাইড ব্যাজ দেওয়া।',
        'বাংলা ও ইংরেজি ভাষা সাপোর্ট (Bilingual localization).'
      ]
    }
  },
  {
    id: 'deployment-guide',
    stepNumber: 8,
    titleBn: '৮. ডেপ্লয়মেন্ট ও প্রোডাকশন গাইড',
    titleEn: '8. Deployment & Production Setup (VPS, Nginx, Docker)',
    summaryBn: 'Ubuntu VPS এ Nginx, Gunicorn, Daphne ASGI, SSL ও PostgreSQL কনফিগারেশন',
    badge: 'ডেপ্লয়মেন্ট',
    content: {
      descriptionBn: 'প্রোডাকশনে অ্যাপটি হোস্ট করার জন্য DigitalOcean, AWS বা Linode এর একটি Ubuntu VPS সবচেয়ে সাশ্রয়ী ও উপযুক্ত।',
      keyPointsBn: [
        'Nginx: রিভার্স প্রক্সি এবং স্ট্যাটিক ফাইল ক্যাশিং',
        'Gunicorn (WSGI) + Daphne (ASGI): REST API এবং WebSockets হ্যান্ডলিং',
        'Certbot (Let\'s Encrypt): ফ্রি HTTPS SSL সার্টিফিকেট',
        'PostgreSQL: সিকিউর প্রোডাকশন ডেটাবেজ সেটআপ'
      ],
      codeSnippets: [
        {
          language: 'nginx',
          fileName: '/etc/nginx/sites-available/rentbd',
          code: `server {
    server_name api.rentbd.com;

    location /static/ {
        alias /var/www/rentbd/static/;
    }
    location /media/ {
        alias /var/www/rentbd/media/;
    }

    # REST API via Gunicorn
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSockets via Daphne
    location /ws/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}`
        }
      ]
    }
  }
];
