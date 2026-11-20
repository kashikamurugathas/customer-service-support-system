import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  template: `
    @if (visible()) {
      <div class="modal-backdrop" (click)="cancel.emit()">
        <div class="modal-container" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
          <div class="modal-body">
            <div class="confirm-icon-box">⚠</div>
            <h2 id="confirm-title">{{ title() }}</h2>
            <p class="confirm-message">{{ message() }}</p>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" (click)="cancel.emit()">Cancel</button>
            <button type="button" class="btn-confirm-delete" (click)="confirm.emit()">
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .modal-backdrop { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px); padding: 16px; }
    .modal-container { width: 100%; max-width: 420px; background: #fff; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); overflow: hidden; animation: modalPop 0.18s ease-out; }
    @keyframes modalPop { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
    .modal-body { padding: 24px 22px 18px; text-align: center; }
    .confirm-icon-box { width: 44px; height: 44px; margin: 0 auto 12px; border-radius: 50%; background: #fee2e2; color: #dc2626; font-size: 20px; font-weight: 700; display: grid; place-items: center; }
    .modal-body h2 { margin: 0 0 6px; color: #1e293b; font-size: 17px; font-weight: 700; }
    .confirm-message { margin: 0; color: #64748b; font-size: 13px; line-height: 1.5; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 22px; background: #fafbfc; border-top: 1px solid #edf0f5; }
    .btn-cancel { height: 36px; padding: 0 16px; border: 1px solid #e2e8f0; border-radius: 7px; background: #fff; color: #475569; font-size: 13px; font-weight: 600; cursor: pointer; }
    .btn-cancel:hover { background: #f8fafc; }
    .btn-confirm-delete { height: 36px; padding: 0 16px; border: 0; border-radius: 7px; background: #dc2626; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; }
    .btn-confirm-delete:hover { background: #b91c1c; }
  `,
})
export class ConfirmDialogComponent {
  readonly visible = input<boolean>(false);
  readonly title = input<string>('Confirm Deletion');
  readonly message = input<string>('Are you sure you want to delete this record? This action cannot be undone.');
  readonly confirmLabel = input<string>('Delete Agent');

  readonly confirm = output<void>();
  readonly cancel = output<void>();
}
