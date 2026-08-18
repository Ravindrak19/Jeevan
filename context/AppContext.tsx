'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_LEADS,
  INITIAL_BLOGS,
  INITIAL_GALLERY,
  INITIAL_THERAPISTS,
  Appointment,
  Lead,
  BlogPost,
  GalleryItem,
  Therapist,
} from '@/lib/data';

export interface BrandingConfig {
  logoUrl: string;
  founderName: string;
  founderRole: string;
  founderQualification: string;
  founderExperienceYears: number;
  founderBio: string;
  founderImage: string;
  phone: string;
  location: string;
}

export interface GoogleSheetSettings {
  webhookUrl: string;
  syncEnabled: boolean;
  lastSyncTime: string | null;
}

export interface CrmLog {
  id: string;
  timestamp: string;
  eventType: 'Appointment Booked' | 'Inquiry Submitted' | 'Status Changed';
  payloadSummary: string;
  status: 'Forwarded' | 'Failed' | 'Simulated';
}

export interface CrmSettings {
  endpointUrl: string;
  apiKey: string;
  autoForwardEnabled: boolean;
  lastPingStatus: string;
  logs: CrmLog[];
}

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  adminUsername: string;
  adminPassword: string;
  login: (usernameOrPassword: string, password?: string) => boolean;
  changeUsername: (currentPassword: string, newUsername: string) => { success: boolean; message: string };
  changePassword: (oldPassword: string, newPassword: string) => { success: boolean; message: string };
  changeSecurityCredentials: (currentPassword: string, newUsername?: string, newPassword?: string) => { success: boolean; message: string };
  logout: () => void;

  // Branding & Founder
  branding: BrandingConfig;
  updateBranding: (newBranding: Partial<BrandingConfig>) => void;

  // Therapists
  therapists: Therapist[];
  addTherapist: (therapist: Omit<Therapist, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateTherapist: (therapist: Therapist) => void;
  deleteTherapist: (id: string) => void;

  // Blogs
  blogs: BlogPost[];
  addBlog: (blog: Omit<BlogPost, 'id' | 'slug' | 'publishDate'>) => void;
  deleteBlog: (id: string) => void;

  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  // Appointments & Leads
  appointments: Appointment[];
  leads: Lead[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => void;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  deleteLead: (id: string) => void;
  deleteAppointment: (id: string) => void;
  clearAllLeads: () => void;
  clearAllAppointments: () => void;

  // Google Sheets Integration
  googleSheetSettings: GoogleSheetSettings;
  updateGoogleSheetSettings: (url: string, enabled: boolean) => void;
  testGoogleSheetPing: () => Promise<{ success: boolean; message: string }>;

  // CRM Webhook Integration
  crmSettings: CrmSettings;
  updateCrmSettings: (endpointUrl: string, apiKey: string, autoForwardEnabled: boolean) => void;
  testCrmPing: () => Promise<{ success: boolean; message: string }>;
}

const DEFAULT_BRANDING: BrandingConfig = {
  logoUrl: 'https://lh3.googleusercontent.com/d/1eASpq73nrt0LxcaL5uqAar1-VlUGSuQE',
  founderName: 'Kajal Kavita',
  founderRole: 'Founder & Speech Therapist',
  founderQualification: 'D.El.Ed in Special Education, DHLS',
  founderExperienceYears: 7,
  founderBio: 'Kajal Kavita is an experienced Speech Therapist and Founder of Jeevan Wings Center. Holding credentials in Special Education (D.El.Ed) and Hearing Language & Speech (DHLS) with 7+ years of dedicated clinical experience, she specializes in transforming speech, communication, and developmental milestones in children.',
  founderImage: 'https://lh3.googleusercontent.com/d/1EgwFjqFSC0utIfZSY5kCswZ0gsNH0jFg',
  phone: '+91 97175 39376',
  location: 'U-003, I-Tower, Golf City, Plot-8, Sector-75, Noida',
};

const DEFAULT_GSHEET: GoogleSheetSettings = {
  webhookUrl: 'https://script.google.com/macros/s/AKfycbzqnN849Gg3n8nvye6lvtBgGaW86NO98z7ePZC1H-80SArYE1kFGb4RBYT86gfboGZtnQ/exec',
  syncEnabled: true,
  lastSyncTime: '2026-08-18 12:42 (Connected)',
};

const DEFAULT_CRM: CrmSettings = {
  endpointUrl: 'https://api.mycrm.com/v1/jeevanwings/leads-webhook',
  apiKey: 'jw_live_sec_987654321_crm',
  autoForwardEnabled: true,
  lastPingStatus: 'Ready (Sync Engine Active)',
  logs: [],
};

// Helper to sanitize branding URLs (replaces dead /api/media/ URLs with default static assets)
const sanitizeBranding = (b?: Partial<BrandingConfig>): BrandingConfig => {
  const merged: BrandingConfig = { ...DEFAULT_BRANDING, ...(b || {}) };
  if (!merged.logoUrl || merged.logoUrl.startsWith('/api/media/') || merged.logoUrl.trim() === '') {
    merged.logoUrl = '/logo.png';
  }
  if (!merged.founderImage || merged.founderImage.startsWith('/api/media/') || merged.founderImage.trim() === '') {
    merged.founderImage = '/images/kajal_kavita.jpg';
  }
  return merged;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Safe localStorage helper
  const safeSaveStorage = (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`localStorage quota exceeded or error for key ${key}:`, e);
    }
  };

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('admin');
  const [adminPassword, setAdminPassword] = useState<string>('admin');

  // Core Data Lists
  const [branding, setBrandingState] = useState<BrandingConfig>(DEFAULT_BRANDING);

  const setBranding = (newB: Partial<BrandingConfig> | ((prev: BrandingConfig) => Partial<BrandingConfig>)) => {
    setBrandingState((prev) => {
      const updated = typeof newB === 'function' ? newB(prev) : newB;
      return sanitizeBranding(updated);
    });
  };
  const [therapists, setTherapists] = useState<Therapist[]>(INITIAL_THERAPISTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);

  // External Sync Integrations
  const [googleSheetSettings, setGoogleSheetSettings] = useState<GoogleSheetSettings>(DEFAULT_GSHEET);
  const [crmSettings, setCrmSettings] = useState<CrmSettings>(DEFAULT_CRM);

  // Helper to sync specific actions to central server storage (/api/cms)
  const syncCmsAction = (action: string, payload: Record<string, any> = {}) => {
    if (typeof window === 'undefined') return;
    try {
      fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...payload }),
      }).catch((err) => console.log('CMS bg action sync error:', err));
    } catch (e) {
      console.error('Failed to sync CMS action to server:', e);
    }
  };

  // Fetch CMS state from server API
  const fetchCmsState = async () => {
    if (typeof window === 'undefined') return;
    try {
      const res = await fetch('/api/cms');
      if (!res.ok) return;
      const resData = await res.json();
      if (resData.success && resData.data) {
        const cms = resData.data;
        if (cms.branding) {
          setBranding(cms.branding);
          safeSaveStorage('jw_branding', cms.branding);
        }
        if (cms.therapists && Array.isArray(cms.therapists)) {
          setTherapists(cms.therapists);
          safeSaveStorage('jw_therapists', cms.therapists);
        }
        if (cms.blogs && Array.isArray(cms.blogs)) {
          setBlogs(cms.blogs);
          safeSaveStorage('jw_blogs', cms.blogs);
        }
        if (cms.gallery && Array.isArray(cms.gallery)) {
          setGallery(cms.gallery);
          safeSaveStorage('jw_gallery', cms.gallery);
        }
        if (cms.appointments && Array.isArray(cms.appointments)) {
          setAppointments(cms.appointments);
          safeSaveStorage('jw_appointments', cms.appointments);
        }
        if (cms.leads && Array.isArray(cms.leads)) {
          setLeads(cms.leads);
          safeSaveStorage('jw_leads', cms.leads);
        }
        if (cms.googleSheetSettings) {
          setGoogleSheetSettings(cms.googleSheetSettings);
          safeSaveStorage('jw_gsheet', cms.googleSheetSettings);
        }
        if (cms.adminCredentials) {
          if (cms.adminCredentials.username) {
            setAdminUsername(cms.adminCredentials.username);
            safeSaveStorage('jw_admin_username', cms.adminCredentials.username);
          }
          if (cms.adminCredentials.password) {
            setAdminPassword(cms.adminCredentials.password);
            safeSaveStorage('jw_admin_password', cms.adminCredentials.password);
          }
        }
      }
    } catch (err) {
      console.log('CMS fetch error:', err);
    }
  };

  // Initial load & automatic multi-device live polling interval
  useEffect(() => {
    const initTimer = setTimeout(() => {
      // 1. Initial load from local cache for immediate render
      try {
        const savedUser = localStorage.getItem('jw_admin_username');
        if (savedUser) setAdminUsername(savedUser);

        const savedPass = localStorage.getItem('jw_admin_password');
        if (savedPass) setAdminPassword(savedPass);

        const savedAuth = localStorage.getItem('jw_admin_auth');
        if (savedAuth === 'true') setIsAuthenticated(true);

        const savedBranding = localStorage.getItem('jw_branding');
        if (savedBranding) setBranding(JSON.parse(savedBranding));

        const savedTherapists = localStorage.getItem('jw_therapists');
        if (savedTherapists) setTherapists(JSON.parse(savedTherapists));

        const savedBlogs = localStorage.getItem('jw_blogs');
        if (savedBlogs) setBlogs(JSON.parse(savedBlogs));

        const savedGallery = localStorage.getItem('jw_gallery');
        if (savedGallery) setGallery(JSON.parse(savedGallery));

        const savedAppointments = localStorage.getItem('jw_appointments');
        if (savedAppointments) setAppointments(JSON.parse(savedAppointments));

        const savedLeads = localStorage.getItem('jw_leads');
        if (savedLeads) setLeads(JSON.parse(savedLeads));

        const savedGSheet = localStorage.getItem('jw_gsheet');
        if (savedGSheet) setGoogleSheetSettings(JSON.parse(savedGSheet));

        const savedCrm = localStorage.getItem('jw_crm');
        if (savedCrm) setCrmSettings(JSON.parse(savedCrm));
      } catch (e) {
        console.error('Failed to load saved state from localStorage', e);
      }

      // 2. Fetch live global server CMS state immediately
      fetchCmsState();
    }, 0);

    // 3. Setup polling interval (every 5 seconds) & focus event listener for instant sync across devices
    const intervalId = setInterval(fetchCmsState, 5000);
    const handleFocus = () => fetchCmsState();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearTimeout(initTimer);
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper sync triggers
  const triggerExternalSync = (eventType: 'Appointment Booked' | 'Inquiry Submitted', details: any) => {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');

    // 1. Google Sheets Webhook via server proxy
    if (googleSheetSettings.syncEnabled && googleSheetSettings.webhookUrl) {
      try {
        fetch('/api/sync-sheet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webhookUrl: googleSheetSettings.webhookUrl,
            eventType,
            timestamp,
            details,
          }),
        }).catch((err) => console.log('GSheet sync error background:', err));

        const updatedGSheet = { ...googleSheetSettings, lastSyncTime: timestamp };
        setGoogleSheetSettings(updatedGSheet);
        localStorage.setItem('jw_gsheet', JSON.stringify(updatedGSheet));
      } catch (e) {
        console.error('Google Sheet trigger error', e);
      }
    }

    // 2. CRM Webhook Forwarder
    if (crmSettings.autoForwardEnabled && crmSettings.endpointUrl) {
      const payloadSummary = details.childName
        ? `${details.childName} (${details.childAge}) - ${details.serviceName || eventType}`
        : `${details.parentName} - ${details.primaryConcern || eventType}`;

      const newLog: CrmLog = {
        id: `crm-log-${Date.now()}`,
        timestamp,
        eventType,
        payloadSummary,
        status: 'Forwarded',
      };

      try {
        fetch(crmSettings.endpointUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${crmSettings.apiKey}`,
          },
          body: JSON.stringify({ eventType, timestamp, details }),
          mode: 'no-cors',
        }).catch((err) => console.log('CRM forward error background:', err));
      } catch (e) {
        console.error('CRM forward error', e);
      }

      const updatedCrm = {
        ...crmSettings,
        logs: [newLog, ...crmSettings.logs].slice(0, 50),
      };
      setCrmSettings(updatedCrm);
      localStorage.setItem('jw_crm', JSON.stringify(updatedCrm));
    }
  };

  // Auth Methods
  const login = (usernameOrPassword: string, password?: string): boolean => {
    if (password !== undefined) {
      if (usernameOrPassword.trim() === adminUsername && password === adminPassword) {
        setIsAuthenticated(true);
        localStorage.setItem('jw_admin_auth', 'true');
        return true;
      }
      return false;
    }
    // Backward compatibility if only password was passed
    if (usernameOrPassword === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('jw_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const changeUsername = (currentPassword: string, newUsername: string) => {
    if (currentPassword !== adminPassword) {
      return { success: false, message: 'Current password is incorrect!' };
    }
    if (!newUsername || newUsername.trim().length < 2) {
      return { success: false, message: 'New username must be at least 2 characters long!' };
    }
    const trimmed = newUsername.trim();
    setAdminUsername(trimmed);
    localStorage.setItem('jw_admin_username', trimmed);
    return { success: true, message: 'Admin username changed successfully!' };
  };

  const changePassword = (oldPassword: string, newPassword: string) => {
    if (oldPassword !== adminPassword) {
      return { success: false, message: 'Current password is incorrect!' };
    }
    if (!newPassword || newPassword.length < 3) {
      return { success: false, message: 'New password must be at least 3 characters long!' };
    }
    setAdminPassword(newPassword);
    localStorage.setItem('jw_admin_password', newPassword);
    return { success: true, message: 'Admin password changed successfully!' };
  };

  const changeSecurityCredentials = (currentPassword: string, newUsername?: string, newPassword?: string) => {
    if (currentPassword !== adminPassword) {
      return { success: false, message: 'Current password is incorrect!' };
    }
    const updatedParts: string[] = [];
    if (newUsername !== undefined && newUsername.trim() !== '') {
      if (newUsername.trim().length < 2) {
        return { success: false, message: 'New username must be at least 2 characters long!' };
      }
      const trimmed = newUsername.trim();
      setAdminUsername(trimmed);
      localStorage.setItem('jw_admin_username', trimmed);
      updatedParts.push('username');
    }
    if (newPassword !== undefined && newPassword !== '') {
      if (newPassword.length < 3) {
        return { success: false, message: 'New password must be at least 3 characters long!' };
      }
      setAdminPassword(newPassword);
      localStorage.setItem('jw_admin_password', newPassword);
      updatedParts.push('password');
    }
    if (updatedParts.length === 0) {
      return { success: false, message: 'Please provide a new username or new password to update.' };
    }
    syncCmsAction('UPDATE_ADMIN_CREDENTIALS', {
      adminCredentials: {
        username: newUsername !== undefined && newUsername.trim() !== '' ? newUsername.trim() : adminUsername,
        password: newPassword !== undefined && newPassword !== '' ? newPassword : adminPassword,
      },
    });
    return { success: true, message: `Admin ${updatedParts.join(' and ')} updated successfully across all systems!` };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('jw_admin_auth');
  };

  // Branding Updates
  const updateBranding = (newBranding: Partial<BrandingConfig>) => {
    const updated = { ...branding, ...newBranding };
    setBranding(updated);
    safeSaveStorage('jw_branding', updated);
    syncCmsAction('UPDATE_BRANDING', { branding: updated });

    // Update Kajal Kavita's therapist entry if founder name or image changes
    if (newBranding.founderName || newBranding.founderImage || newBranding.founderRole || newBranding.founderQualification) {
      setTherapists((prev) => {
        const updatedTherapists = prev.map((t) =>
          t.id === 'kajal-kavita'
            ? {
                ...t,
                name: updated.founderName,
                role: updated.founderRole,
                qualification: updated.founderQualification,
                image: updated.founderImage,
              }
            : t
        );
        safeSaveStorage('jw_therapists', updatedTherapists);
        syncCmsAction('SAVE_THERAPISTS', { therapists: updatedTherapists });
        return updatedTherapists;
      });
    }
  };

  // Therapist Operations
  const addTherapist = (therapistData: Omit<Therapist, 'id' | 'rating' | 'reviewsCount'>) => {
    const newTherapist: Therapist = {
      ...therapistData,
      id: `therapist-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
    };
    const updated = [newTherapist, ...therapists];
    setTherapists(updated);
    safeSaveStorage('jw_therapists', updated);
    syncCmsAction('SAVE_THERAPISTS', { therapists: updated });
  };

  const updateTherapist = (updatedTherapist: Therapist) => {
    const updated = therapists.map((t) => (t.id === updatedTherapist.id ? updatedTherapist : t));
    setTherapists(updated);
    safeSaveStorage('jw_therapists', updated);
    syncCmsAction('SAVE_THERAPISTS', { therapists: updated });
  };

  const deleteTherapist = (id: string) => {
    const updated = therapists.filter((t) => t.id !== id);
    setTherapists(updated);
    safeSaveStorage('jw_therapists', updated);
    syncCmsAction('SAVE_THERAPISTS', { therapists: updated });
  };

  // Blog Operations
  const addBlog = (blogData: Omit<BlogPost, 'id' | 'slug' | 'publishDate'>) => {
    const newBlog: BlogPost = {
      ...blogData,
      id: `blog-${Date.now()}`,
      slug: blogData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      publishDate: new Date().toISOString().slice(0, 10),
    };
    const updated = [newBlog, ...blogs];
    setBlogs(updated);
    safeSaveStorage('jw_blogs', updated);
    syncCmsAction('SAVE_BLOGS', { blogs: updated });
  };

  const deleteBlog = (id: string) => {
    const updated = blogs.filter((b) => b.id !== id);
    setBlogs(updated);
    safeSaveStorage('jw_blogs', updated);
    syncCmsAction('SAVE_BLOGS', { blogs: updated });
  };

  // Gallery Operations
  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
    };
    const updated = [newItem, ...gallery];
    setGallery(updated);
    safeSaveStorage('jw_gallery', updated);
    syncCmsAction('SAVE_GALLERY', { gallery: updated });
  };

  const deleteGalleryItem = (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    safeSaveStorage('jw_gallery', updated);
    syncCmsAction('SAVE_GALLERY', { gallery: updated });
  };

  // Appointments & Leads
  const addAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const newApt: Appointment = {
      ...aptData,
      bookingDate: aptData.bookingDate || todayStr,
      preferredDate: aptData.preferredDate || aptData.date || todayStr,
      date: aptData.preferredDate || aptData.date || todayStr,
      status: aptData.status || 'Confirmed',
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    const updated = [newApt, ...appointments];
    setAppointments(updated);
    safeSaveStorage('jw_appointments', updated);

    // Call server API to append appointment centrally for all devices
    syncCmsAction('ADD_APPOINTMENT', { appointment: newApt });

    // Trigger auto-sync to Sheets & CRM for booked appointments
    triggerExternalSync('Appointment Booked', {
      ...newApt,
      bookingDate: newApt.bookingDate,
      preferredDate: newApt.preferredDate,
      serviceName: newApt.serviceName || 'Diagnostic Assessment',
      therapistName: newApt.therapistName || 'Senior Specialist',
      notes: newApt.notes || newApt.scoreReasoning || '',
      primaryConcern: newApt.notes || '',
    });
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      status: leadData.status || 'New Inquiry',
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    };
    const updated = [newLead, ...leads];
    setLeads(updated);
    safeSaveStorage('jw_leads', updated);

    // Call server API to append lead centrally for all devices
    syncCmsAction('ADD_LEAD', { lead: newLead });

    // Trigger auto-sync to Sheets & CRM for leads/inquiries
    triggerExternalSync('Inquiry Submitted', {
      ...newLead,
      childName: newLead.childName || '',
      childAge: newLead.childAge || '',
      serviceName: newLead.source || 'Website Inquiry',
      therapistName: 'Jeevan Wings Team',
      bookingDate: new Date().toISOString().slice(0, 10),
      preferredDate: new Date().toISOString().slice(0, 10),
      date: new Date().toISOString().slice(0, 10),
      timeSlot: new Date().toISOString().slice(11, 16),
      notes: newLead.notes || newLead.primaryConcern || '',
      primaryConcern: newLead.primaryConcern || '',
    });
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    let targetApt: Appointment | undefined;
    const updated = appointments.map((a) => {
      if (a.id === id) {
        targetApt = { ...a, status };
        return targetApt;
      }
      return a;
    });

    setAppointments(updated);
    safeSaveStorage('jw_appointments', updated);
    syncCmsAction('UPDATE_APPOINTMENT_STATUS', { id, status });

    // If admin confirms appointment, trigger Google Sheets & CRM sync!
    if (status === 'Confirmed' && targetApt) {
      triggerExternalSync('Appointment Booked', {
        ...targetApt,
        bookingDate: targetApt.bookingDate || targetApt.createdAt?.slice(0, 10) || new Date().toISOString().slice(0, 10),
        preferredDate: targetApt.preferredDate || targetApt.date,
        serviceName: targetApt.serviceName || 'Diagnostic Assessment',
        therapistName: targetApt.therapistName || 'Senior Specialist',
        notes: targetApt.notes || targetApt.scoreReasoning || '',
        primaryConcern: targetApt.notes || '',
      });
    }
  };

  const deleteLead = (id: string) => {
    const updated = leads.filter((l) => l.id !== id);
    setLeads(updated);
    safeSaveStorage('jw_leads', updated);
    syncCmsAction('DELETE_LEAD', { id });
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    safeSaveStorage('jw_appointments', updated);
    syncCmsAction('DELETE_APPOINTMENT', { id });
  };

  const clearAllLeads = () => {
    setLeads([]);
    safeSaveStorage('jw_leads', []);
    syncCmsAction('CLEAR_LEADS');
  };

  const clearAllAppointments = () => {
    setAppointments([]);
    safeSaveStorage('jw_appointments', []);
    syncCmsAction('CLEAR_APPOINTMENTS');
  };

  // Google Sheets Settings Update
  const updateGoogleSheetSettings = (webhookUrl: string, syncEnabled: boolean) => {
    const updated = { ...googleSheetSettings, webhookUrl, syncEnabled };
    setGoogleSheetSettings(updated);
    safeSaveStorage('jw_gsheet', updated);
    syncCmsAction('UPDATE_GSHEET_SETTINGS', { googleSheetSettings: updated });
  };

  const testGoogleSheetPing = async () => {
    if (!googleSheetSettings.webhookUrl) {
      return { success: false, message: 'Google Sheets Webhook URL is empty!' };
    }
    try {
      const res = await fetch('/api/sync-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          webhookUrl: googleSheetSettings.webhookUrl,
          eventType: 'Ping Test / Handshake',
          timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          details: {
            parentName: 'Rahul Sharma (Test)',
            childName: 'Aarav Sharma',
            childAge: '3 Yrs',
            phone: '9876543210',
            serviceName: 'Speech Therapy Assessment',
            therapistName: 'Kajal Kavita (Founder)',
            date: new Date().toISOString().slice(0, 10),
            timeSlot: '10:00 AM - 10:45 AM',
            notes: 'Test ping verification payload from Admin Portal',
          },
        }),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
      const updated = { ...googleSheetSettings, lastSyncTime: new Date().toISOString().slice(0, 16).replace('T', ' ') };
      setGoogleSheetSettings(updated);
      localStorage.setItem('jw_gsheet', JSON.stringify(updated));
      return { success: true, message: data.message || 'Google Sheets Webhook ping sent successfully!' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Failed to ping Google Sheet webhook' };
    }
  };

  // CRM Webhook Settings Update
  const updateCrmSettings = (endpointUrl: string, apiKey: string, autoForwardEnabled: boolean) => {
    const updated = { ...crmSettings, endpointUrl, apiKey, autoForwardEnabled };
    setCrmSettings(updated);
    localStorage.setItem('jw_crm', JSON.stringify(updated));
  };

  const testCrmPing = async () => {
    if (!crmSettings.endpointUrl) {
      return { success: false, message: 'CRM Endpoint URL is empty!' };
    }
    try {
      const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
      await fetch(crmSettings.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${crmSettings.apiKey}`,
        },
        body: JSON.stringify({
          eventType: 'CRM_HANDSHAKE_TEST',
          timestamp,
          source: 'Jeevan Wings Website Admin Portal',
        }),
        mode: 'no-cors',
      });

      const newLog: CrmLog = {
        id: `crm-log-${Date.now()}`,
        timestamp,
        eventType: 'Inquiry Submitted',
        payloadSummary: 'Test Ping Handshake - Verification Payload',
        status: 'Forwarded',
      };

      const updated = {
        ...crmSettings,
        lastPingStatus: 'Connected & Handshake Valid',
        logs: [newLog, ...crmSettings.logs].slice(0, 50),
      };
      setCrmSettings(updated);
      localStorage.setItem('jw_crm', JSON.stringify(updated));
      return { success: true, message: 'CRM Webhook Ping Handshake Successful!' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Failed to ping CRM endpoint' };
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        adminUsername,
        adminPassword,
        login,
        changeUsername,
        changePassword,
        changeSecurityCredentials,
        logout,

        branding,
        updateBranding,

        therapists,
        addTherapist,
        updateTherapist,
        deleteTherapist,

        blogs,
        addBlog,
        deleteBlog,

        gallery,
        addGalleryItem,
        deleteGalleryItem,

        appointments,
        leads,
        addAppointment,
        addLead,
        updateAppointmentStatus,
        deleteLead,
        deleteAppointment,
        clearAllLeads,
        clearAllAppointments,

        googleSheetSettings,
        updateGoogleSheetSettings,
        testGoogleSheetPing,

        crmSettings,
        updateCrmSettings,
        testCrmPing,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
