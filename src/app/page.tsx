'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCRM } from '@/lib/crmStore';
import { RiskWidgetCard } from '@/components/RiskWidgetCard';
import { ServiceTypeChart } from '@/components/ServiceTypeChart';
import { AppraisalFunnelProgress } from '@/components/AppraisalFunnelProgress';
import { CertificationHealthRadar } from '@/components/CertificationHealthRadar';
import { ActionRequiredStream } from '@/components/ActionRequiredStream';
import { AIAssistantModal } from '@/components/AIAssistantModal';
import { ClientDetailDrawer } from '@/components/ClientDetailDrawer';
import { AddClientModal } from '@/components/AddClientModal';
import { AIEmailGeneratorModal } from '@/components/AIEmailGeneratorModal';
import { Client } from '@/types/crm';
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
  Plus, 
  Sparkles, 
  TrendingUp,
  CheckCircle2,
  CalendarDays,
  FileSpreadsheet,
  Activity,
  Bot
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const { metrics, clients, activityLogs, isLoading: crmLoading, resetToDemoSeed } = useCRM();

  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [emailClient, setEmailClient] = useState<Client | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const formatTime = () => {
      const d = new Date();
      return `Today, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    };
    setLastSyncTime(formatTime());
  }, []);

  if (authLoading || crmLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-9 h-9 border-3 border-[#0F172A] border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-700">Loading Enterprise Appraisal Intelligence...</span>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const d = new Date();
      setLastSyncTime(`Today, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
      setIsSyncing(false);
    }, 600);
  };

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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. EXECUTIVE HERO INTRO SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-2 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-700 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>EXECUTIVE QUALITY & APPRAISAL INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good morning, {user?.name || 'Mahesh Bhaskara'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            Monitor client appraisal cohorts, CMMI v2.0 benchmark pipelines, ISO compliance surveillance, and risk intelligence in real time.
          </p>
        </div>

        {/* Hero Actions & Sync Status */}
        <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-y-2">
          {/* Sync status */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 shadow-saas-xs">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Synced: <strong className="text-slate-700">{lastSyncTime}</strong></span>
            <button
              type="button"
              onClick={handleRefresh}
              className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
              title="Sync latest state"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-600' : ''}`} />
            </button>
          </div>

          {/* AI Assist Quick CTA */}
          <button
            type="button"
            onClick={() => setIsAIOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-saas-xs hover:bg-slate-800 transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask AI</span>
          </button>

          {/* Register Client CTA */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-saas-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Register Client</span>
          </button>
        </div>
      </div>

      {/* 2. TOP 4 HIGH-END KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Engagements */}
        <div className="saas-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Total Engagements
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shadow-saas-xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.totalClients}
            </span>
            <span className="text-xs font-bold text-emerald-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +12% QoQ
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Registered organizations in Hyderabad registry
          </p>
        </div>

        {/* In-Appraisal Pipeline */}
        <div className="saas-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              In-Appraisal Pipeline
            </span>
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-900 shadow-saas-xs">
              <Kanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.inAppraisalCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Active Cohorts
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Moving through 6 benchmark stages
          </p>
        </div>

        {/* Active Certified */}
        <div className="saas-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Certified
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shadow-saas-xs">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.activeCount}
            </span>
            <span className="text-xs font-bold text-emerald-700">
              100% Compliant
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            CMMI High-Maturity & ISO certified
          </p>
        </div>

        {/* Renewal Cycles */}
        <div className="saas-card p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Renewal Cycles
            </span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 shadow-saas-xs">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {metrics.renewalDueCount}
            </span>
            <span className="text-xs font-bold text-amber-700">
              Within 90 Days
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Recertifications & annual surveillance audits
          </p>
        </div>

      </div>

      {/* 3. RISK INTELLIGENCE MONITORS */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h2 className="text-base font-bold text-slate-900">
                Risk Intelligence • Priority Monitors
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated algorithmic flags for upcoming expirations, stalled milestones, and cold leads
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAIOpen(true)}
            className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Risk Diagnostics</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

      {/* 4. VISUAL ANALYTICS: APPRAISAL PROGRESS & CERTIFICATION HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <AppraisalFunnelProgress />
        </div>
        <div>
          <CertificationHealthRadar />
        </div>
      </div>

      {/* 5. ACTION REQUIRED STREAM */}
      <ActionRequiredStream
        onSelectClient={(client) => setSelectedClient(client)}
        onOpenEmail={(client) => setEmailClient(client)}
      />

      {/* 6. APPRAISAL PORTFOLIO DISTRIBUTION */}
      <ServiceTypeChart />

      {/* 7. RECENT APPRAISAL AUDIT TIMELINE */}
      <div className="saas-card p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-amber-400 shadow-saas-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Recent Appraisal Logs & Milestone Observations
              </h3>
              <p className="text-xs text-slate-500">
                Real-time chronological timeline from lead appraisers and audit team members
              </p>
            </div>
          </div>
          <Link
            href="/clients"
            className="text-xs font-semibold text-slate-900 hover:text-amber-600 flex items-center space-x-1 transition-colors"
          >
            <span>View All Records</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {recentLogs.map((log) => (
            <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="font-bold text-xs text-slate-900">
                    {getClientName(log.client_id)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {getClientService(log.client_id)}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
                  {log.note}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-bold text-[#0F172A] block">
                  {log.logged_by}
                </span>
                <span className="text-[10px] text-slate-400">
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

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onSelectClient={(client) => {
          setSelectedClient(client);
        }}
      />

      {/* Client Detail Drawer */}
      <ClientDetailDrawer
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />

      {/* Register Client Modal with Excel / CSV Bulk Upload */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* AI Status Email Generator Modal */}
      <AIEmailGeneratorModal
        client={emailClient}
        isOpen={!!emailClient}
        onClose={() => setEmailClient(null)}
      />

    </div>
  );
}
