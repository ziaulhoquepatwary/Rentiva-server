import mongoose, { Schema, model } from 'mongoose';

const bookingSchema = new Schema(
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
        moveInDate: {
            type: Date,
            required: [true, 'Move-in date is required']
        },
        contactNumber: {
            type: String,
            required: [true, 'Contact number is required']
        },
        additionalNotes: {
            type: String
        },
        amountPaid: {
            type: Number,
            required: [true, 'Amount paid is required']
        },
        transactionId: {
            type: String,
            required: [true, 'Transaction ID is required']
        },
        bookingStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid'],
            default: 'Paid'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;