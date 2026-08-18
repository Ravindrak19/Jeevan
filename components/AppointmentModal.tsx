'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, User, Phone, CheckCircle2, MessageCircle, Download, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import { INITIAL_SERVICES, Appointment } from '@/lib/data';
import { useApp } from '@/context/AppContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialTherapistId?: string;
  onAppointmentCreated?: (newApt: Appointment) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
  initialTherapistId,
  onAppointmentCreated,
}) => {
  const { therapists, addAppointment } = useApp();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [selectedServiceId, setSelectedServiceId] = useState(
    initialServiceId || INITIAL_SERVICES[0].id
  );
  const [selectedTherapistId, setSelectedTherapistId] = useState(
    initialTherapistId || (therapists[0]?.id || 'kajal-kavita')
  );
  
  // Auto-fetch today's date for Booking Date
  const todayStr = new Date().toISOString().slice(0, 10);
  const [bookingDate] = useState<string>(todayStr);
  
  // Preferred Date chosen by client (defaults to tomorrow or today)
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM - 10:45 AM');

  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('2.5 Years');
  const [notes, setNotes] = useState('');

  const [confirmedApt, setConfirmedApt] = useState<Appointment | null>(null);

  const timeSlots = [
    '09:15 AM - 10:00 AM',
    '10:00 AM - 10:45 AM',
    '11:00 AM - 11:45 AM',
    '02:00 PM - 02:45 PM',
    '03:30 PM - 04:15 PM',
    '04:30 PM - 05:15 PM',
    '05:30 PM - 06:15 PM'
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedService = INITIAL_SERVICES.find((s) => s.id === selectedServiceId);
    const selectedTherapist = therapists.find((t) => t.id === selectedTherapistId);

    // Call AI Lead Scorer in background
    let leadScore: 'Hot' | 'Warm' | 'Cold' = 'Warm';
    let reasoning = 'Standard parent booking inquiry';

    try {
      const res = await fetch('/api/ai/lead-scorer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName,
          childAge,
          primaryConcern: notes || selectedService?.title,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success && data.leadAnalysis) {
        leadScore = data.leadAnalysis.score;
        reasoning = data.leadAnalysis.reasoning;
      }
    } catch (e) {
      console.warn('AI Lead Scoring skipped', e);
    }

    const newApt: Appointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      serviceId: selectedServiceId,
      serviceName: selectedService?.title || 'Diagnostic Assessment',
      therapistId: selectedTherapistId,
      therapistName: selectedTherapist?.name || 'Senior Consultant',
      bookingDate,
      preferredDate,
      date: preferredDate,
      timeSlot: selectedTimeSlot,
      parentName,
      phone,
      childName,
      childAge,
      notes,
      status: 'Confirmed',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      leadScore,
      scoreReasoning: reasoning,
    };

    addAppointment(newApt);
    setConfirmedApt(newApt);
    onAppointmentCreated?.(newApt);
    setStep(4); // Success step
  };

  const generateIcsFile = () => {
    if (!confirmedApt) return;
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Jeevan Wings Noida//NODA//EN
BEGIN:VEVENT
SUMMARY:Jeevan Wings Child Assessment - ${confirmedApt.childName}
DESCRIPTION:Pediatric Clinical Assessment for ${confirmedApt.serviceName} at Jeevan Wings Noida Sector 75 with ${confirmedApt.therapistName}.
LOCATION:U-003, I-Tower, Golf City, Plot-8, Sector-75, Noida, UP-201316
DTSTART:20260725T100000Z
DTEND:20260725T104500Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `jeevan_wings_assessment_${confirmedApt.childName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[24px] shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#0A2540] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider block">
              Jeevan Wings Noida Sector 75
            </span>
            <h3 className="font-poppins font-bold text-xl text-white">3-Click Assessment Booking</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        {step < 4 && (
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600">
            <div className={`flex items-center space-x-1.5 ${step === 1 ? 'text-[#0A2540]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-[#0A2540] text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
              <span>Service & Specialist</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className={`flex items-center space-x-1.5 ${step === 2 ? 'text-[#0A2540]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-[#0A2540] text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
              <span>Date & Slot</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className={`flex items-center space-x-1.5 ${step === 3 ? 'text-[#0A2540]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-[#0A2540] text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
              <span>Parent & Child Details</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {/* STEP 1: Service & Specialist */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Therapy Program</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {INITIAL_SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedServiceId(s.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        selectedServiceId === s.id
                          ? 'border-[#0A2540] bg-blue-50/70 text-[#0A2540] font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <p className="font-poppins text-sm font-semibold text-slate-900">{s.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{s.shortDesc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Select Clinical Specialist</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {therapists.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTherapistId(t.id)}
                      className={`p-3 rounded-xl border flex items-center space-x-3 text-left transition-all ${
                        selectedTherapistId === t.id
                          ? 'border-[#0A2540] bg-blue-50/70 text-[#0A2540] font-bold shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={t.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80'}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <p className="font-poppins text-xs font-bold text-slate-900">{t.name}</p>
                        <p className="text-[10px] text-slate-500">{t.experienceYears} Yrs Exp • {t.specialties[0] || t.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md flex items-center space-x-2"
                >
                  <span>Select Date & Time Slot</span>
                  <Clock className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Date & Slot */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Auto Today's Booking Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Booking Date (Auto-fetched Today)
                  </label>
                  <div className="w-full bg-slate-100 border border-slate-200/90 rounded-xl px-4 py-3 text-sm font-bold text-[#0A2540] flex items-center justify-between">
                    <span>{bookingDate}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Today
                    </span>
                  </div>
                </div>

                {/* Preferred Appointment Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                    Preferred Appointment Date *
                  </label>
                  <input
                    type="date"
                    min={bookingDate}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Available Time Slot (Noida Sector 75 Center)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {timeSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        selectedTimeSlot === slot
                          ? 'border-[#0A2540] bg-[#0A2540] text-white shadow-md'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-4 py-2"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md"
                >
                  Enter Parent & Child Info →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Parent & Child Info */}
          {step === 3 && (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Child Name *</label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Child Age *</label>
                  <select
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  >
                    <option>1.5 Years</option>
                    <option>2 Years</option>
                    <option>2.5 Years</option>
                    <option>3 Years</option>
                    <option>4 Years</option>
                    <option>5 Years</option>
                    <option>6+ Years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Key Symptoms or Concerns (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Not speaking 2-word phrases, covers ears at loud sounds..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-4 py-2"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  className="bg-[#EA580C] hover:bg-[#C2410C] text-white px-7 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-600/20 flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Confirm Clinical Booking</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Sync Downloads */}
          {step === 4 && confirmedApt && (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-poppins font-bold text-2xl text-slate-900">Assessment Booking Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-1">Booking Ref: <strong className="text-slate-800">{confirmedApt.id}</strong></p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Child & Parent:</span>
                  <strong className="text-slate-900">{confirmedApt.childName} ({confirmedApt.childAge}) • {confirmedApt.parentName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Therapy Program:</span>
                  <strong className="text-[#0A2540]">{confirmedApt.serviceName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Clinical Specialist:</span>
                  <strong className="text-slate-900">{confirmedApt.therapistName}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500">Booking Date (Today):</span>
                  <strong className="text-slate-900">{confirmedApt.bookingDate || confirmedApt.createdAt?.slice(0, 10)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Preferred Appointment Date & Slot:</span>
                  <strong className="text-slate-900">{confirmedApt.preferredDate || confirmedApt.date} @ {confirmedApt.timeSlot}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://wa.me/919717539376?text=${encodeURIComponent(
                    `Hi Jeevan Wings, I have booked a clinical assessment for my child ${confirmedApt.childName}. Booking Date: ${confirmedApt.bookingDate || confirmedApt.createdAt?.slice(0, 10)}, Preferred Appointment Date: ${confirmedApt.preferredDate || confirmedApt.date} at ${confirmedApt.timeSlot}. Ref ID: ${confirmedApt.id}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Notify via WhatsApp Instant</span>
                </a>

                <button
                  onClick={generateIcsFile}
                  className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  <Download className="w-4 h-4 text-[#EA580C]" />
                  <span>Download .ics Google Calendar Invite</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 pt-2 block mx-auto"
              >
                Close Booking Window
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
