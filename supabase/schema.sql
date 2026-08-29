-- ==============================================================================
-- SHREE QA SOLUTIONS - CMMI & ISO APPRAISAL CRM
-- Kukatpally, Hyderabad, India
-- Supabase Postgres Schema & Mock Seed Dataset
-- ==============================================================================

-- 1. Create Enums / Types (or Domain Constraints)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS clients CASCADE;

-- 3. Create Clients Table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (
        service_type IN (
            'CMMI DEV', 'CMMI SVC', 'CMMI SEC', 'CMMI PPL', 'CMMI SPM',
            'PCI DSS', 'HIPAA', 'GDPR', 'SOC', 'QMS', 'ISMS', 'ITSM',
            'AIMS', 'BCMS', 'PIMS', 'Cert-In'
        )
    ),
    stage VARCHAR(50) NOT NULL CHECK (
        stage IN ('lead', 'in_appraisal', 'active', 'renewal_due', 'lapsed')
    ),
    pipeline_substage VARCHAR(50) CHECK (
        pipeline_substage IS NULL OR pipeline_substage IN (
            'inquiry', 'docs_collected', 'assessment', 'site_visit', 'report', 'signoff'
        )
    ),
    owner VARCHAR(100) NOT NULL,
    last_contact_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cert_expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Activity Log Table
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    note TEXT NOT NULL,
    logged_by VARCHAR(100) NOT NULL
);

-- 5. Indexes for Performance
CREATE INDEX idx_clients_stage ON clients(stage);
CREATE INDEX idx_clients_pipeline_substage ON clients(pipeline_substage);
CREATE INDEX idx_clients_service_type ON clients(service_type);
CREATE INDEX idx_clients_last_contact ON clients(last_contact_date);
CREATE INDEX idx_activity_log_client_id ON activity_log(client_id);
CREATE INDEX idx_activity_log_timestamp ON activity_log(timestamp DESC);

-- 6. Enable Row Level Security (RLS) & Public Policies for Demo
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on clients" ON clients FOR SELECT USING (true);
CREATE POLICY "Allow public insert on clients" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on clients" ON clients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on clients" ON clients FOR DELETE USING (true);

CREATE POLICY "Allow public read on activity_log" ON activity_log FOR SELECT USING (true);
CREATE POLICY "Allow public insert on activity_log" ON activity_log FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on activity_log" ON activity_log FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on activity_log" ON activity_log FOR DELETE USING (true);

-- ==============================================================================
-- 7. SEED DATA - 20 Realistic Indian Mock Clients
-- ==============================================================================

