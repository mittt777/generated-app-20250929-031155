import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api-client";
import type { Plan } from "@shared/types";
import { Check, PlusCircle, MoreVertical, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlanForm } from "@/components/forms/PlanForm";
import { z } from "zod";
export function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await api<Plan[]>("/api/plans");
      setPlans(data);
    } catch (error) {
      toast.error("Failed to fetch plans.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPlans();
  }, []);
  const handleFormSubmit = async (values: { name: string; price: number; interval: "month" | "year"; features: string[]; }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        price: Math.round(values.price * 100), // Convert dollars to cents
      };
      if (editingPlan) {
        // Update existing plan
        const updatedPlan = await api<Plan>(`/api/plans/${editingPlan.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
        toast.success("Plan updated successfully.");
      } else {
        // Create new plan
        const newPlan = await api<Plan>("/api/plans", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setPlans((prev) => [newPlan, ...prev]);
        toast.success("Plan created successfully.");
      }
      setFormOpen(false);
      setEditingPlan(null);
    } catch (error) {
      toast.error(`Failed to ${editingPlan ? "update" : "create"} plan.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    try {
      await api(`/api/plans/${planToDelete.id}`, { method: "DELETE" });
      setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
      toast.success("Plan deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete plan.");
    } finally {
      setPlanToDelete(null);
    }
  };
  const openEditDialog = (plan: Plan) => {
    setEditingPlan(plan);
    setFormOpen(true);
  };
  const openCreateDialog = () => {
    setEditingPlan(null);
    setFormOpen(true);
  };
  const handleDialogChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingPlan(null);
  };
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-muted-foreground">Create and manage your subscription plans.</p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </div>
      {loading ? (
        renderSkeleton()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                    <CardDescription>
                      Created on {new Date(plan.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(plan)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setPlanToDelete(plan)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price / 100}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={isFormOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Plan" : "Create a New Plan"}</DialogTitle>
            <DialogDescription>
              {editingPlan
                ? "Update the details of your existing plan."
                : "Fill in the details below to create a new subscription plan."}
            </DialogDescription>
          </DialogHeader>
          <PlanForm
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
            defaultValues={editingPlan || undefined}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!planToDelete} onOpenChange={() => setPlanToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the '{planToDelete?.name}' plan. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster richColors />
    </div>
  );
}