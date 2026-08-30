'use client';

import React, { useState } from 'react';
import { Client, PipelineSubstage, ClientStage, ServiceType } from '@/types/crm';
import { useCRM } from '@/lib/crmStore';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { AIEmailGeneratorModal } from '@/components/AIEmailGeneratorModal';
import { 
  X, 
  Building2, 
  Calendar, 
  User, 
  Clock, 
  ShieldAlert, 
  PlusCircle, 
  Send, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  AlertTriangle,
  Mail,
  Sparkles,
  Award
} from 'lucide-react';

interface ClientDetailDrawerProps {
  client: Client | null;
  onClose: () => void;
}

export const ClientDetailDrawer: React.FC<ClientDetailDrawerProps> = ({ client, onClose }) => {
  const { 
    getClientLogs, 
    addActivityLog, 
    updateClient, 
    updateClientSubstage, 
    isRenewalAtRisk, 
    isColdLead, 
    isStalledEngagement,
    getDaysSinceLastActivity 
  } = useCRM();

  const [newNote, setNewNote] = useState('');
  const [author, setAuthor] = useState('Mahesh Bhaskara (Certified Lead Appraiser)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  if (!client) return null;

  const logs = getClientLogs(client.id);
  const daysSinceActivity = getDaysSinceLastActivity(client.id);
  const renewalAtRisk = isRenewalAtRisk(client);
  const coldLead = isColdLead(client);
  const stalled = isStalledEngagement(client);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      await addActivityLog(client.id, newNote.trim(), author);
      setNewNote('');
      setFeedbackMsg('Activity logged successfully! Risk status updated.');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStageChange = async (newStage: ClientStage) => {
    await updateClient({
      id: client.id,
      stage: newStage,
      pipeline_substage: newStage === 'in_appraisal' ? (client.pipeline_substage || 'inquiry') : null,
    });
  };

  const handleSubstageChange = async (newSubstage: PipelineSubstage) => {
    await updateClientSubstage(client.id, newSubstage);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not Set';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
          onClick={onClose} 
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-2xl bg-[#FAF7F2] border-l border-[#DEC6A6] shadow-2xl flex flex-col">
            
            {/* Header with Brand Gradient Accent */}
            <div className="relative bg-[#1B2A4A] text-white p-6">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#E08A3E] text-white uppercase tracking-wider">
                      {client.service_type}
                    </span>
                    <span className="text-xs text-amber-200 font-medium capitalize">
                      {client.stage.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-white">
                    {client.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Lead Appraiser: <span className="text-white font-medium">{client.owner}</span> • Last contact: {daysSinceActivity} {daysSinceActivity === 1 ? 'day' : 'days'} ago
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Quick Action Bar in Header (WhatsApp + AI Email) */}
              <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  {/* WhatsApp Button */}
                  <WhatsAppButton client={client} variant="solid" />

                  {/* AI Email Button */}
                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#B33A2E] hover:bg-[#8F281E] text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>AI Status Email</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-300 italic font-serif">
                  Shree QA Solutions • Hyderabad
                </span>
              </div>

              {/* Risk Warnings Banner */}
              {(renewalAtRisk || coldLead || stalled) && (
                <div className="mt-4 p-3 rounded-lg bg-[#B33A2E]/20 border border-[#B33A2E]/50 flex items-center space-x-2.5 text-xs text-amber-100">
                  <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
                  <div>
                    {renewalAtRisk && <span><strong>Renewal at Risk:</strong> Expiration is within 90 days with no contact in 14+ days.</span>}
                    {coldLead && <span><strong>Cold Lead:</strong> Lead inquiry is idle with no contact in 14+ days.</span>}
                    {stalled && <span><strong>Stalled Engagement:</strong> In-appraisal milestone has had no activity for 21+ days.</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Quick Metadata Card */}
              <div className="bg-white rounded-xl border border-[#DEC6A6] p-4 shadow-xs">
                <h3 className="font-serif text-sm font-bold text-[#1B2A4A] border-b border-gray-100 pb-2 mb-3">
                  Appraisal & Engagement Details
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">Current Stage</span>
                    <select
                      value={client.stage}
                      onChange={(e) => handleStageChange(e.target.value as ClientStage)}
                      className="mt-1 block w-full rounded-md border border-[#DEC6A6] bg-[#FAF7F2] px-2.5 py-1.5 text-xs font-semibold text-[#1B2A4A] focus:border-[#B33A2E] focus:ring-1 focus:ring-[#B33A2E]"
                    >
                      <option value="lead">Lead</option>
                      <option value="in_appraisal">In Appraisal</option>
                      <option value="active">Active Certification</option>
                      <option value="renewal_due">Renewal Due</option>
                      <option value="lapsed">Lapsed</option>
                    </select>
                  </div>

                  {client.stage === 'in_appraisal' && (
                    <div>
                      <span className="text-gray-500 block">Appraisal Substage</span>
                      <select
                        value={client.pipeline_substage || 'inquiry'}
                        onChange={(e) => handleSubstageChange(e.target.value as PipelineSubstage)}
                        className="mt-1 block w-full rounded-md border border-[#DEC6A6] bg-[#FAF7F2] px-2.5 py-1.5 text-xs font-semibold text-[#1B2A4A] focus:border-[#B33A2E] focus:ring-1 focus:ring-[#B33A2E]"
                      >
                        <option value="inquiry">1. Inquiry</option>
                        <option value="docs_collected">2. Docs Collected</option>
                        <option value="assessment">3. Assessment</option>
                        <option value="site_visit">4. Site Visit</option>
                        <option value="report">5. Report</option>
                        <option value="signoff">6. Sign-off</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-500 block">Cert Expiry Date</span>
                    <span className="mt-1 block font-semibold text-[#1B2A4A]">
                      {formatDate(client.cert_expiry_date)}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Client Created</span>
                    <span className="mt-1 block font-semibold text-[#1B2A4A]">
                      {formatDate(client.created_at)}
                    </span>
                  </div>
                </div>

                {client.notes && (
                  <div className="mt-4 pt-3 border-t border-gray-100 text-xs">
                    <span className="text-gray-500 font-medium block mb-1">Appraisal Scope & Notes:</span>
                    <p className="text-gray-700 bg-[#FAF7F2] p-2.5 rounded-md border border-[#DEC6A6]/40 leading-relaxed">
                      {client.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Add Activity Log Form */}
              <div className="bg-white rounded-xl border border-[#DEC6A6] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-sm font-bold text-[#1B2A4A] flex items-center space-x-1.5">
                    <PlusCircle className="w-4 h-4 text-[#B33A2E]" />
                    <span>Log New Appraisal Activity / Audit Note</span>
                  </h3>
                  <span className="text-[11px] text-[#B33A2E] font-medium">Real-time sync</span>
                </div>

                {feedbackMsg && (
                  <div className="mb-3 p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{feedbackMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddNote} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Logged By</label>
                      <select
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full rounded-md border border-[#DEC6A6] bg-[#FAF7F2] px-2.5 py-1.5 text-xs text-[#1B2A4A]"
                      >
                        <option value="Mahesh Bhaskara (Certified Lead Appraiser)">Mahesh Bhaskara (Certified Lead Appraiser)</option>
                        <option value="Venkat Rao (CMMI Lead Auditor)">Venkat Rao (CMMI Lead Auditor)</option>
                        <option value="Priya Nair (Client Success)">Priya Nair (Client Success)</option>
                        <option value="Ananya Reddy (BD Manager)">Ananya Reddy (BD Manager)</option>
                        <option value="Suresh Kumar (Appraisal Team)">Suresh Kumar (Appraisal Team)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-600 font-medium block mb-1 text-xs">
                      Activity Note / Audit Observation / Follow-up Details
                    </label>
                    <textarea
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Enter details of meeting, appraisal progress, document verification, or client follow-up..."
                      className="w-full rounded-md border border-[#DEC6A6] bg-[#FAF7F2] p-2.5 text-xs text-[#1B2A4A] focus:bg-white focus:border-[#B33A2E] focus:ring-1 focus:ring-[#B33A2E]"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !newNote.trim()}
                      className="flex items-center space-x-2 px-4 py-2 rounded-md bg-[#B33A2E] hover:bg-[#8F281E] text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Saving Note...' : 'Record Activity Note'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Chronological Activity Log History */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-bold text-[#1B2A4A] flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-[#1B2A4A]" />
                    <span>Activity & Appraisal History ({logs.length})</span>
                  </h3>
                </div>

                {logs.length === 0 ? (
                  <div className="p-6 text-center bg-white rounded-xl border border-dashed border-[#DEC6A6] text-xs text-gray-500">
                    No activity logs recorded yet. Add the first note above.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DEC6A6]">
                    {logs.map((log) => (
                      <div key={log.id} className="relative bg-white p-4 rounded-xl border border-[#DEC6A6] shadow-xs">
                        {/* Timeline dot */}
                        <div className="absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full bg-[#E08A3E] border-2 border-white shadow-xs" />

                        <div className="flex items-center justify-between text-[11px] mb-1.5">
                          <span className="font-semibold text-[#1B2A4A]">{log.logged_by}</span>
                          <span className="text-gray-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(log.timestamp)}</span>
                          </span>
                        </div>

                        <p className="text-xs text-gray-800 leading-relaxed">
                          {log.note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#DEC6A6] bg-[#FAF7F2] flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                Lead Appraiser: Mahesh Bhaskara • Kukatpally, Hyd
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-[#1B2A4A] text-white text-xs font-semibold hover:bg-[#101B31] transition-colors"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* AI Email Generator Modal */}
      <AIEmailGeneratorModal
        client={client}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </>
  );
};
