import Stripe from "stripe";
import Booking from "./booking.model.js";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import { bookingValidationSchema } from "./booking.validation.js";
import Property from "../properties/property.model.js";


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

        const propertyInfo = await Property.findById(propertyId);
        if (!propertyInfo) {
            throw new AppError(404, "Property not found for booking");
        }
        const ownerId = propertyInfo.ownerId;

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
            ownerId,
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

        //  bookingStatus Change- "Booked"
        await Property.findByIdAndUpdate(
            propertyId,
            { bookingStatus: "Booked" },
            { new: true, runValidators: true }
        );
    }

    res.status(200).json({
        success: true,
        message: "Webhook event processed and database execution completed successfully",
    });
});

export const getTenantBookings = catchAsync(async (req, res) => {
    const userId = req.user.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const bookingType = req.query.type || "running";

    // Convert current date to "YYYY-MM-DD" string format matching DB structure
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const currentDateString = `${year}-${month}-${day}`;

    const filter = {
        tenantId: userId,
        paymentStatus: "paid"
    };

    if (bookingType === "running") {
        filter.endDate = { $gte: currentDateString };
    } else if (bookingType === "previous") {
        filter.endDate = { $lt: currentDateString };
    }

    const total = await Booking.countDocuments(filter);

    const bookings = await Booking.find(filter)
        .populate({
            path: "propertyId",
            select: "title location propertyType rent images"
        })
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        message: `Tenant ${bookingType} bookings fetched successfully`,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: bookings,
    });
});