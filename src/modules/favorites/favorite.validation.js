import { z } from 'zod';

export const favoriteValidationSchema = z.object({
    userId: z.string({
        required_error: 'Tenant ID is required'
    }),
    propertyId: z.string({
        required_error: 'Property ID is required'
    })
});