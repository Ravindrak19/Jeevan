'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Activity, HeartHandshake, Brain, BookOpen, Utensils, ArrowRight, CheckCircle2, Clock, Users, X, MessageCircle, Calendar } from 'lucide-react';
import { INITIAL_SERVICES, Service } from '@/lib/data';

interface ServicesSectionProps {
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForBooking }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedServiceModal, setSelectedServiceModal] = useState<Service | null>(null);

  const categories = ['All', 'Speech', 'Occupational', 'Behavioral', 'Education', 'Specialized'];

  const filteredServices = activeCategory === 'All'
    ? INITIAL_SERVICES
    : INITIAL_SERVICES.filter((s) => s.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mic': return <Mic className="w-6 h-6 text-[#0A2540]" />;
      case 'Activity': return <Activity className="w-6 h-6 text-[#0A2540]" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-[#0A2540]" />;
      case 'Brain': return <Brain className="w-6 h-6 text-[#0A2540]" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-[#0A2540]" />;
      default: return <Utensils className="w-6 h-6 text-[#0A2540]" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-[#F7FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A2540] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            Evidence-Based Pediatric Programs
          </span>

          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Specialized Child Therapy Services
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Every session at Jeevan Wings Noida Sector 75 is structured around individualized clinical milestones, play therapy, and active parental guidance.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#0A2540] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Therapy Modules' : `${cat} Therapy`}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-[20px] p-6 border border-slate-200/80 soft-shadow soft-shadow-hover flex flex-col justify-between group"
            >
              <div>
                {/* Icon & Category Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(service.iconName)}
                  </div>
                  <span className="text-[11px] font-bold text-[#EA580C] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    {service.ageGroup}
                  </span>
                </div>

                <h3 className="font-poppins font-bold text-lg text-slate-900 group-hover:text-[#0A2540] transition-colors">
                  {service.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm mt-2 line-clamp-3 leading-relaxed">
                  {service.shortDesc}
                </p>

                {/* Key Benefits List */}
                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  {service.keyBenefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0A2540] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer CTAs */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedServiceModal(service)}
                  className="text-xs font-semibold text-[#0A2540] hover:underline flex items-center space-x-1"
                >
                  <span>View Clinical Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onSelectServiceForBooking(service.id)}
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-colors flex items-center space-x-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span>Book Assessment</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Service Modal */}
        <AnimatePresence>
          {selectedServiceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[24px] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden my-8"
              >
                <div className="bg-[#0A2540] p-6 text-white flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider block">
                      Jeevan Wings Therapy Module
                    </span>
                    <h3 className="font-poppins font-bold text-xl text-white">
                      {selectedServiceModal.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedServiceModal(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="bg-blue-50 text-[#0A2540] font-semibold px-3 py-1 rounded-full">
                      Age Target: {selectedServiceModal.ageGroup}
                    </span>
                    <span className="bg-amber-50 text-[#EA580C] font-semibold px-3 py-1 rounded-full">
                      Session Length: {selectedServiceModal.duration}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical Overview</h4>
                    <p className="text-slate-700 text-sm leading-relaxed">{selectedServiceModal.fullDesc}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Therapeutic Approach</h4>
                    <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                      {selectedServiceModal.approach}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Core Clinical Outcomes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedServiceModal.keyBenefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center space-x-2 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                          <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0" />
                          <span className="text-slate-800 font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQs */}
                  {selectedServiceModal.faqList?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Parent FAQs</h4>
                      <div className="space-y-2">
                        {selectedServiceModal.faqList.map((faq, idx) => (
                          <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs">
                            <p className="font-bold text-slate-900">Q: {faq.question}</p>
                            <p className="text-slate-600 mt-1">A: {faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTAs */}
                  <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/919876543210?text=${encodeURIComponent(selectedServiceModal.whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Inquire on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => {
                        const id = selectedServiceModal.id;
                        setSelectedServiceModal(null);
                        onSelectServiceForBooking(id);
                      }}
                      className="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md"
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      <span>Book Diagnostic Evaluation</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
