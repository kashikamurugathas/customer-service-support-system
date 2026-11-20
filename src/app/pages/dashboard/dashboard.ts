import { Component } from '@angular/core';
import { Table } from '../../components/table/table';

@Component({
  imports: [Table],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {}
