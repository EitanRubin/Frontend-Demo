import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, TicketMessage } from '../models/ticket.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.supabaseUrl}/functions/v1/support-api`;

  getTickets(status?: string): Observable<Ticket[]> {
    let params = new HttpParams();
    if (status && status !== 'all') {
      params = params.set('status', status);
    }
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`, { params });
  }

  getTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`);
  }

  updateTicketStatus(id: string, status: string): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${id}/status`, { status });
  }

  addMessage(ticketId: string, message: string): Observable<TicketMessage> {
    return this.http.post<TicketMessage>(`${this.apiUrl}/tickets/${ticketId}/messages`, { message });
  }
}
