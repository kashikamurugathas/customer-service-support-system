import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityManagement } from './priority-management';

describe('PriorityManagement', () => {
  let component: PriorityManagement;
  let fixture: ComponentFixture<PriorityManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
