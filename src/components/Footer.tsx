'use client';

import React from 'react';
import { ShieldCheck, MapPin, Mail, Phone, Award, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E] text-white shadow-inner mt-auto">
      {/* Upper footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Company identity - Removed 'Pvt Ltd' */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                SHREE QA Solutions
              </span>
            </div>
            <p className="text-xs font-serif italic text-white/95">
              "Excelling the Excellence" — CMMI Partner & Lead Appraisal Body
            </p>
            <p className="text-xs text-white/85">
              Mahesh Bhaskara • Certified Lead Appraiser (CMMI DEV, SVC, SEC, SPM, PPL)
            </p>
          </div>

          {/* Location & Contact directly from business card */}
          <div className="text-xs text-white/95 space-y-1 text-center">
            <div className="flex items-center justify-center space-x-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <span>503, Sharada Nilayam, Jaya Nagar, Road No: 4, Kukatpally, Hyd - 72</span>
            </div>
            <div className="flex items-center justify-center space-x-4 pt-1 flex-wrap gap-y-1">
              <a href="tel:9177020007" className="flex items-center space-x-1 hover:underline">
                <Phone className="w-3 h-3 text-amber-200" />
                <span>+91 9177020007</span>
              </a>
              <a href="mailto:maheshbhaskara@shreeqasolutions.com" className="flex items-center space-x-1 hover:underline">
                <Mail className="w-3 h-3 text-amber-200" />
                <span>maheshbhaskara@shreeqasolutions.com</span>
              </a>
            </div>
          </div>

          {/* Appraisal Standards Badge & Website */}
          <div className="flex flex-col items-center md:items-end space-y-2 text-xs text-white/95">
            <a 
              href="https://www.shreeqasolutions.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-black/20 hover:bg-black/30 px-3.5 py-1.5 rounded-lg border border-white/30 text-white font-bold transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>www.shreeqasolutions.com</span>
            </a>
            <span className="text-[11px] text-white/80">
              16 Certified Standards • CMMI, ISO & PCI QSA Frameworks
            </span>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-6 pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/80">
          <p>© {new Date().getFullYear()} SHREE QA Solutions. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">Kukatpally, Hyderabad - 500072, Telangana, India</p>
        </div>
      </div>
    </footer>
  );
};
