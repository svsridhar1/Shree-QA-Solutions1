'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Client, ActivityLog, DashboardMetrics, PipelineSubstage, RiskFilterType, ServiceType } from '@/types/crm';
import { getInitialSeedData } from '@/lib/seedData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface CRMContextType {
  clients: Client[];
  activityLogs: ActivityLog[];
  isLoading: boolean;
  activeRiskFilter: RiskFilterType;
  setActiveRiskFilter: (filter: RiskFilterType) => void;
  metrics: DashboardMetrics;
  getClientLogs: (clientId: string) => ActivityLog[];
  getLatestActivityDate: (clientId: string) => string;
  getDaysSinceLastActivity: (clientId: string) => number;
  isRenewalAtRisk: (client: Client) => boolean;
  isColdLead: (client: Client) => boolean;
  isStalledEngagement: (client: Client) => boolean;
  addActivityLog: (clientId: string, note: string, loggedBy?: string) => Promise<void>;
  updateClientSubstage: (clientId: string, newSubstage: PipelineSubstage) => Promise<void>;
  updateClient: (updatedClient: Partial<Client> & { id: string }) => Promise<void>;
  addClient: (newClientData: Omit<Client, 'id' | 'created_at'>) => Promise<Client>;
  resetToDemoSeed: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CLIENTS = 'shree_qa_crm_clients_v2';
