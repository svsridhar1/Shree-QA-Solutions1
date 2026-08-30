'use client';

import React from 'react';
import { ShieldCheck, MapPin, Mail, Phone, Award, Globe, Heart } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0F172A] text-slate-400 border-t border-slate-800 mt-auto text-xs">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Identity Column with exact 3-line format */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-3 select-none">
              <BrandLogo size="sm" editable={true} />

              <div className="flex flex-col justify-center text-left">
                {/* Line 1: SHREE */}
                <span className="font-serif text-xl font-extrabold tracking-wider text-[#E11D48] leading-none uppercase">
                  SHREE
                </span>

                {/* Line 2: QA Solutions in single line */}
                <span className="font-serif text-sm font-bold tracking-tight text-white leading-none mt-1 whitespace-nowrap">
                  QA Solutions
                </span>

                {/* Divider line */}
                <div className="w-full h-[1px] bg-slate-700 my-1" />

                {/* Line 3: Excelling the Excellence in single line */}
                <span className="font-serif text-[10px] font-medium italic tracking-tight text-amber-400 leading-none whitespace-nowrap">
                  Excelling the Excellence
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Authorized CMMI Institute Partner & ISO/IEC Lead Appraisal Body.
            </p>
          </div>

          {/* Lead Appraiser Profile Column */}
          <div className="space-y-2">
            <span className="font-bold text-white uppercase text-[11px] tracking-wider block">
              Certified Appraisal Leadership
            </span>
            <p className="text-white font-semibold">
              Mahesh Bhaskara
            </p>
            <p className="text-[11px] text-slate-400">
              Certified Lead Appraiser (CMMI DEV, SVC, SEC, SPM, PPL Domains)
            </p>
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
              16 Certified Standards
            </span>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-2">
            <span className="font-bold text-white uppercase text-[11px] tracking-wider block">
              Corporate Office & Registry
            </span>
            <div className="flex items-start space-x-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <span>503, Sharada Nilayam, Jaya Nagar, Road No: 4, Kukatpally, Hyd - 72</span>
            </div>
            <div className="space-y-1 pt-1">
              <a href="tel:9177020007" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 9177020007</span>
              </a>
              <a href="mailto:maheshbhaskara@shreeqasolutions.com" className="flex items-center space-x-1.5 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>maheshbhaskara@shreeqasolutions.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-2">
            <span className="font-bold text-white uppercase text-[11px] tracking-wider block">
              Verified Compliance Systems
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              CMMI Maturity Level 2-5, ISO 9001, ISO 27001, ISO 20000, ISO 42001, PCI DSS & Cert-In Empanelment.
            </p>
            <div className="pt-2">
              <a 
                href="https://www.shreeqasolutions.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors border border-slate-700"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>www.shreeqasolutions.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} SHREE QA Solutions. All rights reserved.</p>
          <p>Executive Quality, Audit & Appraisal Intelligence Platform • Kukatpally, Hyderabad</p>
        </div>
      </div>
    </footer>
  );
};
