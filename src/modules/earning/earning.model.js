import mongoose, { Schema, model } from 'mongoose';

const earningSchema = new Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    stripeSessionId: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    adminCommissionRate: {
        type: Number,
        required: true
    },
    adminEarnings: {
        type: Number,
        required: true
    },
    ownerEarnings: {
        type: Number,
        required: true
    },
    payoutStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending'
    }
},
    {
        timestamps: true,
        versionKey: false,
    }

);

const Earning = mongoose.model('Earning', earningSchema);
export default Earning;