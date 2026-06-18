import mongoose, { Schema, model } from 'mongoose';

const reviewSchema = new Schema(
    {
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Property ID is required']
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Tenant ID is required']
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot be more than 5']
        },
        comment: {
            type: String,
            required: [true, 'Comment is required']
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;