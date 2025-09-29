import * as z from "zod";

export const planSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  interval: z.enum(["month", "year"]),
  features: z.array(z.string().min(3, "Feature must be at least 3 characters.")).min(1, "At least one feature is required."),
});

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  status: z.enum(["active", "inactive", "pending"]),
});