import type {Metadata} from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'Jeevan Wings | Speech Therapy & Child Development Center - Noida Sector 75',
  description: 'Premier pediatric speech therapy, occupational therapy, autism support, and child development center in Noida Sector 75 led by Founder & Speech Therapist Kajal Kavita.',
  keywords: 'Speech Therapy Noida, Child Development Centre Sector 75, Pediatric Occupational Therapy Noida, Autism Therapy Centre, Stammering Treatment, Early Intervention',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/logo.png', type: 'image/png' },
    ],
    shortcut: '/icon.svg',
    apple: '/logo.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className="bg-[#F7FAFC] text-slate-800 antialiased font-inter">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
