export type PipelineStage = 'New' | 'Contacted' | 'Proposal' | 'Closed';
export type ActivityType = 'call' | 'email' | 'note';

export interface Agent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Lead {
  id: string;
  contactName: string;
  company: string;
  email: string;
  phone: string;
  dealValue: number;
  stage: PipelineStage;
  assignedAgentId: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  note: string;
  authorName: string;
  createdAt: Date;
}
