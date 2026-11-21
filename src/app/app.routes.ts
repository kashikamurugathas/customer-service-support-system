import { Routes } from '@angular/router';
import { MainLayout } from './shared/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then((module) => module.Dashboard),
      },
      {
        path: 'agents',
        loadComponent: () => import('./pages/agent-management/agent-management').then((module) => module.AgentManagement),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/user-management/user-management').then((module) => module.UserManagement),
      },
      {
        path: 'tickets',
        loadComponent: () => import('./pages/ticket-management/ticket-management').then((module) => module.TicketManagement),
      },
      {
        path: 'complaints',
        loadComponent: () => import('./pages/complaint-management/complaint-management').then((module) => module.ComplaintManagement),
      },
      {
        path: 'complaint',
        pathMatch: 'full',
        redirectTo: 'complaints',
      },
      {
        path: 'priorities',
        loadComponent: () => import('./pages/priority-management/priority-management').then((module) => module.PriorityManagement),
      },
      {
        path: 'feedback',
        loadComponent: () => import('./pages/feedback/feedback').then((module) => module.Feedback),
      },
      {
        path: 'service-level',
        loadComponent: () => import('./pages/service-level-agreement-management/service-level-agreement-management').then((module) => module.ServiceLevelAgreementManagement),
      },
      {
        path: 'reports',
        loadComponent: () => import('./pages/reports-analytics-management/reports-analytics-management').then((module) => module.ReportsAnalyticsManagement),
      },
    ],
  },
];
