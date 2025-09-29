// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Demo types from boilerplate (can be removed in a future phase)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
// Core application models for Zenith Bills
export interface Tenant {
  id: string; // subdomain
  name: string;
  ownerEmail: string;
  passwordHash: string;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string; // ISO 8601 date string
}
export interface Plan {
  id: string;
  name: string;
  price: number; // in cents
  interval: 'month' | 'year';
  features: string[];
  createdAt: string; // ISO 8601 date string
}
export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  startDate: string; // ISO 8601 date string
  endDate: string | null; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
}
export interface Invoice {
  id: string;
  customerId: string;
  customerName: string; // Denormalized for convenience
  subscriptionId: string;
  status: 'paid' | 'pending' | 'failed';
  amount: number; // in cents
  issueDate: string; // ISO 8601 date string
  dueDate: string; // ISO 8601 date string
  createdAt: string; // ISO 8601 date string
}