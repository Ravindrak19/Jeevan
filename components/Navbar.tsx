'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Calendar, Shield, Sparkles, MessageCircle, Menu, X, LayoutDashboard, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface NavbarProps {
  onOpenAppointment: (serviceId?: string, therapistId?: string) => void;
  onOpenAdmin: () => void;
  onOpenMilestoneQuiz?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAppointment, onOpenAdmin, onOpenMilestoneQuiz }) => {
  const { branding } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Top Clinical Utility Bar */}
      <div className="bg-[#0A2540] text-white text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>U-003, I-Tower, Golf City, Plot-8, Sector-75, Noida, UP-201316</span>
            </span>
            <span className="hidden md:flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-[#00A896]" />
              <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="tel:+919717539376"
              className="flex items-center space-x-1 hover:text-[#EA580C] transition-colors font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 97175 39376 | +91 95991 85496</span>
            </a>
            <span className="text-blue-300">|</span>
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1 text-blue-100 hover:text-white transition-colors"
              title="Staff & CMS Admin Portal"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#EA580C]" />
              <span className="font-medium">Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <img
            src={
              branding.logoUrl && !branding.logoUrl.startsWith('/api/media/')
                ? branding.logoUrl
                : '/logo.png'
            }
            alt="Jeevan Wings Logo"
            className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.dataset.failed) {
                target.dataset.failed = 'true';
                target.src = '/logo.png';
              }
            }}
          />
          <div>
            <span className="font-poppins font-extrabold text-xl sm:text-2xl text-[#0A2540] tracking-tight block leading-none">
              JEEVAN <span className="text-[#EA580C]">WINGS</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest block mt-1">
              Speech Therapy & Child Development Center
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-700">
          <Link href="/about" className="hover:text-[#0A2540] transition-colors font-semibold text-[#0A2540]">About Founder</Link>
          <Link href="/#services" className="hover:text-[#0A2540] transition-colors">Therapy Services</Link>
          <Link href="/#conditions" className="hover:text-[#0A2540] transition-colors">Conditions Treated</Link>
          <Link href="/#smart-search" className="flex items-center space-x-1 text-[#0A2540] font-semibold bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>AI Parent Assistant</span>
          </Link>
          <Link href="/#therapists" className="hover:text-[#0A2540] transition-colors">Specialist Team</Link>
          <Link href="/#gallery" className="hover:text-[#0A2540] transition-colors">Sensory Gym</Link>
          <Link href="/#blogs" className="hover:text-[#0A2540] transition-colors">Parent Blogs</Link>
        </nav>

        {/* Call-to-Action Buttons */}
        <div className="hidden sm:flex items-center space-x-2">
          {onOpenMilestoneQuiz && (
            <button
              onClick={onOpenMilestoneQuiz}
              className="hidden lg:flex items-center space-x-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#EA580C]" />
              <span>Milestone Quiz</span>
            </button>
          )}

          <a
            href="https://wa.me/919717539376?text=Hi%20Jeevan%20Wings%20Noida,%20I%20would%20like%20to%20inquire%20about%20child%20assessment."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-500 text-white" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => onOpenAppointment()}
            className="flex items-center space-x-1.5 bg-[#EA580C] hover:bg-[#C2410C] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-orange-600/20 hover:shadow-lg transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span>Book Assessment</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3">
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#0A2540] font-bold"
          >
            About Founder
          </Link>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            Therapy Services
          </a>
          <a
            href="#conditions"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            Conditions Treated
          </a>
          <a
            href="#smart-search"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-[#0A2540] font-semibold"
          >
            AI Parent Assistant
          </a>
          <a
            href="#therapists"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            Specialist Team
          </a>
          <a
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            Sensory Gym Gallery
          </a>
          <a
            href="#blogs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-slate-700 font-medium"
          >
            Parent Blogs
          </a>

          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAppointment();
              }}
              className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white py-2.5 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-md shadow-orange-600/20"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Assessment Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
