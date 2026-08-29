'use client';

import React from 'react';
import { ShieldCheck, MapPin, Mail, Phone, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E] text-white shadow-inner mt-auto">
      {/* Upper footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Company identity */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                SHREE QA Solutions
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/20 text-white font-medium">
                Pvt. Ltd.
              </span>
            </div>
            <p className="text-xs font-serif italic text-white/90">
              "Excelling the Excellence" — Authorized Lead Appraisal & Certification Partner
            </p>
            <p className="text-xs text-white/80">
              CMMI Institute Partner • ISO/IEC Accredited Audit Organization • PCI SSC QSA
            </p>
          </div>

          {/* Location & Contact */}
          <div className="text-xs text-white/90 space-y-1 text-center md:text-center">
            <div className="flex items-center justify-center space-x-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-200" />
              <span>Plot No. 42, 3rd Floor, Phase-1, KPHB Colony, Kukatpally, Hyderabad - 500072</span>
            </div>
            <div className="flex items-center justify-center space-x-4 pt-1">
              <span className="flex items-center space-x-1">
                <Mail className="w-3 h-3 text-amber-200" />
                <span>appraisal@shreeqasolutions.com</span>
              </span>
              <span className="flex items-center space-x-1">
                <Phone className="w-3 h-3 text-amber-200" />
                <span>+91 40 4852 9900</span>
              </span>
            </div>
          </div>

          {/* Appraisal Standards Badge */}
          <div className="flex flex-col items-center md:items-end space-y-1.5 text-xs text-white/90">
            <div className="flex items-center space-x-1.5 bg-black/15 px-3 py-1.5 rounded-md border border-white/20">
              <Award className="w-4 h-4 text-amber-300" />
              <span className="font-semibold text-white">CMMI DEV / SVC / SEC & ISO 27001</span>
            </div>
            <span className="text-[11px] text-white/80">
              Internal Appraisal CRM Portal v2.0 • Secure Session
            </span>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/75">
          <p>© {new Date().getFullYear()} Shree QA Solutions. All rights reserved. Confidential Internal System.</p>
          <p className="mt-1 sm:mt-0">Hyderabad • Bengaluru • Chennai • Pune</p>
        </div>
      </div>
    </footer>
  );
};
