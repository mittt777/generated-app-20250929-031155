import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
interface DashboardMetrics {
  mrr: number;
  activeCustomers: number;
  activeSubscriptions: number;
  revenueLast30Days: number;
  revenueChartData: { name: string; revenue: number }[];
}
export function DashboardHomePage() {
  const { tenant } = useAuthStore();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await api<DashboardMetrics>('/api/dashboard/metrics');
        setMetrics(data);
      } catch (error) {
        toast.error('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  const renderMetricCard = (title: string, value: string, icon: React.ReactNode, isLoading: boolean) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-3/4" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {tenant?.name}!</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {renderMetricCard('Monthly Recurring Revenue', formatCurrency(metrics?.mrr ?? 0), <DollarSign className="h-4 w-4 text-muted-foreground" />, loading)}
        {renderMetricCard('Active Customers', metrics?.activeCustomers.toString() ?? '0', <Users className="h-4 w-4 text-muted-foreground" />, loading)}
        {renderMetricCard('Active Subscriptions', metrics?.activeSubscriptions.toString() ?? '0', <CreditCard className="h-4 w-4 text-muted-foreground" />, loading)}
        {renderMetricCard('Revenue (Last 30d)', formatCurrency(metrics?.revenueLast30Days ?? 0), <Activity className="h-4 w-4 text-muted-foreground" />, loading)}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={metrics?.revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      <Toaster richColors />
    </div>
  );
}