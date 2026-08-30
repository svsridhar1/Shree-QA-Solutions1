'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCRM } from '@/lib/crmStore';
import { ServiceType } from '@/types/crm';
import { BarChart3, ShieldCheck, ArrowRight, Layers } from 'lucide-react';

export const ServiceTypeChart: React.FC = () => {
  const { clients } = useCRM();
  const [filterCategory, setFilterCategory] = useState<'all' | 'cmmi' | 'iso' | 'security'>('all');

  // Count distribution
  const counts: Record<string, number> = {};
  clients.forEach((c) => {
    counts[c.service_type] = (counts[c.service_type] || 0) + 1;
  });

  const allStandards: { name: ServiceType; category: 'cmmi' | 'iso' | 'security'; color: string }[] = [
    { name: 'CMMI DEV', category: 'cmmi', color: 'bg-amber-500' },
    { name: 'CMMI SVC', category: 'cmmi', color: 'bg-amber-600' },
    { name: 'CMMI SEC', category: 'cmmi', color: 'bg-amber-700' },
    { name: 'CMMI PPL', category: 'cmmi', color: 'bg-orange-500' },
    { name: 'CMMI SPM', category: 'cmmi', color: 'bg-orange-600' },
    { name: 'ISMS', category: 'iso', color: 'bg-[#0F172A]' },
    { name: 'QMS', category: 'iso', color: 'bg-blue-600' },
    { name: 'ITSM', category: 'iso', color: 'bg-indigo-600' },
    { name: 'AIMS', category: 'iso', color: 'bg-purple-600' },
    { name: 'BCMS', category: 'iso', color: 'bg-teal-600' },
    { name: 'PIMS', category: 'iso', color: 'bg-cyan-600' },
    { name: 'PCI DSS', category: 'security', color: 'bg-rose-600' },
    { name: 'HIPAA', category: 'security', color: 'bg-emerald-600' },
    { name: 'GDPR', category: 'security', color: 'bg-slate-700' },
    { name: 'SOC', category: 'security', color: 'bg-sky-600' },
    { name: 'Cert-In', category: 'security', color: 'bg-red-700' },
  ];

  const filteredStandards = allStandards.filter((s) => {
    if (filterCategory === 'all') return true;
    return s.category === filterCategory;
  });

  const maxCount = Math.max(...allStandards.map((s) => counts[s.name] || 0), 1);

  return (
    <div className="saas-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-slate-900 text-amber-400 shadow-saas-xs">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Appraisal Portfolio Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown across 16 accredited certification tracks
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterCategory === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tracks ({allStandards.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('cmmi')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterCategory === 'cmmi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CMMI
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('iso')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterCategory === 'iso'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ISO / Governance
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('security')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterCategory === 'security'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Security & QSA
          </button>
        </div>
      </div>

      {/* Modern Horizontal Bar Grid */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5">
        {filteredStandards.map((std) => {
          const count = counts[std.name] || 0;
          const percentage = Math.round((count / maxCount) * 100);

          return (
            <Link
              key={std.name}
              href={`/clients?service=${encodeURIComponent(std.name)}`}
              className="flex items-center space-x-3 group text-xs hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
            >
              <div className="w-24 font-semibold text-slate-700 group-hover:text-slate-900 truncate">
                {std.name}
              </div>

              {/* Bar track */}
              <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${std.color}`}
                  style={{ width: `${Math.max(count > 0 ? 12 : 2, percentage)}%` }}
                />
              </div>

              {/* Value badge */}
              <div className="w-8 text-right font-bold text-slate-900 text-xs">
                {count}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Lead Appraiser: Mahesh Bhaskara • Kukatpally, Hyd</span>
        <Link 
          href="/clients" 
          className="font-semibold text-slate-900 hover:text-amber-600 flex items-center space-x-1"
        >
          <span>View Detailed Directory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
