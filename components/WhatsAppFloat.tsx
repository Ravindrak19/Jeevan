'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloat: React.FC = () => {
  return (
    <a
      href="https://wa.me/919717539376?text=Hi%20Jeevan%20Wings%20Noida,%20I%20would%20like%20to%20inquire%20about%20a%20child%20speech%20/%20sensory%20assessment."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-2xl shadow-emerald-600/40 flex items-center space-x-2 group hover:scale-105 transition-all"
      title="Chat with Jeevan Wings Clinical Consultant on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white text-emerald-500" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold pr-1">
        Quick WhatsApp Consultation
      </span>
    </a>
  );
};
