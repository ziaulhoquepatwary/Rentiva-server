import Earning from "./earning.model.js";

export const createEarningRecord = async (bookingData) => {
    const { _id: bookingId, propertyId, ownerId, stripeSessionId, payableAmount, durationType } = bookingData;

    const adminCommissionRate = durationType === "Yearly" ? 15 : 10;

    const adminEarnings = (payableAmount * adminCommissionRate) / 100;
    const ownerEarnings = payableAmount - adminEarnings;

    const earningPayload = {
        bookingId,
        propertyId,
        ownerId,
        stripeSessionId,
        totalAmount: payableAmount,
        adminCommissionRate,
        adminEarnings,
        ownerEarnings,
        payoutStatus: "Pending"
    };

    const newEarning = await Earning.create(earningPayload);
    return newEarning;
};