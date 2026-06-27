import mongoose, { Schema, model } from 'mongoose';

const propertySchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Property title is required']
        },
        description: {
            type: String,
            required: [true, 'Description is required']
        },
        location: {
            type: String,
            required: [true, 'Location is required']
        },
        propertyType: {
            type: String,
            required: [true, 'Property type is required'],
            enum: {
                values: ['apartment', 'house', 'villa', 'cottage', 'studio', 'duplex', 'penthouse', 'commercial', 'office', 'other'],
                message: '{VALUE} is not a valid property type'
            }
        },

        rent: {
            type: Number,
            required: [true, 'Rent amount is required']
        },
        rentType: {
            type: String,
            enum: ["Yearly", 'Monthly', 'Weekly', 'Daily'],
            required: [true, 'Rent type is required']
        },
        bedrooms: {
            type: Number,
            required: [true, 'Number of bedrooms is required']
        },
        bathrooms: {
            type: Number,
            required: [true, 'Number of bathrooms is required']
        },
        propertySize: {
            type: Number,
            required: [true, 'Property size is required']
        },
        amenities: {
            type: [String],
            required: [true, 'Amenities are required']
        },
        images: {
            type: [String],
            required: [true, 'At least one image is required']
        },
        extraFeatures: {
            type: String
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        bookingStatus: {
            type: String,
            enum: ['Available', 'Booked'],
            default: 'Available'
        },
        rejectionFeedback: {
            type: String,
            default: ''
        },
        ownerId: {
            type: String,
            required: [true, 'Owner information is required']
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Property = mongoose.model("Property", propertySchema)
export default Property;