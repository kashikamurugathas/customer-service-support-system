import { Component, computed, inject, signal } from '@angular/core';
import { AgentService } from '../../services/agent.service';
import { Agent, AgentCreateInput, AgentStatus, AgentUpdateInput } from '../../models/agent.model';
import { DataTable, TableColumn } from '../../../../shared/components/data-table/data-table';
import { AgentStatsComponent } from '../../components/agent-stats/agent-stats';
import { AgentFormDialogComponent } from '../../components/agent-form-dialog/agent-form-dialog';
import { AgentDetailDialogComponent } from '../../components/agent-detail-dialog/agent-detail-dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-agent-list',
  imports: [
    DataTable,
    AgentStatsComponent,
    AgentFormDialogComponent,
    AgentDetailDialogComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './agent-list.html',
  styleUrl: './agent-list.css',
})
export class AgentListPage {
  readonly agentService = inject(AgentService);

  readonly activeStatusFilter = signal<string>('ALL');

  // Modal states
  readonly formDialogOpen = signal<boolean>(false);
  readonly selectedAgentForEdit = signal<Agent | null>(null);
  readonly detailDialogOpen = signal<boolean>(false);
  readonly selectedAgentForDetail = signal<Agent | null>(null);
  readonly deleteDialogOpen = signal<boolean>(false);
  readonly agentToDelete = signal<Agent | null>(null);

  readonly columns: TableColumn<Agent>[] = [
    { key: 'agentId', label: 'Agent ID', width: '120px' },
    { key: 'name', label: 'Agent Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'createdAt', label: 'Created Date', type: 'date' },
    { key: 'actions', label: 'Actions', type: 'actions' },
  ];

  readonly filteredAgents = computed(() => {
    const status = this.activeStatusFilter();
    const agents = this.agentService.agents();
    if (status === 'ALL') return agents;
    return agents.filter((a) => a.status === status);
  });

  setStatusFilter(status: string): void {
    this.activeStatusFilter.set(status);
  }

  openCreateDialog(): void {
    this.selectedAgentForEdit.set(null);
    this.formDialogOpen.set(true);
  }

  onViewAgent(agent: Agent): void {
    this.selectedAgentForDetail.set(agent);
    this.detailDialogOpen.set(true);
  }

  onEditAgent(agent: Agent): void {
    this.selectedAgentForDetail.set(null);
    this.detailDialogOpen.set(false);
    this.selectedAgentForEdit.set(agent);
    this.formDialogOpen.set(true);
  }

  onPromptDelete(agent: Agent): void {
    this.agentToDelete.set(agent);
    this.deleteDialogOpen.set(true);
  }

  onConfirmDelete(): void {
    const agent = this.agentToDelete();
    if (agent) {
      this.agentService.deleteAgent(agent.id).subscribe();
      this.deleteDialogOpen.set(false);
      this.agentToDelete.set(null);
    }
  }

  onSaveAgent(event: { isEdit: boolean; id?: string; data: AgentCreateInput | AgentUpdateInput }): void {
    if (event.isEdit && event.id) {
      this.agentService.updateAgent(event.id, event.data as AgentUpdateInput).subscribe(() => {
        this.formDialogOpen.set(false);
      });
    } else {
      this.agentService.createAgent(event.data as AgentCreateInput).subscribe(() => {
        this.formDialogOpen.set(false);
      });
    }
  }

  reconnect(): void {
    this.agentService.loadAgents();
    this.agentService.loadStats();
  }
}
