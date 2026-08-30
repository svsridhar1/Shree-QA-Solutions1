'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Users, 
  TrendingUp, 
  Shield, 
  Activity, 
  FileCheck, 
  Headphones, 
  Target, 
  FileText, 
  Monitor, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Award,
  Sparkles
} from 'lucide-react';

interface ServiceIconDef {
  name: string;
  category: string;
  iconBg: string;
  iconColor: string;
  IconComponent: React.ElementType;
}

export const EnterpriseShowcase: React.FC = () => {
  // 16 Services arranged exactly as on the business card
  const row1Services: ServiceIconDef[] = [
    { name: 'CMMI DEV', category: 'Dev Model', iconBg: 'bg-[#B33A2E]', iconColor: 'text-white', IconComponent: ShieldCheck },
    { name: 'CMMI SVC', category: 'Services', iconBg: 'bg-[#1B2A4A]', iconColor: 'text-white', IconComponent: Shield },
    { name: 'CMMI SEC', category: 'Security', iconBg: 'bg-[#E08A3E]', iconColor: 'text-white', IconComponent: Lock },
    { name: 'CMMI PPL', category: 'People CMM', iconBg: 'bg-[#1B2A4A]', iconColor: 'text-white', IconComponent: Users },
    { name: 'CMMI SPM', category: 'Process Mgmt', iconBg: 'bg-[#2E7D32]', iconColor: 'text-white', IconComponent: TrendingUp },
  ];

  const row2Services: ServiceIconDef[] = [
    { name: 'PCI DSS', category: 'Payments', iconBg: 'bg-[#1565C0]', iconColor: 'text-white', IconComponent: ShieldCheck },
    { name: 'HIPAA', category: 'Healthcare', iconBg: 'bg-[#2E7D32]', iconColor: 'text-white', IconComponent: Activity },
    { name: 'GDPR', category: 'Privacy', iconBg: 'bg-[#1B2A4A]', iconColor: 'text-white', IconComponent: Lock },
    { name: 'SOC', category: 'Trust Criteria', iconBg: 'bg-[#C2185B]', iconColor: 'text-white', IconComponent: Shield },
    { name: 'QMS', category: 'ISO 9001', iconBg: 'bg-[#00838F]', iconColor: 'text-white', IconComponent: Award },
    { name: 'ISMS', category: 'ISO 27001', iconBg: 'bg-[#D97706]', iconColor: 'text-white', IconComponent: FileCheck },
    { name: 'ITSM', category: 'ISO 20000', iconBg: 'bg-[#283593]', iconColor: 'text-white', IconComponent: Headphones },
  ];

  const row3Services: ServiceIconDef[] = [
    { name: 'AIMS', category: 'ISO 42001 AI', iconBg: 'bg-[#00695C]', iconColor: 'text-white', IconComponent: Target },
    { name: 'BCMS', category: 'ISO 22301', iconBg: 'bg-[#2E7D32]', iconColor: 'text-white', IconComponent: ShieldCheck },
    { name: 'PIMS', category: 'ISO 27701', iconBg: 'bg-[#1A237E]', iconColor: 'text-white', IconComponent: FileText },
    { name: 'Cert-In', category: 'Empanelment', iconBg: 'bg-[#0277BD]', iconColor: 'text-white', IconComponent: Monitor },
  ];

  return (
    <div className="bg-[#FAF7F2] rounded-xl border border-[#DEC6A6] shadow-sm relative overflow-hidden p-6">
      {/* Top Gradient Stripe */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />

      {/* Top Right Scenic Indian Artwork SVG (Hills, River, Rising Sun) matching business card */}
      <div className="absolute top-2 right-2 w-48 sm:w-64 h-24 sm:h-28 pointer-events-none opacity-90 overflow-hidden rounded-tr-xl">
        <svg viewBox="0 0 240 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sunGrad" x1="160" y1="20" x2="190" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDB813" />
              <stop offset="1" stopColor="#E08A3E" />
            </linearGradient>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="240" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFF9E6" stopOpacity="0.8" />
              <stop offset="1" stopColor="#F5F0E6" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="mountainGrad1" x1="140" y1="40" x2="220" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2E6B4D" />
              <stop offset="1" stopColor="#1B4D36" />
            </linearGradient>
            <linearGradient id="mountainGrad2" x1="80" y1="50" x2="160" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A8B63" />
              <stop offset="1" stopColor="#265C3E" />
            </linearGradient>
            <linearGradient id="riverGrad" x1="120" y1="70" x2="180" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4FC3F7" />
              <stop offset="1" stopColor="#0288D1" />
            </linearGradient>
          </defs>

          <rect width="240" height="100" fill="url(#skyGrad)" />
          
          {/* Rising Sun */}
          <circle cx="175" cy="35" r="16" fill="url(#sunGrad)" />
          
          {/* Birds in sky */}
          <path d="M140 25 Q145 20 150 25 Q155 20 160 25" stroke="#7A6855" strokeWidth="1.2" fill="none" />
          <path d="M155 18 Q158 14 162 18 Q166 14 170 18" stroke="#7A6855" strokeWidth="1" fill="none" />

          {/* Mountains */}
          <polygon points="120,85 175,30 235,90" fill="url(#mountainGrad1)" opacity="0.95" />
          <polygon points="70,95 130,42 190,95" fill="url(#mountainGrad2)" opacity="0.9" />
          <polygon points="180,95 210,50 240,95" fill="#1B4D36" opacity="0.85" />

          {/* Snow peaks */}
          <polygon points="175,30 165,42 175,38 185,42" fill="#FFFFFF" opacity="0.85" />
          <polygon points="130,42 122,52 130,48 138,52" fill="#FFFFFF" opacity="0.85" />

          {/* River Stream */}
          <path d="M165 70 Q160 80 145 85 Q130 90 110 100 L240 100 L240 85 Q200 80 180 75 Z" fill="url(#riverGrad)" opacity="0.8" />
        </svg>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Appraiser Info Block (Mahesh Bhaskara) matching the card */}
        <div className="lg:col-span-4 space-y-3.5 border-b lg:border-b-0 lg:border-r border-[#DEC6A6]/80 lg:pr-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B33A2E] flex items-center space-x-1">
              <Award className="w-3.5 h-3.5" />
              <span>Certified Appraisal Leadership</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight mt-0.5">
              Mahesh Bhaskara
            </h2>
            <p className="font-serif text-sm font-bold text-[#B33A2E]">
              Certified Lead Appraiser
            </p>
            <p className="text-[11px] font-semibold text-[#1B2A4A]/80 tracking-wide mt-0.5">
              CMMI - DEV, SVC, SEC, SPM, PPL Domains
            </p>
          </div>

          {/* Direct contact info from business card */}
          <div className="space-y-2 pt-2 text-xs text-[#1B2A4A]">
            <a 
              href="tel:9177020007" 
              className="flex items-center space-x-2.5 p-1.5 rounded-md hover:bg-[#EBDDC9]/40 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-[#B33A2E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-xs group-hover:text-[#B33A2E] transition-colors">
                +91 9177020007
              </span>
            </a>

            <a 
              href="mailto:maheshbhaskara@shreeqasolutions.com" 
              className="flex items-center space-x-2.5 p-1.5 rounded-md hover:bg-[#EBDDC9]/40 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full bg-[#B33A2E] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-xs text-[#1B2A4A] group-hover:text-[#B33A2E] transition-colors truncate">
                maheshbhaskara@shreeqasolutions.com
              </span>
            </a>

            <div className="flex items-start space-x-2.5 p-1.5">
              <div className="w-7 h-7 rounded-full bg-[#E08A3E] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] text-gray-700 leading-snug">
                503, Sharada Nilayam, Jaya Nagar, Road No: 4, Kukatpally, Hyd - 72
              </span>
            </div>
          </div>

          {/* Red gradient website badge */}
          <div className="pt-1">
            <div className="bg-gradient-to-r from-[#B33A2E] to-[#E08A3E] text-white py-1.5 px-3 rounded-lg flex items-center space-x-2 text-xs font-bold shadow-xs">
              <Globe className="w-3.5 h-3.5" />
              <span>www.shreeqasolutions.com</span>
            </div>
          </div>
        </div>

        {/* Right 16 Services Icons Showcase Grid */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-sm font-bold text-[#1B2A4A] flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#E08A3E]" />
                <span>Accredited CMMI & ISO Appraisal Frameworks</span>
              </h3>
              <span className="text-[11px] font-semibold text-[#B33A2E] hidden sm:inline">
                16 Certification Standards
              </span>
            </div>

            {/* Row 1: CMMI Domains */}
            <div className="space-y-1 mb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                CMMI Core Domains:
              </span>
              <div className="grid grid-cols-5 gap-2">
                {row1Services.map((srv) => {
                  const Icon = srv.IconComponent;
                  return (
                    <div 
                      key={srv.name} 
                      className="flex flex-col items-center text-center p-2 rounded-lg bg-white border border-[#DEC6A6] shadow-xs hover:border-[#B33A2E] hover:scale-105 transition-all cursor-default"
                      title={`${srv.name} (${srv.category})`}
                    >
                      <div className={`w-8 h-8 rounded-full ${srv.iconBg} ${srv.iconColor} flex items-center justify-center shadow-xs mb-1`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[10px] text-[#1B2A4A]">{srv.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 2: Security & Management Systems */}
            <div className="space-y-1 mb-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                Security, Compliance & ISO Management:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {row2Services.map((srv) => {
                  const Icon = srv.IconComponent;
                  return (
                    <div 
                      key={srv.name} 
                      className="flex flex-col items-center text-center p-1.5 rounded-lg bg-white border border-[#DEC6A6] shadow-xs hover:border-[#1B2A4A] hover:scale-105 transition-all cursor-default"
                      title={`${srv.name} (${srv.category})`}
                    >
                      <div className={`w-7 h-7 rounded-full ${srv.iconBg} ${srv.iconColor} flex items-center justify-center shadow-xs mb-1`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-[10px] text-[#1B2A4A]">{srv.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 3: Emerging Standards & Cert-In */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                AI Management (AIMS), Privacy & Cert-In Empanelment:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {row3Services.map((srv) => {
                  const Icon = srv.IconComponent;
                  return (
                    <div 
                      key={srv.name} 
                      className="flex flex-col items-center text-center p-2 rounded-lg bg-white border border-[#DEC6A6] shadow-xs hover:border-[#E08A3E] hover:scale-105 transition-all cursor-default"
                      title={`${srv.name} (${srv.category})`}
                    >
                      <div className={`w-8 h-8 rounded-full ${srv.iconBg} ${srv.iconColor} flex items-center justify-center shadow-xs mb-1`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-[10px] text-[#1B2A4A]">{srv.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
