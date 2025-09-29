import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/DataTable";
import { api } from "@/lib/api-client";
import type { Customer } from "@shared/types";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerForm } from "@/components/forms/CustomerForm";
import { customerSchema } from "@/lib/schemas";
import { z } from "zod";
export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await api<Customer[]>("/api/customers");
      setCustomers(data);
    } catch (error) {
      toast.error("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);
  const handleCreateCustomer = async (values: z.infer<typeof customerSchema>) => {
    setIsSubmitting(true);
    try {
      const newCustomer = await api<Customer>("/api/customers", {
        method: "POST",
        body: JSON.stringify(values),
      });
      setCustomers((prev) => [newCustomer, ...prev]);
      toast.success("Customer created successfully.");
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create customer.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    try {
      await api(`/api/customers/${customerToDelete.id}`, { method: "DELETE" });
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
      toast.success("Customer deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete customer.");
    } finally {
      setCustomerToDelete(null);
    }
  };
  const columns: ColumnDef<Customer, any>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.name}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div className="text-muted-foreground">{row.email}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const variant =
          row.status === "active"
            ? "default"
            : row.status === "inactive"
            ? "secondary"
            : "outline";
        return <Badge variant={variant} className="capitalize">{row.status}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => new Date(row.createdAt).toLocaleDateString(),
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
                <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => setCustomerToDelete(row)}>
                  Delete Customer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  const renderSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customers and their subscriptions.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new customer</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new customer to your records.
              </DialogDescription>
            </DialogHeader>
            <CustomerForm onSubmit={handleCreateCustomer} isSubmitting={isSubmitting} />
          </DialogContent>
        </Dialog>
      </div>
      {loading ? renderSkeleton() : <DataTable columns={columns} data={customers} />}
      <AlertDialog open={!!customerToDelete} onOpenChange={() => setCustomerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer record for {customerToDelete?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster richColors />
    </div>
  );
}