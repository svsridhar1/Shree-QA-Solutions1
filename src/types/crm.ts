export type ClientStage = 
  | 'lead' 
  | 'in_appraisal' 
  | 'active' 
  | 'renewal_due' 
  | 'lapsed';

export type PipelineSubstage = 
  | 'inquiry' 
  | 'docs_collected' 
  | 'assessment' 
  | 'site_visit' 
  | 'report' 
  | 'signoff';

export type ServiceType = 
  | 'CMMI DEV' 
  | 'CMMI SVC' 
  | 'CMMI SEC' 
  | 'CMMI PPL' 
  | 'CMMI SPM' 
  | 'PCI DSS' 
  | 'HIPAA' 
  | 'GDPR' 
  | 'SOC' 
  | 'QMS' 
  | 'ISMS' 
  | 'ITSM' 
  | 'AIMS' 
  | 'BCMS' 
  | 'PIMS' 
  | 'Cert-In';

export interface ActivityLog {
  id: string;
  client_id: string;
  timestamp: string; // ISO 8601
  note: string;
  logged_by: string;
}

export interface Client {
  id: string;
  name: string;
  service_type: ServiceType;
  stage: ClientStage;
  pipeline_substage: PipelineSubstage | null;
  owner: string;
  last_contact_date: string; // ISO 8601
  cert_expiry_date: string | null; // ISO 8601 (YYYY-MM-DD)
  notes: string;
  created_at: string;
  activity_logs?: ActivityLog[];
}

export type RiskFilterType = 'renewals_at_risk' | 'cold_leads' | 'stalled_engagements' | null;

export interface DashboardMetrics {
  totalClients: number;
  inAppraisalCount: number;
  activeCount: number;
  renewalDueCount: number;
  renewalsAtRiskCount: number;
  coldLeadsCount: number;
  stalledEngagementsCount: number;
  serviceDistribution: { service: ServiceType; count: number }[];
}
