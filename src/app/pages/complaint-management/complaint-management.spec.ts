import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComplaintManagement } from './complaint-management';

describe('ComplaintManagement', () => {
  let component: ComplaintManagement;
  let fixture: ComponentFixture<ComplaintManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplaintManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
