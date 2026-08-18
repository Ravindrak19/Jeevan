'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SmartSearchAI } from '@/components/SmartSearchAI';
import { ServicesSection } from '@/components/ServicesSection';
import { ConditionsSection } from '@/components/ConditionsSection';
import { TherapistsSection } from '@/components/TherapistsSection';
import { GallerySection } from '@/components/GallerySection';
import { BlogsSection } from '@/components/BlogsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { AppointmentModal } from '@/components/AppointmentModal';
import { AdminPortalModal } from '@/components/AdminPortalModal';
import { MilestoneQuizModal } from '@/components/MilestoneQuizModal';
import { INITIAL_APPOINTMENTS, Appointment } from '@/lib/data';

export default function Home() {
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | undefined>();

  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  const handleOpenAppointment = (serviceId?: string, therapistId?: string) => {
    setSelectedServiceId(serviceId);
    setSelectedTherapistId(therapistId);
    setAppointmentModalOpen(true);
  };

  const handleAppointmentCreated = (newApt: Appointment) => {
    setAppointmentsList((prev) => [newApt, ...prev]);
  };

  const scrollToSmartSearch = () => {
    const el = document.getElementById('smart-search');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] font-inter text-slate-800 selection:bg-[#0A2540] selection:text-white">
      {/* Sticky Brand Header */}
      <Navbar
        onOpenAppointment={() => handleOpenAppointment()}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenMilestoneQuiz={() => setMilestoneModalOpen(true)}
      />

      <main>
        {/* Main Clinical Hero Section */}
        <Hero
          onOpenAppointment={() => handleOpenAppointment()}
          onOpenSmartSearch={scrollToSmartSearch}
          onOpenMilestoneQuiz={() => setMilestoneModalOpen(true)}
        />

        {/* AI Natural Language Parent Assistant */}
        <SmartSearchAI
          onOpenAppointmentWithService={(serviceName) => {
            handleOpenAppointment();
          }}
        />

        {/* Comprehensive Therapy Programs */}
        <ServicesSection
          onSelectServiceForBooking={(serviceId) => handleOpenAppointment(serviceId)}
        />

        {/* Pediatric Conditions Treated */}
        <ConditionsSection
          onSelectServiceForBooking={(serviceId) => handleOpenAppointment(serviceId)}
        />

        {/* EEAT Specialist Team */}
        <TherapistsSection
          onSelectTherapistForBooking={(therapistId) => handleOpenAppointment(undefined, therapistId)}
        />

        {/* Sensory Gym & Clinical Infrastructure Gallery */}
        <GallerySection />

        {/* Clinical Blogs & AI Social Marketing */}
        <BlogsSection />

        {/* Verified Parent Reviews & 4.9/5 Star Rating */}
        <TestimonialsSection />
      </main>

      {/* Local SEO Footer & Map */}
      <Footer />

      {/* Quick WhatsApp Consultation Floating Button */}
      <WhatsAppFloat />

      {/* 3-Click Appointment Booking Modal */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        initialServiceId={selectedServiceId}
        initialTherapistId={selectedTherapistId}
        onAppointmentCreated={handleAppointmentCreated}
      />

      {/* Enterprise SaaS Admin Portal Modal */}
      <AdminPortalModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        appointments={appointmentsList}
      />

      {/* 60-Sec Child Milestone Screening Quiz Modal */}
      <MilestoneQuizModal
        isOpen={milestoneModalOpen}
        onClose={() => setMilestoneModalOpen(false)}
        onOpenAppointment={(serviceId) => handleOpenAppointment(serviceId)}
      />
    </div>
  );
}
