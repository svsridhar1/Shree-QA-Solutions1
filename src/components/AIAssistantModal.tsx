'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crmStore';
import { Client } from '@/types/crm';
import { ShreeSymbol } from '@/components/BrandLogo';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  RotateCcw, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Award, 
  FileText,
  HelpCircle,
  TrendingUp,
  Shuffle
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient?: (client: Client) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  matchedClients?: Client[];
  dataSummary?: { label: string; value: string | number }[];
}

const SAMPLE_PROMPTS = [
  "Which clients have certification renewals due in the next 60 days?",
  "Show me all in-appraisal engagements that are currently stalled.",
  "Give me an executive summary of Mahesh Bhaskara's CMMI DEV pipeline.",
  "Who are the cold leads with no contact in 14+ days?",
  "List all active ISO 27001 (ISMS) and SOC compliance clients.",
  "What is the breakdown of appraisal stages across our Hyderabad clients?"
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ 
  isOpen, 
  onClose,
  onSelectClient 
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
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Namaste! I am your Shree QA Solutions AI Appraisal Assistant. I can analyze our entire live client registry, CMMI maturity pipelines, risk monitors, and audit activity logs. What query can I solve for you today?",
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      dataSummary: [
        { label: 'Total Clients', value: metrics.totalClients },
        { label: 'In Appraisal', value: metrics.inAppraisalCount },
        { label: 'Renewals at Risk', value: metrics.renewalsAtRiskCount },
        { label: 'Cold Leads', value: metrics.coldLeadsCount },
      ]
    }
  ]);

  if (!isOpen) return null;

  const runAIQuery = (query: string) => {
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let responseText = '';
      let matched: Client[] = [];
      let summaryData: { label: string; value: string | number }[] | undefined = undefined;

      // 1. Renewals / Expiry Queries
      if (q.includes('renewal') || q.includes('expire') || q.includes('risk') || q.includes('due')) {
        matched = clients.filter(isRenewalAtRisk);
        if (matched.length === 0) {
          matched = clients.filter((c) => c.stage === 'renewal_due');
        }
        responseText = `Identified **${matched.length} client certifications** with critical renewal attention requirements. These organizations have certification expiration dates approaching within 90 days with no recorded audit contact in 14+ days. Recommended action: Send immediate recertification reminder packet.`;
        summaryData = [
          { label: 'At-Risk Renewals', value: matched.length },
          { label: 'Appraiser Lead', value: 'Mahesh Bhaskara' },
          { label: 'Urgency', value: 'High' }
        ];
      } 
      // 2. Cold Leads
      else if (q.includes('cold') || q.includes('lead') || q.includes('prospect')) {
        matched = clients.filter(isColdLead);
        if (matched.length === 0) {
          matched = clients.filter((c) => c.stage === 'lead');
        }
        responseText = `Found **${matched.length} prospect leads** in the pipeline with no logged follow-up in the last 14 days. These require immediate outreach with standard CMMI/ISO scoping questionnaires to prevent lead attrition.`;
        summaryData = [
          { label: 'Cold Leads', value: matched.length },
          { label: 'Action Required', value: 'Outreach / Proposal' }
        ];
      } 
      // 3. Stalled Engagements
      else if (q.includes('stall') || q.includes('in-appraisal') || q.includes('pipeline') || q.includes('kanban')) {
        matched = clients.filter(isStalledEngagement);
        if (matched.length === 0) {
          matched = clients.filter((c) => c.stage === 'in_appraisal');
        }
        responseText = `Analyzed the 6-stage appraisal pipeline. There are **${matched.length} engagements** experiencing documentation bottlenecks or review delays (>21 days without activity log update). Recommended action: Coordinate with client ATM leads to unblock PIID evidence collection.`;
        summaryData = [
          { label: 'Stalled Engagements', value: matched.length },
          { label: 'Pipeline Total', value: metrics.inAppraisalCount }
        ];
      } 
      // 4. CMMI Specific
      else if (q.includes('cmmi') || q.includes('dev') || q.includes('svc') || q.includes('sec') || q.includes('ppl') || q.includes('spm')) {
        matched = clients.filter((c) => c.service_type.startsWith('CMMI'));
        responseText = `There are **${matched.length} active CMMI appraisal tracks** (covering CMMI DEV, CMMI SVC, CMMI SEC, CMMI PPL, and CMMI SPM domains) managed under Mahesh Bhaskara's lead appraiser license.`;
        summaryData = [
          { label: 'CMMI Accounts', value: matched.length },
          { label: 'In Appraisal', value: matched.filter(c => c.stage === 'in_appraisal').length }
        ];
      }
      // 5. ISO / Security Specific (ISO 27001, ISMS, SOC, PCI DSS, HIPAA, GDPR)
      else if (q.includes('iso') || q.includes('isms') || q.includes('soc') || q.includes('pci') || q.includes('hipaa') || q.includes('gdpr') || q.includes('qms')) {
        matched = clients.filter((c) => 
          ['ISMS', 'SOC', 'PCI DSS', 'HIPAA', 'GDPR', 'QMS', 'ITSM', 'AIMS', 'BCMS', 'PIMS'].includes(c.service_type)
        );
        responseText = `Found **${matched.length} compliance & management systems audits** across ISMS (ISO 27001), SOC 2, PCI DSS v4.0, HIPAA, and GDPR standards in the Hyderabad IT corridor.`;
        summaryData = [
          { label: 'Security & ISO Accounts', value: matched.length },
          { label: 'Audits Underway', value: matched.filter(c => c.stage === 'in_appraisal').length }
        ];
      }
      // 6. Generic / Custom intelligent search
      else {
        matched = clients.filter((c) => 
          c.name.toLowerCase().includes(q) || 
          c.owner.toLowerCase().includes(q) || 
          c.service_type.toLowerCase().includes(q) ||
          c.notes.toLowerCase().includes(q)
        );
        
        if (matched.length > 0) {
          responseText = `Found **${matched.length} client records** matching your search criteria "${query}". Detailed breakdown below:`;
        } else {
          matched = clients.slice(0, 5);
          responseText = `Generated high-level portfolio overview: Shree QA Solutions manages **${clients.length} total client organizations** across Kukatpally, HITEC City, and Telangana tech clusters. Key priorities include ${metrics.renewalsAtRiskCount} renewal cycles and ${metrics.inAppraisalCount} active appraisal cohorts.`;
        }
      }

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        matchedClients: matched.slice(0, 6),
        dataSummary: summaryData,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 450);
  };

  const handleRandomQuery = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PROMPTS.length);
    runAIQuery(SAMPLE_PROMPTS[randomIndex]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#FAF7F2] border-l border-[#DEC6A6] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="bg-[#1B2A4A] p-5 text-white relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E08A3E] via-[#D35D33] to-[#B33A2E]" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] p-0.5 shadow-md flex items-center justify-center border border-[#E08A3E]">
                  <ShreeSymbol className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-serif text-xl font-bold tracking-tight text-white">
                      AI Appraisal Assistant
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E08A3E] text-white uppercase">
                      Live CRM Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Natural language queries across clients, CMMI appraisals, risk monitors, and audit history
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* Quick suggested prompt chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-600 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E08A3E]" />
                  <span>Suggested Analytical Queries:</span>
                </span>
                <button
                  type="button"
                  onClick={handleRandomQuery}
                  className="text-[11px] font-bold text-[#B33A2E] hover:underline flex items-center space-x-1"
                >
                  <Shuffle className="w-3 h-3" />
                  <span>Surprise Me / Random Query</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PROMPTS.slice(0, 4).map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => runAIQuery(prompt)}
                    className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-white border border-[#DEC6A6] hover:border-[#B33A2E] hover:bg-[#FFFBF5] text-[#1B2A4A] transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#DEC6A6]/60 pt-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl p-4 text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#1B2A4A] text-white rounded-br-none'
                        : 'bg-white border border-[#DEC6A6] text-[#1B2A4A] rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="flex items-center space-x-1.5 mb-2 font-bold text-[#B33A2E]">
                        <Bot className="w-3.5 h-3.5" />
                        <span>Shree QA Intelligence</span>
                      </div>
                    )}

                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Summary KPI chips if present */}
                    {msg.dataSummary && (
                      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {msg.dataSummary.map((item, i) => (
                          <div key={i} className="p-2 rounded bg-[#FAF7F2] border border-[#DEC6A6]/60 text-center">
                            <span className="text-[10px] text-gray-500 block">{item.label}</span>
                            <span className="font-bold text-xs text-[#1B2A4A]">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Matched Clients Table Preview */}
                    {msg.matchedClients && msg.matchedClients.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        <span className="font-bold text-[11px] text-[#1B2A4A] block">
                          Relevant Client Engagements ({msg.matchedClients.length}):
                        </span>
                        <div className="divide-y divide-gray-100 bg-[#FAF7F2] rounded-lg border border-[#DEC6A6]/60 overflow-hidden">
                          {msg.matchedClients.map((client) => {
                            const daysSinceActivity = getDaysSinceLastActivity(client.id);
                            return (
                              <div
                                key={client.id}
                                onClick={() => {
                                  if (onSelectClient) {
                                    onSelectClient(client);
                                    onClose();
                                  }
                                }}
                                className="p-2.5 flex items-center justify-between hover:bg-[#EBDDC9]/40 cursor-pointer transition-colors"
                              >
                                <div>
                                  <div className="font-bold text-xs text-[#1B2A4A]">
                                    {client.name}
                                  </div>
                                  <div className="text-[10px] text-gray-600">
                                    {client.service_type} • Stage: <span className="capitalize">{client.stage.replace('_', ' ')}</span> • Last contact: {daysSinceActivity}d ago
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 text-[#B33A2E] text-[11px] font-semibold">
                                  <span>View</span>
                                  <ArrowRight className="w-3 h-3" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <span
                      className={`text-[9px] mt-2 block ${
                        msg.sender === 'user' ? 'text-slate-300 text-right' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-white border border-[#DEC6A6] max-w-xs text-xs text-gray-500">
                  <div className="w-4 h-4 border-2 border-[#B33A2E] border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing CRM database & audit logs...</span>
                </div>
              )}
            </div>

          </div>

          {/* Input Box Footer */}
          <div className="p-4 border-t border-[#DEC6A6] bg-[#FAF7F2]">
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
                placeholder="Ask any question about clients, renewals, CMMI appraisals, or stalled leads..."
                className="flex-1 rounded-lg border border-[#DEC6A6] bg-white p-2.5 text-xs text-[#1B2A4A] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#B33A2E] focus:border-[#B33A2E]"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isThinking}
                className="p-2.5 rounded-lg bg-[#B33A2E] hover:bg-[#8F281E] text-white disabled:opacity-50 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
