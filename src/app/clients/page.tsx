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
  AlertTriangle, 
  Clock, 
  Flame, 
  User, 
  ExternalLink,
  RotateCcw,
  X,
  Mail,
  FileSpreadsheet,
  CheckCircle2,
  ChevronDown
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
    const stageParam = searchParams.get('stage');
    if (stageParam) {
      setSelectedStage(stageParam);
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
          <div className="w-9 h-9 border-3 border-[#0F172A] border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-700">Loading Client Directory...</span>
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
      case 'active':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">ACTIVE CERTIFIED</span>;
      case 'in_appraisal':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">IN APPRAISAL</span>;
      case 'renewal_due':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">RENEWAL DUE</span>;
      case 'lead':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">LEAD INQUIRY</span>;
      case 'lapsed':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">LAPSED</span>;
    }
  };

  const formatExpiry = (dateStr: string | null) => {
    if (!dateStr) return <span className="text-slate-400">—</span>;
    try {
      const d = new Date(dateStr);
      return (
        <span className="font-mono text-xs text-slate-700 font-medium">
          {d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      );
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Client & Appraisal Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Master repository of {clients.length} enterprise client engagements, appraisal lifecycles, and certification timelines.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-saas-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register / Import Clients</span>
        </button>
      </div>

      {/* Active Dashboard Risk Filter Banner */}
      {activeRiskFilter && (
        <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between shadow-saas-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-rose-600 text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-rose-900">
                  Filtered by Risk Monitor:
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white uppercase">
                  {activeRiskFilter.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Showing {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} requiring immediate appraisal attention.
              </p>
            </div>
          </div>

          <button
            onClick={clearRiskFilter}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-white border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Filter</span>
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="saas-card p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, appraiser, service..."
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
            />
          </div>

          {/* Stage filter */}
          <div>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
            >
              <option value="all">All Stages ({clients.length})</option>
              <option value="active">Active Certified</option>
              <option value="in_appraisal">In Appraisal</option>
              <option value="renewal_due">Renewal Due</option>
              <option value="lead">Lead Inquiry</option>
              <option value="lapsed">Lapsed</option>
            </select>
          </div>

          {/* Service Standard filter */}
          <div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="block w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
            >
              <option value="all">All 16 Service Standards</option>
              <option value="CMMI DEV">CMMI DEV</option>
              <option value="CMMI SVC">CMMI SVC</option>
              <option value="CMMI SEC">CMMI SEC</option>
              <option value="CMMI PPL">CMMI PPL</option>
              <option value="CMMI SPM">CMMI SPM</option>
              <option value="ISMS">ISMS (ISO 27001)</option>
              <option value="QMS">QMS (ISO 9001)</option>
              <option value="ITSM">ITSM (ISO 20000)</option>
              <option value="AIMS">AIMS (ISO 42001 AI)</option>
              <option value="BCMS">BCMS (ISO 22301)</option>
              <option value="PIMS">PIMS (ISO 27701)</option>
              <option value="PCI DSS">PCI DSS</option>
              <option value="HIPAA">HIPAA</option>
              <option value="GDPR">GDPR</option>
              <option value="SOC">SOC</option>
              <option value="Cert-In">Cert-In</option>
            </select>
          </div>

          {/* Filter Status Reset */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong>{filteredClients.length}</strong> of {clients.length}
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
                className="text-xs text-amber-600 font-semibold hover:underline flex items-center space-x-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Enterprise SaaS Table */}
      <div className="saas-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-700 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold tracking-wider">
                  Organization / Client
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">
                  Standard Track
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">
                  Appraisal Stage
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">
                  Lead Appraiser
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">
                  Last Contact
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">
                  Cert Expiry
                </th>
                <th scope="col" className="px-4 py-3.5 text-left text-xs font-bold tracking-wider">
                  Risk Status
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-xs text-slate-500">
                    No client records match the current filter criteria.
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
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Organization Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-xs border border-slate-200">
                            {client.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-900 group-hover:text-amber-600 transition-colors">
                              {client.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              ID: {client.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Service Standard Track */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {client.service_type}
                        </span>
                      </td>

                      {/* Stage & Substage */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getStageBadge(client.stage)}
                          {client.stage === 'in_appraisal' && client.pipeline_substage && (
                            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                              Substage: {client.pipeline_substage.replace(/_/g, ' ')}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Lead Owner */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-700 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>{client.owner}</span>
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        <span className={`font-semibold ${daysSinceActivity > 14 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {daysSinceActivity} {daysSinceActivity === 1 ? 'day' : 'days'} ago
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {formatExpiry(client.cert_expiry_date)}
                      </td>

                      {/* Risk Badges */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {renewalAtRisk && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Renewal Risk
                          </span>
                        )}
                        {coldLead && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Flame className="w-3 h-3 mr-1" />
                            Cold Lead
                          </span>
                        )}
                        {stalled && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Stalled
                          </span>
                        )}
                        {!renewalAtRisk && !coldLead && !stalled && (
                          <span className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Healthy</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end space-x-2">
                          <WhatsAppButton client={client} size="icon" />

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEmailClient(client);
                            }}
                            title={`AI Status Email for ${client.name}`}
                            className="p-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-[#0F172A] hover:text-white transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClient(client);
                            }}
                            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors"
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
        <div className="w-8 h-8 border-3 border-[#0F172A] border-t-amber-500 rounded-full animate-spin" />
      </div>
    }>
      <ClientsContent />
    </Suspense>
  );
}
