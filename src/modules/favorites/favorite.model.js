import mongoose, { Schema, model } from 'mongoose';

const favoriteSchema = new Schema(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Tenant ID is required']
        },
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Property ID is required']
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;