'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ShieldCheck, Sparkles, Star, Award, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onOpenAppointment: () => void;
  onOpenSmartSearch: () => void;
  onOpenMilestoneQuiz?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAppointment, onOpenSmartSearch, onOpenMilestoneQuiz }) => {
  return (
    <section className="relative bg-gradient-to-b from-blue-50/70 via-[#F7FAFC] to-[#F7FAFC] pt-8 pb-16 overflow-hidden">
      {/* Background Subtle Accent Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0b6fb808_1px,transparent_1px),linear-gradient(to_bottom,#0b6fb808_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Trust Badges, Value Proposition, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Accreditation Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-white/90 border border-blue-200/80 px-3.5 py-1.5 rounded-full shadow-sm text-xs font-semibold text-[#0A2540]"
            >
              <Award className="w-4 h-4 text-[#EA580C]" />
              <span>Advance Speech Therapy & Child Development Center</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-poppins text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
            >
              Unlocking Every Child’s <br className="hidden sm:inline" />
              <span className="text-[#0A2540] relative">
                Communication & Potential
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#EA580C]/30" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path d="M0 15 Q 50 0 100 15" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed font-normal"
            >
              World-class pediatric therapy center in Sector 75, Noida specializing in 
              <strong className="text-slate-800 font-semibold"> Speech Delay, Sensory Integration, Stammering, Autism, ADHD, and Learning Support</strong>. 
              Compassionate clinical care tailored to your child’s unique pace.
            </motion.p>

            {/* Key Clinical Features Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-700 font-medium"
            >
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#0A2540]" />
                <span>Advanced Speech & Language Labs</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-[#0A2540]" />
                <span>Play-Based Methodologies</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-[#0A2540]" />
                <span>Parent Coaching Plans</span>
              </div>
            </motion.div>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2"
            >
              <button
                onClick={onOpenAppointment}
                className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold shadow-lg shadow-orange-600/25 flex items-center justify-center space-x-2.5 group transition-all"
              >
                <Calendar className="w-5 h-5 text-white" />
                <span>Book Clinical Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenSmartSearch}
                className="bg-white hover:bg-slate-50 text-[#0A2540] border-2 border-[#0A2540]/30 px-5 py-3.5 rounded-xl text-sm sm:text-base font-semibold shadow-xs flex items-center justify-center space-x-2 transition-all"
              >
                <Sparkles className="w-5 h-5 text-[#EA580C] animate-pulse" />
                <span>Describe Symptoms AI</span>
              </button>

              {onOpenMilestoneQuiz && (
                <button
                  onClick={onOpenMilestoneQuiz}
                  className="bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-300 px-5 py-3.5 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-xs"
                >
                  <Award className="w-4 h-4 text-[#EA580C]" />
                  <span>60-Sec Milestone Quiz</span>
                </button>
              )}
            </motion.div>

            {/* Google Rating & Review Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center space-x-4 pt-2 border-t border-slate-200/60"
            >
              <div className="flex -space-x-2">
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120" alt="Parent Avatar" referrerPolicy="no-referrer" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" alt="Parent Avatar" referrerPolicy="no-referrer" />
                <img className="w-9 h-9 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120" alt="Parent Avatar" referrerPolicy="no-referrer" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#EA580C] text-[#EA580C]" />
                  ))}
                  <span className="font-bold text-slate-800 text-sm ml-1">4.9 / 5.0</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Verified Reviews from 350+ Noida Families</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Hero Image with Layered Soft Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-[20px] overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/images/hero.jpg"
                alt="Jeevan Wings Child Development & Speech Therapy Center Noida"
                className="w-full h-[440px] sm:h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0A2540] uppercase tracking-wider block">Noida Center Direct</span>
                    <h4 className="font-poppins font-bold text-slate-900 text-xs sm:text-sm">U-003, I-Tower, Golf City, Plot-8, Sector-75</h4>
                    <p className="text-xs text-slate-500">Walk-ins & Diagnostic Consultations Available</p>
                  </div>
                  <a
                    href="https://wa.me/919717539376?text=Hi%20Jeevan%20Wings,%20I%20would%20like%20to%20visit%20your%20Noida%20Sector%2075%20centre."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0A2540] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#06182B] transition-colors shrink-0"
                  >
                    Locate Clinic
                  </a>
                </div>
              </div>
            </div>

            {/* Floating Trust Card Top-Right */}
            <div className="absolute -top-6 -right-4 hidden sm:flex items-center space-x-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xl z-20">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-[#EA580C]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">100% Safe & Play-Based</p>
                <p className="text-[11px] text-slate-500">Parent Observation Rooms</p>
              </div>
            </div>

            {/* Floating Stat Card Bottom-Left */}
            <div className="absolute -bottom-6 -left-4 hidden sm:flex items-center space-x-3 bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xl z-20">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0A2540]">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">500+ Children</p>
                <p className="text-[11px] text-slate-500">Milestones Empowered</p>
              </div>
            </div>

          </motion.div>

        </div>

        {/* Bottom Key Performance Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-200">
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 soft-shadow text-center">
            <span className="font-poppins font-extrabold text-3xl sm:text-4xl text-[#0A2540]">500+</span>
            <p className="text-xs font-medium text-slate-600 mt-1">Children Empowered</p>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 soft-shadow text-center">
            <span className="font-poppins font-extrabold text-3xl sm:text-4xl text-[#EA580C]">98%</span>
            <p className="text-xs font-medium text-slate-600 mt-1">Parent Satisfaction Rate</p>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 soft-shadow text-center">
            <span className="font-poppins font-extrabold text-3xl sm:text-4xl text-[#0A2540]">7+ Yrs</span>
            <p className="text-xs font-medium text-slate-600 mt-1">Clinical Experience</p>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 soft-shadow text-center">
            <span className="font-poppins font-extrabold text-3xl sm:text-4xl text-[#06182B]">100%</span>
            <p className="text-xs font-medium text-slate-600 mt-1">Customized Clinical Plans</p>
          </div>
        </div>

      </div>
    </section>
  );
};
