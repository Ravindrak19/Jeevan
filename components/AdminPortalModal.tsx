'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  Shield,
  Sparkles,
  X,
  Plus,
  Check,
  Search,
  Filter,
  Loader2,
  ArrowUpRight,
  Flame,
  BarChart3,
  Clock,
  AlertTriangle,
  Upload,
  Lock,
  Key,
  Database,
  Link as LinkIcon,
  Globe,
  UserPlus,
  User,
  Trash2,
  Edit,
  FileText,
  Send,
  CheckCircle2,
  RefreshCw,
  Sliders,
  LogOut,
  UserCheck,
  Copy,
  Code,
  Download,
  PhoneCall,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Appointment, Lead, BlogPost, GalleryItem, Therapist } from '@/lib/data';

const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    
    var details = data.details || data;
    
    // Auto-create header columns if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Event Type",
        "Parent Name",
        "Child Name & Age",
        "Phone / Contact",
        "Therapy Service",
        "Specialist / Therapist",
        "Booking Date (Created)",
        "Preferred Appointment Date & Time",
        "Primary Concern / Notes"
      ]);
      sheet.getRange(1, 1, 1, 10)
        .setFontWeight("bold")
        .setBackground("#0A2540")
        .setFontColor("#FFFFFF");
    }
    
    var parentName = details.parentName || details.name || data.parentName || data.name || "";
    var childName = details.childName || data.childName || "";
    var childAge = details.childAge || data.childAge || "";
    var childInfo = childName ? (childName + (childAge ? " (" + childAge + ")" : "")) : (childAge || "");
    var phone = details.phone || data.phone || "";
    var serviceName = details.serviceName || details.service || data.serviceName || "Speech Consultation";
    var therapistName = details.therapistName || details.therapist || data.therapistName || "Lead Specialist";
    
    var bookingDate = details.bookingDate || data.bookingDate || (data.timestamp ? data.timestamp.slice(0, 10) : new Date().toISOString().slice(0, 10));
    var preferredDate = details.preferredDate || details.date || data.preferredDate || data.date || "";
    var timeSlot = details.timeSlot || data.timeSlot || "";
    var preferredDateTimeStr = preferredDate + (timeSlot ? " @ " + timeSlot : "");
    
    var concern = details.primaryConcern || details.notes || data.primaryConcern || data.notes || "";
    
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.eventType || "Parent Inquiry",
      parentName,
      childInfo,
      phone,
      serviceName,
      therapistName,
      bookingDate,
      preferredDateTimeStr,
      concern
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Lead saved to Google Sheet successfully"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments?: Appointment[];
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    isAuthenticated,
    adminUsername,
    login,
    changePassword,
    changeSecurityCredentials,
    logout,
    branding,
    updateBranding,
    therapists,
    addTherapist,
    deleteTherapist,
    blogs,
    addBlog,
    deleteBlog,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    appointments,
    leads,
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
  } = useApp();

  // Search & Filter State for Leads & Appointments
  const [leadSearch, setLeadSearch] = useState('');
  const [leadScoreFilter, setLeadScoreFilter] = useState('All');
  const [aptSearch, setAptSearch] = useState('');
  const [aptStatusFilter, setAptStatusFilter] = useState('All');

  // CSV Export Helpers
  const exportLeadsToCSV = () => {
    if (!leads.length) return;
    const headers = ['Parent Name', 'Phone', 'Email', 'Child Age', 'Primary Concern', 'Source', 'Score', 'Status', 'Date Created', 'Notes'];
    const rows = leads.map(l => [
      `"${(l.parentName || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.childAge || '').replace(/"/g, '""')}"`,
      `"${(l.primaryConcern || '').replace(/"/g, '""')}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`,
      `"${(l.score || '').replace(/"/g, '""')}"`,
      `"${(l.status || '').replace(/"/g, '""')}"`,
      `"${(l.createdAt || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jeevan_wings_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAppointmentsToCSV = () => {
    if (!appointments.length) return;
    const headers = ['Parent Name', 'Phone', 'Child Name', 'Child Age', 'Therapy Service', 'Specialist', 'Booking Date (Created)', 'Preferred Appointment Date', 'Time Slot', 'Status', 'Notes'];
    const rows = appointments.map(a => [
      `"${(a.parentName || '').replace(/"/g, '""')}"`,
      `"${(a.phone || '').replace(/"/g, '""')}"`,
      `"${(a.childName || '').replace(/"/g, '""')}"`,
      `"${(a.childAge || '').replace(/"/g, '""')}"`,
      `"${(a.serviceName || '').replace(/"/g, '""')}"`,
      `"${(a.therapistName || '').replace(/"/g, '""')}"`,
      `"${(a.bookingDate || a.createdAt?.slice(0, 10) || '').replace(/"/g, '""')}"`,
      `"${(a.preferredDate || a.date || '').replace(/"/g, '""')}"`,
      `"${(a.timeSlot || '').replace(/"/g, '""')}"`,
      `"${(a.status || '').replace(/"/g, '""')}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jeevan_wings_appointments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Active Tab State
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'leads'
    | 'appointments'
    | 'therapists'
    | 'blogs'
    | 'gallery'
    | 'branding'
    | 'gsheet'
    | 'crm'
    | 'security'
  >('overview');

  // Login Form State
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Security / Credentials Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ success: boolean; text: string } | null>(null);

  // Branding Form State
  const [logoInput, setLogoInput] = useState(branding.logoUrl);
  const [founderNameInput, setFounderNameInput] = useState(branding.founderName);
  const [founderRoleInput, setFounderRoleInput] = useState(branding.founderRole);
  const [founderQualInput, setFounderQualInput] = useState(branding.founderQualification);
  const [founderExpInput, setFounderExpInput] = useState(branding.founderExperienceYears);
  const [founderBioInput, setFounderBioInput] = useState(branding.founderBio);
  const [founderImgInput, setFounderImgInput] = useState(branding.founderImage);
  const [brandingSaved, setBrandingSaved] = useState(false);

  // New Therapist Form State
  const [showAddTherapistModal, setShowAddTherapistModal] = useState(false);
  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('Pediatric Speech Therapist');
  const [tQual, setTQual] = useState('B.ASLP / M.ASLP');
  const [tExp, setTExp] = useState(5);
  const [tBio, setTBio] = useState('');
  const [tImg, setTImg] = useState('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400');
  const [tSpecialties, setTSpecialties] = useState('Speech Delay, Stammering, Articulation');
  const [therapistSuccessMsg, setTherapistSuccessMsg] = useState('');

  // Blog Publishing State
  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('Speech Therapy');
  const [blogImage, setBlogImage] = useState('https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800');
  const [blogAuthor, setBlogAuthor] = useState('Kajal Kavita');

  // AI Blog Writer State
  const [showAiBlogModal, setShowAiBlogModal] = useState(false);
  const [aiBlogTopic, setAiBlogTopic] = useState('');
  const [aiBlogCategory, setAiBlogCategory] = useState('Speech Therapy');
  const [generatingBlog, setGeneratingBlog] = useState(false);

  // New Gallery Item State
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [gTitle, setGTitle] = useState('');
  const [gCategory, setGCategory] = useState<'Sensory Gym' | 'Speech Labs' | 'Play Rooms' | 'Events & Workshops' | 'Infrastructure'>('Sensory Gym');
  const [gDesc, setGDesc] = useState('');
  const [gImage, setGImage] = useState('https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800');

  // Google Sheet Form State
  const [gsheetUrl, setGsheetUrl] = useState(googleSheetSettings.webhookUrl);
  const [gsheetEnabled, setGsheetEnabled] = useState(googleSheetSettings.syncEnabled);
  const [pingingGSheet, setPingingGSheet] = useState(false);
  const [gsheetStatus, setGsheetStatus] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  // CRM Webhook Form State
  const [crmUrl, setCrmUrl] = useState(crmSettings.endpointUrl);
  const [crmKey, setCrmKey] = useState(crmSettings.apiKey);
  const [crmAutoForward, setCrmAutoForward] = useState(crmSettings.autoForwardEnabled);
  const [pingingCrm, setPingingCrm] = useState(false);
  const [crmStatus, setCrmStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper to compress uploaded image files to lightweight base64 JPEG
  const compressImageFile = (file: File, maxWidth = 600, maxHeight = 600, quality = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve((event.target?.result as string) || '');
          }
        };
        img.onerror = () => resolve((event.target?.result as string) || '');
        img.src = (event.target?.result as string) || '';
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // File to Base64 Upload Helper with Automatic Compression (100% persistent on Vercel/Serverless)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const mimeType = file.type === 'image/png' ? 'png' : 'jpeg';
      const compressedDataUrl = await compressImageFile(file, 800, 800, 0.85);
      if (compressedDataUrl) {
        setter(compressedDataUrl);
      }
    } catch (err) {
      console.warn('Image compression failed, fallback to raw reader:', err);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Login Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = login(loginId, loginPassword);
    if (!success) {
      setLoginError('Incorrect username or password. Please verify your credentials.');
    } else {
      setLoginPassword('');
    }
  };

  // Security Credentials Change Handler
  const handleSecurityChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (newPass && newPass !== confirmPass) {
      setPassMsg({ success: false, text: 'New password and confirm password do not match!' });
      return;
    }
    const res = changeSecurityCredentials(
      currentPass,
      newUsername ? newUsername : undefined,
      newPass ? newPass : undefined
    );
    setPassMsg({ success: res.success, text: res.message });
    if (res.success) {
      setCurrentPass('');
      setNewUsername('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  // Save Branding Handler
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding({
      logoUrl: logoInput,
      founderName: founderNameInput,
      founderRole: founderRoleInput,
      founderQualification: founderQualInput,
      founderExperienceYears: Number(founderExpInput),
      founderBio: founderBioInput,
      founderImage: founderImgInput,
    });
    setBrandingSaved(true);
    setTimeout(() => setBrandingSaved(false), 3000);
  };

  // Add Therapist Handler
  const handleAddTherapistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName.trim()) return;
    const defaultImg = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';
    const addedName = tName.trim();
    addTherapist({
      name: addedName,
      role: tRole || 'Pediatric Speech Therapist',
      qualification: tQual || 'B.ASLP',
      experienceYears: Number(tExp) || 1,
      specialties: tSpecialties ? tSpecialties.split(',').map((s) => s.trim()).filter(Boolean) : ['Speech Delay', 'Child Therapy'],
      bio: tBio || `${addedName} is a dedicated practitioner at Jeevan Wings Center.`,
      availabilityDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      image: tImg || defaultImg,
    });
    setTherapistSuccessMsg(`Clinical Specialist "${addedName}" added successfully and published on website!`);
    setTimeout(() => setTherapistSuccessMsg(''), 5000);
    setShowAddTherapistModal(false);
    setTName('');
    setTRole('Pediatric Speech Therapist');
    setTQual('B.ASLP');
    setTExp(5);
    setTSpecialties('Speech Delay, Stammering, Articulation');
    setTBio('');
    setTImg(defaultImg);
  };

  // Custom Blog Submit
  const handleAddBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;
    addBlog({
      title: blogTitle,
      excerpt: blogExcerpt,
      content: blogContent,
      category: blogCategory,
      author: blogAuthor,
      authorRole: 'Clinical Specialist',
      readTime: '4 Min Read',
      image: blogImage,
      tags: ['Pediatric Care', 'Noida Sector 75', blogCategory],
      seoMetaTitle: blogTitle,
      seoMetaDescription: blogExcerpt,
    });
    setShowAddBlogModal(false);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
  };

  // AI Blog Generation Handler
  const handleGenerateAiBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiBlogTopic.trim()) return;
    setGeneratingBlog(true);

    try {
      const res = await fetch('/api/ai/blog-writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiBlogTopic,
          category: aiBlogCategory,
          targetKeywords: 'Speech Therapy Noida, Child Development Sector 75',
        }),
      });

      const data = await res.json();
      if (data.success && data.blog) {
        addBlog({
          title: data.blog.title,
          excerpt: data.blog.excerpt,
          content: data.blog.content,
          category: aiBlogCategory,
          author: `${branding.founderName} (AI Assisted)`,
          authorRole: 'Founder & Clinical Director',
          readTime: data.blog.readTime || '5 Min Read',
          image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=800',
          tags: data.blog.tags || ['Noida Sector 75', 'Child Development'],
          seoMetaTitle: data.blog.seoMetaTitle || data.blog.title,
          seoMetaDescription: data.blog.seoMetaDescription || data.blog.excerpt,
        });
        setShowAiBlogModal(false);
        setAiBlogTopic('');
      }
    } catch (e) {
      console.error('Failed AI Blog Generation', e);
    } finally {
      setGeneratingBlog(false);
    }
  };

  // Add Gallery Item Submit
  const handleAddGallerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gTitle.trim()) return;
    addGalleryItem({
      title: gTitle,
      category: gCategory,
      description: gDesc || `${gTitle} facility at Jeevan Wings Center Noida Sector 75`,
      imageUrl: gImage,
      altText: gTitle,
    });
    setShowAddGalleryModal(false);
    setGTitle('');
    setGDesc('');
  };

  // Google Sheet Save & Ping
  const handleGSheetSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoogleSheetSettings(gsheetUrl, gsheetEnabled);
    setGsheetStatus('Settings saved successfully!');
    setTimeout(() => setGsheetStatus(null), 3000);
  };

  const handleGSheetPing = async () => {
    setPingingGSheet(true);
    setGsheetStatus(null);
    const res = await testGoogleSheetPing();
    setPingingGSheet(false);
    setGsheetStatus(res.message);
  };

  // CRM Webhook Save & Ping
  const handleCrmSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCrmSettings(crmUrl, crmKey, crmAutoForward);
    setCrmStatus('CRM Settings saved successfully!');
    setTimeout(() => setCrmStatus(null), 3000);
  };

  const handleCrmPing = async () => {
    setPingingCrm(true);
    setCrmStatus(null);
    const res = await testCrmPing();
    setPingingCrm(false);
    setCrmStatus(res.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[24px] shadow-2xl border border-slate-100 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden my-auto"
      >
        {/* Top Enterprise Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <img src={branding.logoUrl || '/logo.png'} alt="Logo" className="w-9 h-9 object-contain bg-white/10 p-0.5 rounded-xl" />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-poppins font-bold text-base text-white">Jeevan Wings Admin CMS Portal</h3>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                  SECURE SYSTEM
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Noida Sector 75 Rehabilitation Center Control Suite</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated && (
              <button
                onClick={logout}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* UNAUTHENTICATED: LOGIN SCREEN */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-blue-50 text-[#0A2540] rounded-2xl flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
                  <Lock className="w-7 h-7 text-[#0A2540]" />
                </div>
                <h2 className="font-poppins font-bold text-2xl text-slate-900">Admin Portal Login</h2>
                <p className="text-xs text-slate-500">
                  Password protected admin workspace. Enter your credentials to manage leads, therapists, blogs & integrations.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Login ID</label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Enter admin ID"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-hidden focus:border-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-hidden focus:border-[#0A2540]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#EA580C] hover:bg-[#C2410C] text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <Shield className="w-4 h-4 text-white" />
                  <span>Access Secure Portal</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED: DASHBOARD TABS & PANELS */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 flex flex-col justify-between shrink-0 overflow-y-auto">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">CMS Navigation</p>

                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'overview' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview & Health</span>
                </button>

                <button
                  onClick={() => setActiveTab('leads')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'leads' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Inquiries & Leads ({leads.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'appointments' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Appointments ({appointments.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('therapists')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'therapists' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Therapists ({therapists.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'blogs' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Blogs & Articles ({blogs.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('gallery')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'gallery' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Gallery Gym Photos ({gallery.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('branding')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'branding' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Sliders className="w-4 h-4 text-[#EA580C]" />
                  <span>Branding & Founder</span>
                </button>

                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pt-4 mb-2">Integrations & Security</p>

                <button
                  onClick={() => setActiveTab('gsheet')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'gsheet' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Google Sheets Sync</span>
                </button>

                <button
                  onClick={() => setActiveTab('crm')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'crm' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>CRM Webhook Software</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    activeTab === 'security' ? 'bg-[#0A2540] text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Key className="w-4 h-4 text-rose-400" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
                <p>Noida Sector 75 Center</p>
                <p className="text-emerald-400 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Sync Services Active</span>
                </p>
              </div>
            </div>

            {/* Main Tab Panel Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-poppins font-bold text-2xl text-slate-900">Executive Performance Overview</h2>
                    <p className="text-xs text-slate-500">Live operational metrics and sync status for Jeevan Wings Center</p>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-xs font-bold text-slate-500 uppercase">Total Inquiries</p>
                      <h3 className="font-poppins font-extrabold text-3xl text-slate-900 mt-1">{leads.length}</h3>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-1">Live Parent Leads</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-xs font-bold text-slate-500 uppercase">Booked Consultations</p>
                      <h3 className="font-poppins font-extrabold text-3xl text-[#0A2540] mt-1">{appointments.length}</h3>
                      <p className="text-[11px] text-blue-600 font-semibold mt-1">Confirmed Appointments</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-xs font-bold text-slate-500 uppercase">Specialist Team</p>
                      <h3 className="font-poppins font-extrabold text-3xl text-slate-900 mt-1">{therapists.length}</h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">Active Clinical Staff</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                      <p className="text-xs font-bold text-slate-500 uppercase">Google Sheet Sync</p>
                      <h3 className="font-poppins font-extrabold text-xl text-emerald-600 mt-1">
                        {googleSheetSettings.syncEnabled ? 'ACTIVE' : 'OFF'}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 truncate">{googleSheetSettings.lastSyncTime || 'Ready'}</p>
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <h3 className="font-poppins font-bold text-base text-slate-900">Quick Administrative Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => { setActiveTab('therapists'); setShowAddTherapistModal(true); }}
                        className="p-4 bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 rounded-xl text-left transition-colors"
                      >
                        <UserPlus className="w-5 h-5 text-[#0A2540] mb-1" />
                        <p className="font-bold text-xs text-slate-900">Add New Therapist</p>
                        <p className="text-[11px] text-slate-500">Upload profile, bio & credentials</p>
                      </button>

                      <button
                        onClick={() => { setActiveTab('blogs'); setShowAddBlogModal(true); }}
                        className="p-4 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left transition-colors"
                      >
                        <FileText className="w-5 h-5 text-emerald-600 mb-1" />
                        <p className="font-bold text-xs text-slate-900">Publish Blog Article</p>
                        <p className="text-[11px] text-slate-500">Post custom or AI generated blogs</p>
                      </button>

                      <button
                        onClick={() => { setActiveTab('gallery'); setShowAddGalleryModal(true); }}
                        className="p-4 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left transition-colors"
                      >
                        <Upload className="w-5 h-5 text-amber-600 mb-1" />
                        <p className="font-bold text-xs text-slate-900">Upload Activity Photos</p>
                        <p className="text-[11px] text-slate-500">Sensory gym & therapy pics</p>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LEADS & INQUIRIES */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-poppins font-bold text-xl text-slate-900 flex items-center space-x-2">
                        <span>Inquiries & Leads</span>
                        <span className="bg-blue-100 text-[#0A2540] text-xs px-2.5 py-0.5 rounded-full font-extrabold">{leads.length}</span>
                      </h2>
                      <p className="text-xs text-slate-500">Parent inquiries submitted through smart search and contact forms</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {leads.length > 0 && (
                        <>
                          <button
                            onClick={exportLeadsToCSV}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export CSV</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to clear all inquiries?')) {
                                clearAllLeads();
                              }
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear All</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Filters & Search */}
                  {leads.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
                      <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={leadSearch}
                          onChange={(e) => setLeadSearch(e.target.value)}
                          placeholder="Search parent name, phone or primary concern..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A2540]"
                        />
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={leadScoreFilter}
                          onChange={(e) => setLeadScoreFilter(e.target.value)}
                          className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white font-medium text-slate-700"
                        >
                          <option value="All">All Leads</option>
                          <option value="Hot">Hot Lead</option>
                          <option value="Warm">Warm Lead</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Table or Clean Empty State */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {leads.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <div className="w-12 h-12 bg-blue-50 text-[#0A2540] rounded-2xl flex items-center justify-center mx-auto">
                          <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-poppins font-bold text-base text-slate-900">No Parent Inquiries Yet</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          When parents fill out contact forms or ask questions via AI Assistant, their inquiries will appear here live with automatic score calculations!
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                            <tr>
                              <th className="p-3">Parent Name</th>
                              <th className="p-3">Phone / Contact</th>
                              <th className="p-3">Child Age</th>
                              <th className="p-3">Primary Concern</th>
                              <th className="p-3">Score</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {leads
                              .filter((l) => {
                                const q = leadSearch.toLowerCase();
                                const matchesSearch = !q || l.parentName.toLowerCase().includes(q) || l.phone.toLowerCase().includes(q) || (l.primaryConcern || '').toLowerCase().includes(q);
                                const matchesScore = leadScoreFilter === 'All' || l.score === leadScoreFilter;
                                return matchesSearch && matchesScore;
                              })
                              .map((l) => {
                                const cleanPhone = l.phone.replace(/[^0-9]/g, '');
                                const waMsg = encodeURIComponent(`Hello ${l.parentName}, thank you for contacting Jeevan Wings Speech & Child Development Center Noida. How can we assist you with ${l.childAge ? `your child (${l.childAge})` : 'therapy services'}?`);
                                const waUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${waMsg}`;

                                return (
                                  <tr key={l.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-bold text-slate-900">{l.parentName}</td>
                                    <td className="p-3 font-semibold text-[#0A2540]">
                                      <div className="flex items-center space-x-1.5">
                                        <span>{l.phone}</span>
                                        <a
                                          href={waUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          title="Chat on WhatsApp"
                                          className="p-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                        >
                                          <MessageSquare className="w-3.5 h-3.5" />
                                        </a>
                                        <a
                                          href={`tel:${l.phone}`}
                                          title="Call Parent"
                                          className="p-1 bg-blue-50 text-[#0A2540] hover:bg-blue-100 rounded-lg transition-colors"
                                        >
                                          <PhoneCall className="w-3.5 h-3.5" />
                                        </a>
                                      </div>
                                    </td>
                                    <td className="p-3">{l.childAge}</td>
                                    <td className="p-3 max-w-xs text-slate-600 truncate" title={l.primaryConcern}>{l.primaryConcern}</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        l.score === 'Hot' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                      }`}>
                                        {l.score} Lead
                                      </span>
                                    </td>
                                    <td className="p-3">
                                      <span className="bg-blue-50 text-[#0A2540] px-2 py-0.5 rounded-md font-semibold">
                                        {l.status}
                                      </span>
                                    </td>
                                    <td className="p-3 text-right">
                                      <button
                                        onClick={() => deleteLead(l.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Delete Lead"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: APPOINTMENTS */}
              {activeTab === 'appointments' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-poppins font-bold text-xl text-slate-900 flex items-center space-x-2">
                        <span>Booked Consultations</span>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-extrabold">{appointments.length}</span>
                      </h2>
                      <p className="text-xs text-slate-500">Confirmed parent appointment bookings and status management</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {appointments.length > 0 && (
                        <>
                          <button
                            onClick={exportAppointmentsToCSV}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export CSV</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to clear all appointment bookings?')) {
                                clearAllAppointments();
                              }
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear All</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Pending Banner Alert */}
                  {appointments.filter((a) => a.status === 'Pending').length > 0 && (
                    <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-xs">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                        <span>
                          You have <strong>{appointments.filter((a) => a.status === 'Pending').length}</strong> new booking(s) in <strong>Pending</strong> state. Confirm to send details to Google Sheet.
                        </span>
                      </div>
                      <button
                        onClick={() => setAptStatusFilter('Pending')}
                        className="bg-amber-600 text-white hover:bg-amber-700 px-3 py-1 rounded-lg font-bold text-[11px] transition-colors"
                      >
                        View Pending Only
                      </button>
                    </div>
                  )}

                  {/* Filters & Search */}
                  {appointments.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200">
                      <div className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={aptSearch}
                          onChange={(e) => setAptSearch(e.target.value)}
                          placeholder="Search parent, child, phone or specialist name..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A2540]"
                        />
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={aptStatusFilter}
                          onChange={(e) => setAptStatusFilter(e.target.value)}
                          className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white font-medium text-slate-700"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Pending">⏳ Pending Review</option>
                          <option value="Confirmed">✓ Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Table or Clean Empty State */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {appointments.length === 0 ? (
                      <div className="p-12 text-center space-y-3">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="font-poppins font-bold text-base text-slate-900">No Consultation Bookings Yet</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          When parents book speech therapy, occupational therapy, or behavioral assessments, their bookings will appear here live in real-time across all devices!
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                            <tr>
                              <th className="p-3">Parent & Child</th>
                              <th className="p-3">Therapy Service</th>
                              <th className="p-3">Specialist</th>
                              <th className="p-3">Date & Time</th>
                              <th className="p-3">Status / Approval</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {appointments
                              .filter((a) => {
                                const q = aptSearch.toLowerCase();
                                const matchesSearch = !q || a.parentName.toLowerCase().includes(q) || a.childName.toLowerCase().includes(q) || a.phone.toLowerCase().includes(q) || a.therapistName.toLowerCase().includes(q);
                                const matchesStatus = aptStatusFilter === 'All' || a.status === aptStatusFilter;
                                return matchesSearch && matchesStatus;
                              })
                              .map((a) => {
                                const cleanPhone = a.phone.replace(/[^0-9]/g, '');
                                const waMsg = encodeURIComponent(`Hello ${a.parentName}, confirming consultation appointment for ${a.childName} (${a.serviceName}) with ${a.therapistName} on ${a.date} at ${a.timeSlot}.`);
                                const waUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${waMsg}`;

                                return (
                                  <tr key={a.id} className="hover:bg-slate-50">
                                    <td className="p-3">
                                      <p className="font-bold text-slate-900">{a.parentName}</p>
                                      <p className="text-[11px] text-slate-500">Child: {a.childName} ({a.childAge})</p>
                                      <div className="flex items-center space-x-1.5 mt-0.5">
                                        <span className="text-[11px] text-[#0A2540] font-semibold">{a.phone}</span>
                                        <a
                                          href={waUrl}
                                          target="_blank"
                                          rel="noreferrer"
                                          title="Send WhatsApp Confirmation"
                                          className="p-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                        >
                                          <MessageSquare className="w-3 h-3" />
                                        </a>
                                      </div>
                                    </td>
                                    <td className="p-3 font-medium text-slate-800">{a.serviceName}</td>
                                    <td className="p-3 font-semibold text-slate-900">{a.therapistName}</td>
                                    <td className="p-3">
                                      <p className="text-[10px] font-semibold text-slate-500">
                                        Booked: <span className="font-bold text-slate-800">{a.bookingDate || a.createdAt?.slice(0, 10) || 'Today'}</span>
                                      </p>
                                      <p className="font-bold text-[#0A2540] mt-0.5">
                                        Preferred: {a.preferredDate || a.date}
                                      </p>
                                      <p className="text-[11px] text-slate-500">{a.timeSlot}</p>
                                    </td>
                                    <td className="p-3">
                                      {a.status === 'Pending' ? (
                                        <div className="space-y-1.5">
                                          <span className="inline-block bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md font-bold text-[10px]">
                                            ⏳ Pending Review
                                          </span>
                                          <button
                                            onClick={() => updateAppointmentStatus(a.id, 'Confirmed')}
                                            className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all shadow-xs text-center cursor-pointer"
                                            title="Confirm Booking and sync to Google Sheet"
                                          >
                                            ✓ Confirm & Sync Sheet
                                          </button>
                                        </div>
                                      ) : (
                                        <select
                                          value={a.status}
                                          onChange={(e) => updateAppointmentStatus(a.id, e.target.value as any)}
                                          className="text-[11px] border border-slate-200 rounded-lg p-1 bg-white font-medium text-slate-800 focus:outline-hidden focus:border-[#0A2540]"
                                        >
                                          <option value="Pending">Pending</option>
                                          <option value="Confirmed">Confirmed</option>
                                          <option value="Completed">Completed</option>
                                          <option value="Cancelled">Cancelled</option>
                                        </select>
                                      )}
                                    </td>
                                    <td className="p-3 text-right">
                                      <button
                                        onClick={() => deleteAppointment(a.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                        title="Delete Appointment"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: THERAPISTS MANAGEMENT */}
              {activeTab === 'therapists' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-poppins font-bold text-xl text-slate-900">Therapist & Specialist Team</h2>
                      <p className="text-xs text-slate-500">Add and manage clinical specialists displayed on the website</p>
                    </div>

                    <button
                      onClick={() => setShowAddTherapistModal(true)}
                      className="bg-[#0A2540] hover:bg-[#06182B] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition-all"
                    >
                      <Plus className="w-4 h-4 text-[#EA580C]" />
                      <span>Add New Specialist</span>
                    </button>
                  </div>

                  {therapistSuccessMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-xl flex items-center space-x-2.5 font-medium shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{therapistSuccessMsg}</span>
                    </div>
                  )}

                  {/* Therapists List Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {therapists.map((t) => (
                      <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img
                            src={t.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'}
                            alt={t.name}
                            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400';
                            }}
                          />
                          <div className="space-y-1">
                            <h4 className="font-poppins font-bold text-base text-slate-900">{t.name}</h4>
                            <p className="text-xs font-semibold text-[#0A2540]">{t.role}</p>
                            <p className="text-[11px] text-slate-500">{t.qualification} • {t.experienceYears} Yrs Exp</p>
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">{t.bio}</p>
                          </div>
                        </div>

                        {t.id !== 'kajal-kavita' && (
                          <button
                            onClick={() => deleteTherapist(t.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete Therapist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BLOGS MANAGEMENT */}
              {activeTab === 'blogs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-poppins font-bold text-xl text-slate-900">Custom Blog Publishing</h2>
                      <p className="text-xs text-slate-500">Write custom articles or generate AI clinical blog posts</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowAiBlogModal(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>AI Blog Writer</span>
                      </button>

                      <button
                        onClick={() => setShowAddBlogModal(true)}
                        className="bg-[#0A2540] hover:bg-[#06182B] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#EA580C]" />
                        <span>Write Custom Blog</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blogs.map((b) => (
                      <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between space-x-3">
                        <div className="flex items-start space-x-3">
                          <img src={b.image} alt={b.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-[#0A2540] uppercase">{b.category}</span>
                            <h4 className="font-poppins font-bold text-xs text-slate-900 line-clamp-2">{b.title}</h4>
                            <p className="text-[11px] text-slate-500">By {b.author} • {b.publishDate}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteBlog(b.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                          title="Delete Blog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: GALLERY MANAGEMENT */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-poppins font-bold text-xl text-slate-900">Gallery & Child Activity Photos</h2>
                      <p className="text-xs text-slate-500">Upload pictures of therapy sessions, sensory gym and play rooms</p>
                    </div>

                    <button
                      onClick={() => setShowAddGalleryModal(true)}
                      className="bg-[#0A2540] hover:bg-[#06182B] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all"
                    >
                      <Upload className="w-4 h-4 text-[#EA580C]" />
                      <span>Upload New Photo</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gallery.map((g) => (
                      <div key={g.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative group">
                        <img src={g.imageUrl} alt={g.title} className="w-full h-36 object-cover" />
                        <div className="p-3">
                          <span className="text-[10px] font-bold text-[#0A2540] uppercase">{g.category}</span>
                          <h4 className="font-poppins font-bold text-xs text-slate-900">{g.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{g.description}</p>
                        </div>
                        <button
                          onClick={() => deleteGalleryItem(g.id)}
                          className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-90 hover:opacity-100 shadow-md transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: BRANDING & FOUNDER DETAILS */}
              {activeTab === 'branding' && (
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl">
                  <div>
                    <h2 className="font-poppins font-bold text-xl text-slate-900">Custom Website Logo & Founder Details</h2>
                    <p className="text-xs text-slate-500">Update logo and founder profile information across the entire website. Tip: You can paste any direct image URL (Google Drive public link, Imgur, etc.) for permanent, reliable updating.</p>
                  </div>

                  {brandingSaved && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Website Branding & Founder Details updated successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveBranding} className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <label className="block text-xs font-bold text-slate-800 uppercase">Custom Website Logo</label>
                      <div className="flex items-center space-x-4">
                        <img
                          src={logoInput || '/logo.png'}
                          alt="Logo Preview"
                          className="w-12 h-12 object-contain bg-white p-1 rounded-xl border border-slate-200"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/logo.png';
                          }}
                        />
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={logoInput}
                            onChange={(e) => setLogoInput(e.target.value)}
                            placeholder="Logo Image URL"
                            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                          />
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-slate-500">Or upload local file:</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e, setLogoInput)}
                              className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0A2540]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Founder Name</label>
                        <input
                          type="text"
                          value={founderNameInput}
                          onChange={(e) => setFounderNameInput(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designation / Role</label>
                        <input
                          type="text"
                          value={founderRoleInput}
                          onChange={(e) => setFounderRoleInput(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Qualifications & Degrees</label>
                        <input
                          type="text"
                          value={founderQualInput}
                          onChange={(e) => setFounderQualInput(e.target.value)}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience Years</label>
                        <input
                          type="number"
                          value={founderExpInput}
                          onChange={(e) => setFounderExpInput(Number(e.target.value))}
                          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Founder Photo Upload</label>
                      <div className="flex items-center space-x-3">
                        <img
                          src={founderImgInput || '/images/kajal_kavita.jpg'}
                          alt="Founder Preview"
                          className="w-12 h-12 rounded-full object-cover border border-slate-200"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/kajal_kavita.jpg';
                          }}
                        />
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={founderImgInput}
                            onChange={(e) => setFounderImgInput(e.target.value)}
                            placeholder="Image URL"
                            className="w-full text-xs px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setFounderImgInput)}
                            className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#0A2540]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Founder Bio / Mission</label>
                      <textarea
                        rows={3}
                        value={founderBioInput}
                        onChange={(e) => setFounderBioInput(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#0A2540] hover:bg-[#06182B] text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all"
                    >
                      <Check className="w-4 h-4 text-[#EA580C]" />
                      <span>Update Website Branding & Founder</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 8: GOOGLE SHEETS INTEGRATION */}
              {activeTab === 'gsheet' && (
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Database className="w-5 h-5 text-emerald-600" />
                      <h2 className="font-poppins font-bold text-xl text-slate-900">Google Sheets Lead Sync</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Automatically stream every booked appointment and parent inquiry into your Google Sheet via Webhook AppScript
                    </p>
                  </div>

                  {gsheetStatus && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs p-3 rounded-xl flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0A2540] shrink-0" />
                      <span>{gsheetStatus}</span>
                    </div>
                  )}

                  <form onSubmit={handleGSheetSave} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Google Apps Script Webhook URL
                      </label>
                      <input
                        type="text"
                        value={gsheetUrl}
                        onChange={(e) => setGsheetUrl(e.target.value)}
                        placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                        className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl font-mono text-slate-800"
                      />
                      {gsheetUrl.includes('docs.google.com/spreadsheets') && (
                        <div className="mt-2 p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start space-x-2.5 shadow-xs">
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-900">⚠️ Dhyan Sein: Aapne Direct Google Sheet Ka Link Dala Hai!</p>
                            <p className="mt-1 text-[11px] text-slate-700 leading-relaxed">
                              Direct <code>docs.google.com</code> URL par data auto-sync nahi ho sakta. Data direct aapke Google Sheet mein receive hone ke liye <strong>Apps Script Web App URL</strong> (jo <code>script.google.com/macros/s/.../exec</code> hota hai) zaroori hai.
                              <br />
                              <span className="font-semibold text-amber-800">Kripya niche 6 steps wala guide dekhein, Apps Script Code copy karke deploy karein aur Web App URL yahan paste karein.</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="gsheetEnable"
                        checked={gsheetEnabled}
                        onChange={(e) => setGsheetEnabled(e.target.checked)}
                        className="w-4 h-4 text-[#0A2540] rounded border-slate-300"
                      />
                      <label htmlFor="gsheetEnable" className="text-xs font-bold text-slate-800">
                        Enable Automatic Real-time Google Sheet Syncing
                      </label>
                    </div>

                    {/* Apps Script Code Box with Copy Button */}
                    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 text-slate-100 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                          <Code className="w-4 h-4 text-[#0A2540]" />
                          <span>Google Apps Script Code (Code.gs)</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyScript}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                            copiedScript
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#0A2540] hover:bg-blue-600 text-white'
                          }`}
                        >
                          {copiedScript ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Code Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Script Code</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400">
                        Copy this script, paste it into your Google Sheet&apos;s <strong>Extensions &gt; Apps Script</strong>, and deploy as a Web App:
                      </p>

                      <div className="max-h-52 overflow-y-auto rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] font-mono leading-relaxed text-emerald-400 select-all">
                        <pre className="whitespace-pre-wrap break-all">{APPS_SCRIPT_CODE}</pre>
                      </div>
                    </div>

                    {/* Step-by-Step Instructions */}
                    <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-100 space-y-2 text-xs text-slate-700">
                      <p className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-[#0A2540]" />
                        <span>Google Sheet Link Karne Ka Aasaan Tareeka (Step-by-Step):</span>
                      </p>
                      <ol className="list-decimal pl-5 space-y-1 text-[11px] font-medium leading-relaxed">
                        <li>Apna <strong>Google Sheet</strong> kholein jahan aap leads save karna chahte hain.</li>
                        <li>Top menu mein <strong>Extensions &gt; Apps Script</strong> par click karein.</li>
                        <li>Purana code hata kar upar diye gaye <strong>Copy Script Code</strong> button par click karke code paste karein.</li>
                        <li>Top right corner mein <strong>Deploy &gt; New deployment</strong> par click karein.</li>
                        <li>Select type mein <strong>Web app</strong> chunein. <em>Who has access:</em> <strong>Anyone</strong> set karein.</li>
                        <li><strong>Deploy</strong> button click karke milne waala <strong>Web App URL</strong> copy karein aur upar field mein paste karke <strong>Save Webhook Settings</strong> dabayein.</li>
                      </ol>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        type="submit"
                        className="bg-[#0A2540] hover:bg-[#06182B] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                      >
                        Save Webhook Settings
                      </button>

                      <button
                        type="button"
                        onClick={handleGSheetPing}
                        disabled={pingingGSheet}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
                      >
                        {pingingGSheet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        <span>Test Webhook Ping</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 9: CRM WEBHOOK INTEGRATION */}
              {activeTab === 'crm' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-amber-500" />
                        <h2 className="font-poppins font-bold text-xl text-slate-900">External CRM Software Webhook API</h2>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Link your custom CRM software directly with the website. Incoming appointments & leads are immediately posted as HTTP payloads.
                      </p>
                    </div>

                    {crmStatus && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{crmStatus}</span>
                      </div>
                    )}

                    <form onSubmit={handleCrmSave} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          External CRM Endpoint URL
                        </label>
                        <input
                          type="text"
                          value={crmUrl}
                          onChange={(e) => setCrmUrl(e.target.value)}
                          placeholder="https://your-crm-software.com/api/v1/leads-webhook"
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl font-mono text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                          API Secret Key / Authorization Token
                        </label>
                        <input
                          type="text"
                          value={crmKey}
                          onChange={(e) => setCrmKey(e.target.value)}
                          placeholder="Bearer jw_sec_key_..."
                          className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl font-mono text-slate-800"
                        />
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="crmAuto"
                          checked={crmAutoForward}
                          onChange={(e) => setCrmAutoForward(e.target.checked)}
                          className="w-4 h-4 text-[#0A2540] rounded border-slate-300"
                        />
                        <label htmlFor="crmAuto" className="text-xs font-bold text-slate-800">
                          Auto-Forward All Incoming Leads & Appointments to CRM
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="submit"
                          className="bg-[#0A2540] hover:bg-[#06182B] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
                        >
                          Save CRM Configuration
                        </button>

                        <button
                          type="button"
                          onClick={handleCrmPing}
                          disabled={pingingCrm}
                          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all"
                        >
                          {pingingCrm ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                          <span>Test Handshake Ping</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* CRM Payload Audit Trail Table */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h3 className="font-poppins font-bold text-sm text-slate-900">Live CRM Payload Dispatch Logs</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                          <tr>
                            <th className="p-2.5">Time</th>
                            <th className="p-2.5">Event Type</th>
                            <th className="p-2.5">Payload Summary</th>
                            <th className="p-2.5">Delivery Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600">
                          {crmSettings.logs.map((log) => (
                            <tr key={log.id}>
                              <td className="p-2.5 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                              <td className="p-2.5 font-bold text-slate-800">{log.eventType}</td>
                              <td className="p-2.5 max-w-xs truncate text-slate-700">{log.payloadSummary}</td>
                              <td className="p-2.5">
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: SECURITY & CREDENTIALS MANAGEMENT */}
              {activeTab === 'security' && (
                <div className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-md">
                  <div>
                    <h2 className="font-poppins font-bold text-xl text-slate-900">Security Credentials</h2>
                    <p className="text-xs text-slate-500">Update your admin username and secret password for the Jeevan Wings Admin Portal</p>
                  </div>

                  {passMsg && (
                    <div className={`text-xs p-3 rounded-xl border flex items-center space-x-2 ${
                      passMsg.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      {passMsg.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                      <span>{passMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleSecurityChangeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current Password *</label>
                      <input
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="Enter current password (required for changes)"
                        className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                        required
                      />
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Admin Username (Optional)</label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder={`Current username: ${adminUsername || 'admin'}`}
                        className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Leave blank if you do not want to change the username.</p>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Password (Optional)</label>
                      <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full text-xs px-3 py-2.5 border border-slate-200 rounded-xl text-slate-900"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0A2540] hover:bg-[#06182B] text-white py-3 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <Key className="w-4 h-4 text-[#EA580C]" />
                      <span>Save Security Credentials</span>
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </motion.div>

      {/* MODAL: ADD THERAPIST */}
      <AnimatePresence>
        {showAddTherapistModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full flex flex-col shadow-2xl border border-slate-200 max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 shrink-0">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-[#0A2540]" />
                  <h3 className="font-poppins font-bold text-lg text-slate-900">Add New Clinical Specialist</h3>
                </div>
                <button type="button" onClick={() => setShowAddTherapistModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTherapistSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0 text-xs mt-3">
                <div className="overflow-y-auto space-y-3.5 pr-1.5 flex-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={tName}
                      onChange={(e) => setTName(e.target.value)}
                      placeholder="e.g. Dr. Ravindra Kumar"
                      className="w-full p-2.5 border rounded-xl text-slate-800 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Designation / Role *</label>
                      <input
                        type="text"
                        required
                        value={tRole}
                        onChange={(e) => setTRole(e.target.value)}
                        placeholder="e.g. Pediatric Speech Therapist"
                        className="w-full p-2.5 border rounded-xl text-slate-800 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Qualification *</label>
                      <input
                        type="text"
                        required
                        value={tQual}
                        onChange={(e) => setTQual(e.target.value)}
                        placeholder="e.g. B.ASLP, M.ASLP"
                        className="w-full p-2.5 border rounded-xl text-slate-800 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      required
                      value={tExp}
                      onChange={(e) => setTExp(Number(e.target.value))}
                      className="w-full p-2.5 border rounded-xl text-slate-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Specialties (comma separated)</label>
                    <input
                      type="text"
                      value={tSpecialties}
                      onChange={(e) => setTSpecialties(e.target.value)}
                      placeholder="Speech Delay, Stammering, Articulation"
                      className="w-full p-2.5 border rounded-xl text-slate-800 font-medium"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <label className="block font-bold text-slate-700 mb-1.5">Photo Upload / Preview</label>
                    <div className="flex items-center space-x-3">
                      <img
                        src={tImg || 'https://images.unsplash.com/photo-1594824813566-78a05f1f99c2?auto=format&fit=crop&q=80&w=400'}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-300 shadow-xs"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, setTImg)}
                        className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-[#0A2540] file:text-white file:font-semibold cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Therapist Bio</label>
                    <textarea
                      rows={3}
                      value={tBio}
                      onChange={(e) => setTBio(e.target.value)}
                      placeholder="Brief clinical background and expertise..."
                      className="w-full p-2.5 border rounded-xl text-slate-800 font-medium leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end space-x-2 shrink-0 bg-white">
                  <button
                    type="button"
                    onClick={() => setShowAddTherapistModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#0A2540] hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5"
                  >
                    <Plus className="w-4 h-4 text-[#EA580C]" />
                    <span>Add Specialist</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD BLOG */}
      <AnimatePresence>
        {showAddBlogModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <h3 className="font-poppins font-bold text-lg text-slate-900">Write & Publish Custom Blog Article</h3>
                <button onClick={() => setShowAddBlogModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddBlogSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. How Speech Therapy Helps Stuttering in Children"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full p-2.5 border rounded-xl bg-white"
                    >
                      <option value="Speech Therapy">Speech Therapy</option>
                      <option value="Occupational Therapy">Occupational Therapy</option>
                      <option value="Autism Support">Autism Support</option>
                      <option value="Child Development">Child Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={blogAuthor}
                      onChange={(e) => setBlogAuthor(e.target.value)}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Featured Image</label>
                  <div className="flex items-center space-x-2">
                    <img src={blogImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setBlogImage)}
                      className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#0A2540]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Short Excerpt</label>
                  <input
                    type="text"
                    required
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    placeholder="Brief summary for preview cards..."
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Article Content</label>
                  <textarea
                    rows={5}
                    required
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Write detailed clinical advice..."
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddBlogModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-700">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#0A2540] text-white font-bold">Publish Post</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: AI BLOG WRITER */}
      <AnimatePresence>
        {showAiBlogModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="font-poppins font-bold text-lg text-slate-900">AI Clinical Article Generator</h3>
                </div>
                <button onClick={() => setShowAiBlogModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleGenerateAiBlog} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic / Title Prompt</label>
                  <input
                    type="text"
                    required
                    value={aiBlogTopic}
                    onChange={(e) => setAiBlogTopic(e.target.value)}
                    placeholder="e.g. 5 Warning Signs of Autism in 2-Year-Olds in Noida"
                    className="w-full p-3 border rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={aiBlogCategory}
                    onChange={(e) => setAiBlogCategory(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="Speech Therapy">Speech Therapy</option>
                    <option value="Occupational Therapy">Occupational Therapy</option>
                    <option value="Autism Support">Autism Support</option>
                    <option value="Child Development">Child Development</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAiBlogModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-700">Cancel</button>
                  <button
                    type="submit"
                    disabled={generatingBlog}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold flex items-center space-x-1.5 shadow-md"
                  >
                    {generatingBlog ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
                    <span>{generatingBlog ? 'Writing Article...' : 'Generate AI Article'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD GALLERY ITEM */}
      <AnimatePresence>
        {showAddGalleryModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <h3 className="font-poppins font-bold text-lg text-slate-900">Upload Activity / Gym Photo</h3>
                <button onClick={() => setShowAddGalleryModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddGallerySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Photo Title</label>
                  <input
                    type="text"
                    required
                    value={gTitle}
                    onChange={(e) => setGTitle(e.target.value)}
                    placeholder="e.g. Children Sensory Ball Pit Therapy Room"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Facility Category</label>
                  <select
                    value={gCategory}
                    onChange={(e) => setGCategory(e.target.value as any)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="Sensory Gym">Sensory Gym</option>
                    <option value="Speech Labs">Speech Labs</option>
                    <option value="Play Rooms">Play Rooms</option>
                    <option value="Events & Workshops">Events & Workshops</option>
                    <option value="Infrastructure">Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Photo Upload</label>
                  <div className="flex items-center space-x-2">
                    <img src={gImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setGImage)}
                      className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-[#0A2540]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={gDesc}
                    onChange={(e) => setGDesc(e.target.value)}
                    placeholder="Brief caption describing the activity..."
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAddGalleryModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 font-bold text-slate-700">Cancel</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-[#0A2540] text-white font-bold">Upload to Gallery</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
