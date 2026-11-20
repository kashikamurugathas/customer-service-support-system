import { Component, input, output } from '@angular/core';
import { Agent } from '../../models/agent.model';

@Component({
  selector: 'app-agent-detail-dialog',
  imports: [],
  template: `
    @if (visible() && agent()) {
      <div class="modal-backdrop" (click)="close.emit()">
        <div class="modal-container" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-labelledby="detail-title">
          <div class="modal-header">
            <div>
              <span class="agent-id-tag">{{ agent()?.agentId }}</span>
              <h2 id="detail-title">{{ agent()?.name }}</h2>
            </div>
            <button type="button" class="close-btn" (click)="close.emit()" aria-label="Close dialog">✕</button>
          </div>

          <div class="modal-body">
            <div class="agent-profile-banner">
              <div class="agent-avatar">{{ getInitials(agent()?.name || '') }}</div>
              <div class="agent-header-info">
                <strong>{{ agent()?.name }}</strong>
                <span>{{ agent()?.role }} · {{ agent()?.department }}</span>
                <span class="status-pill" [class]="getStatusClass(agent()?.status)">{{ agent()?.status }}</span>
              </div>
            </div>

            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">Email Address</span>
                <span class="detail-val">{{ agent()?.email }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Phone Number</span>
                <span class="detail-val">{{ agent()?.phone || '—' }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Department</span>
                <span class="detail-val">{{ agent()?.department }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Role / Level</span>
                <span class="detail-val">{{ agent()?.role }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">System Record ID</span>
                <span class="detail-val">{{ agent()?.id }}</span>
              </div>

              <div class="detail-item">
                <span class="detail-label">Created Date</span>
                <span class="detail-val">{{ formatDate(agent()?.createdAt) }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="close.emit()">Close</button>
            <button type="button" class="btn-primary" (click)="edit.emit(agent()!)">Edit Agent</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .modal-backdrop { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px); padding: 16px; }
    .modal-container { width: 100%; max-width: 500px; background: #fff; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); overflow: hidden; animation: modalPop 0.18s ease-out; }
    @keyframes modalPop { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    .modal-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #edf0f5; background: #fafbfc; }
    .agent-id-tag { color: #6366f1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
    .modal-header h2 { margin: 4px 0 0; color: #1e293b; font-size: 18px; font-weight: 700; }
    .close-btn { width: 28px; height: 28px; border: 0; border-radius: 6px; background: transparent; color: #64748b; font-size: 13px; cursor: pointer; display: grid; place-items: center; }
    .close-btn:hover { background: #e2e8f0; color: #1e293b; }
    .modal-body { padding: 20px 22px; }
    .agent-profile-banner { display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: #f8fafc; border-radius: 9px; margin-bottom: 18px; }
    .agent-avatar { width: 44px; height: 44px; border-radius: 50%; background: #eef2ff; color: #4f46e5; font-size: 15px; font-weight: 700; display: grid; place-items: center; flex-shrink: 0; }
    .agent-header-info { display: flex; flex-direction: column; gap: 3px; }
    .agent-header-info strong { color: #1e293b; font-size: 14px; }
    .agent-header-info span { color: #64748b; font-size: 12px; }
    .status-pill { display: inline-block; width: fit-content; padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 600; margin-top: 2px; }
    .pill-active { background: #eeedff; color: #5e54d5; }
    .pill-available { background: #e6f7ef; color: #15803d; }
    .pill-inactive { background: #f1f5f9; color: #475569; }
    .pill-break { background: #fff3df; color: #b77716; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .detail-item { display: flex; flex-direction: column; gap: 3px; }
    .detail-label { color: #94a3b8; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
    .detail-val { color: #1e293b; font-size: 13px; font-weight: 500; word-break: break-word; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 22px; border-top: 1px solid #edf0f5; background: #fafbfc; }
    .btn-secondary { height: 36px; padding: 0 16px; border: 1px solid #e2e8f0; border-radius: 7px; background: #fff; color: #475569; font-size: 13px; font-weight: 600; cursor: pointer; }
    .btn-secondary:hover { background: #f8fafc; }
    .btn-primary { height: 36px; padding: 0 16px; border: 0; border-radius: 7px; background: #4f46e5; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; }
    .btn-primary:hover { background: #4338ca; }
    @media (max-width: 500px) { .detail-grid { grid-template-columns: 1fr; } }
  `,
})
export class AgentDetailDialogComponent {
  readonly agent = input<Agent | null>(null);
  readonly visible = input<boolean>(false);

  readonly close = output<void>();
  readonly edit = output<Agent>();

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AG';
  }

  getStatusClass(status?: string): string {
    const s = (status || '').toLowerCase();
    if (s === 'active') return 'pill-active';
    if (s === 'available') return 'pill-available';
    if (s === 'on break') return 'pill-break';
    return 'pill-inactive';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
