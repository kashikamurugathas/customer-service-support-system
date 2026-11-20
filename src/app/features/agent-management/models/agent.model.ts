export type AgentStatus = 'Active' | 'Inactive' | 'Available' | 'Offline' | 'On Break';

export interface Agent extends Record<string, unknown> {
  id: string;
  agentId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: AgentStatus;
  createdAt: string;
}

export interface AgentStats {
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
  availableAgents: number;
}

export interface AgentCreateInput {
  agentId?: string;
  name: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  status?: AgentStatus;
}

export interface AgentUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  role?: string;
  status?: AgentStatus;
}

export interface AgentFilter {
  search?: string;
  status?: string;
  ordering?: string;
  page: number;
  pageSize: number;
}
