'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, AlertTriangle, Lightbulb, ArrowRight, X, Heart, ShieldCheck, CheckCircle, Calendar } from 'lucide-react';
import { INITIAL_CONDITIONS, Condition } from '@/lib/data';

interface ConditionsSectionProps {
  onSelectServiceForBooking: (serviceId: string) => void;
}

export const ConditionsSection: React.FC<ConditionsSectionProps> = ({ onSelectServiceForBooking }) => {
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);

  return (
    <section id="conditions" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0A2540] bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full">
            Clinical Conditions Index
          </span>

          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Child Developmental Conditions Treated
          </h2>

          <p className="text-slate-600 text-sm sm:text-base">
            Detailed pediatric medical condition profiles to help parents identify early symptoms, recognize clinical red flags, and access guided therapy.
          </p>
        </div>

        {/* Conditions Cards Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_CONDITIONS.map((cond) => (
            <div
              key={cond.id}
              className="bg-white rounded-[22px] overflow-hidden border border-slate-200/80 soft-shadow soft-shadow-hover flex flex-col justify-between group"
            >
              {/* Card Image Banner with Category & Onset Overlay */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                {cond.imageUrl ? (
                  <img
                    src={cond.imageUrl}
                    alt={cond.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0A2540] to-slate-800" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
                
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-[#0A2540]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    {cond.category}
                  </span>
                  <span className="text-[11px] font-bold text-white bg-slate-900/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                    Onset: {cond.ageOfOnset}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-poppins font-bold text-lg text-white drop-shadow-md">
                    {cond.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {cond.summary}
                  </p>

                  {/* Common Symptoms Highlights */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Common Parent Observations
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {cond.commonSymptoms.slice(0, 3).map((symp, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-[#EA580C] font-bold">•</span>
                          <span className="line-clamp-1">{symp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedCondition(cond)}
                    className="text-xs font-semibold text-[#0A2540] hover:underline flex items-center space-x-1"
                  >
                    <span>Red Flags & Parent Tips</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onSelectServiceForBooking(cond.recommendedTherapyIds[0])}
                    className="bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                  >
                    Consult Specialist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Condition Modal */}
        <AnimatePresence>
          {selectedCondition && (
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
                      Pediatric Condition Profile
                    </span>
                    <h3 className="font-poppins font-bold text-xl text-white">
                      {selectedCondition.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedCondition(null)}
                    className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedCondition.imageUrl && (
                  <div className="h-52 w-full overflow-hidden bg-slate-900">
                    <img
                      src={selectedCondition.imageUrl}
                      alt={selectedCondition.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                  <p className="text-slate-700 text-sm leading-relaxed">{selectedCondition.summary}</p>

                  {/* Red Flags Warning Box */}
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <h4 className="font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5 mb-2">
                      <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
                      <span>Clinical Red Flags Requiring Immediate Assessment</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedCondition.redFlags.map((flag, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-[#EA580C] font-bold">•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Parent Guidance */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1 mb-2">
                      <Lightbulb className="w-4 h-4 text-[#0A2540]" />
                      <span>Recommended Parent Home Guidelines</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {selectedCondition.parentTips.map((tip, idx) => (
                        <li key={idx} className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTAs */}
                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => {
                        const rec = selectedCondition.recommendedTherapyIds[0];
                        setSelectedCondition(null);
                        onSelectServiceForBooking(rec);
                      }}
                      className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-md flex items-center space-x-2"
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      <span>Book Assessment for {selectedCondition.name}</span>
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
