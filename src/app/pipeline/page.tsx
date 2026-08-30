'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { useCRM } from '@/lib/crmStore';
import { Client, PipelineSubstage } from '@/types/crm';
import { ClientDetailDrawer } from '@/components/ClientDetailDrawer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AIEmailGeneratorModal } from '@/components/AIEmailGeneratorModal';
import { 
  Kanban, 
  Clock, 
  AlertTriangle, 
  User, 
  GripVertical, 
  CheckCircle2, 
  FileText, 
  ShieldCheck,
  Plus,
  Mail,
  Sparkles
} from 'lucide-react';

interface ColumnDef {
  id: PipelineSubstage;
  title: string;
  stepNumber: number;
  description: string;
}

const PIPELINE_COLUMNS: ColumnDef[] = [
  {
    id: 'inquiry',
    title: 'Inquiry',
    stepNumber: 1,
    description: 'Scope definition & ATM planning',
  },
  {
    id: 'docs_collected',
    title: 'Docs Collected',
    stepNumber: 2,
    description: 'PAL review & project sampling',
  },
  {
    id: 'assessment',
    title: 'Assessment',
    stepNumber: 3,
    description: 'Stage 1 readiness & gap analysis',
  },
  {
    id: 'site_visit',
    title: 'Site Visit',
    stepNumber: 4,
    description: 'On-site appraisal & ATM interviews',
  },
  {
    id: 'report',
    title: 'Report',
    stepNumber: 5,
    description: 'PIID findings & evidence compilation',
  },
  {
    id: 'signoff',
    title: 'Sign-off',
    stepNumber: 6,
    description: 'Final rating & credentialing publication',
  },
];

export default function PipelinePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { 
    clients, 
    updateClientSubstage, 
    isStalledEngagement, 
    getDaysSinceLastActivity, 
    isLoading: crmLoading 
  } = useCRM();

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [emailClient, setEmailClient] = useState<Client | null>(null);
  const [draggedClientId, setDraggedClientId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<PipelineSubstage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Clients in appraisal stage
  const appraisalClients = clients.filter((c) => c.stage === 'in_appraisal');

  // Drag handlers using HTML5 Drag and Drop
  const handleDragStart = (e: React.DragEvent, clientId: string) => {
    e.dataTransfer.setData('text/plain', clientId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedClientId(clientId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: PipelineSubstage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetSubstage: PipelineSubstage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const clientId = e.dataTransfer.getData('text/plain') || draggedClientId;
    setDraggedClientId(null);

    if (!clientId) return;

    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    if (client.pipeline_substage === targetSubstage) return;

    try {
      await updateClientSubstage(clientId, targetSubstage);
      const col = PIPELINE_COLUMNS.find((c) => c.id === targetSubstage);
      setToastMessage(`Moved "${client.name}" to ${col?.title || targetSubstage} milestone`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Failed to update pipeline stage:', err);
    }
  };

  if (authLoading || crmLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-9 h-9 border-3 border-[#0F172A] border-t-amber-500 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-700">Loading Appraisal Pipeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-1">
            <span>LEAD APPRAISER: MAHESH BHASKARA</span>
            <span>•</span>
            <span className="text-amber-600 font-bold">CMMI & ISO BENCHMARK AUDITS</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            In-Appraisal Kanban Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active appraisal cohorts moving from initial inquiry through documentation, readiness assessment, on-site appraisals, and final ratings sign-off.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold px-3 py-1.5 bg-[#0F172A] text-white rounded-lg shadow-saas-xs">
            {appraisalClients.length} Active Appraisals
          </span>
        </div>
      </div>

      {/* Real-time Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-saas-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700">Persisted to CRM Activity Timeline</span>
        </div>
      )}

      {/* 6 Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {PIPELINE_COLUMNS.map((column) => {
          const columnClients = appraisalClients.filter(
            (c) => (c.pipeline_substage || 'inquiry') === column.id
          );
          const isOver = dragOverColumn === column.id;

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              className={`flex flex-col rounded-xl border transition-all min-h-[580px] bg-slate-50/60 ${
                isOver 
                  ? 'border-amber-500 bg-amber-50/40 shadow-saas-md ring-2 ring-amber-500/20' 
                  : 'border-slate-200 shadow-saas-xs'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200 bg-white rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-md bg-[#0F172A] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {column.stepNumber}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900">
                      {column.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700">
                    {columnClients.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                  {column.description}
                </p>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[700px]">
                {columnClients.length === 0 ? (
                  <div className={`p-4 rounded-lg border border-dashed text-center text-[11px] text-slate-400 ${isOver ? 'border-amber-500 text-amber-600 bg-amber-50/50' : 'border-slate-200'}`}>
                    {isOver ? 'Drop client here' : 'No clients in this stage'}
                  </div>
                ) : (
                  columnClients.map((client) => {
                    const daysSinceActivity = getDaysSinceLastActivity(client.id);
                    const isStalled = isStalledEngagement(client);
                    const isDragging = draggedClientId === client.id;

                    return (
                      <div
                        key={client.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, client.id)}
                        onClick={() => setSelectedClient(client)}
                        className={`p-3 rounded-xl border bg-white shadow-saas-xs hover:shadow-saas-md cursor-grab active:cursor-grabbing transition-all ${
                          isDragging ? 'opacity-40 scale-95 border-dashed border-amber-500' : 'border-slate-200 hover:border-slate-400'
                        } ${isStalled ? 'ring-1 ring-rose-400 bg-rose-50/20' : ''}`}
                      >
                        {/* Top tag & Grip */}
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                            {client.service_type}
                          </span>
                          <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        </div>

                        {/* Client Name */}
                        <h4 className="font-bold text-xs text-slate-900 hover:text-amber-600 transition-colors line-clamp-2">
                          {client.name}
                        </h4>

                        {/* Stalled Alert Pill */}
                        {isStalled && (
                          <div className="mt-2 p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-semibold flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>Stalled ({daysSinceActivity}d idle)</span>
                          </div>
                        )}

                        {/* Card Actions & Footer */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <span className="flex items-center space-x-1 truncate max-w-[70px]">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{client.owner}</span>
                          </span>

                          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                            <WhatsAppButton client={client} size="icon" />
                            <button
                              type="button"
                              onClick={() => setEmailClient(client)}
                              title="AI Status Email"
                              className="p-1 rounded-md bg-slate-100 text-slate-700 hover:bg-[#0F172A] hover:text-white transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Column Footer */}
              <div className="p-2 border-t border-slate-200/60 text-center bg-slate-50 rounded-b-xl">
                <span className="text-[10px] text-slate-400 font-medium">
                  Step {column.stepNumber} of 6
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Client Detail Drawer */}
      <ClientDetailDrawer
        client={selectedClient}
        onClose={() => setSelectedClient(null)}
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
