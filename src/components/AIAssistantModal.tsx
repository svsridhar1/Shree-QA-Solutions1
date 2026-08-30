'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmStore';
import { Client } from '@/types/crm';
import { ShreeSymbol } from '@/components/BrandLogo';
import { 
  Bot, 
  Sparkles, 
  Search, 
  X, 
  ArrowRight, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Building2,
  Calendar,
  Shuffle,
  Send
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient?: (client: Client) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  matchedClients?: Client[];
  dataMetrics?: { label: string; value: string | number; color?: string }[];
}

const SAMPLE_PROMPTS = [
  'Which clients have certification renewals due in the next 60 days?',
  'Show me all in-appraisal engagements that are currently stalled.',
  'Give me an executive summary of Mahesh Bhaskara\'s CMMI DEV pipeline.',
  'Who are the cold leads with no contact in 14+ days?',
  'List all active ISO 27001 (ISMS) and SOC compliance clients.',
  'What is our total active compliance rate across all 16 standards?'
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectClient,
}) => {
  const { 
    clients, 
    activityLogs, 
    metrics, 
    isRenewalAtRisk, 
    isColdLead, 
    isStalledEngagement,
    getDaysSinceLastActivity 
  } = useCRM();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello Mahesh, I am your Shree QA Appraisal Intelligence Assistant. You can query live CRM data, renewal timelines, stalled milestone diagnostics, lead engagement velocity, or standard compliance matrices in natural language.',
      timestamp: 'Just now',
      dataMetrics: [
        { label: 'Total Clients', value: metrics.totalClients, color: 'text-slate-900' },
        { label: 'Active Certified', value: metrics.activeCount, color: 'text-emerald-600' },
        { label: 'In Appraisal', value: metrics.inAppraisalCount, color: 'text-amber-600' },
        { label: 'Renewals at Risk', value: metrics.renewalsAtRiskCount, color: 'text-rose-600' },
      ]
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const runAIQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: queryText.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const q = queryText.toLowerCase();
      let replyText = '';
      let matches: Client[] = [];
      let extraMetrics: { label: string; value: string | number; color?: string }[] | undefined = undefined;

      if (q.includes('renewal') || q.includes('expir') || q.includes('due') || q.includes('risk')) {
        matches = clients.filter((c) => isRenewalAtRisk(c) || c.stage === 'renewal_due');
        replyText = `Found ${matches.length} organizations in the active renewal cycle or flagged as Renewal at Risk (due within 90 days with idle follow-ups).`;
        extraMetrics = [
          { label: 'Renewals at Risk', value: metrics.renewalsAtRiskCount, color: 'text-rose-600' },
          { label: 'Total Renewal Due', value: metrics.renewalDueCount, color: 'text-amber-600' },
        ];
      } else if (q.includes('stall') || q.includes('block') || q.includes('delay')) {
        matches = clients.filter((c) => isStalledEngagement(c));
        replyText = `Found ${matches.length} in-appraisal engagement(s) currently stalled with no recorded activity for 21+ days. Immediate ATM PIID artifact follow-up is recommended.`;
        extraMetrics = [
          { label: 'Stalled Engagements', value: metrics.stalledEngagementsCount, color: 'text-indigo-600' },
        ];
      } else if (q.includes('cold') || q.includes('lead') || q.includes('inquir')) {
        matches = clients.filter((c) => isColdLead(c) || c.stage === 'lead');
        replyText = `Found ${matches.length} lead inquiry account(s). ${metrics.coldLeadsCount} of them are cold leads with >14 days of inactivity.`;
        extraMetrics = [
          { label: 'Total Leads', value: clients.filter((c) => c.stage === 'lead').length, color: 'text-slate-900' },
          { label: 'Cold Leads (>14d)', value: metrics.coldLeadsCount, color: 'text-amber-600' },
        ];
      } else if (q.includes('cmmi') || q.includes('dev') || q.includes('svc') || q.includes('sec')) {
        matches = clients.filter((c) => c.service_type.startsWith('CMMI'));
        replyText = `Found ${matches.length} client organization(s) under CMMI Domain Appraisals (DEV, SVC, SEC, PPL, SPM) lead-appraised by Mahesh Bhaskara.`;
        extraMetrics = [
          { label: 'CMMI Accounts', value: matches.length, color: 'text-amber-600' },
        ];
      } else if (q.includes('iso') || q.includes('isms') || q.includes('qms') || q.includes('soc') || q.includes('pci')) {
        matches = clients.filter((c) => !c.service_type.startsWith('CMMI'));
        replyText = `Found ${matches.length} client organization(s) enrolled across ISO Standards (ISMS, QMS, ITSM, AIMS, BCMS, PIMS) and Security QSA Frameworks (PCI DSS, HIPAA, GDPR, SOC, Cert-In).`;
        extraMetrics = [
          { label: 'ISO & Security Cohorts', value: matches.length, color: 'text-blue-600' },
        ];
      } else {
        matches = clients.filter((c) => 
          c.name.toLowerCase().includes(q) || 
          c.owner.toLowerCase().includes(q) || 
          c.service_type.toLowerCase().includes(q)
        );
        if (matches.length > 0) {
          replyText = `Found ${matches.length} client match(es) in the Hyderabad master registry matching your query.`;
        } else {
          replyText = `Executive Analysis Summary: We currently maintain ${metrics.totalClients} client organizations in the registry (${metrics.activeCount} active certified, ${metrics.inAppraisalCount} in active appraisal pipeline, ${metrics.renewalDueCount} renewals due).`;
          extraMetrics = [
            { label: 'Master Registry', value: metrics.totalClients, color: 'text-slate-900' },
            { label: 'Active Pipeline', value: metrics.inAppraisalCount, color: 'text-amber-600' },
            { label: 'Total Risk Alerts', value: metrics.renewalsAtRiskCount + metrics.stalledEngagementsCount + metrics.coldLeadsCount, color: 'text-rose-600' },
          ];
        }
      }

      const aiReply: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: 'Just now',
        matchedClients: matches.slice(0, 4),
        dataMetrics: extraMetrics,
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsThinking(false);
    }, 450);
  };

  const handleRandomQuery = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PROMPTS.length);
    runAIQuery(SAMPLE_PROMPTS[randomIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white border-l border-slate-200 shadow-2xl flex flex-col animate-fade-in">
          
          {/* Header */}
          <div className="bg-[#0F172A] p-5 text-white relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-saas-xs flex items-center justify-center">
                  <ShreeSymbol />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white">
                      AI Appraisal Intelligence Assistant
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                      Live CRM Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Natural language queries across clients, CMMI appraisals, risk monitors, and audit history
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            
            {/* Quick suggested prompt chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Suggested Analytical Queries:</span>
                </span>
                <button
                  type="button"
                  onClick={handleRandomQuery}
                  className="text-[11px] font-bold text-amber-600 hover:underline flex items-center space-x-1"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Random Query</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PROMPTS.slice(0, 3).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => runAIQuery(prompt)}
                    className="text-left text-[11px] p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-500 hover:text-[#0F172A] text-slate-700 transition-colors shadow-2xs"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-3 pt-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#0F172A] text-white shadow-saas-xs'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-saas-xs'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex items-center space-x-1.5 text-amber-600 font-bold mb-1.5 text-[11px]">
                        <Bot className="w-3.5 h-3.5" />
                        <span>Shree QA Intelligence</span>
                      </div>
                    )}

                    <p>{msg.text}</p>

                    {/* Render metrics chips if available */}
                    {msg.dataMetrics && (
                      <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        {msg.dataMetrics.map((m, idx) => (
                          <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                            <span className="text-[10px] text-slate-500 block font-medium">{m.label}</span>
                            <span className={`text-sm font-bold ${m.color || 'text-slate-900'}`}>{m.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Render matched client cards */}
                    {msg.matchedClients && msg.matchedClients.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          Matched Engagements ({msg.matchedClients.length}):
                        </span>
                        <div className="space-y-1.5">
                          {msg.matchedClients.map((client) => (
                            <div
                              key={client.id}
                              onClick={() => {
                                onClose();
                                if (onSelectClient) onSelectClient(client);
                              }}
                              className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-amber-500 hover:bg-white cursor-pointer transition-all flex items-center justify-between group"
                            >
                              <div>
                                <div className="font-bold text-slate-900 group-hover:text-amber-600 text-xs">
                                  {client.name}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {client.service_type} • {client.stage.replace(/_/g, ' ')}
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 max-w-xs shadow-saas-xs">
                  <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing CRM database & appraisal logs...</span>
                </div>
              )}
            </div>

          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runAIQuery(inputQuery);
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask any custom query (e.g. Show stalled audits or upcoming expirations)..."
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isThinking}
                className="px-4 py-2.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold shadow-saas-xs disabled:opacity-50 transition-colors flex items-center space-x-1.5"
              >
                <span>Query</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
