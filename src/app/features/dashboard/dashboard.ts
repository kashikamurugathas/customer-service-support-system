
import { Component } from '@angular/core';
import { DataTable, TableColumn } from '../../shared/components/data-table/data-table';

@Component({
  selector: 'app-dashboard',
  imports: [DataTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  columns: TableColumn[] = [
    { key: 'ticketNumber', label: 'Ticket Number' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'subject', label: 'Subject' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' }
  ];

  tickets = [
    {
      ticketNumber: 'TKT-001',
      customerName: 'John',
      subject: 'Login Issue',
      status: 'Open',
      priority: 'High'
    },
    {
      ticketNumber: 'TKT-002',
      customerName: 'David',
      subject: 'Payment Issue',
      status: 'Pending',
      priority: 'Medium'
    },
    {
      ticketNumber: 'TKT-003',
      customerName: 'Sarah',
      subject: 'Account Issue',
      status: 'Resolved',
      priority: 'Low'
    }
  ];

}
