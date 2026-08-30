'use client';

import React from 'react';
import Link from 'next/link';
import { useCRM } from '@/lib/crmStore';
import { ShieldCheck, AlertTriangle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const CertificationHealthRadar: React.FC = () => {
  const { clients, metrics } = useCRM();

  const total = clients.length;
  const active = metrics.activeCount;
  const renewalDue = metrics.renewalDueCount;
  const inAppraisal = metrics.inAppraisalCount;
  const leads = clients.filter((c) => c.stage === 'lead').length;
  const lapsed = clients.filter((c) => c.stage === 'lapsed').length;

  // Percentage calculations
  const activePct = total > 0 ? Math.round((active / total) * 100) : 0;
  const renewalPct = total > 0 ? Math.round((renewalDue / total) * 100) : 0;
  const pipelinePct = total > 0 ? Math.round((inAppraisal / total) * 100) : 0;
  const leadPct = total > 0 ? Math.round((leads / total) * 100) : 0;
  const lapsedPct = total > 0 ? Math.round((lapsed / total) * 100) : 0;

  return (
    <div className="saas-card p-6 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shadow-saas-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Certification Lifecycle Health
              </h3>
              <p className="text-xs text-slate-500">
                Portfolio compliance distribution
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {activePct}% Certified
          </span>
        </div>

        {/* Multi-Segment Color Progression Bar */}
        <div className="mt-5 space-y-1.5">
          <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden p-0.5 border border-slate-200/60 shadow-inner">
            <div 
              style={{ width: `${activePct}%` }} 
              className="bg-emerald-500 rounded-l-full transition-all duration-500" 
              title={`Active Certified: ${active}`}
            />
            <div 
              style={{ width: `${renewalPct}%` }} 
              className="bg-rose-500 transition-all duration-500" 
              title={`Renewal Due: ${renewalDue}`}
            />
            <div 
              style={{ width: `${pipelinePct}%` }} 
              className="bg-[#0F172A] transition-all duration-500" 
              title={`In Appraisal: ${inAppraisal}`}
            />
            <div 
              style={{ width: `${leadPct}%` }} 
              className="bg-amber-400 transition-all duration-500" 
              title={`Leads: ${leads}`}
            />
            <div 
              style={{ width: `${lapsedPct}%` }} 
              className="bg-slate-300 rounded-r-full transition-all duration-500" 
              title={`Lapsed: ${lapsed}`}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
            <span>0%</span>
            <span>50%</span>
            <span>100% ({total} clients)</span>
          </div>
        </div>

        {/* Metric Legend Grid */}
        <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
          <Link
            href="/clients"
            className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between"
          >
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Active Certified</span>
            </span>
            <span className="font-bold text-slate-900">{active}</span>
          </Link>

          <Link
            href="/clients?risk=renewals_at_risk"
            className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between"
          >
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-slate-600">Renewal Due</span>
            </span>
            <span className="font-bold text-slate-900">{renewalDue}</span>
          </Link>

          <Link
            href="/pipeline"
            className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between"
          >
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F172A]" />
              <span className="text-slate-600">In Appraisal</span>
            </span>
            <span className="font-bold text-slate-900">{inAppraisal}</span>
          </Link>

          <Link
            href="/clients?stage=lead"
            className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between"
          >
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-600">Leads</span>
            </span>
            <span className="font-bold text-slate-900">{leads}</span>
          </Link>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400">
          Accredited CMMI Institute & ISO Standards
        </span>
        <Link 
          href="/clients" 
          className="font-semibold text-slate-800 hover:text-amber-600 flex items-center space-x-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
