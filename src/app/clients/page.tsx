'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCRM } from '@/lib/crmStore';
import { Client, ClientStage, ServiceType, RiskFilterType } from '@/types/crm';
import { ClientDetailDrawer } from '@/components/ClientDetailDrawer';
import { AddClientModal } from '@/components/AddClientModal';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AIEmailGeneratorModal } from '@/components/AIEmailGeneratorModal';
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Flame, 
  Calendar, 
  User, 
  ExternalLink,
  RotateCcw,
  X,
  Layers,
  Sparkles,
  Mail,
  FileSpreadsheet
} from 'lucide-react';

function ClientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    clients, 
    activeRiskFilter, 
    setActiveRiskFilter, 
    isRenewalAtRisk, 
    isColdLead, 
    isStalledEngagement,
    getDaysSinceLastActivity, 
    isLoading: crmLoading 
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [emailClient, setEmailClient] = useState<Client | null>(null);

  // Sync URL query params
  useEffect(() => {
    const riskParam = searchParams.get('risk') as RiskFilterType;
    if (riskParam) {
      setActiveRiskFilter(riskParam);
    }
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setSelectedService(serviceParam);
    }
    const selectedId = searchParams.get('selected');
    if (selectedId && clients.length > 0) {
      const match = clients.find((c) => c.id === selectedId);
      if (match) setSelectedClient(match);
    }
  }, [searchParams, setActiveRiskFilter, clients]);

  // Auth protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = client.name.toLowerCase().includes(q);
        const matchesOwner = client.owner.toLowerCase().includes(q);
        const matchesService = client.service_type.toLowerCase().includes(q);
        if (!matchesName && !matchesOwner && !matchesService) return false;
      }

      // 2. Risk Filter Preset from Dashboard
      if (activeRiskFilter === 'renewals_at_risk') {
        if (!isRenewalAtRisk(client)) return false;
      } else if (activeRiskFilter === 'cold_leads') {
        if (!isColdLead(client)) return false;
      } else if (activeRiskFilter === 'stalled_engagements') {
        if (!isStalledEngagement(client)) return false;
      }

      // 3. Stage Filter
      if (selectedStage !== 'all' && client.stage !== selectedStage) {
        return false;
      }

      // 4. Service Filter
      if (selectedService !== 'all' && client.service_type !== selectedService) {
        return false;
      }

      return true;
    });
  }, [
    clients, 
    searchQuery, 
    activeRiskFilter, 
    selectedStage, 
    selectedService, 
    isRenewalAtRisk, 
    isColdLead, 
    isStalledEngagement
  ]);

  if (authLoading || crmLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#B33A2E] border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm font-semibold text-[#1B2A4A]">Loading Client Registry...</span>
        </div>
      </div>
    );
  }

  const clearRiskFilter = () => {
    setActiveRiskFilter(null);
    router.replace('/clients');
  };

  const getStageBadge = (stage: ClientStage) => {
    switch (stage) {
      case 'lead':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">Lead</span>;
      case 'in_appraisal':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-900 border border-blue-300">In Appraisal</span>;
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">Active Certified</span>;
      case 'renewal_due':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-900 border border-rose-300">Renewal Due</span>;
      case 'lapsed':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-800 border border-gray-300">Lapsed</span>;
    }
  };

  const formatExpiry = (dateStr: string | null) => {
    if (!dateStr) return <span className="text-gray-400">—</span>;
    try {
      const d = new Date(dateStr);
      return (
        <span className="font-mono text-xs text-[#1B2A4A]">
          {d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      );
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="bg-[#FAF7F2] rounded-xl border border-[#DEC6A6] p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
              Client & Appraisal Directory
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">
              Master repository of appraisal engagements, certification timelines, Excel/CSV bulk imports, and WhatsApp interactions.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-md bg-[#B33A2E] hover:bg-[#8F281E] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Register / Import Clients</span>
          </button>
        </div>
      </div>

      {/* Active Dashboard Risk Filter Banner */}
      {activeRiskFilter && (
        <div className="p-4 rounded-xl bg-[#FFF8F6] border-2 border-[#B33A2E]/50 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#B33A2E] text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-sm text-[#B33A2E]">
                  Filtered By Dashboard Risk Monitor:
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B33A2E] text-white uppercase">
                  {activeRiskFilter.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                Showing {filteredClients.length} matching client {filteredClients.length === 1 ? 'record' : 'records'} requiring appraisal attention.
              </p>
            </div>
          </div>

          <button
            onClick={clearRiskFilter}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white border border-[#DEC6A6] text-xs font-semibold text-[#1B2A4A] hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 text-[#B33A2E]" />
            <span>Clear Filter</span>
          </button>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-[#FAF7F2] rounded-xl border border-[#DEC6A6] p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4 text-[#1B2A4A]/60" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, appraiser, service..."
              className="block w-full pl-9 pr-3 py-2 border border-[#DEC6A6] rounded-md text-xs text-[#1B2A4A] bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#B33A2E] focus:border-[#B33A2E]"
            />
          </div>

          {/* Stage filter */}
          <div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="block w-full px-3 py-2 border border-[#DEC6A6] rounded-md text-xs text-[#1B2A4A] bg-white focus:outline-none focus:ring-1 focus:ring-[#B33A2E] focus:border-[#B33A2E]"
            >
              <option value="all">All Stages ({clients.length})</option>
              <option value="lead">Lead</option>
              <option value="in_appraisal">In Appraisal</option>
              <option value="active">Active Certified</option>
              <option value="renewal_due">Renewal Due</option>
              <option value="lapsed">Lapsed</option>
            </select>
          </div>

          {/* Service Standard filter */}
          <div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="block w-full px-3 py-2 border border-[#DEC6A6] rounded-md text-xs text-[#1B2A4A] bg-white focus:outline-none focus:ring-1 focus:ring-[#B33A2E] focus:border-[#B33A2E]"
            >
              <option value="all">All Service Standards</option>
              <option value="CMMI DEV">CMMI DEV</option>
              <option value="CMMI SVC">CMMI SVC</option>
              <option value="CMMI SEC">CMMI SEC</option>
              <option value="CMMI PPL">CMMI PPL</option>
              <option value="CMMI SPM">CMMI SPM</option>
              <option value="PCI DSS">PCI DSS</option>
              <option value="HIPAA">HIPAA</option>
              <option value="GDPR">GDPR</option>
              <option value="SOC">SOC</option>
              <option value="QMS">QMS (ISO 9001)</option>
              <option value="ISMS">ISMS (ISO 27001)</option>
              <option value="ITSM">ITSM (ISO 20000)</option>
              <option value="AIMS">AIMS (ISO 42001)</option>
              <option value="BCMS">BCMS (ISO 22301)</option>
              <option value="PIMS">PIMS (ISO 27701)</option>
              <option value="Cert-In">Cert-In</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Showing {filteredClients.length} of {clients.length} clients
            </span>
            {(searchQuery || selectedStage !== 'all' || selectedService !== 'all' || activeRiskFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedStage('all');
                  setSelectedService('all');
                  setActiveRiskFilter(null);
                  router.replace('/clients');
                }}
                className="text-xs text-[#B33A2E] font-semibold hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-[#FAF7F2] rounded-xl border border-[#DEC6A6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#DEC6A6]/60">
            <thead className="bg-[#1B2A4A] text-white">
              <tr>
                <th scope="col" className="px-5 py-3.5 text-left text-xs font-serif font-bold tracking-wider">
                  Company / Organization
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-serif font-bold tracking-wider">
                  Service Track
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-serif font-bold tracking-wider">
                  Appraisal Stage
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-serif font-bold tracking-wider">
                  Lead Appraiser
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-serif font-bold tracking-wider">
                  Last Activity
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-serif font-bold tracking-wider">
                  Cert Expiry
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-serif font-bold tracking-wider">
                  Risk Status
                </th>
                <th scope="col" className="px-4 py-3.5 text-right text-xs font-serif font-bold tracking-wider">
                  Quick Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EBDDC9] bg-white">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-xs text-gray-500 bg-[#FAF7F2]">
                    No client records match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const daysSinceActivity = getDaysSinceLastActivity(client.id);
                  const renewalAtRisk = isRenewalAtRisk(client);
                  const coldLead = isColdLead(client);
                  const stalled = isStalledEngagement(client);

                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className="hover:bg-[#FFFBF5] cursor-pointer transition-colors group"
                    >
                      {/* Company Name */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#EBDDC9]/60 flex items-center justify-center text-[#1B2A4A] font-bold text-xs border border-[#DEC6A6]">
                            {client.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#1B2A4A] group-hover:text-[#B33A2E] transition-colors">
                              {client.name}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              ID: {client.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Service Standard */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#EBDDC9]/60 text-[#1B2A4A] border border-[#DEC6A6]">
                          {client.service_type}
                        </span>
                      </td>

                      {/* Stage & Substage */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getStageBadge(client.stage)}
                          {client.stage === 'in_appraisal' && client.pipeline_substage && (
                            <div className="text-[10px] font-semibold text-[#1B2A4A] uppercase tracking-wide">
                              Substage: {client.pipeline_substage.replace('_', ' ')}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Lead Owner */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-700">
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span>{client.owner}</span>
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        <span className={`font-semibold ${daysSinceActivity > 14 ? 'text-[#B33A2E]' : 'text-gray-700'}`}>
                          {daysSinceActivity} {daysSinceActivity === 1 ? 'day' : 'days'} ago
                        </span>
                      </td>

                      {/* Cert Expiry */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {formatExpiry(client.cert_expiry_date)}
                      </td>

                      {/* Risk Badges */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {renewalAtRisk && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Renewal at Risk
                          </span>
                        )}
                        {coldLead && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Flame className="w-3 h-3 mr-1" />
                            Cold Lead
                          </span>
                        )}
                        {stalled && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                            <Clock className="w-3 h-3 mr-1" />
                            Stalled
                          </span>
                        )}
                        {!renewalAtRisk && !coldLead && !stalled && (
                          <span className="text-[11px] text-emerald-700 font-medium">
                            Healthy
                          </span>
                        )}
                      </td>

                      {/* Actions with WhatsApp & AI Email */}
                      <td className="px-4 py-4 whitespace-nowrap text-right text-xs font-semibold">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* WhatsApp Trigger */}
                          <WhatsAppButton client={client} size="icon" />

                          {/* AI Email Trigger */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEmailClient(client);
                            }}
                            title={`AI Status Email for ${client.name}`}
                            className="p-1.5 rounded-md bg-[#B33A2E]/10 text-[#B33A2E] hover:bg-[#B33A2E] hover:text-white transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          {/* View Drawer */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client);
                            }}
                            className="px-2.5 py-1 rounded bg-[#FAF7F2] hover:bg-[#EBDDC9] text-[#1B2A4A] border border-[#DEC6A6] transition-colors"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Drawer */}
      <ClientDetailDrawer
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
      />

      {/* Add Client Modal with Excel / CSV Upload */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* AI Email Generator Modal */}
      <AIEmailGeneratorModal
        client={emailClient}
        isOpen={!!emailClient}
        onClose={() => setEmailClient(null)}
      />

    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#B33A2E] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ClientsContent />
    </Suspense>
  );
}
