import { Component, input } from '@angular/core';
import { AgentStats } from '../../models/agent.model';

@Component({
  selector: 'app-agent-stats',
  imports: [],
  template: `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Total Agents</span>
          <span class="stat-icon icon-blue">♙</span>
        </div>
        <div class="stat-value">{{ stats()?.totalAgents ?? '—' }}</div>
        <div class="stat-sub">Across all departments</div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Active Agents</span>
          <span class="stat-icon icon-green">●</span>
        </div>
        <div class="stat-value">{{ stats()?.activeAgents ?? '—' }}</div>
        <div class="stat-sub">Currently handling tickets</div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Available</span>
          <span class="stat-icon icon-violet">✓</span>
        </div>
        <div class="stat-value">{{ stats()?.availableAgents ?? '—' }}</div>
        <div class="stat-sub">Ready for incoming requests</div>
      </div>

      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Inactive / Offline</span>
          <span class="stat-icon icon-amber">○</span>
        </div>
        <div class="stat-value">{{ stats()?.inactiveAgents ?? '—' }}</div>
        <div class="stat-sub">On break or off shift</div>
      </div>
    </div>
  `,
  styles: `
    .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 20px; }
    .stat-card { background: #fff; border: 1px solid #edf0f5; border-radius: 11px; padding: 16px 18px; box-shadow: 0 1px 3px rgba(16,24,40,.04); }
    .stat-top { display: flex; justify-content: space-between; align-items: center; }
    .stat-label { color: #64748b; font-size: 12px; font-weight: 600; }
    .stat-icon { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 7px; font-size: 14px; font-weight: 700; }
    .icon-blue { color: #4f46e5; background: #eef2ff; }
    .icon-green { color: #16a34a; background: #f0fdf4; }
    .icon-violet { color: #9333ea; background: #faf5ff; }
    .icon-amber { color: #d97706; background: #fffbeb; }
    .stat-value { margin: 8px 0 4px; color: #1e293b; font-size: 26px; font-weight: 700; letter-spacing: -0.03em; }
    .stat-sub { color: #94a3b8; font-size: 11px; }
    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px) { .stats-grid { grid-template-columns: 1fr; gap: 12px; } }
  `,
})
export class AgentStatsComponent {
  readonly stats = input<AgentStats | null>(null);
}
