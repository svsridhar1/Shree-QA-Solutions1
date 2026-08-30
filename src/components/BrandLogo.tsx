'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Edit3, Upload, RefreshCcw, Image as ImageIcon, X, Check, AlertCircle } from 'lucide-react';

const LOCAL_STORAGE_LOGO_KEY = 'shree_qa_custom_logo_v1';
const LOGO_UPDATED_EVENT = 'shree_logo_updated';

// Exact SVG Lotus-Sunburst Mandala with Devanagari 'श्री' matching the business card
export const ShreeSymbol: React.FC<{ className?: string; size?: number }> = ({ 
  className = "w-full h-full", 
  size = 48 
}) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Shree Emblem"
    >
      <defs>
        {/* Outer petal gradient: Gold center to rich terracotta/red rim */}
        <radialGradient id="petalGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#FDB813" />
          <stop offset="60%" stopColor="#E67E22" />
          <stop offset="88%" stopColor="#C0392B" />
          <stop offset="100%" stopColor="#78281F" />
        </radialGradient>

        {/* Inner cream/warm ivory parchment background */}
        <radialGradient id="innerDisk" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFAF0" />
          <stop offset="75%" stopColor="#F7EEDD" />
          <stop offset="100%" stopColor="#EAD8BE" />
        </radialGradient>

        {/* Calligraphic 'श्री' terracotta-red gradient */}
        <linearGradient id="shreeCalligraphy" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0392B" />
          <stop offset="100%" stopColor="#96281B" />
        </linearGradient>

        {/* Subtle shadow for depth */}
        <filter id="softShreeShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#78281F" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* 16 Scalloped Lotus Mandala Petals */}
      <g stroke="#6E1F16" strokeWidth="1.2">
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <path
              key={i}
              d="M 50 50 L 41 6 C 45.5 3 54.5 3 59 6 Z"
              fill="url(#petalGradient)"
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}
      </g>

      {/* Outer scalloped rim trim */}
      <circle cx="50" cy="50" r="45.5" fill="none" stroke="#B33A2E" strokeWidth="1" opacity="0.6" />

      {/* Inner Decorative Golden Ring */}
      <circle cx="50" cy="50" r="35" fill="url(#innerDisk)" stroke="#78281F" strokeWidth="2.2" />
      <circle cx="50" cy="50" r="32.5" fill="none" stroke="#D35400" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

      {/* Exact Devanagari Hindi 'श्री' Glyph */}
      <g filter="url(#softShreeShadow)" fill="url(#shreeCalligraphy)">
        {/* Shirorekha (Top Horizontal Bar) */}
        <path d="M 28 32 C 28 30.5 29.5 30 31 30 L 71 30 C 72.5 30 74 30.5 74 32 C 74 33.5 72.5 34 71 34 L 31 34 C 29.5 34 28 33.5 28 32 Z" />

        {/* 'श' Loop and left body */}
        <path 
          d="M 40 33 
             C 40 39, 31 41, 31 47 
             C 31 52.5, 36 55.5, 41 53 
             C 43.5 51.5, 45 49, 46 46 
             L 53.5 68 C 54.2 70, 56.5 70, 57 68.5 C 57.5 67, 56.5 65.5, 55 62 L 49.5 46.5
             C 51 43.5, 51.5 39, 48 35.5
             C 45.5 33, 42.5 32.5, 40 33 Z
             M 39 42
             C 40.5 44.5, 38.5 48.5, 35.5 48
             C 34 47.5, 34 44.5, 36.5 43
             C 37.5 42.5, 38.2 42.2, 39 42 Z" 
          fillRule="evenodd"
        />

        {/* Vertical Stem of 'श' */}
        <path d="M 53 32 L 53 69 C 53 71, 56.5 71, 56.5 69 L 56.5 32 Z" />

        {/* R-kar diagonal foot stroke */}
        <path d="M 45 52 L 56 68.5 C 56.8 69.8, 58.5 69, 57.8 67.5 L 47 50.5 Z" />

        {/* Deergha Ee Matra ('ी') - Elegant arch looping over and down */}
        <path 
          d="M 53.5 32 
             C 53.5 17, 68 17, 68 32
             L 68 69
             C 68 71, 71.5 71, 71.5 69
             L 71.5 32
             C 71.5 13, 50 13, 50 32
             Z" 
        />

        {/* Dot / Bindu / Top Accent */}
        <circle cx="69" cy="18" r="2.2" fill="#B33A2E" />
      </g>
    </svg>
  );
};

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; editable?: boolean }> = ({ 
  size = 'md', 
  editable = true 
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSavedLogo = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_LOGO_KEY);
      setCustomLogoUrl(saved || null);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadSavedLogo();

    const handleUpdate = () => loadSavedLogo();
    window.addEventListener(LOGO_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(LOGO_UPDATED_EVENT, handleUpdate);
  }, []);

  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-13 h-13 sm:w-14 sm:h-14',
    lg: 'w-18 h-18 sm:w-20 sm:h-20',
  }[size];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file (PNG, JPG, SVG, WebP).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size is too large. Please upload an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read image file. Please try another image.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = () => {
    const logoToSave = previewUrl || (inputUrl.trim() ? inputUrl.trim() : null);
    if (logoToSave) {
      setCustomLogoUrl(logoToSave);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_LOGO_KEY, logoToSave);
        window.dispatchEvent(new Event(LOGO_UPDATED_EVENT));
      }
    }
    setIsModalOpen(false);
  };

  const handleResetToDefault = () => {
    setCustomLogoUrl(null);
    setPreviewUrl(null);
    setInputUrl('');
    setErrorMessage(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_LOGO_KEY);
      window.dispatchEvent(new Event(LOGO_UPDATED_EVENT));
    }
    setIsModalOpen(false);
  };

  const handleOpenModal = (e: React.MouseEvent) => {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    setPreviewUrl(customLogoUrl);
    setInputUrl('');
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <button 
        type="button"
        className="relative group select-none shrink-0 p-0 border-0 bg-transparent text-left cursor-pointer focus:outline-none"
        onClick={handleOpenModal}
        title={editable ? "Click to edit/upload custom enterprise logo" : undefined}
      >
        <div className={`relative flex items-center justify-center ${sizeClasses} transition-transform group-hover:scale-105 rounded-full`}>
          {customLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={customLogoUrl} 
              alt="Shree QA Solutions Logo" 
              className="w-full h-full object-cover rounded-full shadow-saas-xs border-2 border-amber-500"
            />
          ) : (
            // Exact Hindi "श्री" Mandala Symbol
            <ShreeSymbol />
          )}

          {/* Hover Edit Overlay Icon */}
          {editable && (
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity shadow-inner">
              <Edit3 className="w-4 h-4 text-white drop-shadow-md" />
            </div>
          )}
        </div>
      </button>

      {/* Customize Logo Modal rendered via React Portal on document.body for highest z-index */}
      {isModalOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[99999] overflow-y-auto" 
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsModalOpen(false)} 
            />

            {/* Modal Dialog */}
            <div 
              className="relative transform overflow-hidden rounded-2xl bg-white border border-slate-200 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Header */}
              <div className="bg-[#0F172A] px-6 py-4 text-white relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-xs">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Customize Enterprise Logo
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Upload your brand emblem or retain the Hindi "श्री" mark
                      </p>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)} 
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 text-xs text-slate-800">
                
                {/* Live Preview */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-saas-xs border-2 border-slate-200 bg-white">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
                    ) : customLogoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={customLogoUrl} alt="Preview" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <ShreeSymbol className="w-16 h-16" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-slate-900">Emblem Preview</span>
                    <span className="text-slate-500 text-[11px] mt-0.5 block">
                      {previewUrl ? 'Uploaded file preview ready' : customLogoUrl ? 'Custom uploaded logo active' : 'Authentic Hindi "श्री" 16-petal lotus mandala'}
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Option 1: File Upload */}
                <div>
                  <label className="font-semibold block mb-1.5 text-slate-700">
                    Upload Image File (PNG, JPG, SVG, WebP)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/30 font-semibold text-slate-800 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span>Choose Image from Computer</span>
                  </button>
                </div>

                {/* Option 2: Image URL */}
                <div>
                  <label className="font-semibold block mb-1 text-slate-700">
                    Or Paste Image URL
                  </label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      if (e.target.value.trim()) setPreviewUrl(e.target.value.trim());
                    }}
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="flex items-center space-x-1 text-xs text-[#B33A2E] hover:underline font-semibold"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Reset to Hindi "श्री"</span>
                  </button>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveLogo}
                      className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-saas-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Apply</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
