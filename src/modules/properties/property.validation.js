import { z } from 'zod';

export const propertyValidationSchema = z.object({
    title: z.string({
        required_error: 'Property title is required'
    }),
    description: z.string({
        required_error: 'Description is required'
    }),
    location: z.string({
        required_error: 'Location is required'
    }),
    propertyType: z.string({
        required_error: 'Property type is required'
    }),
    rent: z.number({
        required_error: 'Rent amount is required'
    }).positive('Rent must be a positive number'),
    rentType: z.enum(['Monthly', 'Weekly', 'Daily'], {
        required_error: 'Rent type must be Monthly, Weekly, or Daily'
    }),
    bedrooms: z.number({
        required_error: 'Number of bedrooms is required'
    }).int().nonnegative(),
    bathrooms: z.number({
        required_error: 'Number of bathrooms is required'
    }).int().nonnegative(),
    propertySize: z.number({
        required_error: 'Property size is required'
    }).positive(),
    amenities: z.array(z.string(), {
        required_error: 'Amenities are required'
    }).min(1, 'At least one amenity must be added'),
    images: z.array(z.string(), {
        required_error: 'Property images are required'
    }).min(1, 'At least one image must be provided'),
    extraFeatures: z.string().optional(),
    status: z.enum(['Pending', 'Approved', 'Rejected']).default('Pending'),
    rejectionFeedback: z.string().optional(),
    ownerId: z.string({
        required_error: 'Owner ID is required'
    })
});