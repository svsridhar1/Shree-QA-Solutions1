import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { CRMProvider } from '@/lib/crmStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Shree QA Solutions • Enterprise CMMI & ISO Appraisal Platform',
  description: 'Executive Quality, Audit & Appraisal Intelligence Platform for Shree QA Solutions, certified lead appraisal body based in Kukatpally, Hyderabad, India.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-[#F8FAFC] text-[#0F172A] flex flex-col min-h-screen antialiased selection:bg-[#D97706] selection:text-white font-sans">
        <AuthProvider>
          <CRMProvider>
            <Header />
            <main className="flex-1 pb-12">
              {children}
            </main>
            <Footer />
          </CRMProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
