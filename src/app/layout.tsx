import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { CRMProvider } from '@/lib/crmStore';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Shree QA Solutions • CMMI & ISO Appraisal CRM',
  description: 'Enterprise Internal CRM MVP for Shree QA Solutions, CMMI/ISO certification and lead appraisal company based in Kukatpally, Hyderabad, India.',
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
    <html lang="en">
      <body className="bg-[#F5F0E6] text-[#1B2A4A] flex flex-col min-h-screen antialiased selection:bg-[#E08A3E] selection:text-white">
        <AuthProvider>
          <CRMProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CRMProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
