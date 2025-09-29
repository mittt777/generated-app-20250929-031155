import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/DataTable";
import { api } from "@/lib/api-client";
import type { Invoice } from "@shared/types";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await api<Invoice[]>("/api/invoices");
      setInvoices(data);
    } catch (error) {
      toast.error("Failed to fetch invoices.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInvoices();
  }, []);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
  };
  const columns: ColumnDef<Invoice, any>[] = [
    {
      accessorKey: "id",
      header: "Invoice ID",
      cell: ({ row }) => <div className="font-mono text-sm">#{row.id.slice(0, 7)}</div>,
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => <div className="font-medium">{row.customerName}</div>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.amount),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const variant =
          row.status === "paid"
            ? "default"
            : row.status === "pending"
            ? "secondary"
            : "destructive";
        return <Badge variant={variant} className="capitalize">{row.status}</Badge>;
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => new Date(row.dueDate).toLocaleDateString(),
    },
    {
      header: "",
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Download PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const renderSkeleton = () => (
    <div className="space-y-2">
      {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">View and manage all your invoices.</p>
        </div>
      </div>
      {loading ? renderSkeleton() : <DataTable columns={columns} data={invoices} />}
      <Toaster richColors />
    </div>
  );
}