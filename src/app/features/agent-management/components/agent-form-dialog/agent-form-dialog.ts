import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Agent, AgentCreateInput, AgentStatus, AgentUpdateInput } from '../../models/agent.model';

@Component({
  selector: 'app-agent-form-dialog',
  imports: [ReactiveFormsModule],
  template: `
    @if (visible()) {
      <div class="modal-backdrop" (click)="onCancel()">
        <div class="modal-container" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div class="modal-header">
            <h2 id="modal-title">{{ isEdit ? 'Edit Agent Profile' : 'Add New Support Agent' }}</h2>
            <button type="button" class="close-btn" (click)="onCancel()" aria-label="Close dialog">✕</button>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="modal-form">
            <div class="form-grid">
              <div class="form-group full-width">
                <label for="agentName">Full Name <span class="required">*</span></label>
                <input
                  id="agentName"
                  type="text"
                  formControlName="name"
                  placeholder="e.g. Sarah Jenkins"
                  [class.input-error]="form.get('name')?.invalid && form.get('name')?.touched"
                />
                @if (form.get('name')?.invalid && form.get('name')?.touched) {
                  <span class="field-error">Agent full name is required.</span>
                }
              </div>

              <div class="form-group">
                <label for="agentEmail">Email Address <span class="required">*</span></label>
                <input
                  id="agentEmail"
                  type="email"
                  formControlName="email"
                  placeholder="e.g. sarah.j@supportdesk.io"
                  [class.input-error]="form.get('email')?.invalid && form.get('email')?.touched"
                />
                @if (form.get('email')?.invalid && form.get('email')?.touched) {
                  <span class="field-error">Please enter a valid email address.</span>
                }
              </div>

              <div class="form-group">
                <label for="agentPhone">Phone Number</label>
                <input
                  id="agentPhone"
                  type="tel"
                  formControlName="phone"
                  placeholder="e.g. +1 (555) 234-5678"
                />
              </div>

              <div class="form-group">
                <label for="agentDept">Department <span class="required">*</span></label>
                <select id="agentDept" formControlName="department">
                  <option value="Customer Care">Customer Care</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing & Subscriptions">Billing & Subscriptions</option>
                  <option value="Enterprise Success">Enterprise Success</option>
                </select>
              </div>

              <div class="form-group">
                <label for="agentRole">Role / Title <span class="required">*</span></label>
                <input
                  id="agentRole"
                  type="text"
                  formControlName="role"
                  placeholder="e.g. Tier 2 Specialist"
                  [class.input-error]="form.get('role')?.invalid && form.get('role')?.touched"
                />
                @if (form.get('role')?.invalid && form.get('role')?.touched) {
                  <span class="field-error">Role/Title is required.</span>
                }
              </div>

              <div class="form-group full-width">
                <label for="agentStatus">Status <span class="required">*</span></label>
                <select id="agentStatus" formControlName="status">
                  @if (agent() && !['Working', 'Active', 'Available', 'Inactive', 'On Break', 'Offline'].includes(agent()!.status)) {
                    <option [value]="agent()!.status">{{ agent()!.status }}</option>
                  }
                  <option value="Working">Working</option>
                  <option value="Active">Active</option>
                  <option value="Available">Available</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Break">On Break</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-secondary" (click)="onCancel()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="form.invalid">
                {{ isEdit ? 'Save Changes' : 'Create Agent' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: `
    .modal-backdrop { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px); padding: 16px; }
    .modal-container { width: 100%; max-width: 520px; background: #fff; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); overflow: hidden; animation: modalPop 0.18s ease-out; }
    @keyframes modalPop { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #edf0f5; background: #fafbfc; }
    .modal-header h2 { margin: 0; color: #1e293b; font-size: 16px; font-weight: 700; }
    .close-btn { width: 28px; height: 28px; border: 0; border-radius: 6px; background: transparent; color: #64748b; font-size: 13px; cursor: pointer; display: grid; place-items: center; }
    .close-btn:hover { background: #e2e8f0; color: #1e293b; }
    .modal-form { padding: 20px 22px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .full-width { grid-column: 1 / -1; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group label { color: #475569; font-size: 12px; font-weight: 600; }
    .required { color: #dc2626; }
    .form-group input, .form-group select { height: 38px; border: 1px solid #e2e8f0; border-radius: 7px; padding: 0 11px; font-size: 13px; color: #1e293b; outline: 0; background: #fff; transition: border-color 0.12s; }
    .form-group input:focus, .form-group select:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12); }
    .form-group input.input-error { border-color: #ef4444; }
    .field-error { color: #dc2626; font-size: 11px; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; padding-top: 16px; border-top: 1px solid #edf0f5; }
    .btn-secondary { height: 38px; padding: 0 16px; border: 1px solid #e2e8f0; border-radius: 7px; background: #fff; color: #475569; font-size: 13px; font-weight: 600; cursor: pointer; }
    .btn-secondary:hover { background: #f8fafc; }
    .btn-primary { height: 38px; padding: 0 18px; border: 0; border-radius: 7px; background: #4f46e5; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 1px 2px rgba(79, 70, 229, 0.3); }
    .btn-primary:hover:not(:disabled) { background: #4338ca; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    @media (max-width: 540px) { .form-grid { grid-template-columns: 1fr; } }
  `,
})
export class AgentFormDialogComponent {
  readonly agent = input<Agent | null>(null);
  readonly visible = input<boolean>(false);

  readonly close = output<void>();
  readonly save = output<{ isEdit: boolean; id?: string; data: AgentCreateInput | AgentUpdateInput }>();

  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true }),
    department: new FormControl('Customer Care', { nonNullable: true, validators: [Validators.required] }),
    role: new FormControl('Support Agent', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<AgentStatus>('Active', { nonNullable: true, validators: [Validators.required] }),
  });

  get isEdit(): boolean {
    return !!this.agent();
  }

  constructor() {
    effect(() => {
      const a = this.agent();
      if (a) {
        this.form.patchValue({
          name: a.name,
          email: a.email,
          phone: a.phone || '',
          department: a.department,
          role: a.role,
          status: a.status,
        });
      } else {
        this.form.reset({
          name: '',
          email: '',
          phone: '',
          department: 'Customer Care',
          role: 'Support Agent',
          status: 'Active',
        });
      }
    });
  }

  onCancel(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const existing = this.agent();
    if (existing) {
      this.save.emit({
        isEdit: true,
        id: existing.id,
        data: value as AgentUpdateInput,
      });
    } else {
      this.save.emit({
        isEdit: false,
        data: value as AgentCreateInput,
      });
    }
  }
}
