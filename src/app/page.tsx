'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCRM } from '@/lib/crmStore';
import { RiskWidgetCard } from '@/components/RiskWidgetCard';
import { ServiceTypeChart } from '@/components/ServiceTypeChart';
import { 
  Users, 
  Kanban, 
  Award, 
  RefreshCw, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  AlertCircle,
  Building2,
  CalendarDays,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { metrics, clients, activityLogs, isLoading: crmLoading } = useCRM();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || crmLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#B33A2E] border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm font-semibold text-[#1B2A4A]">Loading Shree QA Solutions CRM...</span>
        </div>
      </div>
    );
  }

  // Recent 5 activity logs
  const recentLogs = [...activityLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.name || 'Client Account';
  };

  const getClientService = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.service_type || 'CMMI/ISO';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner & Welcome strip */}
      <div className="bg-[#FAF7F2] rounded-xl border border-[#DEC6A6] p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBDDC9] text-[#1B2A4A] border border-[#DEC6A6]">
                Kukatpally Center of Appraisal Excellence
              </span>
              <span className="text-xs text-gray-500">• ISO/IEC 17021 & CMMI v2.0 Partner</span>
            </div>
            <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
              Executive Appraisal & Audit Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">
              Active oversight of client maturity appraisals, recertification cycles, and lead pipeline health.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/pipeline"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-md bg-[#1B2A4A] hover:bg-[#101B31] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Kanban className="w-4 h-4 text-[#E08A3E]" />
              <span>Appraisal Kanban</span>
            </Link>
            <Link
              href="/clients"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-md bg-[#B33A2E] hover:bg-[#8F281E] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Client Directory</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Strip - Rotating Gold/Orange, Deep Red, Navy */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Clients - Gold/Orange */}
        <div className="bg-[#FAF7F2] rounded-xl border border-[#E08A3E]/40 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#E08A3E]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C26F25]">Total Engagements</span>
            <div className="p-2 rounded-lg bg-[#FFF7ED] text-[#E08A3E]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-serif font-extrabold text-[#1B2A4A]">
            {metrics.totalClients}
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">Registered in Hyderabad registry</span>
        </div>

        {/* In Appraisal Pipeline - Navy */}
        <div className="bg-[#FAF7F2] rounded-xl border border-[#1B2A4A]/30 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#1B2A4A]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1B2A4A]">In-Appraisal Pipeline</span>
            <div className="p-2 rounded-lg bg-[#F0F4F8] text-[#1B2A4A]">
              <Kanban className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-serif font-extrabold text-[#1B2A4A]">
            {metrics.inAppraisalCount}
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">Across 6 assessment substages</span>
        </div>

        {/* Active Certified - Deep Red */}
        <div className="bg-[#FAF7F2] rounded-xl border border-[#B33A2E]/30 p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#B33A2E]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#B33A2E]">Active Certified</span>
            <div className="p-2 rounded-lg bg-[#FEF2F2] text-[#B33A2E]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-serif font-extrabold text-[#1B2A4A]">
            {metrics.activeCount}
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">CMMI & ISO compliance active</span>
        </div>

        {/* Renewals Due - Navy/Gold */}
        <div className="bg-[#FAF7F2] rounded-xl border border-[#DEC6A6] p-5 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2C3E6B]" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2C3E6B]">Renewal Cycles</span>
            <div className="p-2 rounded-lg bg-[#EBDDC9]/50 text-[#1B2A4A]">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-serif font-extrabold text-[#1B2A4A]">
            {metrics.renewalDueCount}
          </p>
          <span className="text-[11px] text-gray-500 mt-1 block">Annual recertifications</span>
        </div>

      </div>

      {/* 3 Clickable Risk Metrics Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1B2A4A] flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B33A2E]" />
              <span>Critical Engagement & Risk Monitors</span>
            </h2>
            <p className="text-xs text-gray-600">
              Click any monitor card to filter the client records for targeted audit intervention
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RiskWidgetCard
            type="renewals_at_risk"
            count={metrics.renewalsAtRiskCount}
          />
          <RiskWidgetCard
            type="cold_leads"
            count={metrics.coldLeadsCount}
          />
          <RiskWidgetCard
            type="stalled_engagements"
            count={metrics.stalledEngagementsCount}
          />
        </div>
      </div>

      {/* Bar Chart Section */}
      <ServiceTypeChart />

      {/* Recent Appraisal Milestones & Activity Feed */}
      <div className="bg-[#FAF7F2] rounded-xl border border-[#DEC6A6] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6DCce]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-[#1B2A4A] text-white">
              <Clock className="w-5 h-5 text-[#E08A3E]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#1B2A4A]">
                Recent Appraisal Logs & Audit Milestones
              </h3>
              <p className="text-xs text-gray-600">
                Latest updates from lead appraisers, auditors, and engagement managers
              </p>
            </div>
          </div>
          <Link
            href="/clients"
            className="text-xs font-semibold text-[#B33A2E] hover:underline flex items-center space-x-1"
          >
            <span>View All Records</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-[#E6DCce]">
          {recentLogs.map((log) => (
            <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-[#1B2A4A]">
                    {getClientName(log.client_id)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBDDC9] text-[#1B2A4A]">
                    {getClientService(log.client_id)}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed max-w-3xl">
                  {log.note}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-semibold text-[#B33A2E] block">
                  {log.logged_by}
                </span>
                <span className="text-[10px] text-gray-500">
                  {new Date(log.timestamp).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
