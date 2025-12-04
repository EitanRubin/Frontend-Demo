import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TicketService } from '../services/ticket.service';
import { Ticket, TicketMessage } from '../models/ticket.model';

@Component({
  selector: 'app-support-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>Customer Support</h1>
        <div class="header-actions">
          <span class="user-name">{{ currentUser()?.name }}</span>
          <button class="btn btn-secondary" (click)="goToMainMenu()">← Main Menu</button>
          <button class="btn btn-secondary" (click)="logout()">Logout</button>
        </div>
      </header>

      <div class="content">
        <div class="toolbar">
          <div class="filter-tabs">
            <button
              class="tab"
              [class.active]="statusFilter() === 'all'"
              (click)="setStatusFilter('all')"
            >
              All ({{ tickets().length }})
            </button>
            <button
              class="tab"
              [class.active]="statusFilter() === 'open'"
              (click)="setStatusFilter('open')"
            >
              Open ({{ countByStatus('open') }})
            </button>
            <button
              class="tab"
              [class.active]="statusFilter() === 'in_progress'"
              (click)="setStatusFilter('in_progress')"
            >
              In Progress ({{ countByStatus('in_progress') }})
            </button>
            <button
              class="tab"
              [class.active]="statusFilter() === 'closed'"
              (click)="setStatusFilter('closed')"
            >
              Closed ({{ countByStatus('closed') }})
            </button>
          </div>
        </div>

        <div class="main-layout">
          <div class="tickets-list">
            @if (loading()) {
              <div class="loading">Loading tickets...</div>
            } @else if (filteredTickets().length === 0) {
              <div class="empty-state">
                <p>No tickets found</p>
              </div>
            } @else {
              @for (ticket of filteredTickets(); track ticket.id) {
                <div
                  class="ticket-card"
                  [class.selected]="selectedTicket()?.id === ticket.id"
                  (click)="selectTicket(ticket)"
                >
                  <div class="ticket-header">
                    <span class="status-badge" [attr.data-status]="ticket.status">
                      {{ formatStatus(ticket.status) }}
                    </span>
                    <span class="ticket-date">{{ formatDate(ticket.created_at) }}</span>
                  </div>
                  <h3 class="ticket-subject">{{ ticket.subject }}</h3>
                  <p class="ticket-customer">{{ ticket.customer_name }} ({{ ticket.customer_email }})</p>
                </div>
              }
            }
          </div>

          <div class="ticket-detail">
            @if (selectedTicket()) {
              <div class="detail-header">
                <h2>{{ selectedTicket()!.subject }}</h2>
                <div class="status-controls">
                  <select [(ngModel)]="newStatus" (change)="updateStatus()">
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div class="detail-info">
                <div class="info-item">
                  <strong>Customer:</strong> {{ selectedTicket()!.customer_name }}
                </div>
                <div class="info-item">
                  <strong>Email:</strong> {{ selectedTicket()!.customer_email }}
                </div>
                <div class="info-item">
                  <strong>Created:</strong> {{ formatDateTime(selectedTicket()!.created_at) }}
                </div>
              </div>

              <div class="messages-container">
                <div class="message initial-message">
                  <div class="message-header">
                    <strong>{{ selectedTicket()!.customer_name }}</strong>
                    <span class="message-time">{{ formatDateTime(selectedTicket()!.created_at) }}</span>
                  </div>
                  <div class="message-body">{{ selectedTicket()!.description }}</div>
                </div>

                @for (message of selectedTicket()!.messages; track message.id) {
                  <div class="message" [attr.data-sender]="message.sender_type">
                    <div class="message-header">
                      <strong>{{ message.sender_name }}</strong>
                      <span class="message-time">{{ formatDateTime(message.created_at) }}</span>
                    </div>
                    <div class="message-body">{{ message.message }}</div>
                  </div>
                }
              </div>

              <div class="reply-box">
                <h3>Reply</h3>
                <textarea
                  [(ngModel)]="replyMessage"
                  placeholder="Type your response here..."
                  rows="4"
                ></textarea>
                <button class="btn btn-primary" (click)="sendReply()" [disabled]="!replyMessage.trim()">
                  Send Reply
                </button>
              </div>
            } @else {
              <div class="no-selection">
                <p>Select a ticket to view details</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .header {
      background: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h1 {
      margin: 0;
      color: #333;
      font-size: 1.75rem;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-name {
      color: #666;
      font-weight: 500;
    }

    .content {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .toolbar {
      margin-bottom: 2rem;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      background: white;
      padding: 0.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .tab {
      padding: 0.75rem 1.5rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      color: #666;
      transition: all 0.3s ease;
    }

    .tab:hover {
      background: #f8f9fa;
    }

    .tab.active {
      background: #11998e;
      color: white;
    }

    .main-layout {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 2rem;
      min-height: 600px;
    }

    .tickets-list {
      background: white;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      max-height: calc(100vh - 250px);
      overflow-y: auto;
    }

    .ticket-card {
      padding: 1rem;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      margin-bottom: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .ticket-card:hover {
      border-color: #11998e;
      box-shadow: 0 2px 8px rgba(17, 153, 142, 0.1);
    }

    .ticket-card.selected {
      border-color: #11998e;
      background: #f0fdf9;
    }

    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge[data-status="open"] {
      background: #fef3c7;
      color: #92400e;
    }

    .status-badge[data-status="in_progress"] {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge[data-status="closed"] {
      background: #d1fae5;
      color: #065f46;
    }

    .ticket-date {
      font-size: 0.75rem;
      color: #999;
    }

    .ticket-subject {
      margin: 0.5rem 0;
      font-size: 1rem;
      color: #333;
    }

    .ticket-customer {
      margin: 0;
      font-size: 0.875rem;
      color: #666;
    }

    .ticket-detail {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      max-height: calc(100vh - 250px);
      overflow-y: auto;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .detail-header h2 {
      margin: 0;
      color: #333;
      flex: 1;
    }

    .status-controls select {
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }

    .detail-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .info-item {
      font-size: 0.875rem;
    }

    .info-item strong {
      color: #666;
      margin-right: 0.5rem;
    }

    .messages-container {
      margin-bottom: 2rem;
    }

    .message {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border-radius: 8px;
      background: #f8f9fa;
    }

    .message.initial-message {
      background: #fff7ed;
      border-left: 4px solid #f59e0b;
    }

    .message[data-sender="support"] {
      background: #e0f2fe;
      border-left: 4px solid #0284c7;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }

    .message-header strong {
      color: #333;
    }

    .message-time {
      font-size: 0.75rem;
      color: #999;
    }

    .message-body {
      color: #333;
      line-height: 1.6;
    }

    .reply-box {
      border-top: 1px solid #e9ecef;
      padding-top: 1.5rem;
    }

    .reply-box h3 {
      margin: 0 0 1rem;
      font-size: 1rem;
      color: #333;
    }

    .reply-box textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
      margin-bottom: 1rem;
      resize: vertical;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #11998e;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0e8377;
    }

    .btn-secondary {
      background: #e9ecef;
      color: #495057;
    }

    .btn-secondary:hover {
      background: #dee2e6;
    }

    .loading, .empty-state, .no-selection {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    @media (max-width: 1024px) {
      .main-layout {
        grid-template-columns: 1fr;
      }

      .tickets-list {
        max-height: 400px;
      }
    }
  `]
})
export class SupportDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private ticketService = inject(TicketService);
  private router = inject(Router);

  tickets = signal<Ticket[]>([]);
  filteredTickets = signal<Ticket[]>([]);
  selectedTicket = signal<Ticket | null>(null);
  statusFilter = signal('all');
  loading = signal(false);
  replyMessage = '';
  newStatus = 'open';

  currentUser = signal(this.authService.currentUserValue);

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading.set(true);
    const status = this.statusFilter() === 'all' ? undefined : this.statusFilter();
    this.ticketService.getTickets(status).subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.filteredTickets.set(tickets);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading tickets:', err);
        this.loading.set(false);
      }
    });
  }

  setStatusFilter(status: string): void {
    this.statusFilter.set(status);
    this.loadTickets();
  }

  countByStatus(status: string): number {
    return this.tickets().filter(t => t.status === status).length;
  }

  selectTicket(ticket: Ticket): void {
    this.ticketService.getTicket(ticket.id).subscribe({
      next: (fullTicket) => {
        this.selectedTicket.set(fullTicket);
        this.newStatus = fullTicket.status;
        this.replyMessage = '';
      },
      error: (err) => console.error('Error loading ticket details:', err)
    });
  }

  updateStatus(): void {
    const ticket = this.selectedTicket();
    if (ticket) {
      this.ticketService.updateTicketStatus(ticket.id, this.newStatus).subscribe({
        next: () => {
          this.loadTickets();
          this.selectTicket({ ...ticket, status: this.newStatus as any });
        },
        error: (err) => console.error('Error updating status:', err)
      });
    }
  }

  sendReply(): void {
    const ticket = this.selectedTicket();
    if (ticket && this.replyMessage.trim()) {
      this.ticketService.addMessage(ticket.id, this.replyMessage).subscribe({
        next: () => {
          this.selectTicket(ticket);
          this.replyMessage = '';
        },
        error: (err) => console.error('Error sending reply:', err)
      });
    }
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ');
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString();
  }

  goToMainMenu(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/support/login']);
  }
}
