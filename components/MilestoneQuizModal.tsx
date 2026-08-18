'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Brain,
  Baby,
  Smile,
  Activity,
  MessageSquare,
  Calendar,
  Phone,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface MilestoneQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppointment: (serviceId?: string) => void;
}

export const MilestoneQuizModal: React.FC<MilestoneQuizModalProps> = ({
  isOpen,
  onClose,
  onOpenAppointment,
}) => {
  const { addLead } = useApp();

  const [step, setStep] = useState<number>(1);
  const [ageGroup, setAgeGroup] = useState<string>('2-3 Yrs');
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [parentName, setParentName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [submittedLead, setSubmittedLead] = useState<boolean>(false);

  if (!isOpen) return null;

  const ageOptions = [
    { label: '12 - 18 Months', value: '12-18 Mos', desc: 'First word stage, joint attention' },
    { label: '18 - 24 Months', value: '1.5-2 Yrs', desc: '15-20 word vocabulary, simple commands' },
    { label: '2 - 3 Years', value: '2-3 Yrs', desc: '2-3 word sentences, name response' },
    { label: '3 - 5 Years', value: '3-5 Yrs', desc: 'Clear pronunciation, peer play, pre-writing' },
    { label: '5+ Years', value: '5+ Yrs', desc: 'Fluency, academic focus, complex speech' },
  ];

  const concernOptions = [
    { id: 'c1', label: 'Does not respond to name / Poor eye contact', category: 'Autism & Joint Attention', hot: true, serviceId: 'autism-aba-therapy' },
    { id: 'c2', label: 'Speech delay / Speaks fewer than 10 words', category: 'Speech Therapy', hot: true, serviceId: 'speech-language-therapy' },
    { id: 'c3', label: 'Unclear pronunciation / Cannot say R, S, K sounds', category: 'Articulation Therapy', hot: false, serviceId: 'speech-language-therapy' },
    { id: 'c4', label: 'Stammering / Repetition of words or sounds', category: 'Stammering Treatment', hot: false, serviceId: 'stammering-fluency-therapy' },
    { id: 'c5', label: 'Sensory meltdowns / Extreme fear of loud sounds or textures', category: 'Sensory Integration', hot: true, serviceId: 'occupational-therapy-sensory' },
    { id: 'c6', label: 'Hyperactive / Difficulty sitting still in school', category: 'ADHD & Behavioral', hot: false, serviceId: 'special-education' },
  ];

  const toggleConcern = (id: string) => {
    if (selectedConcerns.includes(id)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== id));
    } else {
      setSelectedConcerns([...selectedConcerns, id]);
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim()) return;

    const concernsText = selectedConcerns
      .map((id) => concernOptions.find((c) => c.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const isHot = selectedConcerns.some((id) => concernOptions.find((c) => c.id === id)?.hot);

    addLead({
      parentName,
      phone,
      email: '',
      childAge: ageGroup,
      primaryConcern: `[Milestone Quiz Results]: ${concernsText || 'General Milestone Checkup'}`,
      source: '60-Sec Milestone Screening Quiz',
      status: 'New Inquiry',
      score: isHot ? 'Hot' : 'Warm',
      notes: `Screening completed for age ${ageGroup}. Primary flagged areas: ${concernsText}`,
    });

    setSubmittedLead(true);
    setStep(3); // Recommendation step
  };

  const selectedConcernObjects = concernOptions.filter((c) => selectedConcerns.includes(c.id));
  const primaryServiceId = selectedConcernObjects[0]?.serviceId || 'speech-language-therapy';

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waMessage = encodeURIComponent(
    `Hello Jeevan Wings Noida! I completed the 60-Sec Milestone Screening for my child (${ageGroup}). Concerns: ${selectedConcernObjects.map((c) => c.label).join('; ')}. I would like to book a clinical assessment.`
  );
  const whatsappUrl = `https://wa.me/919717539376?text=${waMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[24px] shadow-2xl border border-slate-100 w-full max-w-xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A2540] to-[#06182B] p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Brain className="w-5 h-5 text-[#EA580C]" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider block">
                Free Pediatric Self-Assessment
              </span>
              <h3 className="font-poppins font-bold text-lg text-white">60-Sec Child Milestone Checker</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Select Age & Symptoms */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  1. Select Child Age Bracket
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ageOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAgeGroup(opt.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        ageGroup === opt.value
                          ? 'border-[#0A2540] bg-blue-50/80 text-[#0A2540] ring-2 ring-blue-500/20 font-bold'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 text-xs font-semibold'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <Baby className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-xs font-bold">{opt.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  2. Select Observed Behaviors or Speech Red Flags
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {concernOptions.map((c) => {
                    const isSelected = selectedConcerns.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleConcern(c.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-start space-x-3 transition-all ${
                          isSelected
                            ? 'border-[#0A2540] bg-blue-50/80 text-slate-900 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#0A2540] border-[#0A2540] text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{c.label}</p>
                          <span className="text-[10px] text-slate-500 font-medium">{c.category}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={selectedConcerns.length === 0}
                onClick={() => setStep(2)}
                className="w-full bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition-all"
              >
                <span>Continue to Results</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {/* STEP 2: Parent Contact to Unlock Clinical Guidance */}
          {step === 2 && (
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <p className="font-bold">Milestone Analysis Ready!</p>
                  <p className="mt-0.5 text-amber-800/80">
                    Enter your phone number to view the clinical milestone report & receive therapist recommendation for Jeevan Wings Noida Sector 75.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parent / Guardian Name</label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Meenakshi Sharma"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#0A2540]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp / Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:border-[#0A2540]"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 transition-all"
                >
                  <span>View Clinical Report</span>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Report & Next Actions */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-poppins font-bold text-base text-slate-900">Milestone Screening Report Complete</h4>
                <p className="text-xs text-slate-600">
                  Thank you <strong className="text-slate-900">{parentName}</strong>! Based on your observations for age <strong className="text-slate-900">{ageGroup}</strong>:
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Identified Focus Areas:</p>
                <div className="space-y-1.5">
                  {selectedConcernObjects.map((c) => (
                    <div key={c.id} className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{c.label}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.hot ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {c.hot ? 'Priority Red Flag' : 'Recommended Care'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                  <strong className="text-slate-800">Therapist Recommendation:</strong> Early intervention yields maximum brain plasticity before age 5. We recommend scheduling a 45-minute clinical evaluation at Noida Sector 75.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all text-center"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Senior Therapist</span>
                </a>

                <button
                  onClick={() => {
                    onClose();
                    onOpenAppointment(primaryServiceId);
                  }}
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-orange-500/20 transition-all"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Book Center Assessment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
