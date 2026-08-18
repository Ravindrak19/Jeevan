'use client';

import React from 'react';
import { Star, Award, Calendar, CheckCircle2, ShieldCheck, Heart, GraduationCap, Sparkles, UserCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface TherapistsSectionProps {
  onSelectTherapistForBooking: (therapistId: string) => void;
}

export const TherapistsSection: React.FC<TherapistsSectionProps> = ({ onSelectTherapistForBooking }) => {
  const { branding, therapists } = useApp();

  const founder = therapists.find((t) => t.id === 'kajal-kavita') || {
    id: 'kajal-kavita',
    name: branding.founderName || 'Kajal Kavita',
    role: branding.founderRole || 'Founder & Speech Therapist',
    qualification: branding.founderQualification || 'D.El.Ed in Special Education, DHLS',
    experienceYears: branding.founderExperienceYears || 7,
    specialties: ['Speech Therapy', 'Language Delay', 'Stammering & Articulation', 'Special Education', 'Hearing & Speech Rehab'],
    bio: branding.founderBio,
    rating: 4.9,
    reviewsCount: 380,
    availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    image: branding.founderImage || '/images/kajal_kavita.jpg',
  };

  const otherTherapists = therapists.filter((t) => t.id !== 'kajal-kavita' && t.name !== (branding.founderName || founder.name));

  return (
    <section id="therapists" className="py-20 bg-gradient-to-b from-[#F7FAFC] via-white to-[#F7FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#0A2540] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            <Award className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>Meet Our Clinical Team & Leadership</span>
          </span>

          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Specialist Team & Founder Profile
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Personalized, compassionate pediatric care led directly by our founder and expert clinical team at Jeevan Wings Center in Noida Sector 75.
          </p>
        </div>

        {/* Founder Spotlight Card */}
        <div className="mt-12 bg-white rounded-[28px] border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: High-Res Founder Portrait & Badges */}
          <div className="lg:col-span-5 relative bg-slate-900 min-h-[380px] lg:min-h-[480px] flex items-center justify-center overflow-hidden">
            <img
              src={
                branding.founderImage && !branding.founderImage.startsWith('/api/media/')
                  ? branding.founderImage
                  : founder.image && !founder.image.startsWith('/api/media/')
                  ? founder.image
                  : '/images/kajal_kavita.jpg'
              }
              alt={`${branding.founderName} - ${branding.founderRole}`}
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
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
            
            {/* Experience Pill Overlay */}
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/20 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>{branding.founderExperienceYears || founder.experienceYears}+ Years Clinical Experience</span>
            </div>

            {/* Bottom Overlay Info on Photo */}
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-sm font-bold text-white">4.9 / 5.0</span>
                <span className="text-xs text-slate-300">(380+ Verified Parent Ratings)</span>
              </div>
              <h3 className="font-poppins font-extrabold text-2xl text-white">{branding.founderName}</h3>
              <p className="text-xs font-medium text-emerald-400">{branding.founderRole} • Jeevan Wings</p>
            </div>
          </div>

          {/* Right Column: Qualifications, Bio & Core Specialties */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            
            <div className="space-y-5">
              <div>
                <span className="text-xs font-bold text-[#0A2540] uppercase tracking-wider block">Founder Profile</span>
                <h3 className="font-poppins font-bold text-2xl sm:text-3xl text-slate-900 mt-1">
                  {branding.founderName}
                </h3>
                <p className="text-sm font-semibold text-[#00A896]">
                  {branding.founderRole}
                </p>
              </div>

              {/* Degrees & Credentials */}
              <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <GraduationCap className="w-4 h-4 text-[#0A2540] shrink-0" />
                  <span>Qualifications & Credentials:</span>
                </div>
                <p className="text-xs font-semibold text-slate-900">{branding.founderQualification}</p>
              </div>

              {/* Bio Statement */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Clinical Mission</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {branding.founderBio}
                </p>
              </div>

              {/* Key Practice Areas */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Primary Clinical Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {(founder.specialties || ['Speech Delay Evaluation', 'Stammering & Fluency', 'Articulation Disorders', 'Special Education Support']).map((spec, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 text-xs bg-slate-100 text-slate-800 font-medium px-3 py-1.5 rounded-lg border border-slate-200/60"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00A896]" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => onSelectTherapistForBooking(founder.id)}
                className="w-full sm:w-auto bg-[#EA580C] hover:bg-[#C2410C] text-white px-7 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Book Direct Consultation with {branding.founderName}</span>
              </button>

              <a
                href={`https://wa.me/91${branding.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(branding.founderName)},%20I%20would%20like%20to%20consult%20regarding%20my%20child's%20speech%20development.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-6 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all"
              >
                <Heart className="w-4 h-4 text-emerald-600" />
                <span>Quick WhatsApp Inquiry</span>
              </a>
            </div>

          </div>

        </div>

        {/* Dynamic Additional Therapists Grid */}
        {otherTherapists.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="text-center">
              <h3 className="font-poppins font-bold text-2xl text-slate-900">
                More Pediatric Specialists & Therapists
              </h3>
              <p className="text-xs text-slate-500 mt-1">Verified Clinical Practitioners at Jeevan Wings Center</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherTherapists.map((t) => (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4">
                      <img
                        src={t.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80'}
                        alt={t.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-50 shadow-xs shrink-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <h4 className="font-poppins font-bold text-base text-slate-900">{t.name}</h4>
                        <p className="text-xs font-semibold text-[#0A2540]">{t.role}</p>
                        <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                          <GraduationCap className="w-3 h-3 text-slate-400" />
                          <span>{t.qualification}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-600 space-y-1">
                      <p><strong className="text-slate-800">Experience:</strong> {t.experienceYears} Years</p>
                      <p className="line-clamp-2"><strong className="text-slate-800">Bio:</strong> {t.bio}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {t.specialties.map((s, i) => (
                        <span key={i} className="text-[10px] bg-blue-50 text-[#0A2540] px-2 py-0.5 rounded-md font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTherapistForBooking(t.id)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>Book Appointment with {t.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

