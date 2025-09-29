import { IndexedEntity, Env } from "./core-utils";
import type { User, Chat, ChatMessage, Tenant, Customer, Plan, Subscription, Invoice } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map((c) => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter((m) => m.chatId === c.id)
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate((s) => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}
export class TenantEntity extends IndexedEntity<Tenant> {
  static readonly entityName = "tenant";
  static readonly indexName = "tenants";
  static readonly initialState: Tenant = { id: "", name: "", ownerEmail: "", passwordHash: "" };
}
export class CustomerEntity extends IndexedEntity<Customer> {
  static readonly entityName = "customer";
  static getIndexName(tenantId: string) { return `customers:${tenantId}`; }
  static readonly initialState: Customer = { id: "", name: "", email: "", status: "pending", createdAt: "" };
  static async createForTenant(env: Env, tenantId: string, state: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const customer: Customer = {
      ...state,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    return super.createBase(env, this.getIndexName(tenantId), customer);
  }
  static async listForTenant(env: Env, tenantId: string) {
    return super.listBase<Customer>(env, this.getIndexName(tenantId));
  }
  static async deleteForTenant(env: Env, tenantId: string, id: string): Promise<boolean> {
    return super.deleteBase(env, this.getIndexName(tenantId), id);
  }
}
export class PlanEntity extends IndexedEntity<Plan> {
  static readonly entityName = "plan";
  static getIndexName(tenantId: string) { return `plans:${tenantId}`; }
  static readonly initialState: Plan = { id: "", name: "", price: 0, interval: "month", features: [], createdAt: "" };
  static async createForTenant(env: Env, tenantId: string, state: Omit<Plan, 'id' | 'createdAt'>): Promise<Plan> {
    const plan: Plan = {
      ...state,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    return super.createBase(env, this.getIndexName(tenantId), plan);
  }
  static async listForTenant(env: Env, tenantId: string) {
    return super.listBase<Plan>(env, this.getIndexName(tenantId));
  }
  static async updateForTenant(env: Env, tenantId: string, id: string, state: Partial<Omit<Plan, 'id' | 'createdAt'>>): Promise<Plan> {
    const plan = new PlanEntity(env, id);
    if (!(await plan.exists())) throw new Error("Plan not found");
    const currentState = await plan.getState();
    const updatedState = { ...currentState, ...state };
    await plan.save(updatedState);
    return updatedState;
  }
  static async deleteForTenant(env: Env, tenantId: string, id: string): Promise<boolean> {
    return super.deleteBase(env, this.getIndexName(tenantId), id);
  }
}
export class SubscriptionEntity extends IndexedEntity<Subscription> {
  static readonly entityName = "subscription";
  static getIndexName(tenantId: string) { return `subscriptions:${tenantId}`; }
  static readonly initialState: Subscription = { id: "", customerId: "", planId: "", status: "active", startDate: "", endDate: null, createdAt: "" };
}
export class InvoiceEntity extends IndexedEntity<Invoice> {
  static readonly entityName = "invoice";
  static getIndexName(tenantId: string) { return `invoices:${tenantId}`; }
  static readonly initialState: Invoice = { id: "", customerId: "", customerName: "", subscriptionId: "", status: "pending", amount: 0, issueDate: "", dueDate: "", createdAt: "" };
}