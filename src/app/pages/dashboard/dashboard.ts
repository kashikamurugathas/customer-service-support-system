import { Component } from '@angular/core';
import { Dashboard as LiveSupportDashboard } from '../../features/dashboard/dashboard';

@Component({
  imports: [LiveSupportDashboard],
  selector: 'app-overview-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
