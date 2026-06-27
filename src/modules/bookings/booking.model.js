import mongoose, { Schema, model } from 'mongoose';

const bookingSchema = new Schema(
    {
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Property ID is required']
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Owner ID is required']
        },
        tenantId: {
            type: String,
            required: [true, 'Tenant ID is required']
        },
        stripeSessionId: { type: String, required: true, unique: true },
        payableAmount: { type: Number, required: true, },
        durationType: {
            type: String,
            enum: ["Yearly", 'Monthly', 'Weekly', 'Daily'],
            required: true,
        },
        startDate: { type: String, required: true, },
        endDate: { type: String, required: true, },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;