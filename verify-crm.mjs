// Self-contained verification suite for Shree QA Solutions CRM MVP business logic

function getRelativeDate(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
}

function getRelativeDateOnly(daysOffset) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

function getInitialSeedData() {
  const activityLogs = [
    { id: 'log-101', client_id: 'cli-01', timestamp: getRelativeDate(-2), note: 'Day 1 CMMI DEV L5 on-site appraisal at HITEC City.', logged_by: 'Venkat Rao' },
    { id: 'log-201', client_id: 'cli-02', timestamp: getRelativeDate(-22), note: 'ISO 27001 recertification reminder.', logged_by: 'Priya Nair' },
    { id: 'log-301', client_id: 'cli-03', timestamp: getRelativeDate(-19), note: 'PCI DSS v4.0 scoping call with VP of Engineering.', logged_by: 'Ananya Reddy' },
    { id: 'log-401', client_id: 'cli-04', timestamp: getRelativeDate(-27), note: 'Stage 1 review for CMMI SVC L3.', logged_by: 'Suresh Kumar' },
    { id: 'log-501', client_id: 'cli-05', timestamp: getRelativeDate(-5), note: 'SOC 2 Type II attestation report delivered.', logged_by: 'Venkat Rao' },
    { id: 'log-601', client_id: 'cli-06', timestamp: getRelativeDate(-18), note: 'HIPAA & GDPR annual compliance recertification schedule.', logged_by: 'Ananya Reddy' },
    { id: 'log-701', client_id: 'cli-07', timestamp: getRelativeDate(-25), note: 'Cert-In Empanelment readiness audit inquiry.', logged_by: 'Rajesh Sharma' },
    { id: 'log-801', client_id: 'cli-08', timestamp: getRelativeDate(-24), note: 'CMMI DEV Level 3 process artifacts uploaded.', logged_by: 'Suresh Kumar' },
    { id: 'log-901', client_id: 'cli-09', timestamp: getRelativeDate(-4), note: 'ISO 9001:2015 surveillance audit #1 completed.', logged_by: 'Venkat Rao' },
    { id: 'log-1001', client_id: 'cli-10', timestamp: getRelativeDate(-1), note: 'Final Report submitted for PCI DSS certification.', logged_by: 'Priya Nair' },
    { id: 'log-1101', client_id: 'cli-11', timestamp: getRelativeDate(-3), note: 'Deep dive session on ISO 42001 (AIMS).', logged_by: 'Ananya Reddy' },
    { id: 'log-1201', client_id: 'cli-12', timestamp: getRelativeDate(-4), note: 'Drafting ISO 20000 Lead Appraisal Findings report.', logged_by: 'Venkat Rao' },
    { id: 'log-1301', client_id: 'cli-13', timestamp: getRelativeDate(-3), note: 'Updated ISO 27701 PIMS privacy impact assessment.', logged_by: 'Priya Nair' },
    { id: 'log-1401', client_id: 'cli-14', timestamp: getRelativeDate(-50), note: 'ISO 22301 BCMS lapsed outreach.', logged_by: 'Ananya Reddy' },
    { id: 'log-1501', client_id: 'cli-15', timestamp: getRelativeDate(-1), note: 'CMMI SPM appraisal scope defined.', logged_by: 'Rajesh Sharma' },
    { id: 'log-1601', client_id: 'cli-16', timestamp: getRelativeDate(-7), note: 'CMMI SEC high-maturity security objectives.', logged_by: 'Venkat Rao' },
    { id: 'log-1701', client_id: 'cli-17', timestamp: getRelativeDate(-31), note: 'HIPAA & GDPR compliance follow-up.', logged_by: 'Ananya Reddy' },
    { id: 'log-1801', client_id: 'cli-18', timestamp: getRelativeDate(-2), note: 'SOC 2 assessment interviews.', logged_by: 'Priya Nair' },
    { id: 'log-1901', client_id: 'cli-19', timestamp: getRelativeDate(-20), note: 'ISMS ISO 27001 recertification due in 30 days.', logged_by: 'Rajesh Sharma' },
    { id: 'log-2001', client_id: 'cli-20', timestamp: getRelativeDate(-32), note: 'People CMM workforce appraisal staffing matrix pending.', logged_by: 'Suresh Kumar' }
  ];

  const clients = [
    { id: 'cli-01', name: 'Vantara Technologies Pvt Ltd', service_type: 'CMMI DEV', stage: 'in_appraisal', pipeline_substage: 'site_visit', owner: 'Venkat Rao', last_contact_date: getRelativeDate(-2), cert_expiry_date: null },
    { id: 'cli-02', name: 'Meridian Software Labs', service_type: 'ISMS', stage: 'renewal_due', pipeline_substage: null, owner: 'Priya Nair', last_contact_date: getRelativeDate(-22), cert_expiry_date: getRelativeDateOnly(35) },
    { id: 'cli-03', name: 'Sundar Fintech Pvt Ltd', service_type: 'PCI DSS', stage: 'lead', pipeline_substage: null, owner: 'Ananya Reddy', last_contact_date: getRelativeDate(-19), cert_expiry_date: null },
    { id: 'cli-04', name: 'Krishna Infosystems', service_type: 'CMMI SVC', stage: 'in_appraisal', pipeline_substage: 'assessment', owner: 'Suresh Kumar', last_contact_date: getRelativeDate(-27), cert_expiry_date: null },
    { id: 'cli-05', name: 'Nalanda Digital Services', service_type: 'SOC', stage: 'active', pipeline_substage: null, owner: 'Venkat Rao', last_contact_date: getRelativeDate(-5), cert_expiry_date: getRelativeDateOnly(280) },
    { id: 'cli-06', name: 'Kakatiya Health Solutions', service_type: 'HIPAA', stage: 'renewal_due', pipeline_substage: null, owner: 'Ananya Reddy', last_contact_date: getRelativeDate(-18), cert_expiry_date: getRelativeDateOnly(42) },
    { id: 'cli-07', name: 'Telangana Cyber Defense Corp', service_type: 'Cert-In', stage: 'lead', pipeline_substage: null, owner: 'Rajesh Sharma', last_contact_date: getRelativeDate(-25), cert_expiry_date: null },
    { id: 'cli-08', name: 'Cyberabad Cloud Infotech', service_type: 'CMMI DEV', stage: 'in_appraisal', pipeline_substage: 'docs_collected', owner: 'Suresh Kumar', last_contact_date: getRelativeDate(-24), cert_expiry_date: null },
    { id: 'cli-09', name: 'Deccan Aerospace & Defense', service_type: 'QMS', stage: 'active', pipeline_substage: null, owner: 'Venkat Rao', last_contact_date: getRelativeDate(-4), cert_expiry_date: getRelativeDateOnly(190) },
    { id: 'cli-10', name: 'Charminar Payments & Banking', service_type: 'PCI DSS', stage: 'in_appraisal', pipeline_substage: 'signoff', owner: 'Priya Nair', last_contact_date: getRelativeDate(-1), cert_expiry_date: null },
    { id: 'cli-11', name: 'Hitech City AI Innovations', service_type: 'AIMS', stage: 'lead', pipeline_substage: null, owner: 'Ananya Reddy', last_contact_date: getRelativeDate(-3), cert_expiry_date: null },
    { id: 'cli-12', name: 'Bhagyanagar Enterprise Systems', service_type: 'ITSM', stage: 'in_appraisal', pipeline_substage: 'report', owner: 'Venkat Rao', last_contact_date: getRelativeDate(-4), cert_expiry_date: null },
    { id: 'cli-13', name: 'Godavari Data Systems', service_type: 'PIMS', stage: 'renewal_due', pipeline_substage: null, owner: 'Priya Nair', last_contact_date: getRelativeDate(-3), cert_expiry_date: getRelativeDateOnly(65) },
    { id: 'cli-14', name: 'Secunderabad Global Logistics', service_type: 'BCMS', stage: 'lapsed', pipeline_substage: null, owner: 'Ananya Reddy', last_contact_date: getRelativeDate(-50), cert_expiry_date: getRelativeDateOnly(-45) },
    { id: 'cli-15', name: 'Warangal Microelectronics', service_type: 'CMMI SPM', stage: 'in_appraisal', pipeline_substage: 'inquiry', owner: 'Rajesh Sharma', last_contact_date: getRelativeDate(-1), cert_expiry_date: null },
    { id: 'cli-16', name: 'Nizam Defense Robotics', service_type: 'CMMI SEC', stage: 'active', pipeline_substage: null, owner: 'Venkat Rao', last_contact_date: getRelativeDate(-7), cert_expiry_date: getRelativeDateOnly(310) },
    { id: 'cli-17', name: 'Gachibowli BioTech Analytics', service_type: 'GDPR', stage: 'lead', pipeline_substage: null, owner: 'Ananya Reddy', last_contact_date: getRelativeDate(-31), cert_expiry_date: null },
    { id: 'cli-18', name: 'Kondapur SaaS Dynamics', service_type: 'SOC', stage: 'in_appraisal', pipeline_substage: 'assessment', owner: 'Priya Nair', last_contact_date: getRelativeDate(-2), cert_expiry_date: null },
    { id: 'cli-19', name: 'Manjeera Telecom Services', service_type: 'ISMS', stage: 'renewal_due', pipeline_substage: null, owner: 'Rajesh Sharma', last_contact_date: getRelativeDate(-20), cert_expiry_date: getRelativeDateOnly(30) },
    { id: 'cli-20', name: 'Hyderabad Quantum Labs', service_type: 'CMMI PPL', stage: 'in_appraisal', pipeline_substage: 'docs_collected', owner: 'Suresh Kumar', last_contact_date: getRelativeDate(-32), cert_expiry_date: null }
  ];

  return { clients, activityLogs };
}

