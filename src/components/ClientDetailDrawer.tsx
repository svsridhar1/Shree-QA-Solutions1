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

  const logs = client?.id ? (getClientLogs(client.id) || []) : [];
  const daysSinceActivity = client?.id ? getDaysSinceLastActivity(client.id) : 0;
  const renewalAtRisk = client ? isRenewalAtRisk(client) : false;
  const coldLead = client ? isColdLead(client) : false;
  const stalled = client ? isStalledEngagement(client) : false;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !client?.id) return;

    setIsSubmitting(true);
    try {
      await addActivityLog(client.id, newNote.trim(), author);
      setNewNote('');
      setFeedbackMsg('Activity recorded in chronological appraisal timeline!');
      setTimeout(() => setFeedbackMsg(null), 3500);
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStageChange = async (newStage: ClientStage) => {
    if (!client?.id) return;
    await updateClient({
      id: client.id,
      stage: newStage,
      pipeline_substage: newStage === 'in_appraisal' ? (client.pipeline_substage || 'inquiry') : null,
    });
  };

  const handleSubstageChange = async (newSubstage: PipelineSubstage) => {
    if (!client?.id) return;
    await updateClientSubstage(client.id, newSubstage);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Not Set';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return String(dateStr);
    }
  };

  const formatDateTime = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return String(dateStr);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Modern Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
          onClick={onClose} 
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-2xl bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-fade-in">
            
            {/* Header */}
            <div className="relative bg-[#0F172A] text-white p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                      {client.service_type || 'CMMI / ISO'}
                    </span>
                    <span className="text-xs text-slate-300 font-medium capitalize">
                      {String(client.stage || '').replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {client.name || 'Client Record'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Lead Appraiser: <span className="text-white font-medium">{client.owner || 'Mahesh Bhaskara'}</span> • Last contact: {daysSinceActivity} {daysSinceActivity === 1 ? 'day' : 'days'} ago
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <WhatsAppButton client={client} variant="solid" />

                  <button
                    type="button"
                    onClick={() => setIsEmailModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-saas-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Status Email</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400">
                  SHREE QA Solutions • Kukatpally, Hyd
                </span>
              </div>

              {/* Risk Warnings Banner */}
              {(renewalAtRisk || coldLead || stalled) && (
                <div className="mt-4 p-3 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center space-x-2.5 text-xs text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
                  <div>
                    {renewalAtRisk && <span><strong>Renewal at Risk:</strong> Expiration is within 90 days with no contact in 14+ days.</span>}
                    {coldLead && <span><strong>Cold Lead:</strong> Lead inquiry is idle with no contact in 14+ days.</span>}
                    {stalled && <span><strong>Stalled Engagement:</strong> In-appraisal milestone has had no activity for 21+ days.</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              
              {/* Engagement Details Card */}
              <div className="saas-card p-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 mb-3 border-b border-slate-100">
                  Appraisal & Lifecycle Controls
                </h3>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block mb-1">Lifecycle Stage</span>
                    <select
                      value={client.stage || 'lead'}
                      onChange={(e) => handleStageChange(e.target.value as ClientStage)}
                      className="block w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="active">Active Certified</option>
                      <option value="in_appraisal">In Appraisal</option>
                      <option value="renewal_due">Renewal Due</option>
                      <option value="lead">Lead Inquiry</option>
                      <option value="lapsed">Lapsed</option>
                    </select>
                  </div>

                  {client.stage === 'in_appraisal' && (
                    <div>
                      <span className="text-slate-500 font-medium block mb-1">Pipeline Milestone</span>
                      <select
                        value={client.pipeline_substage || 'inquiry'}
                        onChange={(e) => handleSubstageChange(e.target.value as PipelineSubstage)}
                        className="block w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
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
                    <span className="text-slate-500 font-medium block">Cert Expiry Date</span>
                    <span className="mt-1 block font-semibold text-slate-900">
                      {formatDate(client.cert_expiry_date)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 font-medium block">Registration Date</span>
                    <span className="mt-1 block font-semibold text-slate-900">
                      {formatDate(client.created_at)}
                    </span>
                  </div>
                </div>

                {client.notes && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium block mb-1">Scope & Appraisal Notes:</span>
                    <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                      {client.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Add Activity Log Form */}
              <div className="saas-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Log New Appraisal Activity / Audit Note</span>
                  </h3>
                  <span className="text-[10px] text-emerald-600 font-semibold">Real-time sync</span>
                </div>

                {feedbackMsg && (
                  <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{feedbackMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddNote} className="space-y-3">
                  <div>
                    <label className="text-slate-600 font-medium block mb-1 text-xs">Logged By</label>
                    <select
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900"
                    >
                      <option value="Mahesh Bhaskara (Certified Lead Appraiser)">Mahesh Bhaskara (Certified Lead Appraiser)</option>
                      <option value="Venkat Rao (CMMI Lead Auditor)">Venkat Rao (CMMI Lead Auditor)</option>
                      <option value="Priya Nair (Client Success)">Priya Nair (Client Success)</option>
                      <option value="Ananya Reddy (BD Manager)">Ananya Reddy (BD Manager)</option>
                      <option value="Suresh Kumar (Appraisal Team)">Suresh Kumar (Appraisal Team)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 font-medium block mb-1 text-xs">
                      Activity Observation / Audit Note
                    </label>
                    <textarea
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Enter details of ATM meeting, evidence validation, PAL review, or client interaction..."
                      className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !newNote.trim()}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold shadow-saas-xs disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Saving...' : 'Record Activity'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Activity History Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Activity & Appraisal History ({logs.length})</span>
                </h3>

                {logs.length === 0 ? (
                  <div className="p-6 text-center saas-card border-dashed text-xs text-slate-400">
                    No activity logs recorded yet. Add the first note above.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {logs.map((log) => (
                      <div key={log.id} className="relative saas-card p-4">
                        <div className="absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow-saas-xs" />

                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-slate-900">{log.logged_by}</span>
                          <span className="text-slate-400 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(log.timestamp)}</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed">
                          {log.note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Lead Appraiser: Mahesh Bhaskara • Kukatpally, Hyd
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* AI Email Generator Modal */}
      {isEmailModalOpen && (
        <AIEmailGeneratorModal
          client={client}
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}
    </>
  );
};
