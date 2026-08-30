'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Upload, RefreshCcw, Image as ImageIcon, X, Check } from 'lucide-react';

const LOCAL_STORAGE_LOGO_KEY = 'shree_qa_custom_logo_v1';

export const BrandLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; editable?: boolean }> = ({ 
  size = 'md', 
  editable = true 
}) => {
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_LOGO_KEY);
      if (saved) {
        setCustomLogoUrl(saved);
      }
    }
  }, []);

  const sizeClasses = {
    sm: 'w-10 h-10 text-base',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl',
  }[size];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
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
      }
    }
    setIsModalOpen(false);
  };

  const handleResetToDefault = () => {
    setCustomLogoUrl(null);
    setPreviewUrl(null);
    setInputUrl('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_LOGO_KEY);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        className="relative group cursor-pointer"
        onClick={() => editable && setIsModalOpen(true)}
        title={editable ? "Click to customize company logo" : undefined}
      >
        {/* Outer Mandala Golden Sunburst Ring */}
        <div className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#F5A623] via-[#E08A3E] to-[#B33A2E] p-0.5 shadow-md group-hover:scale-105 transition-transform ${sizeClasses}`}>
          <div className="w-full h-full rounded-full bg-[#FAF7F2] flex items-center justify-center overflow-hidden border border-[#E08A3E]/40 relative">
            
            {customLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={customLogoUrl} 
                alt="Shree QA Solutions Logo" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              // Authentic Hindi / Devanagari "श्री" Emblem matching the business card
              <svg
                viewBox="0 0 40 40"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Sunburst Mandala Petals */}
                <defs>
                  <linearGradient id="mandalaGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F5A623" />
                    <stop offset="0.5" stopColor="#E08A3E" />
                    <stop offset="1" stopColor="#B33A2E" />
                  </linearGradient>
                  <linearGradient id="innerShreeGrad" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#B33A2E" />
                    <stop offset="1" stopColor="#8F281E" />
                  </linearGradient>
                </defs>

                {/* Mandala rays ring */}
                <circle cx="20" cy="20" r="18" fill="none" stroke="url(#mandalaGrad)" strokeWidth="2" strokeDasharray="3 2" />
                <circle cx="20" cy="20" r="15.5" fill="#FFF8F0" stroke="#E08A3E" strokeWidth="1" />
                <circle cx="20" cy="20" r="13" fill="#FAF0E0" stroke="#B33A2E" strokeWidth="0.8" />

                {/* Devanagari Text 'श्री' */}
                <text
                  x="20"
                  y="26"
                  fontFamily="'Tiro Devanagari Hindi', 'Noto Sans Devanagari', 'Mangal', 'Lohit Devanagari', 'Sanskrit Text', 'Nirmala UI', serif"
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="url(#innerShreeGrad)"
                  stroke="#E08A3E"
                  strokeWidth="0.3"
                >
                  श्री
                </text>
              </svg>
            )}

            {/* Hover Edit Overlay Icon */}
            {editable && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full transition-opacity">
                <Edit3 className="w-3.5 h-3.5 text-white" />
              </div>
            )}

          </div>
        </div>

        {/* Small edit pill on desktop hover */}
        {editable && (
          <span className="sr-only">Click to edit logo</span>
        )}
      </div>

      {/* Customize Logo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setIsModalOpen(false)} />

            <div className="relative transform overflow-hidden rounded-xl bg-[#FAF7F2] border border-[#DEC6A6] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md">
              
              {/* Modal Header */}
              <div className="bg-[#1B2A4A] px-6 py-4 text-white relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-[#E08A3E]" />
                    <span>Customize Enterprise Logo</span>
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Upload any company emblem of your choice or keep the authentic Devanagari Hindi "श्री" mark.
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 text-xs text-[#1B2A4A]">
                
                {/* Live Preview */}
                <div className="flex items-center justify-center space-x-4 p-4 rounded-lg bg-white border border-[#DEC6A6]">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F5A623] via-[#E08A3E] to-[#B33A2E] p-0.5 shadow-md flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full rounded-full bg-[#FAF7F2] flex items-center justify-center overflow-hidden">
                      {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : customLogoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={customLogoUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-serif text-2xl font-bold text-[#B33A2E]">श्री</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-sm block">Current Logo Display</span>
                    <span className="text-gray-500 text-[11px]">
                      {previewUrl ? 'Uploaded file preview' : customLogoUrl ? 'Custom logo active' : 'Original Hindi "श्री" emblem'}
                    </span>
                  </div>
                </div>

                {/* Option 1: File Upload */}
                <div>
                  <label className="font-semibold block mb-1.5">Upload Logo Image File (PNG, JPG, SVG)</label>
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
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md border-2 border-dashed border-[#DEC6A6] bg-white hover:bg-[#FAF7F2] font-semibold text-[#1B2A4A] transition-colors"
                  >
                    <Upload className="w-4 h-4 text-[#B33A2E]" />
                    <span>Choose File from Computer</span>
                  </button>
                </div>

                {/* Option 2: Image URL */}
                <div>
                  <label className="font-semibold block mb-1">Or Paste Image URL</label>
                  <input
                    type="url"
                    value={inputUrl}
                    onChange={(e) => {
                      setInputUrl(e.target.value);
                      if (e.target.value.trim()) setPreviewUrl(e.target.value.trim());
                    }}
                    placeholder="https://example.com/logo.png"
                    className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs text-[#1B2A4A]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-[#DEC6A6] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="flex items-center space-x-1 text-xs text-[#B33A2E] hover:underline font-semibold"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Reset to Hindi "श्री" Mark</span>
                  </button>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3 py-1.5 rounded-md border border-[#DEC6A6] bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveLogo}
                      className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-[#B33A2E] hover:bg-[#8F281E] text-white text-xs font-semibold shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Logo</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
