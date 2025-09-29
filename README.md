# Zenith Bills

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mittt777/generated-app-20250929-031155))

A multi-tenant subscription billing SaaS application with subdomain-based tenant routing and management dashboards.

## About The Project

Zenith Bills is a modern, multi-tenant Subscription Billing SaaS platform built on Cloudflare's edge network. It provides businesses with a seamless solution to manage their subscription-based services. Each client, or 'tenant', receives a dedicated, isolated environment accessible via a unique subdomain (e.g., 'acme.zenithbills.app').

The platform features a public-facing marketing website with details about features and pricing, a streamlined user-onboarding process for new tenants, and a comprehensive dashboard for tenants to manage their own customers, subscription plans, invoices, and view key business metrics. The architecture is designed for scalability and performance, leveraging Cloudflare Workers for routing and API logic, and Durable Objects for reliable, stateful storage, ensuring data isolation between tenants.

### Key Features

*   **Multi-Tenant Architecture**: Securely serve multiple tenants from a single application instance.
*   **Subdomain Isolation**: Each tenant gets their own unique, isolated environment at `tenant-name.your-domain.com`.
*   **Public Marketing Site**: A complete, visually polished marketing site including homepage and pricing pages.
*   **Tenant Onboarding**: A seamless sign-up flow for new tenants to create their account and claim a subdomain.
*   **Management Dashboard**: A comprehensive dashboard for tenants to manage their customers, subscription plans, and invoices.
*   **Edge-Native**: Built entirely on the Cloudflare stack, leveraging Workers for compute and Durable Objects for stateful, consistent storage.

## Technology Stack

This project is built with a modern, edge-native technology stack:

*   **Frontend**:
    *   [React](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/)
    *   [React Router](https://reactrouter.com/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/)
    *   [Framer Motion](https://www.framer.com/motion/)
    *   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    *   [Recharts](https://recharts.org/) for data visualization

*   **Backend**:
    *   [Cloudflare Workers](https://workers.cloudflare.com/)
    *   [Hono](https://hono.dev/)
    *   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)

*   **Language & Tooling**:
    *   [TypeScript](https://www.typescriptlang.org/)
    *   [Bun](https://bun.sh/)
    *   [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Bun](https://bun.sh/)
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/zenith-bills.git
    cd zenith-bills
    ```

2.  **Install dependencies:**
    This project uses `bun` for package management.
    ```sh
    bun install
    ```

### Local Development

To start the development server, which includes the Vite frontend and a local Wrangler instance for the backend API, run:

```sh
bun dev
```

This will typically start the application on `http://localhost:3000`. The backend API endpoints will be available under `/api/*`.

## Usage

Once the development server is running:

1.  Open your browser and navigate to `http://localhost:3000`.
2.  You will see the Zenith Bills marketing homepage.
3.  You can navigate to the Pricing page or the Sign Up page.
4.  On the Sign Up page, you can create a new tenant by providing an organization name, email, password, and a unique subdomain.
5.  After signing up, you will be redirected to the login page.
6.  Upon logging in, you will be taken to the tenant dashboard.

**Note**: The full subdomain routing (`tenant.localhost:3000`) requires manual host file configuration for local development. However, the core application logic can be tested and developed without this setup.

## Project Structure

*   `src/`: Contains the frontend React application source code.
    *   `pages/`: Top-level page components and layouts.
    *   `components/`: Reusable UI components, including shadcn/ui elements.
    *   `lib/`: Utility functions and API client.
*   `worker/`: Contains the Cloudflare Worker backend source code.
    *   `index.ts`: The main worker entry point.
    *   `user-routes.ts`: Hono API route definitions.
    *   `entities.ts`: Durable Object entity definitions.
*   `shared/`: Contains TypeScript types that are shared between the frontend and backend.

## Deployment

This application is designed to be deployed to Cloudflare.

1.  **Login to Wrangler:**
    If you haven't already, authenticate the Wrangler CLI with your Cloudflare account.
    ```sh
    wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script. This will build the Vite application and deploy both the static assets and the worker to your Cloudflare account.
    ```sh
    bun deploy
    ```

After deployment, Wrangler will provide you with the URL where your application is live.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)]([![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mittt777/generated-app-20250929-031155))

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.