'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCRM } from '@/lib/crmStore';
import { RiskFilterType } from '@/types/crm';
import { AlertTriangle, Clock, Flame, ArrowRight, ShieldAlert } from 'lucide-react';

interface RiskWidgetCardProps {
  type: 'renewals_at_risk' | 'cold_leads' | 'stalled_engagements';
  count: number;
}

export const RiskWidgetCard: React.FC<RiskWidgetCardProps> = ({ type, count }) => {
  const router = useRouter();
  const { setActiveRiskFilter } = useCRM();

  const config = {
    renewals_at_risk: {
      title: 'Renewals at Risk',
      subtitle: 'Expiry ≤ 90 days & No activity in 14 days',
      theme: 'red',
      icon: AlertTriangle,
      borderClass: 'border-[#B33A2E]/40 hover:border-[#B33A2E]',
      bgClass: 'bg-[#FFF8F6] hover:bg-[#FFF2EE]',
      headerColor: 'text-[#B33A2E]',
      badgeBg: 'bg-[#B33A2E] text-white',
      accentBar: 'bg-[#B33A2E]',
      description: 'Active client certifications nearing expiration without recent appraisal engagement.',
    },
    cold_leads: {
      title: 'Cold Leads',
      subtitle: 'Stage: Lead & No activity in 14 days',
      theme: 'gold',
      icon: Flame,
      borderClass: 'border-[#E08A3E]/40 hover:border-[#E08A3E]',
      bgClass: 'bg-[#FFFBF5] hover:bg-[#FFF7EA]',
      headerColor: 'text-[#C26F25]',
      badgeBg: 'bg-[#E08A3E] text-white',
      accentBar: 'bg-[#E08A3E]',
      description: 'High-potential appraisal prospects needing immediate follow-up outreach.',
    },
    stalled_engagements: {
      title: 'Stalled Engagements',
      subtitle: 'In Appraisal & No activity in 21 days',
      theme: 'navy',
      icon: Clock,
      borderClass: 'border-[#1B2A4A]/30 hover:border-[#1B2A4A]',
      bgClass: 'bg-[#F4F7FB] hover:bg-[#EBF1F9]',
      headerColor: 'text-[#1B2A4A]',
      badgeBg: 'bg-[#1B2A4A] text-white',
      accentBar: 'bg-[#1B2A4A]',
      description: 'In-flight appraisal milestones with pending documentation or stalled ATM reviews.',
    },
  }[type];

  const handleClick = () => {
    setActiveRiskFilter(type as RiskFilterType);
    router.push(`/clients?risk=${type}`);
  };

  const Icon = config.icon;

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      className={`relative flex flex-col justify-between p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${config.bgClass} ${config.borderClass} group`}
    >
      {/* Top indicator stripe */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-xl ${config.accentBar}`} />

      {/* Header section */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2.5 rounded-lg bg-white shadow-xs border border-black/5 ${config.headerColor}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-serif text-lg font-bold tracking-tight ${config.headerColor}`}>
                {config.title}
              </h3>
              <p className="text-xs text-gray-500 font-medium">{config.subtitle}</p>
            </div>
          </div>

          {/* Count pill */}
          <span className={`text-2xl font-bold px-3.5 py-1 rounded-full shadow-xs ${config.badgeBg}`}>
            {count}
          </span>
        </div>

        {/* Description */}
        <p className="mt-4 text-xs text-gray-700 leading-relaxed">
          {config.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#1B2A4A] group-hover:text-[#B33A2E] transition-colors">
        <span>Filter client records</span>
        <div className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
          <span>View {count} {count === 1 ? 'Client' : 'Clients'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
