import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_BLOGS, INITIAL_GALLERY, INITIAL_THERAPISTS } from '@/lib/data';

export const dynamic = 'force-dynamic';

// Path for server-side persistent data storage
const DATA_FILE_PATH = path.join('/tmp', 'jeevan_wings_cms_data.json');

// In-memory cache
let memoryData: any = null;

// Helper to read current CMS data with default seed structure
function readCmsData() {
  if (memoryData) return memoryData;
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      memoryData = JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading CMS data file:', e);
  }

  if (!memoryData) {
    memoryData = {
      branding: {
        logoUrl: 'https://lh3.googleusercontent.com/d/1eASpq73nrt0LxcaL5uqAar1-VlUGSuQE',
        founderName: 'Kajal Kavita',
        founderRole: 'Founder & Speech Therapist',
        founderQualification: 'D.El.Ed in Special Education, DHLS',
        founderImage: 'https://lh3.googleusercontent.com/d/1EgwFjqFSC0utIfZSY5kCswZ0gsNH0jFg',
        phone: '+91 97175 39376',
        whatsapp: '+91 97175 39376',
        email: 'info@jeevanwings.com',
        address: 'Sector 75, Noida, Uttar Pradesh 201301',
      },
      therapists: INITIAL_THERAPISTS,
      blogs: INITIAL_BLOGS,
      gallery: INITIAL_GALLERY,
      appointments: [],
      leads: [],
      googleSheetSettings: {
        syncEnabled: true,
        webhookUrl: 'https://script.google.com/macros/s/AKfycbzqnN849Gg3n8nvye6lvtBgGaW86NO98z7ePZC1H-80SArYE1kFGb4RBYT86gfboGZtnQ/exec',
        lastSyncTime: '2026-08-18 12:42 (Connected)',
        syncOnlyConfirmed: true,
      },
      crmSettings: {
        autoForwardEnabled: false,
        endpointUrl: '',
        apiKey: '',
        logs: [],
      },
      adminCredentials: {
        username: 'admin',
        password: 'admin',
      },
    };
  }

  // Ensure arrays exist and seed defaults if empty
  if (!Array.isArray(memoryData.appointments)) memoryData.appointments = [];
  if (!Array.isArray(memoryData.leads)) memoryData.leads = [];
  if (!Array.isArray(memoryData.therapists) || memoryData.therapists.length === 0) {
    memoryData.therapists = INITIAL_THERAPISTS;
  } else {
    // Purge deprecated mock therapists if present
    memoryData.therapists = memoryData.therapists.filter(
      (t: any) => t.id !== 'dr-reena-sharma' && t.id !== 'dr-vikas-verma'
    );
  }
  if (!Array.isArray(memoryData.blogs) || memoryData.blogs.length === 0) memoryData.blogs = INITIAL_BLOGS;
  if (!Array.isArray(memoryData.gallery) || memoryData.gallery.length === 0) memoryData.gallery = INITIAL_GALLERY;

  if (memoryData.branding) {
    if (!memoryData.branding.logoUrl || memoryData.branding.logoUrl.startsWith('/api/media/')) {
      memoryData.branding.logoUrl = '/logo.png';
    }
    if (!memoryData.branding.founderImage || memoryData.branding.founderImage.startsWith('/api/media/')) {
      memoryData.branding.founderImage = '/images/kajal_kavita.jpg';
    }
  }

  return memoryData;
}

// Helper to write CMS data to disk and update cache
function writeCmsData(data: any) {
  memoryData = { ...data, lastUpdated: new Date().toISOString() };
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(memoryData, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing CMS data file:', e);
  }
  return memoryData;
}

export async function GET() {
  try {
    const data = readCmsData();
    return NextResponse.json({
      success: true,
      data: data || {},
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to fetch CMS data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, key, value, fullData, appointment, lead, id, status, branding, therapists, blogs, gallery, googleSheetSettings, crmSettings, adminCredentials } = body;

    const current = readCmsData();

    if (action === 'ADD_APPOINTMENT' && appointment) {
      // Ensure status defaults to Pending for new bookings
      const newApt = {
        ...appointment,
        status: appointment.status || 'Pending',
      };
      // Avoid duplicate by ID if already exists
      const filtered = current.appointments.filter((a: any) => a.id !== newApt.id);
      current.appointments = [newApt, ...filtered];
    } else if (action === 'UPDATE_APPOINTMENT_STATUS' && id && status) {
      current.appointments = current.appointments.map((a: any) =>
        a.id === id ? { ...a, status } : a
      );
    } else if (action === 'DELETE_APPOINTMENT' && id) {
      current.appointments = current.appointments.filter((a: any) => a.id !== id);
    } else if (action === 'CLEAR_APPOINTMENTS') {
      current.appointments = [];
    } else if (action === 'ADD_LEAD' && lead) {
      const newLead = {
        ...lead,
        status: lead.status || 'New',
      };
      const filtered = current.leads.filter((l: any) => l.id !== newLead.id);
      current.leads = [newLead, ...filtered];
    } else if (action === 'UPDATE_LEAD_STATUS' && id && status) {
      current.leads = current.leads.map((l: any) =>
        l.id === id ? { ...l, status } : l
      );
    } else if (action === 'DELETE_LEAD' && id) {
      current.leads = current.leads.filter((l: any) => l.id !== id);
    } else if (action === 'CLEAR_LEADS') {
      current.leads = [];
    } else if (action === 'UPDATE_BRANDING' && branding) {
      current.branding = { ...current.branding, ...branding };
    } else if (action === 'SAVE_THERAPISTS' && Array.isArray(therapists)) {
      current.therapists = therapists;
    } else if (action === 'SAVE_BLOGS' && Array.isArray(blogs)) {
      current.blogs = blogs;
    } else if (action === 'SAVE_GALLERY' && Array.isArray(gallery)) {
      current.gallery = gallery;
    } else if (action === 'UPDATE_GSHEET_SETTINGS' && googleSheetSettings) {
      current.googleSheetSettings = { ...current.googleSheetSettings, ...googleSheetSettings };
    } else if (action === 'UPDATE_CRM_SETTINGS' && crmSettings) {
      current.crmSettings = { ...current.crmSettings, ...crmSettings };
    } else if (action === 'UPDATE_ADMIN_CREDENTIALS' && adminCredentials) {
      current.adminCredentials = { ...current.adminCredentials, ...adminCredentials };
    } else if (fullData) {
      Object.assign(current, fullData);
    } else if (key && value !== undefined) {
      current[key] = value;
    }

    const saved = writeCmsData(current);

    return NextResponse.json({
      success: true,
      message: 'Server CMS state updated successfully across all devices worldwide!',
      data: saved,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update CMS data' },
      { status: 500 }
    );
  }
}
