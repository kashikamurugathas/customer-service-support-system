import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { TableColumn } from './shared/components/data-table/data-table';

const emptyRows: Record<string, unknown>[] = [];

const directoryColumns: TableColumn[] = [
  { key: 'reference', label: 'Reference' },
  { key: 'name', label: 'Name' },
  { key: 'details', label: 'Details' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
];

const pageData = (title: string, description: string, metric: string, metricLabel: string) => ({
  page: { title, description, metric, metricLabel, columns: directoryColumns, rows: emptyRows },
});

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then((module) => module.Dashboard) },
      { path: 'tickets', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Tickets', 'Track every customer request in one place.', '—', 'Live data integration unavailable') },
      { path: 'agents', loadComponent: () => import('./features/agent-management/pages/agent-list/agent-list').then((module) => module.AgentListPage) },
      { path: 'complaints', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Complaints', 'Review, prioritize, and resolve customer concerns.', '—', 'Live data integration unavailable') },
      { path: 'feedback', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Feedback', 'Listen to your customers and learn from every interaction.', '—', 'Live data integration unavailable') },
      { path: 'priorities', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Priorities', 'Keep urgent work visible and your team focused.', '—', 'Live data integration unavailable') },
      { path: 'reports', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Reports', 'Understand team performance and customer outcomes.', '—', 'Live data integration unavailable') },
      { path: 'service-level', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Service levels', 'Monitor response targets and service commitments.', '—', 'Live data integration unavailable') },
      { path: 'help', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Help center', 'Helpful guidance for your support workspace.', '24/7', 'Support available') },
      { path: '**', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Page not found', 'The page you are looking for is unavailable.', '—', 'Status') },
    ],
  },
];