function runTests() {
  console.log('🧪 Running Shree QA Solutions CRM Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  };

  const { clients, activityLogs } = getInitialSeedData();

  // Test 1: Seed counts
  assert(clients.length === 20, `Seed contains exactly 20 clients (${clients.length})`);
  assert(activityLogs.length === 20, `Seed contains 20 activity logs (${activityLogs.length})`);

  const getClientLogs = (clientId) => {
    return activityLogs
      .filter((log) => log.client_id === clientId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getLatestActivityDate = (clientId) => {
    const logs = getClientLogs(clientId);
    if (logs.length > 0) return logs[0].timestamp;
    const client = clients.find((c) => c.id === clientId);
    return client?.last_contact_date || new Date().toISOString();
  };

  const getDaysSinceLastActivity = (clientId) => {
    const latest = getLatestActivityDate(clientId);
    const diffMs = Date.now() - new Date(latest).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };

  const isRenewalAtRisk = (client) => {
    if (!client.cert_expiry_date || client.stage === 'lapsed') return false;
    const expiryTime = new Date(client.cert_expiry_date).getTime();
    const daysUntilExpiry = Math.ceil((expiryTime - Date.now()) / (1000 * 60 * 60 * 24));
    const isExpiryWithin90Days = daysUntilExpiry <= 90 && daysUntilExpiry >= 0;
    const daysSinceActivity = getDaysSinceLastActivity(client.id);
    return isExpiryWithin90Days && daysSinceActivity > 14;
  };

  const isColdLead = (client) => {
    if (client.stage !== 'lead') return false;
    const daysSinceActivity = getDaysSinceLastActivity(client.id);
    return daysSinceActivity > 14;
  };

  const isStalledEngagement = (client) => {
    if (client.stage !== 'in_appraisal') return false;
    const daysSinceActivity = getDaysSinceLastActivity(client.id);
    return daysSinceActivity > 21;
  };

  // Test 2: Renewals at Risk
  const renewalsAtRisk = clients.filter(isRenewalAtRisk);
  console.log(`\n📋 Renewals at Risk (${renewalsAtRisk.length} found):`);
  renewalsAtRisk.forEach(c => console.log(`   • ${c.name} (${c.service_type}) - Expiry: ${c.cert_expiry_date}, Inactive: ${getDaysSinceLastActivity(c.id)}d`));
  assert(renewalsAtRisk.length === 3, 'Exactly 3 clients flagged as Renewals at Risk (Meridian, Kakatiya, Manjeera)');
  assert(renewalsAtRisk.some(c => c.name === 'Meridian Software Labs'), 'Meridian Software Labs is in Renewals at Risk');
  assert(!renewalsAtRisk.some(c => c.name === 'Godavari Data Systems'), 'Godavari Data Systems (recently active) is NOT in Renewals at Risk');

  // Test 3: Cold Leads
  const coldLeads = clients.filter(isColdLead);
  console.log(`\n📋 Cold Leads (${coldLeads.length} found):`);
  coldLeads.forEach(c => console.log(`   • ${c.name} (${c.service_type}) - Inactive: ${getDaysSinceLastActivity(c.id)}d`));
  assert(coldLeads.length === 3, 'Exactly 3 clients flagged as Cold Leads (Sundar, Telangana Cyber, Gachibowli)');
  assert(coldLeads.some(c => c.name === 'Sundar Fintech Pvt Ltd'), 'Sundar Fintech Pvt Ltd is in Cold Leads');
  assert(!coldLeads.some(c => c.name === 'Hitech City AI Innovations'), 'Hitech City AI Innovations (recently active) is NOT in Cold Leads');

  // Test 4: Stalled Engagements
  const stalledEngagements = clients.filter(isStalledEngagement);
  console.log(`\n📋 Stalled Engagements (${stalledEngagements.length} found):`);
  stalledEngagements.forEach(c => console.log(`   • ${c.name} (${c.service_type}) - Inactive: ${getDaysSinceLastActivity(c.id)}d`));
  assert(stalledEngagements.length === 3, 'Exactly 3 clients flagged as Stalled Engagements (Krishna, Cyberabad, Hyderabad Quantum)');
  assert(stalledEngagements.some(c => c.name === 'Krishna Infosystems'), 'Krishna Infosystems is in Stalled Engagements');
  assert(!stalledEngagements.some(c => c.name === 'Vantara Technologies Pvt Ltd'), 'Vantara Technologies Pvt Ltd (recently active) is NOT in Stalled Engagements');

  // Test 5: Kanban Substage sequence coverage
  const inAppraisal = clients.filter(c => c.stage === 'in_appraisal');
  const substages = inAppraisal.map(c => c.pipeline_substage);
  assert(substages.includes('inquiry'), 'Kanban contains Inquiry stage cards (Warangal)');
  assert(substages.includes('docs_collected'), 'Kanban contains Docs Collected stage cards (Cyberabad, Hyderabad Quantum)');
  assert(substages.includes('assessment'), 'Kanban contains Assessment stage cards (Krishna, Kondapur)');
  assert(substages.includes('site_visit'), 'Kanban contains Site Visit stage cards (Vantara)');
  assert(substages.includes('report'), 'Kanban contains Report stage cards (Bhagyanagar)');
  assert(substages.includes('signoff'), 'Kanban contains Sign-off stage cards (Charminar)');

  // Test 6: Activity Logging resets risk
  const clientToUpdate = { ...clients[1] }; // Meridian Software Labs
  assert(isRenewalAtRisk(clientToUpdate), 'Meridian starts at Risk');
  const updatedLog = { id: 'new-log', client_id: clientToUpdate.id, timestamp: new Date().toISOString(), note: 'Followed up with CISO', logged_by: 'Demo' };
  activityLogs.unshift(updatedLog);
  assert(!isRenewalAtRisk(clientToUpdate), 'Adding activity log immediately clears Renewal at Risk status');

  console.log(`\n========================================`);
  console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests();
