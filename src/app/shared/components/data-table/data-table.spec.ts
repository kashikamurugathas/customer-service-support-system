import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { DataTable, TableColumn } from './data-table';

interface TestUser extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  status: string;
  priority: string;
  bio: string;
}

describe('DataTable Component', () => {
  let fixture: ComponentFixture<DataTable<TestUser>>;
  let component: DataTable<TestUser>;
  let componentRef: ComponentRef<DataTable<TestUser>>;

  const mockColumns: TableColumn<TestUser>[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', type: 'badge' },
    { key: 'priority', label: 'Priority', type: 'priority' },
    { key: 'bio', label: 'Biography', truncate: true, maxWidth: '200px' },
  ];

  const mockData: TestUser[] = [
    { id: 'U-1', name: 'Alice Smith', email: 'alice@example.com', status: 'Active', priority: 'High', bio: 'Senior Customer Success Manager handling enterprise tier accounts' },
    { id: 'U-2', name: 'Bob Jones', email: 'bob@example.com', status: 'Pending', priority: 'Medium', bio: 'Technical Support Specialist focusing on API integrations' },
    { id: 'U-3', name: 'Charlie Brown', email: 'charlie@example.com', status: 'Inactive', priority: 'Low', bio: 'Tier 1 Support Agent assisting with billing questions' },
    { id: 'U-4', name: 'Diana Prince', email: 'diana@example.com', status: 'Open', priority: 'Urgent', bio: 'Lead Customer Experience Architect and Operations Manager' },
    { id: 'U-5', name: 'Evan Wright', email: 'evan@example.com', status: 'Resolved', priority: 'Normal', bio: 'Customer feedback coordinator and onboarding specialist' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTable],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable<TestUser>);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    await fixture.whenStable();
  });

  it('should create the data table component', () => {
    expect(component).toBeTruthy();
  });

  it('should render dynamic column headers and rows', async () => {
    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const headerCells = compiled.querySelectorAll('thead th');
    expect(headerCells.length).toBe(mockColumns.length);
    expect(headerCells[0].textContent).toContain('ID');
    expect(headerCells[1].textContent).toContain('Name');

    const dataRows = compiled.querySelectorAll('tbody tr.data-row');
    expect(dataRows.length).toBe(mockData.length);
  });

  it('should sort data in ascending and descending order when sortable header is clicked', async () => {
    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const nameHeader = compiled.querySelectorAll('thead th')[1] as HTMLElement;

    // Click to sort asc by Name
    nameHeader.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.sortKey()).toBe('name');
    expect(component.sortDirection()).toBe('asc');
    let rows = fixture.nativeElement.querySelectorAll('tbody tr.data-row');
    expect(rows[0].textContent).toContain('Alice Smith');
    expect(rows[4].textContent).toContain('Evan Wright');

    // Click again to sort desc
    nameHeader.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.sortDirection()).toBe('desc');
    rows = fixture.nativeElement.querySelectorAll('tbody tr.data-row');
    expect(rows[0].textContent).toContain('Evan Wright');
    expect(rows[4].textContent).toContain('Alice Smith');
  });

  it('should filter rows via search input', async () => {
    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', mockData);
    componentRef.setInput('searchable', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const searchInput = fixture.nativeElement.querySelector('.table-search-input') as HTMLInputElement;
    searchInput.value = 'diana';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.searchQuery()).toBe('diana');
    const dataRows = fixture.nativeElement.querySelectorAll('tbody tr.data-row');
    expect(dataRows.length).toBe(1);
    expect(dataRows[0].textContent).toContain('Diana Prince');
  });

  it('should handle pagination and page size selection', async () => {
    const manyUsers: TestUser[] = Array.from({ length: 25 }, (_, i) => ({
      id: `U-${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: 'Active',
      priority: 'Normal',
      bio: `Bio for user ${i + 1}`,
    }));

    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', manyUsers);
    componentRef.setInput('pageSize', 10);
    componentRef.setInput('paginated', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.totalPages()).toBe(3);
    let rows = fixture.nativeElement.querySelectorAll('tbody tr.data-row');
    expect(rows.length).toBe(10);

    // Navigate to next page
    component.goToPage(2);
    fixture.detectChanges();
    await fixture.whenStable();

    rows = fixture.nativeElement.querySelectorAll('tbody tr.data-row');
    expect(rows.length).toBe(10);
    expect(rows[0].textContent).toContain('User 11');

    // Change page size to 25
    component.pageSize.set(25);
    fixture.detectChanges();
    await fixture.whenStable();

    rows = fixture.nativeElement.querySelectorAll('tbody tr.data-row');
    expect(rows.length).toBe(25);
    expect(component.totalPages()).toBe(1);
  });

  it('should support server-side mode with totalRecords and emit events', async () => {
    let emittedSearch = '';
    component.searchChange.subscribe((s) => (emittedSearch = s));

    componentRef.setInput('serverSide', true);
    componentRef.setInput('totalRecords', 100);
    componentRef.setInput('pageSize', 10);
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.totalPages()).toBe(10);
    component.goToPage(3);
    expect(component.currentPage()).toBe(3);

    const searchInput = fixture.nativeElement.querySelector('.table-search-input') as HTMLInputElement;
    searchInput.value = 'query';
    searchInput.dispatchEvent(new Event('input'));
    expect(emittedSearch).toBe('query');
  });

  it('should show error state message and emit retry', async () => {
    let retried = false;
    component.retry.subscribe(() => (retried = true));

    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('errorMessage', 'Failed to fetch from backend GraphQL endpoint');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-title')?.textContent).toContain('Error Loading Records');
    expect(compiled.querySelector('.empty-desc')?.textContent).toContain('Failed to fetch from backend');

    const retryBtn = compiled.querySelector('.empty-clear-btn') as HTMLButtonElement;
    expect(retryBtn).toBeTruthy();
    retryBtn.click();
    expect(retried).toBe(true);
  });

  it('should show loading skeleton shimmer when loading is true', async () => {
    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', mockData);
    componentRef.setInput('loading', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const skeletonRows = compiled.querySelectorAll('.skeleton-row');
    expect(skeletonRows.length).toBe(5);
    expect(compiled.querySelector('table')?.getAttribute('aria-busy')).toBe('true');
  });

  it('should show empty state message when data is empty', async () => {
    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', []);
    componentRef.setInput('emptyTitle', 'No users found');
    componentRef.setInput('emptyMessage', 'Please add a new user to populate this list.');
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-title')?.textContent).toContain('No users found');
    expect(compiled.querySelector('.empty-desc')?.textContent).toContain('Please add a new user');
  });

  it('should support action column with View, Edit, and Delete buttons and emit events', async () => {
    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', mockData);
    componentRef.setInput('showActions', true);
    fixture.detectChanges();
    await fixture.whenStable();

    let viewedRow: TestUser | null = null;
    let editedRow: TestUser | null = null;
    let deletedRow: TestUser | null = null;

    component.view.subscribe((row) => (viewedRow = row));
    component.edit.subscribe((row) => (editedRow = row));
    component.delete.subscribe((row) => (deletedRow = row));

    const firstRow = fixture.nativeElement.querySelector('tbody tr.data-row');
    const viewBtn = firstRow.querySelector('.action-view') as HTMLButtonElement;
    const editBtn = firstRow.querySelector('.action-edit') as HTMLButtonElement;
    const deleteBtn = firstRow.querySelector('.action-delete') as HTMLButtonElement;

    expect(viewBtn).toBeTruthy();
    expect(editBtn).toBeTruthy();
    expect(deleteBtn).toBeTruthy();

    viewBtn.click();
    expect(viewedRow).toEqual(mockData[0]);

    editBtn.click();
    expect(editedRow).toEqual(mockData[0]);

    deleteBtn.click();
    expect(deletedRow).toEqual(mockData[0]);
  });

  it('should support row selection and select-all functionality', async () => {
    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', mockData);
    componentRef.setInput('selectable', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const headerCheckbox = fixture.nativeElement.querySelector('thead .row-checkbox') as HTMLInputElement;
    expect(headerCheckbox).toBeTruthy();

    // Select all on page
    headerCheckbox.checked = true;
    headerCheckbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.selectedRows().length).toBe(mockData.length);
    expect(fixture.nativeElement.querySelector('.selection-banner')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.selection-banner')?.textContent).toContain('5 rows selected');

    // Clear selection
    component.clearSelection();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.selectedRows().length).toBe(0);
    expect(fixture.nativeElement.querySelector('.selection-banner')).toBeFalsy();
  });

  it('should apply truncation and title tooltip when truncate is enabled', async () => {
    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
    await fixture.whenStable();

    const firstRow = fixture.nativeElement.querySelector('tbody tr.data-row');
    const bioCell = firstRow.querySelector('.cell-truncated') as HTMLElement;
    expect(bioCell).toBeTruthy();
    expect(bioCell.getAttribute('title')).toContain('Senior Customer Success Manager');
  });

  it('should correctly format badges and priority indicators', async () => {
    componentRef.setInput('columns', mockColumns);
    componentRef.setInput('data', mockData);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const badges = compiled.querySelectorAll('.table-pill');
    expect(badges.length).toBe(mockData.length);

    const priorityDots = compiled.querySelectorAll('.priority-dot');
    expect(priorityDots.length).toBe(mockData.length);
    expect(priorityDots[0].classList.contains('priority-high')).toBe(true);
  });
});
