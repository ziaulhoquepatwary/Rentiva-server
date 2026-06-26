import { z } from 'zod';

export const bookingValidationSchema = z.object({
    propertyId: z.string({ required_error: "Property ID is required" }),
    tenantId: z.string({ required_error: "Tenant ID is required" }),
    stripeSessionId: z.string({ required_error: "Stripe Session ID is required" }),
    payableAmount: z.number({ required_error: "Payable Amount is required" }).positive(),
    durationType: z.enum(["Yearly", "Monthly", "Weekly", "Daily"], {
        required_error: "Duration Type must be Yearly, Monthly, Weekly, or Daily",
    }),
    startDate: z.string({ required_error: "Start Date is required" }),
    endDate: z.string({ required_error: "End Date is required" }),
    paymentStatus: z.enum(["pending", "paid", "failed"]).default("pending"),
});