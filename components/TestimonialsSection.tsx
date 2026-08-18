'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 't-1',
      parentName: 'Rahul & Neha Sharma',
      location: 'Sector 75, Noida',
      childAge: '3 Years (Aarav)',
      therapy: 'Speech & Language Therapy',
      rating: 5,
      review: 'When Aarav turned 2.5, he only had 2 words and used to cry out of frustration. Within 3 months of speech therapy with Kajal Kavita at Jeevan Wings, he started forming complete 4-word sentences! The mirror lab exercises made a huge difference.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 't-2',
      parentName: 'Vikram & Ananya Gupta',
      location: 'Sector 78, Noida',
      childAge: '4.5 Years (Ria)',
      therapy: 'Occupational Therapy & Sensory Gym',
      rating: 5,
      review: 'Ria had severe sensory meltdowns during hair washes and couldn’t sit in school for 10 minutes. Kajal Kavita created a custom sensory diet with therapy routines and heavy work. She is now calm, focused, and enjoying her preschool!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 't-3',
      parentName: 'Sanjay & Sunita Roy',
      location: 'Expressway, Noida',
      childAge: '6 Years (Kabir)',
      therapy: 'Stammering & Fluency Management',
      rating: 5,
      review: 'Kabir had severe speech blocks while pronouncing K and T sounds and avoided speaking in front of classmates. Jeevan Wings taught him gentle onset and breathing techniques. His confidence has soared and he spoke on stage last week!',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A2540] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            Verified Parent Stories
          </span>

          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Real Transformations at Jeevan Wings
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Read how early intervention and personalized pediatric clinical care helped Noida families celebrate life-changing developmental milestones.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#F7FAFC] rounded-[20px] p-6 border border-slate-200/80 soft-shadow soft-shadow-hover flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-blue-200 absolute top-5 right-5 pointer-events-none" />

              <div>
                {/* Stars */}
                <div className="flex items-center space-x-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  &quot;{t.review}&quot;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center space-x-3">
                <img
                  src={t.avatar}
                  alt={t.parentName}
                  className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-poppins font-bold text-xs text-slate-900">{t.parentName}</h4>
                  <p className="text-[11px] text-[#0A2540] font-semibold">{t.therapy} • {t.childAge}</p>
                  <p className="text-[10px] text-slate-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Badge Banner */}
        <div className="mt-12 bg-blue-50 border border-blue-100 p-6 rounded-[20px] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A2540] text-white flex items-center justify-center font-bold text-xl">
              G
            </div>
            <div>
              <h4 className="font-poppins font-bold text-slate-900 text-sm">Noida Sector 75 Rated 4.9 / 5.0 Stars</h4>
              <p className="text-xs text-slate-600">Based on 350+ Google Reviews from satisfied parents</p>
            </div>
          </div>

          <a
            href="https://wa.me/919876543210?text=Hi%20Jeevan%20Wings,%20I%20would%20like%20to%20consult%20with%20a%20senior%20pediatric%20therapist."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-colors shrink-0 flex items-center space-x-2"
          >
            <span>Connect with Senior Consultant</span>
          </a>
        </div>

      </div>
    </section>
  );
};
