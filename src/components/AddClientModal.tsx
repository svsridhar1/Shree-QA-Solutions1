'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmStore';
import { ClientStage, PipelineSubstage, ServiceType } from '@/types/crm';
import { X, Plus, Building2, ShieldCheck, User, Calendar, FileText } from 'lucide-react';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_OPTIONS: ServiceType[] = [
  'CMMI DEV',
  'CMMI SVC',
  'CMMI SEC',
  'CMMI PPL',
  'CMMI SPM',
  'PCI DSS',
  'HIPAA',
  'GDPR',
  'SOC',
  'QMS',
  'ISMS',
  'ITSM',
  'AIMS',
  'BCMS',
  'PIMS',
  'Cert-In',
];

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient } = useCRM();

  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('CMMI DEV');
  const [stage, setStage] = useState<ClientStage>('lead');
  const [pipelineSubstage, setPipelineSubstage] = useState<PipelineSubstage>('inquiry');
  const [owner, setOwner] = useState('Rajesh Sharma');
  const [certExpiryDate, setCertExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addClient({
        name: name.trim(),
        service_type: serviceType,
        stage,
        pipeline_substage: stage === 'in_appraisal' ? pipelineSubstage : null,
        owner,
        last_contact_date: new Date().toISOString(),
        cert_expiry_date: certExpiryDate || null,
        notes: notes.trim(),
      });
      onClose();
      // Reset form
      setName('');
      setNotes('');
      setCertExpiryDate('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-xl bg-[#FAF7F2] border border-[#DEC6A6] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          
          {/* Header */}
          <div className="bg-[#1B2A4A] px-6 py-4 text-white relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#E08A3E]" />
                <span>Register New Client Account</span>
              </h3>
              <button onClick={onClose} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Shree QA Solutions • CMMI & ISO Certification Registry
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#1B2A4A] block mb-1">Company / Organization Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hyderabad Cloud Infotech Pvt Ltd"
                className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs text-[#1B2A4A] focus:border-[#B33A2E] focus:ring-1 focus:ring-[#B33A2E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#1B2A4A] block mb-1">Standard / Service *</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value as ServiceType)}
                  className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs text-[#1B2A4A]"
                >
                  {SERVICE_OPTIONS.map((srv) => (
                    <option key={srv} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#1B2A4A] block mb-1">Lifecycle Stage *</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as ClientStage)}
                  className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs text-[#1B2A4A]"
                >
                  <option value="lead">Lead</option>
                  <option value="in_appraisal">In Appraisal</option>
                  <option value="active">Active Certified</option>
                  <option value="renewal_due">Renewal Due</option>
                  <option value="lapsed">Lapsed</option>
                </select>
              </div>
            </div>

            {stage === 'in_appraisal' && (
              <div>
                <label className="font-semibold text-[#1B2A4A] block mb-1">Initial Appraisal Substage</label>
                <select
                  value={pipelineSubstage}
                  onChange={(e) => setPipelineSubstage(e.target.value as PipelineSubstage)}
                  className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs text-[#1B2A4A]"
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-[#1B2A4A] block mb-1">Lead Owner / Appraiser</label>
                <select
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs text-[#1B2A4A]"
                >
                  <option value="Rajesh Sharma">Rajesh Sharma</option>
                  <option value="Venkat Rao">Venkat Rao</option>
                  <option value="Priya Nair">Priya Nair</option>
                  <option value="Ananya Reddy">Ananya Reddy</option>
                  <option value="Suresh Kumar">Suresh Kumar</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#1B2A4A] block mb-1">Cert Expiry Date (if applicable)</label>
                <input
                  type="date"
                  value={certExpiryDate}
                  onChange={(e) => setCertExpiryDate(e.target.value)}
                  className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs text-[#1B2A4A]"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#1B2A4A] block mb-1">Scope & Appraisal Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Scope details, ATM details, project count, branch locations..."
                className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs text-[#1B2A4A]"
              />
            </div>

            <div className="pt-3 border-t border-[#DEC6A6] flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-[#DEC6A6] bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="px-4 py-2 rounded-md bg-[#B33A2E] hover:bg-[#8F281E] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Client Record'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
