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
  ArrowRight,
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
  color: string;
}

const PIPELINE_COLUMNS: ColumnDef[] = [
  {
    id: 'inquiry',
    title: 'Inquiry',
    stepNumber: 1,
    description: 'Scope definition & initial ATM planning',
    color: '#E08A3E',
  },
  {
    id: 'docs_collected',
    title: 'Docs Collected',
    stepNumber: 2,
    description: 'Process asset library & project artifacts',
    color: '#D97706',
  },
  {
    id: 'assessment',
    title: 'Assessment',
    stepNumber: 3,
    description: 'Stage 1 readiness & gap analysis',
    color: '#1B2A4A',
  },
  {
    id: 'site_visit',
    title: 'Site Visit',
    stepNumber: 4,
    description: 'On-site lead appraisal & interviews',
    color: '#2C3E6B',
  },
  {
    id: 'report',
    title: 'Report',
    stepNumber: 5,
    description: 'Compilation of findings & PIIDs',
    color: '#8F281E',
  },
  {
    id: 'signoff',
    title: 'Sign-off',
    stepNumber: 6,
    description: 'Final rating & CMMI/ISO credentialing',
    color: '#B33A2E',
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
      setToastMessage(`Moved "${client.name}" to ${col?.title || targetSubstage} stage`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Failed to update pipeline stage:', err);
    }
  };

  if (authLoading || crmLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#B33A2E] border-t-transparent rounded-full animate-spin" />
          <span className="font-serif text-sm font-semibold text-[#1B2A4A]">Loading Appraisal Pipeline...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#FAF7F2] rounded-xl border border-[#DEC6A6] p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBDDC9] text-[#1B2A4A] border border-[#DEC6A6]">
                CMMI & ISO Lead Appraisal Flow
              </span>
              <span className="text-xs text-gray-500">• Lead Appraiser: Mahesh Bhaskara</span>
            </div>
            <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-extrabold text-[#1B2A4A] tracking-tight">
              In-Appraisal Kanban Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">
              Active appraisal cohorts moving from initial inquiry through documentation, readiness assessment, on-site appraisals, and final ratings sign-off.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold px-3 py-1.5 bg-[#1B2A4A] text-white rounded-lg shadow-xs">
              {appraisalClients.length} Active Appraisals
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700">Saved to database & activity timeline</span>
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
              className={`flex flex-col rounded-xl border-2 transition-all min-h-[550px] bg-[#FAF7F2] ${
                isOver 
                  ? 'border-[#B33A2E] bg-[#FFF8F6] shadow-md ring-2 ring-[#B33A2E]/20' 
                  : 'border-[#DEC6A6] shadow-xs'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-[#DEC6A6]/80 bg-[#FAF7F2] rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span 
                      className="w-5 h-5 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: column.color }}
                    >
                      {column.stepNumber}
                    </span>
                    <h3 className="font-serif text-xs font-bold text-[#1B2A4A] tracking-tight">
                      {column.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white border border-[#DEC6A6] text-[#1B2A4A]">
                    {columnClients.length}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 leading-tight">
                  {column.description}
                </p>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[700px]">
                {columnClients.length === 0 ? (
                  <div className={`p-4 rounded-lg border border-dashed text-center text-[11px] text-gray-400 ${isOver ? 'border-[#B33A2E] text-[#B33A2E]' : 'border-[#DEC6A6]'}`}>
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
                        className={`p-3 rounded-lg border bg-white shadow-xs hover:shadow-md cursor-grab active:cursor-grabbing transition-all ${
                          isDragging ? 'opacity-40 scale-95 border-dashed border-[#B33A2E]' : 'border-[#DEC6A6] hover:border-[#1B2A4A]'
                        } ${isStalled ? 'ring-1 ring-rose-400 bg-rose-50/20' : ''}`}
                      >
                        {/* Top tag & Grip */}
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBDDC9]/70 text-[#1B2A4A] border border-[#DEC6A6]/60">
                            {client.service_type}
                          </span>
                          <GripVertical className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        </div>

                        {/* Client Name */}
                        <h4 className="font-bold text-xs text-[#1B2A4A] hover:text-[#B33A2E] transition-colors line-clamp-2">
                          {client.name}
                        </h4>

                        {/* Stalled Alert Pill */}
                        {isStalled && (
                          <div className="mt-2 p-1.5 rounded bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-semibold flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-rose-600 shrink-0" />
                            <span>Stalled ({daysSinceActivity}d no activity)</span>
                          </div>
                        )}

                        {/* Card Actions & Footer */}
                        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                          <span className="flex items-center space-x-1 truncate max-w-[70px]">
                            <User className="w-3 h-3 text-gray-400 shrink-0" />
                            <span className="truncate">{client.owner}</span>
                          </span>

                          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                            <WhatsAppButton client={client} size="icon" />
                            <button
                              type="button"
                              onClick={() => setEmailClient(client)}
                              title="AI Status Email"
                              className="p-1.5 rounded bg-[#B33A2E]/10 text-[#B33A2E] hover:bg-[#B33A2E] hover:text-white transition-colors"
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
              <div className="p-2 border-t border-[#DEC6A6]/40 text-center">
                <span className="text-[10px] text-gray-400">
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
