'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AppointmentModal } from '@/components/AppointmentModal';
import { AdminPortalModal } from '@/components/AdminPortalModal';
import { ShieldCheck, Lock, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 flex flex-col justify-between">
      <Navbar onOpenAppointment={() => setIsAppointmentOpen(true)} onOpenAdmin={() => setIsAdminOpen(true)} />

      <main className="flex-1 pt-28 pb-20">
        
        {/* Header */}
        <section className="bg-gradient-to-b from-blue-50/60 via-white to-white py-12 border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
            <span className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#0A2540] bg-white border border-blue-200 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Data Protection & Patient Confidentiality</span>
            </span>
            <h1 className="font-poppins font-extrabold text-3xl sm:text-4xl text-slate-900">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Effective Date: July 2026 • Jeevan Wings Speech Therapy & Child Development Center, Noida Sector 75
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
          
          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900 flex items-center space-x-2">
              <Lock className="w-5 h-5 text-[#0A2540]" />
              <span>1. Commitment to Patient Privacy</span>
            </h2>
            <p>
              At <strong>Jeevan Wings Speech Therapy & Child Development Center</strong> (referred to as &quot;we&quot;, &quot;our&quot;, or &quot;the Center&quot;), led by Founder & Speech Therapist <strong>Kajal Kavita</strong>, we prioritize the utmost confidentiality and security of medical, personal, and developmental records of the children and families we serve.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              2. Information We Collect
            </h2>
            <p>When you consult with us online, via phone, or at our Noida Sector 75 clinic, we may collect:</p>
            <ul className="list-disc pl-6 space-y-2 font-normal text-slate-600">
              <li><strong>Parent/Guardian Information:</strong> Full Name, Phone Number, Email Address, Residential Address.</li>
              <li><strong>Child Information:</strong> Child&apos;s Name, Age, Gender, Schooling Details, and Medical History.</li>
              <li><strong>Clinical Data:</strong> Speech & language assessment notes, diagnostic reports, therapy goals, progress logs, and behavioral observation records.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              3. Purpose of Data Usage
            </h2>
            <p>Collected information is strictly utilized for clinical and administrative operations, including:</p>
            <ul className="list-disc pl-6 space-y-2 font-normal text-slate-600">
              <li>Designing individualized therapy plans and tracking milestone progression.</li>
              <li>Scheduling, confirming, or updating clinic diagnostic appointments.</li>
              <li>Communicating milestone evaluation results and home practice diets with parents.</li>
              <li>Providing progress reports requested by parents for school accommodations (CBSE/ICSE).</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              4. Strict Non-Disclosure Policy
            </h2>
            <p>
              We <strong>NEVER sell, lease, trade, or publicly share</strong> personal or clinical information to third-party advertisers or telemarketers. Information is only disclosed if explicitly mandated by Indian medical regulations or court orders.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              5. Media & Photo Consent Policy
            </h2>
            <p>
              We maintain a strict policy regarding photographs and videos of therapy sessions. Photographs or video clips are only taken with <strong>prior written consent</strong> from parents for clinical training or milestone progress verification.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-poppins font-bold text-xl text-slate-900">
              6. Contact Details for Privacy Queries
            </h2>
            <p>If you have any questions or requests regarding your personal records, please reach out to us:</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 space-y-1">
              <p><strong>Jeevan Wings Speech Therapy & Child Development Center</strong></p>
              <p>Founder & Lead Speech Therapist: Kajal Kavita</p>
              <p>Address: U-003, I-Tower, Golf City, Plot-8, Sector-75, Noida, UP-201316</p>
              <p>Phone: +91 97175 39376</p>
              <p>Email: contact@jeevanwings.com</p>
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