INSERT INTO clients (id, name, service_type, stage, pipeline_substage, owner, last_contact_date, cert_expiry_date, notes, created_at)
VALUES
  -- 1. In Appraisal (Site Visit)
  ('a0000000-0000-0000-0000-000000000001', 'Vantara Technologies Pvt Ltd', 'CMMI DEV', 'in_appraisal', 'site_visit', 'Venkat Rao', NOW() - INTERVAL '2 days', NULL, 'Enterprise appraisal for CMMI DEV v2.0 Level 5 covering 14 software engineering projects.', NOW() - INTERVAL '90 days'),
  
  -- 2. Renewals at Risk (Expiry <= 90d AND no activity in 14d)
  ('a0000000-0000-0000-0000-000000000002', 'Meridian Software Labs', 'ISMS', 'renewal_due', NULL, 'Priya Nair', NOW() - INTERVAL '22 days', (CURRENT_DATE + INTERVAL '35 days')::DATE, 'ISO/IEC 27001:2022 ISMS recertification cycle. Awaiting client CISO signoff.', NOW() - INTERVAL '700 days'),
  
  -- 3. Cold Lead (Lead AND no activity in 14d)
  ('a0000000-0000-0000-0000-000000000003', 'Sundar Fintech Pvt Ltd', 'PCI DSS', 'lead', NULL, 'Ananya Reddy', NOW() - INTERVAL '19 days', NULL, 'Payment gateway aggregator evaluating PCI DSS v4.0 certification and QSA on-site audits.', NOW() - INTERVAL '25 days'),
  
  -- 4. Stalled Engagement (In Appraisal AND no activity in 21d)
  ('a0000000-0000-0000-0000-000000000004', 'Krishna Infosystems', 'CMMI SVC', 'in_appraisal', 'assessment', 'Suresh Kumar', NOW() - INTERVAL '27 days', NULL, 'CMMI SVC Level 3 benchmark appraisal. 3 non-conformances awaiting closure from client.', NOW() - INTERVAL '75 days'),
  
  -- 5. Active Certified
  ('a0000000-0000-0000-0000-000000000005', 'Nalanda Digital Services', 'SOC', 'active', NULL, 'Venkat Rao', NOW() - INTERVAL '5 days', (CURRENT_DATE + INTERVAL '280 days')::DATE, 'SOC 2 Type II certified. Surveillance review scheduled for Q3.', NOW() - INTERVAL '400 days'),
  
  -- 6. Renewals at Risk
  ('a0000000-0000-0000-0000-000000000006', 'Kakatiya Health Solutions', 'HIPAA', 'renewal_due', NULL, 'Ananya Reddy', NOW() - INTERVAL '18 days', (CURRENT_DATE + INTERVAL '42 days')::DATE, 'HIPAA and GDPR compliance renewal for US-based health tech client database.', NOW() - INTERVAL '365 days'),
  
  -- 7. Cold Lead
  ('a0000000-0000-0000-0000-000000000007', 'Telangana Cyber Defense Corp', 'Cert-In', 'lead', NULL, 'Rajesh Sharma', NOW() - INTERVAL '25 days', NULL, 'Inquiry regarding Cert-In empanelment readiness audit for state defense contractor.', NOW() - INTERVAL '30 days'),
  
  -- 8. Stalled Engagement
  ('a0000000-0000-0000-0000-000000000008', 'Cyberabad Cloud Infotech', 'CMMI DEV', 'in_appraisal', 'docs_collected', 'Suresh Kumar', NOW() - INTERVAL '24 days', NULL, 'CMMI DEV Level 3 appraisal. Evidence collection stalled due to client reorganization.', NOW() - INTERVAL '60 days'),
  
  -- 9. Active Certified
  ('a0000000-0000-0000-0000-000000000009', 'Deccan Aerospace & Defense', 'QMS', 'active', NULL, 'Venkat Rao', NOW() - INTERVAL '4 days', (CURRENT_DATE + INTERVAL '190 days')::DATE, 'ISO 9001:2015 Quality Management System certification.', NOW() - INTERVAL '500 days'),
  
  -- 10. In Appraisal (Signoff)
  ('a0000000-0000-0000-0000-000000000010', 'Charminar Payments & Banking', 'PCI DSS', 'in_appraisal', 'signoff', 'Priya Nair', NOW() - INTERVAL '1 day', NULL, 'Final PCI DSS certification report submitted. Executive signoff scheduled.', NOW() - INTERVAL '45 days'),
  
  -- 11. Lead (Active recent)
  ('a0000000-0000-0000-0000-000000000011', 'Hitech City AI Innovations', 'AIMS', 'lead', NULL, 'Ananya Reddy', NOW() - INTERVAL '3 days', NULL, 'Prospective client for ISO/IEC 42001 Artificial Intelligence Management System.', NOW() - INTERVAL '10 days'),
  
  -- 12. In Appraisal (Report)
  ('a0000000-0000-0000-0000-000000000012', 'Bhagyanagar Enterprise Systems', 'ITSM', 'in_appraisal', 'report', 'Venkat Rao', NOW() - INTERVAL '4 days', NULL, 'ISO 20000-1 IT Service Management appraisal report compilation stage.', NOW() - INTERVAL '80 days'),
  
  -- 13. Renewal Due (Healthy - recent contact)
  ('a0000000-0000-0000-0000-000000000013', 'Godavari Data Systems', 'PIMS', 'renewal_due', NULL, 'Priya Nair', NOW() - INTERVAL '3 days', (CURRENT_DATE + INTERVAL '65 days')::DATE, 'ISO 27701 Privacy Information Management System recertification in progress.', NOW() - INTERVAL '370 days'),
  
  -- 14. Lapsed
  ('a0000000-0000-0000-0000-000000000014', 'Secunderabad Global Logistics', 'BCMS', 'lapsed', NULL, 'Ananya Reddy', NOW() - INTERVAL '50 days', (CURRENT_DATE - INTERVAL '45 days')::DATE, 'ISO 22301 Business Continuity Management System lapsed. Re-engagement outreach.', NOW() - INTERVAL '800 days'),
  
  -- 15. In Appraisal (Inquiry)
  ('a0000000-0000-0000-0000-000000000015', 'Warangal Microelectronics', 'CMMI SPM', 'in_appraisal', 'inquiry', 'Rajesh Sharma', NOW() - INTERVAL '1 day', NULL, 'CMMI Security and Process Management initial scoping and ATM appointment.', NOW() - INTERVAL '5 days'),
  
  -- 16. Active Certified
  ('a0000000-0000-0000-0000-000000000016', 'Nizam Defense Robotics', 'CMMI SEC', 'active', NULL, 'Venkat Rao', NOW() - INTERVAL '7 days', (CURRENT_DATE + INTERVAL '310 days')::DATE, 'CMMI Security Capability Level 4 certified for autonomous defense systems.', NOW() - INTERVAL '600 days'),
  
  -- 17. Cold Lead
  ('a0000000-0000-0000-0000-000000000017', 'Gachibowli BioTech Analytics', 'GDPR', 'lead', NULL, 'Ananya Reddy', NOW() - INTERVAL '31 days', NULL, 'GDPR cross-border clinical trial data compliance consultation inquiry.', NOW() - INTERVAL '40 days'),
  
  -- 18. In Appraisal (Assessment)
  ('a0000000-0000-0000-0000-000000000018', 'Kondapur SaaS Dynamics', 'SOC', 'in_appraisal', 'assessment', 'Priya Nair', NOW() - INTERVAL '2 days', NULL, 'SOC 2 Type I and Type II dual assessment currently in evidence validation phase.', NOW() - INTERVAL '35 days'),
  
  -- 19. Renewals at Risk
  ('a0000000-0000-0000-0000-000000000019', 'Manjeera Telecom Services', 'ISMS', 'renewal_due', NULL, 'Rajesh Sharma', NOW() - INTERVAL '20 days', (CURRENT_DATE + INTERVAL '30 days')::DATE, 'ISO 27001 Telecom infrastructure security certification renewal expiring this month.', NOW() - INTERVAL '720 days'),
  
  -- 20. Stalled Engagement
  ('a0000000-0000-0000-0000-000000000020', 'Hyderabad Quantum Labs', 'CMMI PPL', 'in_appraisal', 'docs_collected', 'Suresh Kumar', NOW() - INTERVAL '32 days', NULL, 'People CMM Level 3 workforce appraisal. Awaiting competency matrix data.', NOW() - INTERVAL '70 days');