const LOCAL_STORAGE_KEY_LOGS = 'shree_qa_crm_logs_v2';

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeRiskFilter, setActiveRiskFilter] = useState<RiskFilterType>(null);

  // Initialize data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      // Check if Supabase has live data
      if (isSupabaseConfigured()) {
        try {
          const { data: dbClients, error: clientsError } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

          const { data: dbLogs, error: logsError } = await supabase
            .from('activity_log')
            .select('*')
            .order('timestamp', { ascending: false });

          if (!clientsError && dbClients && dbClients.length > 0) {
            setClients(dbClients);
            setActivityLogs(dbLogs || []);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase fetch failed, falling back to local store:', err);
        }
      }

      // Check localStorage or load initial seeds
      if (typeof window !== 'undefined') {
        const storedClients = localStorage.getItem(LOCAL_STORAGE_KEY_CLIENTS);
        const storedLogs = localStorage.getItem(LOCAL_STORAGE_KEY_LOGS);

        if (storedClients && storedLogs) {
          try {
            setClients(JSON.parse(storedClients));
            setActivityLogs(JSON.parse(storedLogs));
            setIsLoading(false);
            return;
          } catch {
            // fallback to seed
          }
        }
      }

      // Generate seed
      const seed = getInitialSeedData();
      setClients(seed.clients);
      setActivityLogs(seed.activityLogs);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(seed.clients));
        localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(seed.activityLogs));
      }
      setIsLoading(false);
    }

    loadData();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined' && clients.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(clients));
      localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(activityLogs));
    }
  }, [clients, activityLogs, isLoading]);

  // Activity logs for a client
  const getClientLogs = useCallback((clientId: string): ActivityLog[] => {
    return activityLogs
      .filter((log) => log.client_id === clientId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [activityLogs]);

  // Latest activity date (either most recent activity_log or client.last_contact_date)
  const getLatestActivityDate = useCallback((clientId: string): string => {
    const logs = getClientLogs(clientId);
    if (logs.length > 0) {
      return logs[0].timestamp;
    }
    const client = clients.find((c) => c.id === clientId);
    return client?.last_contact_date || new Date().toISOString();
  }, [getClientLogs, clients]);

  // Days since last activity
  const getDaysSinceLastActivity = useCallback((clientId: string): number => {
    const latestDateStr = getLatestActivityDate(clientId);
    const latestTime = new Date(latestDateStr).getTime();
    const diffMs = Date.now() - latestTime;
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }, [getLatestActivityDate]);

  // Renewals at Risk: cert_expiry_date within 90 days (upcoming 0-90d) AND no activity_log in last 14 days
  const isRenewalAtRisk = useCallback((client: Client): boolean => {
    if (!client.cert_expiry_date || client.stage === 'lapsed') return false;
    const expiryTime = new Date(client.cert_expiry_date).getTime();
    const now = Date.now();
    const daysUntilExpiry = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
    
    // Upcoming within 90 days (0 to 90 days)
    const isExpiryWithin90Days = daysUntilExpiry <= 90 && daysUntilExpiry >= 0;
    const daysSinceActivity = getDaysSinceLastActivity(client.id);

    return isExpiryWithin90Days && daysSinceActivity > 14;
  }, [getDaysSinceLastActivity]);

  // Cold Leads: stage = 'lead' AND no activity_log in last 14 days
  const isColdLead = useCallback((client: Client): boolean => {
    if (client.stage !== 'lead') return false;
    const daysSinceActivity = getDaysSinceLastActivity(client.id);
    return daysSinceActivity > 14;
  }, [getDaysSinceLastActivity]);

  // Stalled Engagements: stage = 'in_appraisal' AND no activity_log in last 21 days
  const isStalledEngagement = useCallback((client: Client): boolean => {
    if (client.stage !== 'in_appraisal') return false;
    const daysSinceActivity = getDaysSinceLastActivity(client.id);
    return daysSinceActivity > 21;
  }, [getDaysSinceLastActivity]);

  // Compute metrics
  const metrics = useMemo<DashboardMetrics>(() => {
    let inAppraisalCount = 0;
    let activeCount = 0;
    let renewalDueCount = 0;
    let renewalsAtRiskCount = 0;
    let coldLeadsCount = 0;
    let stalledEngagementsCount = 0;

    const serviceCounts: Record<string, number> = {};

    clients.forEach((client) => {
      if (client.stage === 'in_appraisal') inAppraisalCount++;
      if (client.stage === 'active') activeCount++;
      if (client.stage === 'renewal_due') renewalDueCount++;

      if (isRenewalAtRisk(client)) renewalsAtRiskCount++;
      if (isColdLead(client)) coldLeadsCount++;
      if (isStalledEngagement(client)) stalledEngagementsCount++;

      serviceCounts[client.service_type] = (serviceCounts[client.service_type] || 0) + 1;
    });

    const serviceDistribution = Object.entries(serviceCounts)
      .map(([service, count]) => ({
        service: service as ServiceType,
        count
      }))
      .sort((a, b) => b.count - a.count);

    return {
      totalClients: clients.length,
      inAppraisalCount,
      activeCount,
      renewalDueCount,
      renewalsAtRiskCount,
      coldLeadsCount,
      stalledEngagementsCount,
      serviceDistribution,
    };
  }, [clients, isRenewalAtRisk, isColdLead, isStalledEngagement]);

  // Add Activity Log
  const addActivityLog = useCallback(async (clientId: string, note: string, loggedBy: string = 'Demo User (Lead Appraiser)') => {
    const nowIso = new Date().toISOString();
    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      client_id: clientId,
      timestamp: nowIso,
      note,
      logged_by: loggedBy,
    };

    // Optimistic state update
    setActivityLogs((prev) => [newLog, ...prev]);
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, last_contact_date: nowIso } : c))
    );

    // Sync to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('activity_log').insert([
          {
            client_id: clientId,
            timestamp: nowIso,
            note,
            logged_by: loggedBy,
          }
        ]);
        await supabase
          .from('clients')
          .update({ last_contact_date: nowIso })
          .eq('id', clientId);
      } catch (err) {
        console.error('Failed to sync activity log to Supabase:', err);
      }
    }
  }, []);

  // Update Client Substage
  const updateClientSubstage = useCallback(async (clientId: string, newSubstage: PipelineSubstage) => {
    const nowIso = new Date().toISOString();

    // Optimistic update
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              pipeline_substage: newSubstage,
              last_contact_date: nowIso,
            }
          : c
      )
    );

    // Auto-create an activity log entry for the stage advancement
    const substageNames: Record<PipelineSubstage, string> = {
      inquiry: 'Inquiry',
      docs_collected: 'Docs Collected',
      assessment: 'Assessment',
      site_visit: 'Site Visit',
      report: 'Report Compilation',
      signoff: 'Sign-off Ceremony',
    };

    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      client_id: clientId,
      timestamp: nowIso,
      note: `Appraisal pipeline moved to "${substageNames[newSubstage]}" milestone.`,
      logged_by: 'Lead Appraisal Coordinator',
    };

    setActivityLogs((prev) => [newLog, ...prev]);

    // Sync to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('clients')
          .update({
            pipeline_substage: newSubstage,
            last_contact_date: nowIso,
          })
          .eq('id', clientId);

        await supabase.from('activity_log').insert([
          {
            client_id: clientId,
            timestamp: nowIso,
            note: newLog.note,
            logged_by: newLog.logged_by,
          }
        ]);
      } catch (err) {
        console.error('Failed to sync pipeline update to Supabase:', err);
      }
    }
  }, []);

  // Update Client general details
  const updateClient = useCallback(async (updatedFields: Partial<Client> & { id: string }) => {
    setClients((prev) =>
      prev.map((c) => (c.id === updatedFields.id ? { ...c, ...updatedFields } : c))
    );

    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('clients')
          .update(updatedFields)
          .eq('id', updatedFields.id);
      } catch (err) {
        console.error('Failed to update client in Supabase:', err);
      }
    }
  }, []);

  // Add new Client
  const addClient = useCallback(async (newClientData: Omit<Client, 'id' | 'created_at'>): Promise<Client> => {
    const nowIso = new Date().toISOString();
    const id = 'cli-' + Date.now().toString(36);
    const newClient: Client = {
      ...newClientData,
      id,
      created_at: nowIso,
      last_contact_date: newClientData.last_contact_date || nowIso,
    };

    setClients((prev) => [newClient, ...prev]);

    const initialLog: ActivityLog = {
      id: 'log-' + Date.now(),
      client_id: id,
      timestamp: nowIso,
      note: `Client account created under ${newClient.service_type} appraisal track.`,
      logged_by: newClient.owner || 'System Administrator',
    };
    setActivityLogs((prev) => [initialLog, ...prev]);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('clients')
          .insert([
            {
              name: newClient.name,
              service_type: newClient.service_type,
              stage: newClient.stage,
              pipeline_substage: newClient.pipeline_substage,
              owner: newClient.owner,
              last_contact_date: newClient.last_contact_date,
              cert_expiry_date: newClient.cert_expiry_date,
              notes: newClient.notes,
            }
          ])
          .select()
          .single();

        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.error('Failed to add client to Supabase:', err);
      }
    }

    return newClient;
  }, []);

  // Reset to initial demo seed data
  const resetToDemoSeed = useCallback(() => {
    const seed = getInitialSeedData();
    setClients(seed.clients);
    setActivityLogs(seed.activityLogs);
    setActiveRiskFilter(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY_CLIENTS, JSON.stringify(seed.clients));
      localStorage.setItem(LOCAL_STORAGE_KEY_LOGS, JSON.stringify(seed.activityLogs));
    }
  }, []);

  return (
    <CRMContext.Provider
      value={{
        clients,
        activityLogs,
        isLoading,
        activeRiskFilter,
        setActiveRiskFilter,
        metrics,
        getClientLogs,
        getLatestActivityDate,
        getDaysSinceLastActivity,
        isRenewalAtRisk,
        isColdLead,
        isStalledEngagement,
        addActivityLog,
        updateClientSubstage,
        updateClient,
        addClient,
        resetToDemoSeed,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
