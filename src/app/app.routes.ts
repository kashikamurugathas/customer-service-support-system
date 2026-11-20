import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';
import { TableColumn } from './shared/components/data-table/data-table';

const directoryColumns: TableColumn[] = [
  { key: 'reference', label: 'Reference' },
  { key: 'name', label: 'Name' },
  { key: 'details', label: 'Details' },
  { key: 'status', label: 'Status' },
  { key: 'priority', label: 'Priority' },
];

const sampleRows: Record<string, unknown>[] = [
  { reference: 'CS-2048', name: 'Olivia Rhye', details: 'Account access request', status: 'Open', priority: 'High' },
  { reference: 'CS-2047', name: 'Phoenix Baker', details: 'Billing and subscription', status: 'In progress', priority: 'Normal' },
  { reference: 'CS-2046', name: 'Lana Steiner', details: 'Product experience', status: 'Pending', priority: 'Low' },
  { reference: 'CS-2045', name: 'Demi Wilkinson', details: 'Delivery follow-up', status: 'Resolved', priority: 'Normal' },
  { reference: 'CS-2044', name: 'Candice Wu', details: 'Technical support', status: 'Open', priority: 'Urgent' },
];

const pageData = (title: string, description: string, metric: string, metricLabel: string) => ({
  page: { title, description, metric, metricLabel, columns: directoryColumns, rows: sampleRows },
});

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then((module) => module.Dashboard) },
      { path: 'tickets', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Tickets', 'Track every customer request in one place.', '48', 'Open tickets') },
      { path: 'agents', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Agents', 'Meet the people delivering excellent customer care.', '24', 'Active agents') },
      { path: 'complaints', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Complaints', 'Review, prioritize, and resolve customer concerns.', '12', 'Needs attention') },
      { path: 'feedback', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Feedback', 'Listen to your customers and learn from every interaction.', '4.8 / 5', 'Average rating') },
      { path: 'priorities', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Priorities', 'Keep urgent work visible and your team focused.', '3', 'Priority levels') },
      { path: 'reports', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Reports', 'Understand team performance and customer outcomes.', '96.8%', 'Satisfaction score') },
      { path: 'service-level', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Service levels', 'Monitor response targets and service commitments.', '98.2%', 'SLA compliance') },
      { path: 'help', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Help center', 'Helpful guidance for your support workspace.', '24/7', 'Support available') },
      { path: '**', loadComponent: () => import('./features/support-page/support-page').then((module) => module.SupportPage), data: pageData('Page not found', 'The page you are looking for is unavailable.', '—', 'Status') },
    ],
  },
];
