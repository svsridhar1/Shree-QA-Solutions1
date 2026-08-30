'use client';

import React from 'react';
import Link from 'next/link';
import { useCRM } from '@/lib/crmStore';
import { PipelineSubstage } from '@/types/crm';
import { Kanban, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

interface StageSummary {
  id: PipelineSubstage;
  step: number;
  label: string;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const AppraisalFunnelProgress: React.FC = () => {
  const { clients } = useCRM();

  const inAppraisalClients = clients.filter((c) => c.stage === 'in_appraisal');
  const totalInAppraisal = inAppraisalClients.length;

  const stages: StageSummary[] = [
    {
      id: 'inquiry',
      step: 1,
      label: 'Inquiry',
      count: inAppraisalClients.filter((c) => (c.pipeline_substage || 'inquiry') === 'inquiry').length,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      id: 'docs_collected',
      step: 2,
      label: 'Docs Collected',
      count: inAppraisalClients.filter((c) => c.pipeline_substage === 'docs_collected').length,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100/50',
      borderColor: 'border-amber-300',
    },
    {
      id: 'assessment',
      step: 3,
      label: 'Assessment',
      count: inAppraisalClients.filter((c) => c.pipeline_substage === 'assessment').length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'site_visit',
      step: 4,
      label: 'Site Visit',
      count: inAppraisalClients.filter((c) => c.pipeline_substage === 'site_visit').length,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      id: 'report',
      step: 5,
      label: 'Report',
      count: inAppraisalClients.filter((c) => c.pipeline_substage === 'report').length,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 'signoff',
      step: 6,
      label: 'Sign-off',
      count: inAppraisalClients.filter((c) => c.pipeline_substage === 'signoff').length,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
  ];

  return (
    <div className="saas-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-slate-900 text-amber-400 shadow-saas-xs">
            <Kanban className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Appraisal Pipeline Funnel
            </h3>
            <p className="text-xs text-slate-500">
              {totalInAppraisal} engagements moving across 6 appraisal milestones
            </p>
          </div>
        </div>

        <Link
          href="/pipeline"
          className="text-xs font-semibold text-[#0F172A] hover:text-amber-600 flex items-center space-x-1 transition-colors"
        >
          <span>Open Interactive Kanban</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 6-Stage Progression Track */}
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map((stage, idx) => {
          const pct = totalInAppraisal > 0 ? Math.round((stage.count / totalInAppraisal) * 100) : 0;
          return (
            <Link
              key={stage.id}
              href="/pipeline"
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-saas-sm transition-all group relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400">
                  0{stage.step}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${stage.bgColor} ${stage.color} ${stage.borderColor}`}>
                  {stage.count} {stage.count === 1 ? 'Client' : 'Clients'}
                </span>
              </div>

              <div className="font-bold text-xs text-slate-800 group-hover:text-[#0F172A] transition-colors truncate">
                {stage.label}
              </div>

              {/* Progress mini-bar */}
              <div className="mt-2.5 w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    stage.count > 0 ? 'bg-[#0F172A]' : 'bg-transparent'
                  }`}
                  style={{ width: `${Math.max(10, pct)}%` }}
                />
              </div>

              <div className="mt-1 text-[10px] text-slate-400 flex justify-between">
                <span>{pct}% share</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
