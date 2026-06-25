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
    propertyType: z.enum(
        ['apartment', 'house', 'villa', 'cottage', 'studio', 'duplex', 'penthouse', 'commercial', 'office', 'other'],
        {
            errorMap: (issue, ctx) => {
                if (issue.code === 'invalid_enum_value' || ctx.data === "") {
                    return { message: 'Property type is required' };
                }
                return { message: 'Invalid property type' };
            }
        }
    ),
    rent: z.number({
        required_error: 'Rent amount is required'
    }).positive('Rent must be a positive number'),
    rentType: z.enum(['Yearly', 'Monthly', 'Weekly', 'Daily'], {
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
});