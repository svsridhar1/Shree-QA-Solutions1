'use client';

import React, { useState, useEffect } from 'react';
import { Client } from '@/types/crm';
import { useCRM } from '@/lib/crmStore';
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  X, 
  FileText, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  ExternalLink
} from 'lucide-react';

interface AIEmailGeneratorModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

type TemplateType = 'renewal_reminder' | 'initial_proposal' | 'appraisal_milestone' | 'surveillance_audit' | 'win_back';

export const AIEmailGeneratorModal: React.FC<AIEmailGeneratorModalProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  const { addActivityLog } = useCRM();

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('renewal_reminder');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLogged, setIsLogged] = useState(false);

  // Set default template matching client stage
  useEffect(() => {
    if (!client) return;

    let initialTemplate: TemplateType = 'renewal_reminder';
    if (client.stage === 'renewal_due') initialTemplate = 'renewal_reminder';
    else if (client.stage === 'lead') initialTemplate = 'initial_proposal';
    else if (client.stage === 'in_appraisal') initialTemplate = 'appraisal_milestone';
    else if (client.stage === 'active') initialTemplate = 'surveillance_audit';
    else if (client.stage === 'lapsed') initialTemplate = 'win_back';

    setSelectedTemplate(initialTemplate);
    generateEmailContent(client, initialTemplate);
    setIsLogged(false);
    setCopied(false);
  }, [client]);

  if (!isOpen || !client) return null;

  const generateEmailContent = (targetClient: Client, template: TemplateType) => {
    const appraiser = 'Mahesh Bhaskara';
    const appraiserTitle = 'Certified Lead Appraiser (CMMI DEV, SVC, SEC, SPM, PPL Domains)';
    const company = targetClient.name;
    const service = targetClient.service_type;
    const expiry = targetClient.cert_expiry_date || '[Expiry Date]';
    const substage = targetClient.pipeline_substage ? targetClient.pipeline_substage.replace('_', ' ').toUpperCase() : 'ASSESSMENT';

    let genSubject = '';
    let genBody = '';

    switch (template) {
      case 'renewal_reminder':
        genSubject = `URGENT: ${service} Certification Recertification Cycle - ${company}`;
        genBody = `Dear Management & Compliance Team at ${company},

Greetings from Shree QA Solutions.

This is a formal communication from Mahesh Bhaskara regarding your organization's ${service} certification, which is scheduled for expiration on ${expiry}.

To maintain seamless compliance continuity with your global enterprise clients and avoid certificate lapse, we recommend scheduling your Stage 1 / Recertification Appraisal Audit at your earliest convenience.

Next Steps:
1. Review and confirm the attached Appraisal Scope Document.
2. Appoint your internal Appraisal Team Members (ATMs).
3. Schedule the 3-day on-site appraisal window for next month.

Please let us know your team's availability for a kickoff alignment call this week.

Warm regards,

${appraiser}
${appraiserTitle}
SHREE QA Solutions
503, Sharada Nilayam, Jaya Nagar, Road No: 4, Kukatpally, Hyd - 72
Phone: +91 9177020007 | Email: maheshbhaskara@shreeqasolutions.com
Web: www.shreeqasolutions.com`;
        break;

      case 'initial_proposal':
        genSubject = `Proposal & Readiness Roadmap for ${service} Certification Appraisal - ${company}`;
        genBody = `Dear ${company} Leadership Team,

Thank you for your interest in partnering with Shree QA Solutions for your ${service} Lead Appraisal engagement.

As an authorized CMMI Institute Partner and accredited ISO/IEC appraisal body based in Kukatpally, Hyderabad, we specialize in end-to-end benchmark appraisals, maturity gap assessments, and credentialing.

Proposed Appraisal Scope:
• Practice Areas & Process Asset Library (PAL) Review
• Project Sampling & Evidence Mapping (PIIDs)
• ATM Training & On-Site Appraisal Interviews
• Formal Appraisal Findings & Final Rating Publication

Attached is our detailed commercial proposal and process readiness questionnaire. We look forward to scheduling an exploratory scoping session.

Best regards,

${appraiser}
${appraiserTitle}
SHREE QA Solutions
Kukatpally, Hyderabad - 500072
Phone: +91 9177020007 | Web: www.shreeqasolutions.com`;
        break;

      case 'appraisal_milestone':
        genSubject = `Appraisal Milestone Update [${substage} Phase] - ${company} (${service})`;
        genBody = `Dear Project Delivery & QA Team at ${company},

We are writing to share the latest progress on your ${service} benchmark appraisal currently in the ${substage} milestone.

Current Appraisal Status:
• Process asset documentation submitted: In Review
• Evidence validation status: Active
• Scheduled Appraisal Activities: On-Site Interviews & Verification

Action Required from Client:
Please ensure all project managers upload their respective Practice Implementation Indicator Documents (PIIDs) and metric baselines to the shared appraisal repository before end of week.

Should you require any guidance regarding artifact preparation, please do not hesitate to contact our appraisal team.

Sincerely,

${appraiser}
Lead Appraiser | SHREE QA Solutions
Mobile: +91 9177020007`;
        break;

      case 'surveillance_audit':
        genSubject = `Annual Surveillance Audit Schedule & Compliance Checklist - ${company} (${service})`;
        genBody = `Dear Quality & Governance Team at ${company},

As part of maintaining your active ${service} certification credentials, we are preparing for your annual surveillance review cycle.

Surveillance Audit Highlights:
• Review of Quality Management System (QMS) / Security performance metrics
• Verification of corrective actions and continuous improvement initiatives
• Sampling of newly initiated client delivery engagements

Kindly confirm your preferred dates in the upcoming quarter for conducting this 2-day surveillance audit.

Best regards,

${appraiser}
${appraiserTitle}
SHREE QA Solutions
Kukatpally, Hyderabad`;
        break;

      case 'win_back':
        genSubject = `Special Re-engagement & Fast-Track Re-Appraisal for ${company} (${service})`;
        genBody = `Dear Leadership Team at ${company},

We noted that your organization's ${service} certification recently lapsed. Having worked together on establishing high-maturity process benchmarks, we would like to extend an expedited re-appraisal fast-track framework.

Our streamlined re-certification package includes:
• Fast-track gap remediation analysis
• Waiver of preliminary documentation setup fees
• Priority scheduling with Lead Appraiser Mahesh Bhaskara

We would value the opportunity to welcome ${company} back into our active certification registry.

Warm regards,

${appraiser}
SHREE QA Solutions
Phone: +91 9177020007 | Email: maheshbhaskara@shreeqasolutions.com`;
        break;
    }

    setSubject(genSubject);
    setBody(genBody);
  };

  const handleTemplateChange = (t: TemplateType) => {
    setSelectedTemplate(t);
    generateEmailContent(client, t);
    setIsLogged(false);
  };

  const handleCopy = () => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleMailto = () => {
    const emailTo = `${client.owner.toLowerCase().replace(/\s+/g, '.')}@${client.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  const handleLogAsActivity = async () => {
    await addActivityLog(
      client.id,
      `[AI Email Sent] Template: "${selectedTemplate.replace('_', ' ').toUpperCase()}". Subject: "${subject}"`,
      'Mahesh Bhaskara (Lead Appraiser)'
    );
    setIsLogged(true);
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
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-[#B33A2E] text-white">
                  <Mail className="w-5 h-5 text-[#E08A3E]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center space-x-2">
                    <span>AI Appraisal Email Generator</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </h3>
                  <p className="text-xs text-slate-300">
                    Auto-generated for <strong className="text-white">{client.name}</strong> ({client.service_type} • {client.stage.replace('_', ' ')})
                  </p>
                </div>
              </div>

              <button onClick={onClose} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 text-xs text-[#1B2A4A]">
            
            {/* Template Selector Pills */}
            <div>
              <label className="font-bold text-gray-700 block mb-1.5 flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-[#B33A2E]" />
                <span>Select Email Purpose / Customer Status Template:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleTemplateChange('renewal_reminder')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    selectedTemplate === 'renewal_reminder'
                      ? 'bg-[#B33A2E] text-white shadow-xs'
                      : 'bg-white border border-[#DEC6A6] text-[#1B2A4A] hover:bg-[#FAF7F2]'
                  }`}
                >
                  🔄 Renewal Reminder
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateChange('initial_proposal')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    selectedTemplate === 'initial_proposal'
                      ? 'bg-[#1B2A4A] text-white shadow-xs'
                      : 'bg-white border border-[#DEC6A6] text-[#1B2A4A] hover:bg-[#FAF7F2]'
                  }`}
                >
                  📄 Commercial Proposal
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateChange('appraisal_milestone')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    selectedTemplate === 'appraisal_milestone'
                      ? 'bg-[#E08A3E] text-white shadow-xs'
                      : 'bg-white border border-[#DEC6A6] text-[#1B2A4A] hover:bg-[#FAF7F2]'
                  }`}
                >
                  🚀 Milestone & PIID Request
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateChange('surveillance_audit')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    selectedTemplate === 'surveillance_audit'
                      ? 'bg-[#00838F] text-white shadow-xs'
                      : 'bg-white border border-[#DEC6A6] text-[#1B2A4A] hover:bg-[#FAF7F2]'
                  }`}
                >
                  🛡️ Annual Surveillance
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateChange('win_back')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    selectedTemplate === 'win_back'
                      ? 'bg-[#5D4037] text-white shadow-xs'
                      : 'bg-white border border-[#DEC6A6] text-[#1B2A4A] hover:bg-[#FAF7F2]'
                  }`}
                >
                  🤝 Win-Back Campaign
                </button>
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-md border border-[#DEC6A6] bg-white p-2 text-xs font-semibold text-[#1B2A4A] focus:border-[#B33A2E] focus:ring-1 focus:ring-[#B33A2E]"
              />
            </div>

            {/* Body Textarea */}
            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Message Body</label>
              <textarea
                rows={9}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full rounded-md border border-[#DEC6A6] bg-white p-3 text-xs text-[#1B2A4A] font-mono leading-relaxed focus:border-[#B33A2E] focus:ring-1 focus:ring-[#B33A2E]"
              />
            </div>

            {/* Notification alert if logged */}
            {isLogged && (
              <div className="p-2.5 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Logged in CRM Activity Timeline! Client's last contact timestamp has been refreshed.</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-3 border-t border-[#DEC6A6] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleLogAsActivity}
                disabled={isLogged}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md border border-[#DEC6A6] bg-white hover:bg-gray-50 text-xs font-semibold text-[#1B2A4A] disabled:opacity-50"
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${isLogged ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span>{isLogged ? 'Activity Logged' : 'Log Email in Activity Timeline'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-md border border-[#DEC6A6] bg-white hover:bg-[#FAF7F2] text-xs font-semibold text-[#1B2A4A] transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleMailto}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-md bg-[#B33A2E] hover:bg-[#8F281E] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Launch in Mail App</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
