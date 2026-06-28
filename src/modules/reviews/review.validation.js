import { z } from 'zod';

export const reviewValidationSchema = z.object({
    propertyId: z.string({
        required_error: 'Property ID is required'
    }),
    tenantId: z.string({
        required_error: 'Tenant ID is required'
    }),
    tenantName: z.string({
        required_error: 'Tenant Name is required'
    }),
    tenantEmail: z.string({
        required_error: 'Tenant Email is required'
    }),
    tenantImage: z.string({
        required_error: 'Tenant Image is required'
    }),
    rating: z.number({
        required_error: 'Rating is required'
    }).min(1, 'Rating must be at least 1').max(5, 'Rating cannot be more than 5'),
    comment: z.string({
        required_error: 'Comment is required'
    })
});