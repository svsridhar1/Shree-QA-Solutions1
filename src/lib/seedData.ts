import { Client, ActivityLog, ServiceType, ClientStage, PipelineSubstage } from '@/types/crm';

// Helper to compute ISO date string relative to current time in days
export function getRelativeDate(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
}

export function getRelativeDateOnly(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

export function getInitialSeedData(): { clients: Client[]; activityLogs: ActivityLog[] } {
  const activityLogs: ActivityLog[] = [
    // 1. Vantara Technologies Pvt Ltd (In Appraisal - Site Visit - active recent)
    {
      id: 'log-101',
      client_id: 'cli-01',
      timestamp: getRelativeDate(-2),
      note: 'Completed Day 1 of CMMI DEV L5 on-site appraisal at HITEC City campus. Reviewed process asset library and project baseline metrics with ATM lead.',
      logged_by: 'Venkat Rao (Lead Appraiser)'
    },
    {
      id: 'log-102',
      client_id: 'cli-01',
      timestamp: getRelativeDate(-8),
      note: 'Appraisal Plan signed off by CTO. All 14 projects sampled across engineering teams.',
      logged_by: 'Venkat Rao'
    },

    // 2. Meridian Software Labs (Renewal Due - EXPIRED in 35 days, last activity 22 days ago -> RENEWALS AT RISK)
    {
      id: 'log-201',
      client_id: 'cli-02',
      timestamp: getRelativeDate(-22),
      note: 'Sent formal ISO 27001 ISMS recertification reminder packet. Awaiting response from CISO office.',
      logged_by: 'Priya Nair (Client Success)'
    },
    {
      id: 'log-202',
      client_id: 'cli-02',
      timestamp: getRelativeDate(-60),
      note: 'Conducted preliminary surveillance audit gap analysis.',
      logged_by: 'Rajesh Sharma'
    },

    // 3. Sundar Fintech Pvt Ltd (Lead - last activity 19 days ago -> COLD LEADS)
    {
      id: 'log-301',
      client_id: 'cli-03',
      timestamp: getRelativeDate(-19),
      note: 'Initial PCI DSS v4.0 scoping call completed with VP of Engineering. Sent commercial proposal for SAQ D and QSA on-site assessment.',
      logged_by: 'Ananya Reddy (BD Manager)'
    },
    {
      id: 'log-302',
      client_id: 'cli-03',
      timestamp: getRelativeDate(-25),
      note: 'Inbound inquiry received via Shree QA Solutions portal regarding RBI mandate compliance.',
      logged_by: 'Ananya Reddy'
    },

    // 4. Krishna Infosystems (In Appraisal - Assessment - last activity 27 days ago -> STALLED ENGAGEMENTS)
    {
      id: 'log-401',
      client_id: 'cli-04',
      timestamp: getRelativeDate(-27),
      note: 'Stage 1 Document Review completed for CMMI SVC L3. Pending closure of 3 Non-Conformances from delivery manager.',
      logged_by: 'Suresh Kumar (Appraisal Team)'
    },
    {
      id: 'log-402',
      client_id: 'cli-04',
      timestamp: getRelativeDate(-45),
      note: 'Kickoff meeting held with QA Head and Delivery Directors.',
      logged_by: 'Suresh Kumar'
    },

    // 5. Nalanda Digital Services (Active - SOC 2 Type II - healthy)
    {
      id: 'log-501',
      client_id: 'cli-05',
      timestamp: getRelativeDate(-5),
      note: 'SOC 2 Type II attestation report published and delivered to Board of Directors.',
      logged_by: 'Venkat Rao'
    },
    {
      id: 'log-502',
      client_id: 'cli-05',
      timestamp: getRelativeDate(-12),
      note: 'Management representation letter signed and verified.',
      logged_by: 'Priya Nair'
    },

    // 6. Kakatiya Health Solutions (Renewal Due - cert expiry in 42 days, last activity 18 days ago -> RENEWALS AT RISK)
    {
      id: 'log-601',
      client_id: 'cli-06',
      timestamp: getRelativeDate(-18),
      note: 'Emailed HIPAA & GDPR annual compliance recertification schedule. Followed up on security risk assessment questionnaire.',
      logged_by: 'Ananya Reddy'
    },

    // 7. Telangana Cyber Defense Corp (Lead - last activity 25 days ago -> COLD LEADS)
    {
      id: 'log-701',
      client_id: 'cli-07',
      timestamp: getRelativeDate(-25),
      note: 'Discussed Cert-In Empanelment readiness audit. Sent NDA and compliance requirement checklist.',
      logged_by: 'Rajesh Sharma'
    },

    // 8. Cyberabad Cloud Infotech (In Appraisal - Docs Collected - last activity 24 days ago -> STALLED ENGAGEMENTS)
    {
      id: 'log-801',
      client_id: 'cli-08',
      timestamp: getRelativeDate(-24),
      note: 'CMMI DEV Level 3 process artifacts uploaded to staging repository. Evidence verification pending due to client internal reorganization.',
      logged_by: 'Suresh Kumar'
    },

    // 9. Deccan Aerospace & Defense (Active - QMS ISO 9001 - healthy)
    {
      id: 'log-901',
      client_id: 'cli-09',
      timestamp: getRelativeDate(-4),
      note: 'ISO 9001:2015 surveillance audit #1 successfully concluded. Zero major NCs reported.',
      logged_by: 'Venkat Rao'
    },

    // 10. Charminar Payments & Banking (In Appraisal - Signoff - active recent)
    {
      id: 'log-1001',
      client_id: 'cli-10',
      timestamp: getRelativeDate(-1),
      note: 'Final Report submitted for PCI DSS certification. Sign-off ceremony scheduled with Executive Board tomorrow.',
      logged_by: 'Priya Nair'
    },
    {
      id: 'log-1002',
      client_id: 'cli-10',
      timestamp: getRelativeDate(-6),
      note: 'Completed validation of remediation fixes for network segmentation.',
      logged_by: 'Rajesh Sharma'
    },

    // 11. Hitech City AI Innovations (Lead - active recent)
    {
      id: 'log-1101',
      client_id: 'cli-11',
      timestamp: getRelativeDate(-3),
      note: 'Deep dive session on ISO/IEC 42001 (AIMS) Artificial Intelligence Management System requirements.',
      logged_by: 'Ananya Reddy'
    },

    // 12. Bhagyanagar Enterprise Systems (In Appraisal - Report - active recent)
    {
      id: 'log-1201',
      client_id: 'cli-12',
      timestamp: getRelativeDate(-4),
      note: 'Drafting formal ITSM ISO 20000 Lead Appraisal Findings report for review by governance council.',
      logged_by: 'Venkat Rao'
    },

    // 13. Godavari Data Systems (Renewal Due - cert expiry in 65 days, active recent -> NOT at risk)
    {
      id: 'log-1301',
      client_id: 'cli-13',
      timestamp: getRelativeDate(-3),
      note: 'Received updated ISO 27701 PIMS privacy impact assessment documentation. Scheduled stage 1 audit for next month.',
      logged_by: 'Priya Nair'
    },

    // 14. Secunderabad Global Logistics (Lapsed - ISO 22301 BCMS)
    {
      id: 'log-1401',
      client_id: 'cli-14',
      timestamp: getRelativeDate(-50),
      note: 'Certification lapsed due to non-completion of surveillance cycle. Win-back campaign initiated.',
      logged_by: 'Ananya Reddy'
    },

    // 15. Warangal Microelectronics (In Appraisal - Inquiry - active recent)
    {
      id: 'log-1501',
      client_id: 'cli-15',
      timestamp: getRelativeDate(-1),
      note: 'CMMI SPM appraisal scope defined for embedded firmware unit. Sent readiness assessment questionnaire.',
      logged_by: 'Rajesh Sharma'
    },

    // 16. Nizam Defense Robotics (Active - CMMI SEC - healthy)
    {
      id: 'log-1601',
      client_id: 'cli-16',
      timestamp: getRelativeDate(-7),
      note: 'Quarterly compliance check for CMMI SEC high-maturity security objectives.',
      logged_by: 'Venkat Rao'
    },

    // 17. Gachibowli BioTech Analytics (Lead - last activity 31 days ago -> COLD LEADS)
    {
      id: 'log-1701',
      client_id: 'cli-17',
      timestamp: getRelativeDate(-31),
      note: 'Demo and compliance checklist for HIPAA & GDPR shared with compliance officer. No response received to follow-ups.',
      logged_by: 'Ananya Reddy'
    },

    // 18. Kondapur SaaS Dynamics (In Appraisal - Assessment - active recent)
    {
      id: 'log-1801',
      client_id: 'cli-18',
      timestamp: getRelativeDate(-2),
      note: 'Assessment interviews in progress with DevOps and Security leads for SOC 2 Type II audit.',
      logged_by: 'Priya Nair'
    },

    // 19. Manjeera Telecom Services (Renewal Due - cert expiry in 30 days, last activity 20 days ago -> RENEWALS AT RISK)
    {
      id: 'log-1901',
      client_id: 'cli-19',
      timestamp: getRelativeDate(-20),
      note: 'ISMS ISO 27001 recertification due in 30 days. Sent second urgent notice to Head of IT Security.',
      logged_by: 'Rajesh Sharma'
    },

    // 20. Hyderabad Quantum Labs (In Appraisal - Docs Collected - last activity 32 days ago -> STALLED ENGAGEMENTS)
    {
      id: 'log-2001',
      client_id: 'cli-20',
      timestamp: getRelativeDate(-32),
      note: 'CMMI PPL documents submitted by HR and Talent team. Appraisal team awaiting staffing baseline metrics.',
      logged_by: 'Suresh Kumar'
    }
  ];

  const clients: Client[] = [
    {
      id: 'cli-01',
      name: 'Vantara Technologies Pvt Ltd',
      service_type: 'CMMI DEV',
      stage: 'in_appraisal',
      pipeline_substage: 'site_visit',
      owner: 'Mahesh Bhaskara',
      last_contact_date: getRelativeDate(-2),
      cert_expiry_date: null,
      notes: 'Enterprise appraisal for CMMI DEV v2.0 Level 5 covering 14 software engineering projects in HITEC City campus.',
      created_at: getRelativeDate(-90)
    },
    {
      id: 'cli-02',
      name: 'Meridian Software Labs',
      service_type: 'ISMS',
      stage: 'renewal_due',
      pipeline_substage: null,
      owner: 'Priya Nair',
      last_contact_date: getRelativeDate(-22),
      cert_expiry_date: getRelativeDateOnly(35), // Due in 35 days (<=90), no activity in 22d (>14d) -> RENEWAL AT RISK
      notes: 'ISO/IEC 27001:2022 ISMS recertification cycle. Needs immediate attention from CISO.',
      created_at: getRelativeDate(-700)
    },
    {
      id: 'cli-03',
      name: 'Sundar Fintech Pvt Ltd',
      service_type: 'PCI DSS',
      stage: 'lead',
      pipeline_substage: null,
      owner: 'Ananya Reddy',
      last_contact_date: getRelativeDate(-19), // Lead with no activity in 19d (>14d) -> COLD LEAD
      cert_expiry_date: null,
      notes: 'Payment gateway aggregator evaluating PCI DSS v4.0 certification and QSA on-site audits.',
      created_at: getRelativeDate(-25)
    },
    {
      id: 'cli-04',
      name: 'Krishna Infosystems',
      service_type: 'CMMI SVC',
      stage: 'in_appraisal',
      pipeline_substage: 'assessment',
      owner: 'Suresh Kumar',
      last_contact_date: getRelativeDate(-27), // In Appraisal with no activity in 27d (>21d) -> STALLED ENGAGEMENT
      cert_expiry_date: null,
      notes: 'CMMI SVC Level 3 benchmark appraisal. 3 non-conformances awaiting closure from client.',
      created_at: getRelativeDate(-75)
    },
    {
      id: 'cli-05',
      name: 'Nalanda Digital Services',
      service_type: 'SOC',
      stage: 'active',
      pipeline_substage: null,
      owner: 'Venkat Rao',
      last_contact_date: getRelativeDate(-5),
      cert_expiry_date: getRelativeDateOnly(280),
      notes: 'SOC 2 Type II certified. Surveillance review scheduled for Q3.',
      created_at: getRelativeDate(-400)
    },
    {
      id: 'cli-06',
      name: 'Kakatiya Health Solutions',
      service_type: 'HIPAA',
      stage: 'renewal_due',
      pipeline_substage: null,
      owner: 'Ananya Reddy',
      last_contact_date: getRelativeDate(-18), // Due in 42 days (<=90), no activity in 18d (>14d) -> RENEWAL AT RISK
      cert_expiry_date: getRelativeDateOnly(42),
      notes: 'HIPAA and GDPR compliance renewal for US-based health tech client database.',
      created_at: getRelativeDate(-365)
    },
    {
      id: 'cli-07',
      name: 'Telangana Cyber Defense Corp',
      service_type: 'Cert-In',
      stage: 'lead',
      pipeline_substage: null,
      owner: 'Rajesh Sharma',
      last_contact_date: getRelativeDate(-25), // Lead with no activity in 25d (>14d) -> COLD LEAD
      cert_expiry_date: null,
      notes: 'Inquiry regarding Cert-In empanelment readiness audit for state defense contractor.',
      created_at: getRelativeDate(-30)
    },
    {
      id: 'cli-08',
      name: 'Cyberabad Cloud Infotech',
      service_type: 'CMMI DEV',
      stage: 'in_appraisal',
      pipeline_substage: 'docs_collected',
      owner: 'Suresh Kumar',
      last_contact_date: getRelativeDate(-24), // In Appraisal with no activity in 24d (>21d) -> STALLED ENGAGEMENT
      cert_expiry_date: null,
      notes: 'CMMI DEV Level 3 appraisal. Evidence collection stalled due to client engineering reorganization.',
      created_at: getRelativeDate(-60)
    },
    {
      id: 'cli-09',
      name: 'Deccan Aerospace & Defense',
      service_type: 'QMS',
      stage: 'active',
      pipeline_substage: null,
      owner: 'Venkat Rao',
      last_contact_date: getRelativeDate(-4),
      cert_expiry_date: getRelativeDateOnly(190),
      notes: 'ISO 9001:2015 Quality Management System certification. Excellent audit track record.',
      created_at: getRelativeDate(-500)
    },
    {
      id: 'cli-10',
      name: 'Charminar Payments & Banking',
      service_type: 'PCI DSS',
      stage: 'in_appraisal',
      pipeline_substage: 'signoff',
      owner: 'Priya Nair',
      last_contact_date: getRelativeDate(-1),
      cert_expiry_date: null,
      notes: 'Final PCI DSS certification report submitted. Executive signoff and seal issuance ceremony pending.',
      created_at: getRelativeDate(-45)
    },
    {
      id: 'cli-11',
      name: 'Hitech City AI Innovations',
      service_type: 'AIMS',
      stage: 'lead',
      pipeline_substage: null,
      owner: 'Ananya Reddy',
      last_contact_date: getRelativeDate(-3),
      cert_expiry_date: null,
      notes: 'Prospective client for ISO/IEC 42001 Artificial Intelligence Management System (AIMS) lead appraisal.',
      created_at: getRelativeDate(-10)
    },
    {
      id: 'cli-12',
      name: 'Bhagyanagar Enterprise Systems',
      service_type: 'ITSM',
      stage: 'in_appraisal',
      pipeline_substage: 'report',
      owner: 'Venkat Rao',
      last_contact_date: getRelativeDate(-4),
      cert_expiry_date: null,
      notes: 'ISO 20000-1 IT Service Management appraisal report compilation stage.',
      created_at: getRelativeDate(-80)
    },
    {
      id: 'cli-13',
      name: 'Godavari Data Systems',
      service_type: 'PIMS',
      stage: 'renewal_due',
      pipeline_substage: null,
      owner: 'Priya Nair',
      last_contact_date: getRelativeDate(-3), // Active recent contact -> NOT AT RISK
      cert_expiry_date: getRelativeDateOnly(65),
      notes: 'ISO 27701 Privacy Information Management System recertification in progress with good momentum.',
      created_at: getRelativeDate(-370)
    },
    {
      id: 'cli-14',
      name: 'Secunderabad Global Logistics',
      service_type: 'BCMS',
      stage: 'lapsed',
      pipeline_substage: null,
      owner: 'Ananya Reddy',
      last_contact_date: getRelativeDate(-50),
      cert_expiry_date: getRelativeDateOnly(-45),
      notes: 'ISO 22301 Business Continuity Management System lapsed. Re-engagement outreach underway.',
      created_at: getRelativeDate(-800)
    },
    {
      id: 'cli-15',
      name: 'Warangal Microelectronics',
      service_type: 'CMMI SPM',
      stage: 'in_appraisal',
      pipeline_substage: 'inquiry',
      owner: 'Rajesh Sharma',
      last_contact_date: getRelativeDate(-1),
      cert_expiry_date: null,
      notes: 'CMMI Security and Process Management initial scoping and ATM appointment.',
      created_at: getRelativeDate(-5)
    },
    {
      id: 'cli-16',
      name: 'Nizam Defense Robotics',
      service_type: 'CMMI SEC',
      stage: 'active',
      pipeline_substage: null,
      owner: 'Venkat Rao',
      last_contact_date: getRelativeDate(-7),
      cert_expiry_date: getRelativeDateOnly(310),
      notes: 'CMMI Security Capability Level 4 certified for autonomous defense systems.',
      created_at: getRelativeDate(-600)
    },
    {
      id: 'cli-17',
      name: 'Gachibowli BioTech Analytics',
      service_type: 'GDPR',
      stage: 'lead',
      pipeline_substage: null,
      owner: 'Ananya Reddy',
      last_contact_date: getRelativeDate(-31), // Lead with no activity in 31d (>14d) -> COLD LEAD
      cert_expiry_date: null,
      notes: 'GDPR cross-border clinical trial data compliance consultation inquiry.',
      created_at: getRelativeDate(-40)
    },
    {
      id: 'cli-18',
      name: 'Kondapur SaaS Dynamics',
      service_type: 'SOC',
      stage: 'in_appraisal',
      pipeline_substage: 'assessment',
      owner: 'Priya Nair',
      last_contact_date: getRelativeDate(-2),
      cert_expiry_date: null,
      notes: 'SOC 2 Type I and Type II dual assessment currently in evidence validation phase.',
      created_at: getRelativeDate(-35)
    },
    {
      id: 'cli-19',
      name: 'Manjeera Telecom Services',
      service_type: 'ISMS',
      stage: 'renewal_due',
      pipeline_substage: null,
      owner: 'Rajesh Sharma',
      last_contact_date: getRelativeDate(-20), // Due in 30 days (<=90), no activity in 20d (>14d) -> RENEWAL AT RISK
      cert_expiry_date: getRelativeDateOnly(30),
      notes: 'ISO 27001 Telecom infrastructure security certification renewal expiring this month.',
      created_at: getRelativeDate(-720)
    },
    {
      id: 'cli-20',
      name: 'Hyderabad Quantum Labs',
      service_type: 'CMMI PPL',
      stage: 'in_appraisal',
      pipeline_substage: 'docs_collected',
      owner: 'Suresh Kumar',
      last_contact_date: getRelativeDate(-32), // In appraisal with no activity in 32d (>21d) -> STALLED ENGAGEMENT
      cert_expiry_date: null,
      notes: 'People CMM (CMMI PPL) Level 3 workforce appraisal. Awaiting competency matrix data from HR.',
      created_at: getRelativeDate(-70)
    }
  ];

  return { clients, activityLogs };
}
