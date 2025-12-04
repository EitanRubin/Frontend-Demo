import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ItemService } from '../services/item.service';
import { Item } from '../models/item.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <h1>Inventory Management</h1>
        <div class="header-actions">
          <span class="user-name">{{ currentUser()?.name }}</span>
          <button class="btn btn-secondary" (click)="goToMainMenu()">← Main Menu</button>
          <button class="btn btn-secondary" (click)="logout()">Logout</button>
        </div>
      </header>

      <div class="content">
        <div class="toolbar">
          <button class="btn btn-primary" (click)="showAddModal()">+ Add Item</button>
          <input
            type="text"
            class="search-input"
            placeholder="Search items..."
            [(ngModel)]="searchTerm"
            (input)="filterItems()"
          />
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">{{ items().length }}</div>
            <div class="stat-label">Total Items</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalQuantity() }}</div>
            <div class="stat-label">Total Quantity</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">\${{ totalValue().toFixed(2) }}</div>
            <div class="stat-label">Total Value</div>
          </div>
        </div>

        @if (loading()) {
          <div class="loading">Loading items...</div>
        } @else if (filteredItems().length === 0) {
          <div class="empty-state">
            <p>No items found</p>
            <button class="btn btn-primary" (click)="showAddModal()">Add your first item</button>
          </div>
        } @else {
          <div class="table-container">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (item of filteredItems(); track item.id) {
                  <tr>
                    <td><strong>{{ item.name }}</strong></td>
                    <td>{{ item.description }}</td>
                    <td><span class="badge">{{ item.category }}</span></td>
                    <td>
                      <div class="quantity-control">
                        <button class="qty-btn" (click)="decrementQuantity(item)">-</button>
                        <span class="qty-value">{{ item.quantity }}</span>
                        <button class="qty-btn" (click)="incrementQuantity(item)">+</button>
                      </div>
                    </td>
                    <td>\${{ item.price.toFixed(2) }}</td>
                    <td>
                      <button class="btn-icon" (click)="editItem(item)" title="Edit">✏️</button>
                      <button class="btn-icon" (click)="deleteItem(item)" title="Delete">🗑️</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    @if (showModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>{{ editingItem() ? 'Edit Item' : 'Add New Item' }}</h2>
          <form (submit)="saveItem($event)">
            <div class="form-group">
              <label>Name *</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="formData.description" name="description" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Category *</label>
                <input type="text" [(ngModel)]="formData.category" name="category" required />
              </div>
              <div class="form-group">
                <label>Quantity *</label>
                <input type="number" [(ngModel)]="formData.quantity" name="quantity" min="0" required />
              </div>
            </div>
            <div class="form-group">
              <label>Price *</label>
              <input type="number" [(ngModel)]="formData.price" name="price" step="0.01" min="0" required />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ editingItem() ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </div>
      </div>
    }
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .search-input {
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      width: 300px;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: #666;
      font-size: 0.875rem;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
    }

    .items-table th {
      background: #f8f9fa;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #333;
      border-bottom: 2px solid #e9ecef;
    }

    .items-table td {
      padding: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .items-table tr:hover {
      background: #f8f9fa;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #e3f2fd;
      color: #1976d2;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    .quantity-control {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .qty-btn {
      width: 28px;
      height: 28px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qty-btn:hover {
      background: #f5f5f5;
    }

    .qty-value {
      min-width: 40px;
      text-align: center;
      font-weight: 600;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #e9ecef;
      color: #495057;
    }

    .btn-secondary:hover {
      background: #dee2e6;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      padding: 0.25rem;
      margin: 0 0.25rem;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }

    .empty-state p {
      margin-bottom: 1rem;
      font-size: 1.125rem;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal h2 {
      margin: 0 0 1.5rem;
      color: #333;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private itemService = inject(ItemService);
  private router = inject(Router);

  items = signal<Item[]>([]);
  filteredItems = signal<Item[]>([]);
  loading = signal(false);
  showModal = signal(false);
  editingItem = signal<Item | null>(null);
  searchTerm = '';

  currentUser = signal(this.authService.currentUserValue);

  formData = {
    name: '',
    description: '',
    category: '',
    quantity: 0,
    price: 0
  };

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading.set(true);
    this.itemService.getItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.filteredItems.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading items:', err);
        this.loading.set(false);
      }
    });
  }

  filterItems(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredItems.set(this.items());
    } else {
      this.filteredItems.set(
        this.items().filter(item =>
          item.name.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term)
        )
      );
    }
  }

  totalQuantity(): number {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  }

  totalValue(): number {
    return this.items().reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }

  showAddModal(): void {
    this.editingItem.set(null);
    this.formData = {
      name: '',
      description: '',
      category: '',
      quantity: 0,
      price: 0
    };
    this.showModal.set(true);
  }

  editItem(item: Item): void {
    this.editingItem.set(item);
    this.formData = {
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.quantity,
      price: item.price
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveItem(event: Event): void {
    event.preventDefault();

    const editing = this.editingItem();
    if (editing) {
      this.itemService.updateItem(editing.id, this.formData).subscribe({
        next: () => {
          this.loadItems();
          this.closeModal();
        },
        error: (err) => console.error('Error updating item:', err)
      });
    } else {
      this.itemService.createItem(this.formData).subscribe({
        next: () => {
          this.loadItems();
          this.closeModal();
        },
        error: (err) => console.error('Error creating item:', err)
      });
    }
  }

  incrementQuantity(item: Item): void {
    this.itemService.updateItem(item.id, { quantity: item.quantity + 1 }).subscribe({
      next: () => this.loadItems(),
      error: (err) => console.error('Error updating quantity:', err)
    });
  }

  decrementQuantity(item: Item): void {
    if (item.quantity > 0) {
      this.itemService.updateItem(item.id, { quantity: item.quantity - 1 }).subscribe({
        next: () => this.loadItems(),
        error: (err) => console.error('Error updating quantity:', err)
      });
    }
  }

  deleteItem(item: Item): void {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      this.itemService.deleteItem(item.id).subscribe({
        next: () => this.loadItems(),
        error: (err) => console.error('Error deleting item:', err)
      });
    }
  }

  goToMainMenu(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
