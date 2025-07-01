import { Component, OnInit, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableModule, CommonModule, DividerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  
  numPackages: number = 0;
  delivered: number = 0;
  inTransit: number = 0;
  created: number = 0;
  loading = true;

  ngOnInit(): void {
  }
}
