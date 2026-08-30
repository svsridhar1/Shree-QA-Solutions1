'use client';

import React, { useState, useRef } from 'react';
import { useCRM } from '@/lib/crmStore';
import { ClientStage, PipelineSubstage, ServiceType, Client } from '@/types/crm';
import * as XLSX from 'xlsx';
import { 
  X, 
  Plus, 
  Building2, 
  ShieldCheck, 
  User, 
  Calendar, 
  FileText, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  Table
} from 'lucide-react';

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

interface ParsedRow {
  name: string;
  service_type: ServiceType;
  stage: ClientStage;
  pipeline_substage: PipelineSubstage | null;
  owner: string;
  cert_expiry_date: string | null;
  notes: string;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient } = useCRM();

  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  // Single form states
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('CMMI DEV');
  const [stage, setStage] = useState<ClientStage>('lead');
  const [pipelineSubstage, setPipelineSubstage] = useState<PipelineSubstage>('inquiry');
  const [owner, setOwner] = useState('Mahesh Bhaskara');
  const [certExpiryDate, setCertExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulk upload states
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkSuccess, setBulkSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmitSingle = async (e: React.FormEvent) => {
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
      // Reset
      setName('');
      setNotes('');
      setCertExpiryDate('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBulkError(null);
    setBulkSuccess(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        let rows: any[] = [];

        if (file.name.endsWith('.json')) {
          const jsonText = data as string;
          rows = JSON.parse(jsonText);
        } else {
          // Parse with XLSX
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          rows = XLSX.utils.sheet_to_json(worksheet);
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          setBulkError('No rows found in uploaded file. Please check file format.');
          return;
        }

        // Validate and normalize rows
        const normalized: ParsedRow[] = rows.map((row) => {
          const companyName = String(row.name || row.Company || row['Company Name'] || row.Name || 'Unnamed Client').trim();
          let srv = String(row.service_type || row.Service || row['Service Type'] || row.Standard || 'CMMI DEV').trim().toUpperCase();
          if (!SERVICE_OPTIONS.includes(srv as ServiceType)) {
            srv = 'CMMI DEV';
          }
          let stg = String(row.stage || row.Stage || 'lead').trim().toLowerCase();
          if (!['lead', 'in_appraisal', 'active', 'renewal_due', 'lapsed'].includes(stg)) {
            stg = 'lead';
          }
          let sub = row.pipeline_substage || row.Substage || row['Pipeline Substage'];
          if (sub) {
            sub = String(sub).trim().toLowerCase().replace(/\s+/g, '_');
          } else if (stg === 'in_appraisal') {
            sub = 'inquiry';
          } else {
            sub = null;
          }

          const own = String(row.owner || row.Owner || row['Lead Appraiser'] || 'Mahesh Bhaskara').trim();
          const exp = row.cert_expiry_date || row['Cert Expiry'] || row.Expiry || null;
          const note = String(row.notes || row.Notes || row.Scope || '').trim();

          return {
            name: companyName,
            service_type: srv as ServiceType,
            stage: stg as ClientStage,
            pipeline_substage: sub as PipelineSubstage | null,
            owner: own,
            cert_expiry_date: exp ? String(exp).trim() : null,
            notes: note,
          };
        });

        setParsedRows(normalized);
      } catch (err: any) {
        setBulkError(`Failed to parse file: ${err.message || 'Invalid format'}`);
      }
    };

    if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleImportBulk = async () => {
    if (parsedRows.length === 0) return;

    setIsSubmitting(true);
    try {
      for (const row of parsedRows) {
        await addClient({
          name: row.name,
          service_type: row.service_type,
          stage: row.stage,
          pipeline_substage: row.stage === 'in_appraisal' ? (row.pipeline_substage || 'inquiry') : null,
          owner: row.owner,
          last_contact_date: new Date().toISOString(),
          cert_expiry_date: row.cert_expiry_date,
          notes: row.notes,
        });
      }

      setBulkSuccess(`Successfully imported ${parsedRows.length} client organizations!`);
      setTimeout(() => {
        onClose();
        setParsedRows([]);
        setBulkSuccess(null);
      }, 1500);
    } catch (err: any) {
      setBulkError(`Import failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Company Name': 'Telangana Cloud Systems Pvt Ltd',
        'Service Type': 'CMMI DEV',
        'Stage': 'in_appraisal',
        'Pipeline Substage': 'docs_collected',
        'Lead Appraiser': 'Mahesh Bhaskara',
        'Cert Expiry': '',
        'Notes': 'CMMI DEV Level 5 appraisal scope across 8 projects.'
      },
      {
        'Company Name': 'Charminar Healthtech Labs',
        'Service Type': 'HIPAA',
        'Stage': 'renewal_due',
        'Pipeline Substage': '',
        'Lead Appraiser': 'Mahesh Bhaskara',
        'Cert Expiry': '2026-10-15',
        'Notes': 'Annual HIPAA compliance audit.'
      },
      {
        'Company Name': 'Cyberabad Cyber Defense',
        'Service Type': 'Cert-In',
        'Stage': 'lead',
        'Pipeline Substage': '',
        'Lead Appraiser': 'Mahesh Bhaskara',
        'Cert Expiry': '',
        'Notes': 'Readiness evaluation for Cert-In empanelment.'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients_Template');
    XLSX.writeFile(workbook, 'Shree_QA_Client_Import_Template.xlsx');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-xl bg-[#FAF7F2] border border-[#DEC6A6] text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          
          {/* Header */}
          <div className="bg-[#1B2A4A] px-6 py-4 text-white relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#E08A3E]" />
                <span>Register Client Organizations</span>
              </h3>
              <button onClick={onClose} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Shree QA Solutions • CMMI Institute Partner & ISO Appraisal Body
            </p>
          </div>

          {/* Navigation Tabs (Single vs Bulk) */}
          <div className="flex border-b border-[#DEC6A6] bg-[#FAF7F2] px-6 pt-3 space-x-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('single')}
              className={`pb-2.5 flex items-center space-x-1.5 border-b-2 transition-all ${
                activeTab === 'single'
                  ? 'border-[#B33A2E] text-[#B33A2E]'
                  : 'border-transparent text-gray-500 hover:text-[#1B2A4A]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Single Client Entry</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bulk')}
              className={`pb-2.5 flex items-center space-x-1.5 border-b-2 transition-all ${
                activeTab === 'bulk'
                  ? 'border-[#B33A2E] text-[#B33A2E]'
                  : 'border-transparent text-gray-500 hover:text-[#1B2A4A]'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Bulk File Upload (Excel, CSV, JSON)</span>
            </button>
          </div>

          {/* TAB 1: Single Form */}
          {activeTab === 'single' ? (
            <form onSubmit={handleSubmitSingle} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#1B2A4A] block mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vantara Technologies Pvt Ltd"
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
                  <label className="font-semibold text-[#1B2A4A] block mb-1">Lead Appraiser</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs text-[#1B2A4A]"
                  >
                    <option value="Mahesh Bhaskara">Mahesh Bhaskara (Certified Lead Appraiser)</option>
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
          ) : (
            /* TAB 2: Bulk Upload Form */
            <div className="p-6 space-y-4 text-xs text-[#1B2A4A]">
              
              {/* Template Download & Upload area */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-[#DEC6A6]">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="w-5 h-5 text-[#2E7D32]" />
                  <div>
                    <span className="font-bold block">Need standard columns format?</span>
                    <span className="text-gray-500 text-[11px]">Download our pre-configured Excel / CSV template</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-[#1B2A4A] text-white hover:bg-[#101B31] font-semibold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>

              {/* Upload Drop Zone */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls, .csv, .json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#DEC6A6] hover:border-[#B33A2E] bg-white hover:bg-[#FFFBF5] rounded-xl p-6 text-center cursor-pointer transition-colors space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-[#EBDDC9]/60 text-[#B33A2E] flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1B2A4A] block">Click to upload or drag & drop</span>
                    <span className="text-gray-500 text-[11px]">Supports Excel (.xlsx, .xls), CSV (.csv), or JSON (.json)</span>
                  </div>
                </div>
              </div>

              {/* Feedback messages */}
              {bulkError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{bulkError}</span>
                </div>
              )}

              {bulkSuccess && (
                <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{bulkSuccess}</span>
                </div>
              )}

              {/* Parsed Rows Preview Table */}
              {parsedRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center space-x-1">
                      <Table className="w-4 h-4 text-[#B33A2E]" />
                      <span>Ready to Import: {parsedRows.length} Client Records</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setParsedRows([])}
                      className="text-gray-500 hover:text-red-600 text-[11px]"
                    >
                      Clear File
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-[#DEC6A6] rounded-lg bg-white">
                    <table className="min-w-full divide-y divide-gray-100 text-[11px]">
                      <thead className="bg-[#FAF7F2] sticky top-0 font-bold text-gray-700">
                        <tr>
                          <th className="px-3 py-2 text-left">Company Name</th>
                          <th className="px-2 py-2 text-left">Service</th>
                          <th className="px-2 py-2 text-left">Stage</th>
                          <th className="px-2 py-2 text-left">Appraiser</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {parsedRows.map((r, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-3 py-1.5 font-semibold text-[#1B2A4A]">{r.name}</td>
                            <td className="px-2 py-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                                {r.service_type}
                              </span>
                            </td>
                            <td className="px-2 py-1.5 capitalize text-gray-600">{r.stage.replace('_', ' ')}</td>
                            <td className="px-2 py-1.5 text-gray-600">{r.owner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#DEC6A6] flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-[#DEC6A6] bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportBulk}
                  disabled={isSubmitting || parsedRows.length === 0}
                  className="px-5 py-2 rounded-md bg-[#B33A2E] hover:bg-[#8F281E] text-white text-xs font-bold shadow-xs disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Importing Clients...' : `Import ${parsedRows.length} Clients`}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
