import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import Property from "./property.model.js";
import { propertyValidationSchema } from "./property.validation.js";


export const createProperty = catchAsync(async (req, res) => {
    const body = req.body;
    let currentUser = req.id;

    const parsed = propertyValidationSchema.safeParse(body);

    if (!parsed.success) {
        throw new AppError(400, `Validation failed ${parsed.error}`)
    };

    const newProperty = await Property.create({
        ...parsed.data,
        ownerId: currentUser,
        status: "Pending",
        rejectionFeedback: "",
    });

    return res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: newProperty,
    })

})