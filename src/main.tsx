import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import { PricingPage } from '@/pages/PricingPage';
import { AuthPage } from '@/pages/AuthPage';
import { AppLayout } from '@/pages/AppLayout';
import { DashboardHomePage } from '@/pages/dashboard/DashboardHomePage';
import { CustomersPage } from '@/pages/dashboard/CustomersPage';
import { PlansPage } from '@/pages/dashboard/PlansPage';
import { InvoicesPage } from '@/pages/dashboard/InvoicesPage';
import { getSubdomain } from './lib/auth';
const subdomain = getSubdomain();
const router = createBrowserRouter(
  subdomain
    ? [
        // Tenant-specific routes
        {
          path: '/',
          element: <Navigate to="/dashboard" replace />,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: '/auth',
          element: <AuthPage />,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: '/dashboard',
          element: <AppLayout />,
          errorElement: <RouteErrorBoundary />,
          children: [
            {
              index: true,
              element: <DashboardHomePage />,
            },
            { path: 'customers', element: <CustomersPage /> },
            { path: 'plans', element: <PlansPage /> },
            { path: 'invoices', element: <InvoicesPage /> },
            { path: 'settings', element: <div>Settings Page</div> },
          ],
        },
      ]
    : [
        // Public marketing site routes
        {
          path: "/",
          element: <HomePage />,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: "/pricing",
          element: <PricingPage />,
          errorElement: <RouteErrorBoundary />,
        },
        {
          path: "/auth",
          element: <AuthPage />,
          errorElement: <RouteErrorBoundary />,
        },
      ]
);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);