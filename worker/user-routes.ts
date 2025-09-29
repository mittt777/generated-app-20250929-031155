import { Hono } from "hono";
import type { Context } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, TenantEntity, CustomerEntity, PlanEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
const getSubdomain = (c: Context): string | null => c.get('subdomain');
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // TENANT ONBOARDING & AUTH
  app.post('/api/tenants', async (c) => {
    const { organizationName, email, password, subdomain } = await c.req.json();
    if (!isStr(organizationName) || !isStr(email) || !isStr(password) || !isStr(subdomain)) {
      return bad(c, 'Missing required fields.');
    }
    const tenant = new TenantEntity(c.env, subdomain);
    if (await tenant.exists()) {
      return bad(c, 'Subdomain is already taken.');
    }
    const newTenant = {
      id: subdomain,
      name: organizationName,
      ownerEmail: email,
      passwordHash: `mock_${password}`,
    };
    await TenantEntity.create(c.env, newTenant);
    return ok(c, { id: newTenant.id, name: newTenant.name });
  });
  app.post('/api/auth/login', async (c) => {
    const subdomain = getSubdomain(c);
    if (!subdomain) return bad(c, 'Login must be done from your subdomain.');
    const { email, password } = await c.req.json();
    if (!isStr(email) || !isStr(password)) return bad(c, 'Email and password are required.');
    const tenantEntity = new TenantEntity(c.env, subdomain);
    if (!await tenantEntity.exists()) return notFound(c, 'Tenant not found.');
    const tenant = await tenantEntity.getState();
    if (tenant.ownerEmail === email && tenant.passwordHash === `mock_${password}`) {
        return ok(c, { name: tenant.name, subdomain: tenant.id });
    }
    return bad(c, 'Invalid credentials.');
  });
  // --- DASHBOARD API ---
  app.get('/api/dashboard/metrics', async (c) => {
    const subdomain = getSubdomain(c);
    if (!subdomain) return bad(c, 'Tenant context is required.');
    // Mock data for now
    const metrics = {
      mrr: 12500,
      activeCustomers: 150,
      activeSubscriptions: 180,
      revenueLast30Days: 13200,
      revenueChartData: [
        { name: 'Jan', revenue: 8000 }, { name: 'Feb', revenue: 9500 },
        { name: 'Mar', revenue: 11000 }, { name: 'Apr', revenue: 10500 },
        { name: 'May', revenue: 12500 }, { name: 'Jun', revenue: 13200 },
      ],
    };
    return ok(c, metrics);
  });
  // --- CUSTOMERS API ---
  app.get('/api/customers', async (c) => {
    const subdomain = getSubdomain(c);
    if (!subdomain) return bad(c, 'Tenant context is required.');
    const { items } = await CustomerEntity.listForTenant(c.env, subdomain);
    return ok(c, items);
  });
  app.post('/api/customers', async (c) => {
    const subdomain = getSubdomain(c);
    if (!subdomain) return bad(c, 'Tenant context is required.');
    const body = await c.req.json();
    const newCustomer = await CustomerEntity.createForTenant(c.env, subdomain, body);
    return ok(c, newCustomer);
  });
  app.delete('/api/customers/:id', async (c) => {
    const subdomain = getSubdomain(c);
    const { id } = c.req.param();
    if (!subdomain) return bad(c, 'Tenant context is required.');
    const deleted = await CustomerEntity.deleteForTenant(c.env, subdomain, id);
    if (!deleted) return notFound(c, 'Customer not found.');
    return ok(c, { id, deleted });
  });
  // --- PLANS API ---
  app.get('/api/plans', async (c) => {
    const subdomain = getSubdomain(c);
    if (!subdomain) return bad(c, 'Tenant context is required.');
    const { items } = await PlanEntity.listForTenant(c.env, subdomain);
    return ok(c, items);
  });
  app.post('/api/plans', async (c) => {
    const subdomain = getSubdomain(c);
    if (!subdomain) return bad(c, 'Tenant context is required.');
    const body = await c.req.json();
    const newPlan = await PlanEntity.createForTenant(c.env, subdomain, body);
    return ok(c, newPlan);
  });
  app.put('/api/plans/:id', async (c) => {
    const subdomain = getSubdomain(c);
    const { id } = c.req.param();
    if (!subdomain) return bad(c, 'Tenant context is required.');
    const body = await c.req.json();
    try {
      const updatedPlan = await PlanEntity.updateForTenant(c.env, subdomain, id, body);
      return ok(c, updatedPlan);
    } catch (error) {
      return notFound(c, 'Plan not found.');
    }
  });
  app.delete('/api/plans/:id', async (c) => {
    const subdomain = getSubdomain(c);
    const { id } = c.req.param();
    if (!subdomain) return bad(c, 'Tenant context is required.');
    const deleted = await PlanEntity.deleteForTenant(c.env, subdomain, id);
    if (!deleted) return notFound(c, 'Plan not found.');
    return ok(c, { id, deleted });
  });
  // --- INVOICES API ---
  app.get('/api/invoices', async (c) => {
    const subdomain = getSubdomain(c);
    if (!subdomain) return bad(c, 'Tenant context is required.');
    // Mock data for now
    const mockInvoices = [
      { id: 'inv_1', customerId: 'cust_1', customerName: 'Acme Corp', subscriptionId: 'sub_1', status: 'paid', amount: 4900, issueDate: '2023-06-01', dueDate: '2023-06-15', createdAt: '2023-06-01' },
      { id: 'inv_2', customerId: 'cust_2', customerName: 'Stark Industries', subscriptionId: 'sub_2', status: 'pending', amount: 9900, issueDate: '2023-06-05', dueDate: '2023-06-20', createdAt: '2023-06-05' },
      { id: 'inv_3', customerId: 'cust_3', customerName: 'Wayne Enterprises', subscriptionId: 'sub_3', status: 'failed', amount: 9900, issueDate: '2023-05-20', dueDate: '2023-06-04', createdAt: '2023-05-20' },
      { id: 'inv_4', customerId: 'cust_4', customerName: 'Cyberdyne Systems', subscriptionId: 'sub_4', status: 'paid', amount: 4900, issueDate: '2023-06-10', dueDate: '2023-06-25', createdAt: '2023-06-10' },
    ];
    return ok(c, mockInvoices);
  });
  // DEMO ROUTES (can be removed later)
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env);
    return ok(c, page);
  });
}