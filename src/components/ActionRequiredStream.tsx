'use client';

import React from 'react';
import Link from 'next/link';
import { useCRM } from '@/lib/crmStore';
import { Client } from '@/types/crm';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { 
  AlertCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Mail, 
  Building2,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ActionRequiredStreamProps {
  onSelectClient: (client: Client) => void;
  onOpenEmail: (client: Client) => void;
}

export const ActionRequiredStream: React.FC<ActionRequiredStreamProps> = ({
  onSelectClient,
  onOpenEmail,
}) => {
  const { clients, isRenewalAtRisk, isColdLead, isStalledEngagement, getDaysSinceLastActivity } = useCRM();

  // Find all clients with any risk condition
  const actionItems: { client: Client; reason: string; severity: 'critical' | 'warning' | 'stalled'; days: number }[] = [];

  clients.forEach((client) => {
    const days = getDaysSinceLastActivity(client.id);
    if (isRenewalAtRisk(client)) {
      actionItems.push({
        client,
        reason: `Cert expiring on ${client.cert_expiry_date || 'soon'} • ${days}d no contact`,
        severity: 'critical',
        days,
      });
    } else if (isStalledEngagement(client)) {
      actionItems.push({
        client,
        reason: `Appraisal milestone [${client.pipeline_substage?.replace(/_/g, ' ').toUpperCase()}] idle for ${days}d`,
        severity: 'stalled',
        days,
      });
    } else if (isColdLead(client)) {
      actionItems.push({
        client,
        reason: `Initial scoping inquiry idle for ${days}d`,
        severity: 'warning',
        days,
      });
    }
  });

  // Sort by highest days idle and slice top 5
  const topActions = actionItems.sort((a, b) => b.days - a.days).slice(0, 5);

  if (topActions.length === 0) {
    return (
      <div className="saas-card p-6 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">All Engagements Healthy</h3>
        <p className="text-xs text-slate-500 mt-0.5">No critical appraisal milestones or renewal risks currently require intervention.</p>
      </div>
    );
  }

  return (
    <div className="saas-card p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 shadow-saas-xs">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900">
                Action Required • Priority Stream
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {topActions.length} Critical
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Immediate appraiser follow-ups to maintain client compliance and appraisal velocity
            </p>
          </div>
        </div>

        <Link
          href="/clients?risk=renewals_at_risk"
          className="text-xs font-semibold text-[#0F172A] hover:text-amber-600 flex items-center space-x-1 transition-colors"
        >
          <span>View All Risk Engagements</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Action Items List */}
      <div className="mt-4 divide-y divide-slate-100">
        {topActions.map(({ client, reason, severity, days }) => {
          const badgeConfig = {
            critical: {
              label: 'Renewal at Risk',
              bg: 'bg-rose-50 text-rose-700 border-rose-200',
              dot: 'bg-rose-500',
            },
            warning: {
              label: 'Cold Lead',
              bg: 'bg-amber-50 text-amber-700 border-amber-200',
              dot: 'bg-amber-500',
            },
            stalled: {
              label: 'Stalled Appraisal',
              bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              dot: 'bg-indigo-500',
            },
          }[severity];

          return (
            <div
              key={client.id}
              onClick={() => onSelectClient(client)}
              className="py-3 px-2 rounded-xl hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left Column: Organization & Reason */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className={`w-2 h-2 rounded-full ${badgeConfig.dot} shrink-0`} />
                  <span className="font-bold text-xs text-slate-900 group-hover:text-amber-600 transition-colors">
                    {client.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {client.service_type}
                  </span>
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${badgeConfig.bg}`}>
                    {badgeConfig.label}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-normal pl-4">
                  {reason}
                </p>
              </div>

              {/* Right Column: Actions */}
              <div 
                className="flex items-center space-x-2 shrink-0 self-end sm:self-center pl-4 sm:pl-0"
                onClick={(e) => e.stopPropagation()}
              >
                <WhatsAppButton client={client} size="sm" variant="outline" />

                <button
                  type="button"
                  onClick={() => onOpenEmail(client)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-[#0F172A] hover:text-white text-slate-700 text-xs font-semibold transition-colors"
                  title="Generate status email"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>AI Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectClient(client)}
                  className="px-2.5 py-1 rounded-md bg-[#0F172A] text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Review
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
