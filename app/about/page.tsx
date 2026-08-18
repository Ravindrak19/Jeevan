'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AppointmentModal } from '@/components/AppointmentModal';
import { AdminPortalModal } from '@/components/AdminPortalModal';
import { Award, GraduationCap, Heart, CheckCircle2, Calendar, Phone, MapPin, Sparkles, Star, ShieldCheck, UserCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AboutPage() {
  const { branding } = useApp();
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 flex flex-col justify-between">
      <Navbar onOpenAppointment={() => setIsAppointmentOpen(true)} onOpenAdmin={() => setIsAdminOpen(true)} />

      <main className="flex-1 pt-28 pb-20">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#0A2540]/10 via-blue-50/50 to-white py-16 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#0A2540] bg-white border border-blue-200 px-4 py-1.5 rounded-full shadow-xs">
                <Award className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Founder & Lead Specialist Profile</span>
              </span>

              <h1 className="font-poppins font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
                About {branding.founderName}
              </h1>

              <p className="text-slate-600 text-base sm:text-lg font-medium">
                {branding.founderRole} at <strong className="text-[#0A2540]">Jeevan Wings Speech Therapy & Child Development Center</strong>, Noida Sector 75.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Founder Bio Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Photo & Credentials Card */}
            <div className="lg:col-span-5 bg-white rounded-[28px] border border-slate-200 p-6 shadow-xl space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/5] border border-slate-100">
                <img
                  src={
                    branding.founderImage && !branding.founderImage.startsWith('/api/media/')
                      ? branding.founderImage
                      : '/images/kajal_kavita.jpg'
                  }
                  alt={`${branding.founderName} - ${branding.founderRole} at Jeevan Wings Noida`}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (!target.dataset.failed) {
                      target.dataset.failed = 'true';
                      target.src = '/images/kajal_kavita.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold mb-1">
                    <Star className="w-4 h-4 fill-amber-400" />
                    <span>4.9 / 5.0 Rating (380+ Parent Reviews)</span>
                  </div>
                  <h2 className="font-poppins font-extrabold text-2xl">{branding.founderName}</h2>
                  <p className="text-xs text-emerald-400 font-medium">{branding.founderRole}</p>
                </div>
              </div>

              {/* Qualifications Badge Box */}
              <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                  <GraduationCap className="w-5 h-5 text-[#0A2540]" />
                  <span>Clinical Education & Credentials</span>
                </div>
                <div className="text-xs text-slate-700 space-y-2 font-medium leading-relaxed">
                  <p className="bg-white p-2.5 rounded-xl border border-blue-100 font-semibold text-slate-900">
                    {branding.founderQualification}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">{branding.founderExperienceYears || 7}+ Years Clinical Experience</strong> in pediatric speech therapy, language delay intervention, stammering cure, and child development.
                  </p>
                </div>
              </div>

              {/* Quick Contact Info */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-medium text-slate-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#0A2540] shrink-0" />
                  <span>{branding.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-[#0A2540] shrink-0" />
                  <span>{branding.phone}</span>
                </div>
              </div>
            </div>

            {/* Right Story & Vision Section */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0A2540]">
                  Founder Message & Vision
                </span>
                <h2 className="font-poppins font-extrabold text-2xl sm:text-3xl text-slate-900">
                  Giving Wings to Every Child&apos;s Voice
                </h2>
                <div className="bg-slate-50 border-l-4 border-[#0A2540] p-4 rounded-r-xl text-slate-700 text-sm italic font-medium leading-relaxed">
                  &quot;{branding.founderBio}&quot;
                </div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  Early childhood is a vital developmental window. As {branding.founderRole} at <strong>Jeevan Wings Center</strong>, {branding.founderName} ensures that when a child experiences speech delay, stammering, or sensory processing challenges, timely, compassionate intervention alters their confidence and developmental milestones.
                </p>
              </div>

              {/* Core Philosophy Box */}
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 space-y-3">
                <h3 className="font-poppins font-bold text-base text-slate-900 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-[#EA580C]" />
                  <span>Our Play-Based Clinical Philosophy</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  At Jeevan Wings, we reject rigid, stressful therapy sessions. Instead, we utilize child-centric play techniques, articulation mirror feedback, sensory integration routines, and positive reinforcement. Children learn best when they feel safe, respected, and joyful.
                </p>
              </div>

              {/* Areas of Clinical Specialization */}
              <div className="space-y-4">
                <h3 className="font-poppins font-bold text-lg text-slate-900">
                  Key Areas of Clinical Specialization
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-medium">
                  {[
                    'Pediatric Speech & Language Delay',
                    'Stammering & Fluency Therapy',
                    'Articulation & Pronunciation Correction',
                    'Autism Spectrum & Early Intervention',
                    'ADHD & Sensory Integration Support',
                    'Hearing & Speech Rehabilitation',
                    'Special Education & Dyslexia Remediation',
                    'Parent Milestone Empowerment Coaching'
                  ].map((area, idx) => (
                    <div key={idx} className="flex items-center space-x-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0" />
                      <span className="text-slate-800">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why Parents Trust Jeevan Wings */}
              <div className="space-y-4 border-t border-slate-200 pt-6">
                <h3 className="font-poppins font-bold text-lg text-slate-900">
                  Why Noida Families Choose Jeevan Wings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1 shadow-2xs">
                    <ShieldCheck className="w-6 h-6 text-[#0A2540] mx-auto" />
                    <h4 className="font-bold text-xs text-slate-900">100% Transparent</h4>
                    <p className="text-[11px] text-slate-500">Parent observation rooms in every session</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1 shadow-2xs">
                    <UserCheck className="w-6 h-6 text-[#EA580C] mx-auto" />
                    <h4 className="font-bold text-xs text-slate-900">Direct Founder Leadership</h4>
                    <p className="text-[11px] text-slate-500">Supervised directly by {branding.founderName}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center space-y-1 shadow-2xs">
                    <Sparkles className="w-6 h-6 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-xs text-slate-900">500+ Children</h4>
                    <p className="text-[11px] text-slate-500">Transformed communication milestones</p>
                  </div>
                </div>
              </div>

              {/* Direct Booking CTAs */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/91${branding.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(branding.founderName)},%20I%20read%20about%20you%20on%20Jeevan%20Wings%20website%20and%20want%20to%20book%20a%20speech%20consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-8 py-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Consult with {branding.founderName}</span>
                </a>

                <a
                  href={`tel:${branding.phone.replace(/\s+/g, '')}`}
                  className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 px-6 py-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4 text-[#0A2540]" />
                  <span>Call Clinic: {branding.phone}</span>
                </a>
              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />

      <AppointmentModal isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} />
      <AdminPortalModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
