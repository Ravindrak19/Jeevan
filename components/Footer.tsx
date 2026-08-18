'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Award, ArrowUpRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const Footer: React.FC = () => {
  const { branding } = useApp();
  // JSON-LD MedicalBusiness and LocalBusiness Schema for SEO
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'LocalBusiness'],
    name: 'Jeevan Wings Speech Therapy & Child Development Center',
    image: 'https://www.jeevanwings.com/images/hero.jpg',
    telePhone: '+919717539376',
    email: 'contact@jeevanwings.com',
    url: 'https://www.jeevanwings.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'U-003, I-Tower, Golf City, Plot-8, Sector-75',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201316',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.5714,
      longitude: 77.3828,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
    medicalSpecialty: [
      'Speech Therapy',
      'Occupational Therapy',
      'Pediatric Rehabilitation',
      'Sensory Integration',
      'Special Education'
    ],
    priceRange: '₹₹',
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      {/* Inject JSON-LD Schema into head for Google SEO crawler */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: Brand Info & Accreditations (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src={branding.logoUrl || '/logo.png'}
                alt="Jeevan Wings Logo"
                className="w-12 h-12 object-contain bg-white/10 p-1 rounded-xl"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/logo.png';
                }}
              />
              <div>
                <span className="font-poppins font-extrabold text-xl text-white tracking-tight block">
                  JEEVAN WINGS
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
                  Speech Therapy & Child Development Center
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              International-standard pediatric therapy center in Sector 75, Noida. Empowering children with Speech Delays, Sensory Integration challenges, Stammering, Autism Spectrum, ADHD, and Learning Disabilities.
            </p>

            <div className="flex items-center space-x-3 pt-2 text-xs text-slate-300 font-medium">
              <span className="flex items-center space-x-1 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#EA580C]" />
                <span>RCI Registered</span>
              </span>
            </div>
          </div>

          {/* Col 2: Fast Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-poppins font-bold text-sm text-[#EA580C] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="text-[#EA580C] hover:underline font-bold">About Founder</Link></li>
              <li><a href="#services" className="hover:text-white transition-colors">Speech & Language Therapy</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Sensory Gym & OT</a></li>
              <li><a href="#conditions" className="hover:text-white transition-colors">Conditions Treated</a></li>
              <li><a href="#therapists" className="hover:text-white transition-colors">Specialist Team</a></li>
            </ul>
          </div>

          {/* Col 3: Noida Local Contact & Maps (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-poppins font-bold text-sm text-[#EA580C] uppercase tracking-wider">
              Noida Sector 75 Center
            </h4>
            
            <div className="space-y-2.5 text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                <span>U-003, I-Tower, Golf City, Plot-8, Sector-75, Noida, UP-201316</span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-[#00A896] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>+91 97175 39376</span>
                  <span>+91 95991 85496</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#00A896] shrink-0" />
                <span>contact@jeevanwings.com</span>
              </div>

              <div className="flex items-center space-x-2.5">
                <ArrowUpRight className="w-4 h-4 text-[#00A896] shrink-0" />
                <a href="https://www.jeevanwings.com" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">
                  www.jeevanwings.com
                </a>
              </div>

              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-[#00A896] shrink-0" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Interactive Noida Map Embed (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <h4 className="font-poppins font-bold text-sm text-[#EA580C] uppercase tracking-wider">
              Location Map
            </h4>
            <div className="rounded-xl overflow-hidden border border-slate-700 shadow-md h-36 bg-slate-800 relative">
              <iframe
                title="Jeevan Wings Noida Location Map"
                src="https://maps.google.com/maps?q=Golf+City,+Plot-8,+Sector-75,+Noida,+UP-201316&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>

        </div>

        {/* Copyright & Legal Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 Jeevan Wings – Speech Therapy & Child Development Center. All Rights Reserved.</p>
          <div className="flex items-center space-x-4 text-slate-400 font-medium">
            <Link href="/about" className="hover:text-white transition-colors">About Founder</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Noida Sector 75</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
