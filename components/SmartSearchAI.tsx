'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertTriangle, CheckCircle, ArrowRight, Loader2, HelpCircle, MessageSquare, Calendar } from 'lucide-react';

interface SmartSearchAIProps {
  onOpenAppointmentWithService?: (serviceName: string) => void;
}

export const SmartSearchAI: React.FC<SmartSearchAIProps> = ({ onOpenAppointmentWithService }) => {
  const [query, setQuery] = useState('');
  const [childAge, setChildAge] = useState('2-4 Years');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQueries = [
    "My 3-year-old child can't pronounce 'R' and 'S' sounds clearly",
    "My toddler avoids eye contact, spins toy wheels for hours and doesn't answer to name",
    "My son stammers and repeats initial sounds like 'c-c-cat' when excited",
    "My daughter has severe meltdowns during hair washes and covers ears at blender sounds"
  ];

  const handleSearch = async (queryText?: string) => {
    const textToSearch = queryText || query;
    if (!textToSearch.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/parent-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSearch, childAge }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze observation');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError('Our AI assistant encountered an issue. Please try again or book a direct consultation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="smart-search" className="py-16 bg-[#0A2540] text-white relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-[#EA580C]">
            <Sparkles className="w-4 h-4 text-[#EA580C]" />
            <span>AI Natural Language Parent Assistant</span>
          </div>

          <h2 className="font-poppins font-extrabold text-2xl sm:text-4xl tracking-tight text-white">
            Noticing Developmental Differences in Your Child?
          </h2>

          <p className="text-blue-100 text-sm sm:text-base font-normal">
            Describe what you are observing in plain words. Our Gemini AI clinical engine maps parental observations directly to pediatric speech, sensory, and behavioral insights.
          </p>
        </div>

        {/* Query Input Box */}
        <div className="mt-8 bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-[20px] shadow-2xl text-slate-800 border border-white/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Child&apos;s Age</label>
                <select
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                >
                  <option>6 - 18 Months</option>
                  <option>18 - 36 Months (1.5 - 3 Yrs)</option>
                  <option>3 - 5 Years</option>
                  <option>5 - 8 Years</option>
                  <option>8+ Years</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Describe Observation / Concern</label>
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. My child can't pronounce R sound and stammers when excited..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 text-white px-4 rounded-lg font-semibold text-xs flex items-center space-x-1.5 transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>Analyze</span>
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Sample Query Buttons */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#0A2540]" />
                <span>Or click a common parent scenario to try:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(sample);
                      handleSearch(sample);
                    }}
                    className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0A2540] px-3 py-1.5 rounded-lg border border-slate-200/80 transition-colors text-left"
                  >
                    &quot;{sample}&quot;
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* AI Output Card */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 border-t border-slate-200 pt-6 space-y-5"
              >
                {/* Result Header Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/80 p-3.5 rounded-xl border border-blue-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C] animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0A2540]">Primary Clinical Focus:</span>
                    <strong className="text-slate-900 font-poppins text-sm">{result.possibleCondition}</strong>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-[#0A2540]">
                    {result.urgencyLevel}
                  </span>
                </div>

                {/* Explanation */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical Insight</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{result.clinicalExplanation}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Red Flags */}
                  <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/60">
                    <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1 mb-2">
                      <AlertTriangle className="w-4 h-4 text-[#EA580C]" />
                      <span>Key Red Flags To Watch</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {result.keyRedFlags?.map((flag: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-[#EA580C] font-bold">•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Home Action Plan */}
                  <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/60">
                    <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center space-x-1 mb-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Immediate Home Action Plan</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {result.homeActionPlan?.map((plan: string, idx: number) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{plan}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Therapy CTA */}
                <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Recommended Jeevan Wings Program:</span>
                    <h4 className="font-poppins font-bold text-base text-[#EA580C]">{result.recommendedTherapy}</h4>
                  </div>
                  <button
                    onClick={() => onOpenAppointmentWithService?.(result.recommendedTherapy)}
                    className="w-full sm:w-auto bg-[#EA580C] hover:bg-[#C2410C] text-white px-5 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition-all shrink-0"
                  >
                    <Calendar className="w-4 h-4 text-white" />
                    <span>Book Evaluation for {result.recommendedTherapy}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
