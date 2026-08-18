# Jeevan Wings - Communication & Child Development Centre

Official web application and clinical management platform for **Jeevan Wings**, Sector 75, Noida. Led by Founder & Speech Therapist **Kajal Kavita** (D.El.Ed in Special Education, DHLS, 7+ years clinical experience).

---

## 🌟 Key Features

- **Clinical Services**: Speech & Language Therapy, Occupational Therapy, Autism Support (ASD), ADHD & Behavioral Therapy, Stammering & Articulation, Early Intervention.
- **Online Consultation & Appointment Booking**: Real-time slot booking with age assessment and primary concern logging.
- **Google Sheets Live Sync**: Instant, automated synchronization of appointments and leads to Google Sheets via Google Apps Script Web App.
- **Admin CMS & Dashboard**:
  - Manage Leads and Appointments.
  - Manage Therapists & Specialists.
  - Publish & manage Blogs & Child Development Articles.
  - Manage Photo Gallery & Clinic Tour.
  - Change Branding, Contact info & Founder Profile.
- **AI Tools Integration (Google Gemini)**:
  - Smart Parent Search & Symptom Guidance.
  - AI Lead Priority Scorer.
  - One-Click Social Media Caption Generator.
  - AI Clinical Blog Article Drafter.
- **Responsive & Accessible UI**: Built with Next.js 15, React 19, Tailwind CSS, Lucide icons, and Motion animations.

---

## 🚀 Getting Started Locally

### 1. Clone or Download the repository
```bash
git clone https://github.com/YOUR_USERNAME/Jeevan-Wings.git
cd Jeevan-Wings
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```
Add your Gemini API key (optional for AI features):
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Google Sheets Sync Configuration

1. In the Admin Dashboard (`/admin`), navigate to **Google Sheet Sync**.
2. Enter your Google Apps Script Web App URL:
   `https://script.google.com/macros/s/.../exec`
3. Ensure the Apps Script deployment access is set to **"Anyone"**.
4. Test the connection with **Test Sync Ping**.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`)
- **AI SDK**: `@google/genai` (Gemini 2.5 Flash / Flash Lite)
