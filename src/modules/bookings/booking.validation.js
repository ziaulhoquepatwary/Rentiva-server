import { z } from 'zod';

export const bookingValidationSchema = z.object({
    propertyId: z.string({
        required_error: 'Property ID is required'
    }),
    tenantId: z.string({
        required_error: 'Tenant ID is required'
    }),
    moveInDate: z.string({
        required_error: 'Move-in date is required'
    }),
    contactNumber: z.string({
        required_error: 'Contact number is required'
    }),
    additionalNotes: z.string().optional(),
    amountPaid: z.number({
        required_error: 'Amount paid is required'
    }),
    transactionId: z.string({
        required_error: 'Transaction ID is required'
    }),
    bookingStatus: z.enum(['Pending', 'Approved', 'Rejected']).default('Pending'),
    paymentStatus: z.enum(['Pending', 'Paid']).default('Paid'),
});