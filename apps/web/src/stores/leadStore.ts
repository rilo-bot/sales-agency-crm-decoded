import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lead, Activity, Agent, PipelineStage } from '@/types/lead';

interface LeadState {
  leads: Lead[];
  activities: Activity[];
  agents: Agent[];
  filterStage: PipelineStage | 'All';
  searchQuery: string;
}

interface LeadActions {
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Omit<Lead, 'id' | 'createdAt'>>) => void;
  deleteLead: (id: string) => void;
  moveLeadToStage: (id: string, stage: PipelineStage) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  addAgent: (agent: Omit<Agent, 'id' | 'createdAt'>) => Agent;
  setFilterStage: (stage: PipelineStage | 'All') => void;
  setSearchQuery: (q: string) => void;
}

export const useLeadStore = create<LeadState & LeadActions>()(
  persist(
    (set, get) => ({
      leads: [],
      activities: [],
      agents: [],
      filterStage: 'All',
      searchQuery: '',

      addLead: (leadData) => {
        const newLead: Lead = {
          ...leadData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ leads: [...state.leads, newLead] }));
        return newLead;
      },

      updateLead: (id, updates) => {
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: new Date() } : l,
          ),
        }));
      },

      deleteLead: (id) => {
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
          activities: state.activities.filter((a) => a.leadId !== id),
        }));
      },

      moveLeadToStage: (id, stage) => {
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, stage, updatedAt: new Date() } : l,
          ),
        }));
      },

      addActivity: (activityData) => {
        const newActivity: Activity = {
          ...activityData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({ activities: [...state.activities, newActivity] }));
      },

      addAgent: (agentData) => {
        const newAgent: Agent = {
          ...agentData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        set((state) => ({ agents: [...state.agents, newAgent] }));
        return newAgent;
      },

      setFilterStage: (stage) => {
        set({ filterStage: stage });
      },

      setSearchQuery: (q) => {
        set({ searchQuery: q });
      },
    }),
    { name: 'agencyflow-leads' },
  ),
);
