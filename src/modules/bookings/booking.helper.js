import Stripe from "stripe";

export const refundStripePayment = async (sessionId) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const paymentIntentId = session.payment_intent;

        if (!paymentIntentId) {
            throw new Error("Payment Intent not found for this session.");
        }

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            reason: "requested_by_customer",
            metadata: {
                reason: "Property already booked by another user. Overbooking safety trigger.",
                checkoutSessionId: sessionId
            }
        });

        console.log(`[Overbooking Safeguard] Refund successful for session ${sessionId}. Refund ID: ${refund.id}`);
        return refund;
    } catch (error) {
        console.error(`[Refund Error] Failed to refund session ${sessionId}:`, error.message);
        throw error;
    }
};