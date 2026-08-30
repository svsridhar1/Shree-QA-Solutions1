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
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          rows = XLSX.utils.sheet_to_json(worksheet);
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          setBulkError('No rows found in uploaded file. Please check format.');
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
      }, 1400);
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-2xl bg-white border border-slate-200 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl animate-fade-in">
          
          {/* Header */}
          <div className="bg-[#0F172A] px-6 py-5 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shadow-xs">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Register Client Organizations
                  </h3>
                  <p className="text-xs text-slate-400">
                    SHREE QA Solutions • CMMI Partner & Lead Appraisal Body
                  </p>
                </div>
              </div>

              <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 pt-3 space-x-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('single')}
              className={`pb-3 flex items-center space-x-1.5 border-b-2 transition-all ${
                activeTab === 'single'
                  ? 'border-amber-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Single Entry</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bulk')}
              className={`pb-3 flex items-center space-x-1.5 border-b-2 transition-all ${
                activeTab === 'bulk'
                  ? 'border-amber-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Bulk File Upload (Excel, CSV, JSON)</span>
            </button>
          </div>

          {/* TAB 1: Single Form */}
          {activeTab === 'single' ? (
            <form onSubmit={handleSubmitSingle} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vantara Technologies Pvt Ltd"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Standard / Track *</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ServiceType)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-medium"
                  >
                    {SERVICE_OPTIONS.map((srv) => (
                      <option key={srv} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Lifecycle Stage *</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as ClientStage)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-medium"
                  >
                    <option value="lead">Lead Inquiry</option>
                    <option value="in_appraisal">In Appraisal</option>
                    <option value="active">Active Certified</option>
                    <option value="renewal_due">Renewal Due</option>
                    <option value="lapsed">Lapsed</option>
                  </select>
                </div>
              </div>

              {stage === 'in_appraisal' && (
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Initial Appraisal Substage</label>
                  <select
                    value={pipelineSubstage}
                    onChange={(e) => setPipelineSubstage(e.target.value as PipelineSubstage)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-medium"
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
                  <label className="font-semibold text-slate-800 block mb-1">Lead Appraiser</label>
                  <select
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-medium"
                  >
                    <option value="Mahesh Bhaskara">Mahesh Bhaskara (Certified Lead Appraiser)</option>
                    <option value="Venkat Rao">Venkat Rao</option>
                    <option value="Priya Nair">Priya Nair</option>
                    <option value="Ananya Reddy">Ananya Reddy</option>
                    <option value="Suresh Kumar">Suresh Kumar</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Cert Expiry Date (if applicable)</label>
                  <input
                    type="date"
                    value={certExpiryDate}
                    onChange={(e) => setCertExpiryDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Scope & Appraisal Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Scope details, ATM details, project count, branch locations..."
                  className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-saas-xs disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Creating...' : 'Register Client Record'}
                </button>
              </div>
            </form>
          ) : (
            /* TAB 2: Bulk Upload Form */
            <div className="p-6 space-y-4 text-xs text-slate-900">
              
              {/* Template Download card */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center space-x-2.5">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Download Template</span>
                    <span className="text-slate-500 text-[11px]">Pre-formatted Excel / CSV template with sample data</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] text-white hover:bg-slate-800 font-semibold text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xlsx</span>
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
                  className="border-2 border-dashed border-slate-200 hover:border-amber-500 bg-slate-50/50 hover:bg-amber-50/20 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Click to upload spreadsheet file</span>
                    <span className="text-slate-500 text-[11px]">Supports Excel (.xlsx, .xls), CSV (.csv), or JSON (.json)</span>
                  </div>
                </div>
              </div>

              {/* Feedback messages */}
              {bulkError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{bulkError}</span>
                </div>
              )}

              {bulkSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{bulkSuccess}</span>
                </div>
              )}

              {/* Parsed Rows Preview */}
              {parsedRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 flex items-center space-x-1.5">
                      <Table className="w-4 h-4 text-amber-600" />
                      <span>Ready to Import ({parsedRows.length} records)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setParsedRows([])}
                      className="text-slate-400 hover:text-rose-600 text-[11px]"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-white">
                    <table className="min-w-full divide-y divide-slate-100 text-[11px]">
                      <thead className="bg-slate-50 sticky top-0 font-bold text-slate-700">
                        <tr>
                          <th className="px-3 py-2 text-left">Company Name</th>
                          <th className="px-2 py-2 text-left">Standard</th>
                          <th className="px-2 py-2 text-left">Stage</th>
                          <th className="px-2 py-2 text-left">Appraiser</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedRows.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-3 py-1.5 font-semibold text-slate-900">{r.name}</td>
                            <td className="px-2 py-1.5">
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold text-[10px]">
                                {r.service_type}
                              </span>
                            </td>
                            <td className="px-2 py-1.5 capitalize text-slate-600">{r.stage.replace(/_/g, ' ')}</td>
                            <td className="px-2 py-1.5 text-slate-600">{r.owner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImportBulk}
                  disabled={isSubmitting || parsedRows.length === 0}
                  className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-saas-xs disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Importing...' : `Import ${parsedRows.length} Records`}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
