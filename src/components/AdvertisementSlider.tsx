import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ADVERTISEMENTS = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    titleBn: 'আপনার স্বপ্নের ফ্ল্যাট খুঁজুন',
    titleEn: 'Find Your Dream Flat',
    subtitleBn: 'শহরের সেরা লোকেশনে আধুনিক সুবিধাসম্পন্ন ফ্ল্যাট',
    subtitleEn: 'Modern flats in the city\'s best locations'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    titleBn: 'বাণিজ্যিক স্পেস ভাড়া',
    titleEn: 'Commercial Space for Rent',
    subtitleBn: 'আপনার ব্যবসার প্রসারে সঠিক জায়গা বেছে নিন',
    subtitleEn: 'Choose the right place to grow your business'
  }
];

interface AdvertisementSliderProps {
  language: 'bn' | 'en';
}

export const AdvertisementSlider: React.FC<AdvertisementSliderProps> = ({ language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isBn = language === 'bn';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ADVERTISEMENTS.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ADVERTISEMENTS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ADVERTISEMENTS.length) % ADVERTISEMENTS.length);
  };

  return (
    <div className="relative w-full h-[250px] sm:h-[350px] overflow-hidden bg-gray-100 mb-6 sm:mb-8 shadow-sm">
      {/* Slides */}
      <div 
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {ADVERTISEMENTS.map((ad) => (
          <div key={ad.id} className="min-w-full h-full relative">
            <img 
              src={ad.imageUrl} 
              alt={isBn ? ad.titleBn : ad.titleEn} 
              className="w-full h-full object-cover"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8 sm:px-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 max-w-lg drop-shadow-md">
                {isBn ? ad.titleBn : ad.titleEn}
              </h2>
              <p className="text-sm sm:text-lg text-gray-200 max-w-md drop-shadow">
                {isBn ? ad.subtitleBn : ad.subtitleEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {ADVERTISEMENTS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
