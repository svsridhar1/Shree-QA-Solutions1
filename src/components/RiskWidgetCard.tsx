'use client';

import React from 'react';
import Link from 'next/link';
import { RiskFilterType } from '@/types/crm';
import { AlertTriangle, Clock, Flame, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface RiskWidgetCardProps {
  type: 'renewals_at_risk' | 'cold_leads' | 'stalled_engagements';
  count: number;
}

export const RiskWidgetCard: React.FC<RiskWidgetCardProps> = ({ type, count }) => {
  const config = {
    renewals_at_risk: {
      title: 'Renewals at Risk',
      severity: 'CRITICAL',
      severityBg: 'bg-rose-50 text-rose-700 border-rose-200',
      accentColor: 'border-l-rose-500',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 text-rose-600',
      description: 'Expiring in <90 days without recent contact',
      actionText: 'Review Renewals',
      href: '/clients?risk=renewals_at_risk',
    },
    cold_leads: {
      title: 'Cold Leads',
      severity: 'ATTENTION',
      severityBg: 'bg-amber-50 text-amber-700 border-amber-200',
      accentColor: 'border-l-amber-500',
      icon: Flame,
      iconBg: 'bg-amber-50 text-amber-600',
      description: 'Lead inquiries idle for 14+ days',
      actionText: 'Follow Up Leads',
      href: '/clients?risk=cold_leads',
    },
    stalled_engagements: {
      title: 'Stalled Engagements',
      severity: 'BLOCKED',
      severityBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      accentColor: 'border-l-indigo-500',
      icon: Clock,
      iconBg: 'bg-indigo-50 text-indigo-600',
      description: 'In-appraisal milestone idle for 21+ days',
      actionText: 'Unblock Milestone',
      href: '/clients?risk=stalled_engagements',
    },
  }[type];

  const Icon = config.icon;

  return (
    <Link
      href={config.href}
      className={`saas-card p-5 block group relative overflow-hidden border-l-4 ${config.accentColor}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${config.iconBg} shadow-saas-xs`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs text-slate-800">
                {config.title}
              </span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${config.severityBg}`}>
                {config.severity}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {config.description}
            </p>
          </div>
        </div>

        {/* Big Dominant Count */}
        <div className="text-right">
          <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${count > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
            {count}
          </span>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 font-medium">
          {count === 0 ? 'No active risk detected' : `${count} ${count === 1 ? 'client' : 'clients'} flagged`}
        </span>

        <span className="font-semibold text-slate-900 group-hover:text-amber-600 flex items-center space-x-1 transition-colors">
          <span>{config.actionText}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
};