-- 8. Seed Activity Logs
INSERT INTO activity_log (client_id, timestamp, note, logged_by)
VALUES
  ('a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days', 'Completed Day 1 of CMMI DEV L5 on-site appraisal at HITEC City campus. Reviewed process asset library.', 'Venkat Rao (Lead Appraiser)'),
  ('a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '8 days', 'Appraisal Plan signed off by CTO. All 14 projects sampled across engineering teams.', 'Venkat Rao'),
  ('a0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '22 days', 'Sent formal ISO 27001 ISMS recertification reminder packet. Awaiting response from CISO office.', 'Priya Nair (Client Success)'),
  ('a0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '19 days', 'Initial PCI DSS v4.0 scoping call completed with VP of Engineering.', 'Ananya Reddy (BD Manager)'),
  ('a0000000-0000-0000-0000-000000000004', NOW() - INTERVAL '27 days', 'Stage 1 Document Review completed for CMMI SVC L3. Pending closure of 3 Non-Conformances.', 'Suresh Kumar (Appraisal Team)'),
  ('a0000000-0000-0000-0000-000000000005', NOW() - INTERVAL '5 days', 'SOC 2 Type II attestation report published and delivered to Board of Directors.', 'Venkat Rao'),
  ('a0000000-0000-0000-0000-000000000006', NOW() - INTERVAL '18 days', 'Emailed HIPAA & GDPR annual compliance recertification schedule.', 'Ananya Reddy'),
  ('a0000000-0000-0000-0000-000000000007', NOW() - INTERVAL '25 days', 'Discussed Cert-In Empanelment readiness audit. Sent NDA and compliance requirement checklist.', 'Rajesh Sharma'),
  ('a0000000-0000-0000-0000-000000000008', NOW() - INTERVAL '24 days', 'CMMI DEV Level 3 process artifacts uploaded to staging repository.', 'Suresh Kumar'),
  ('a0000000-0000-0000-0000-000000000009', NOW() - INTERVAL '4 days', 'ISO 9001:2015 surveillance audit #1 successfully concluded. Zero major NCs reported.', 'Venkat Rao'),
  ('a0000000-0000-0000-0000-000000000010', NOW() - INTERVAL '1 day', 'Final Report submitted for PCI DSS certification. Sign-off ceremony scheduled.', 'Priya Nair'),
  ('a0000000-0000-0000-0000-000000000011', NOW() - INTERVAL '3 days', 'Deep dive session on ISO/IEC 42001 (AIMS) Artificial Intelligence Management System requirements.', 'Ananya Reddy'),
  ('a0000000-0000-0000-0000-000000000012', NOW() - INTERVAL '4 days', 'Drafting formal ITSM ISO 20000 Lead Appraisal Findings report for review by governance council.', 'Venkat Rao'),
  ('a0000000-0000-0000-0000-000000000013', NOW() - INTERVAL '3 days', 'Received updated ISO 27701 PIMS privacy impact assessment documentation.', 'Priya Nair'),
  ('a0000000-0000-0000-0000-000000000014', NOW() - INTERVAL '50 days', 'Certification lapsed due to non-completion of surveillance cycle. Win-back campaign initiated.', 'Ananya Reddy'),
  ('a0000000-0000-0000-0000-000000000015', NOW() - INTERVAL '1 day', 'CMMI SPM appraisal scope defined for embedded firmware unit.', 'Rajesh Sharma'),
  ('a0000000-0000-0000-0000-000000000016', NOW() - INTERVAL '7 days', 'Quarterly compliance check for CMMI SEC high-maturity security objectives.', 'Venkat Rao'),
  ('a0000000-0000-0000-0000-000000000017', NOW() - INTERVAL '31 days', 'Demo and compliance checklist for HIPAA & GDPR shared with compliance officer.', 'Ananya Reddy'),
  ('a0000000-0000-0000-0000-000000000018', NOW() - INTERVAL '2 days', 'Assessment interviews in progress with DevOps and Security leads for SOC 2 Type II audit.', 'Priya Nair'),
  ('a0000000-0000-0000-0000-000000000019', NOW() - INTERVAL '20 days', 'ISMS ISO 27001 recertification due in 30 days. Sent second urgent notice to Head of IT Security.', 'Rajesh Sharma'),
  ('a0000000-0000-0000-0000-000000000020', NOW() - INTERVAL '32 days', 'CMMI PPL documents submitted by HR and Talent team. Appraisal team awaiting staffing baseline.', 'Suresh Kumar');
