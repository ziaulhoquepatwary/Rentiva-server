import Stripe from "stripe";
import Booking from "./booking.model.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import { bookingValidationSchema } from "./booking.validation.js";


export const handleStripeWebhook = catchAsync(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    
    console.log(sig);
    
    let event;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        event = stripe.webhooks.constructEvent(
            req.body, // Must be the raw, unparsed request buffer
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        throw new AppError(400, `Webhook Signature Verification Failed: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const { userId, propertyId, durationType } = session.metadata;
        const payableAmount = session.amount_total / 100;
        const stripeSessionId = session.id;

        // Timeline calculation alignment based on system date parameters
        const start = new Date();
        const end = new Date();

        switch (durationType) {
            case "Daily":
                end.setDate(start.getDate() + 1);
                break;
            case "Weekly":
                end.setDate(start.getDate() + 7);
                break;
            case "Monthly":
                end.setMonth(start.getMonth() + 1);
                break;
            case "Yearly":
                end.setFullYear(start.getFullYear() + 1);
                break;
            default:
                end.setMonth(start.getMonth() + 1);
        }

        const bookingPayload = {
            propertyId,
            tenantId: userId,
            stripeSessionId,
            payableAmount,
            durationType,
            startDate: start.toISOString().split("T")[0], // Saves clean string date format "YYYY-MM-DD"
            endDate: end.toISOString().split("T")[0],
            paymentStatus: "paid",
        };

        bookingValidationSchema.parse(bookingPayload);

        // Construct Mongoose Document Instance mapping
        await Booking.create(bookingPayload);
    }

    res.status(200).json({
        success: true,
        message: "Webhook event processed and database execution completed successfully",
    });
});