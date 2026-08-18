'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AppointmentModal } from '@/components/AppointmentModal';
import { AdminPortalModal } from '@/components/AdminPortalModal';
import { FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function TermsPage() {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 flex flex-col justify-between">
      <Navbar onOpenAppointment={() => setIsAppointmentOpen(true)} onOpenAdmin={() => setIsAdminOpen(true)} />

      <main className="flex-1 pt-28 pb-20">
        
        {/* Header */}
        <section className="bg-gradient-to-b from-amber-50/60 via-white to-white py-12 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
            <span className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#0A2540] bg-white border border-blue-200 px-3.5 py-1.5 rounded-full">
              <FileText className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Clinic Service Terms & Guidelines</span>
            </span>
            <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Effective Date: July 2026 • Jeevan Wings Speech Therapy & Child Development Center, Noida Sector 75
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing this website, scheduling an appointment, or utilizing therapy services at <strong>Jeevan Wings Speech Therapy & Child Development Center</strong> (Noida Sector 75), founded by <strong>Kajal Kavita</strong> (D.El.Ed in Special Education, DHLS), parents and legal guardians agree to comply with these terms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              2. Clinical Appointments & Consultation Protocols
            </h2>
            <ul className="list-disc pl-6 space-y-2 font-normal text-slate-600">
              <li><strong>Punctuality:</strong> Parents are requested to arrive 10 minutes prior to the scheduled slot time to ensure full 45-minute therapeutic evaluation.</li>
              <li><strong>Rescheduling:</strong> Appointment cancellations or rescheduling must be notified at least 24 hours in advance via call or WhatsApp at +91 97175 39376.</li>
              <li><strong>Parent Presence:</strong> To ensure complete transparency and home transfer of speech exercises, one parent/guardian is welcome in our observation room during therapy sessions.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              3. Therapeutic Expectations & Consistency
            </h2>
            <p>
              Pediatric speech, language, and milestone development requires continuous effort both in clinic and at home. While our founder Kajal Kavita and senior specialists employ evidence-based speech and sensory techniques, progress rates vary depending on child attendance consistency and home practice diets.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              4. Educational & Medical Disclaimer
            </h2>
            <p>
              Information provided on this website, AI search assistance tools, or medical articles is intended strictly for parent awareness and educational purposes. It does not replace a formal in-person clinical diagnosis by a certified Speech Therapist or Developmental Pediatrician.
            </p>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-6">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              5. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms are governed by the laws of India. Any legal disputes shall be subject to the exclusive jurisdiction of the courts in Gautam Buddha Nagar (Noida), Uttar Pradesh.
            </p>
          </div>

        </section>

      </main>

      <Footer />

      <AppointmentModal isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} />
      <AdminPortalModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
    </div>
  );
}
