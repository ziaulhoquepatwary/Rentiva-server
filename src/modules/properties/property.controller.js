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

});

export const getAllProperty = catchAsync(async (req, res) => {
    const { location, propertyType, minPrice, maxPrice, } = req.query;
    const page = req.query.page || 1;
    const limit = req.query.limit || 12;

    const filter = {
        // status: "Approved",
    }

    if (location) {
        filter.location = {
            $regex: location,
            $options: "i",
        }
    }

    if (propertyType) {
        filter.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
        filter.rent = {};

        if (minPrice) {
            filter.rent.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.rent.$lte = Number(maxPrice);
        }
    }

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const total = await Property.countDocuments(filter);

    const properties = await Property.find(filter)
        .select("title location propertyType rent images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage);

    res.status(200).json({
        success: true,
        message: "Properties fetched successfully",
        meta: {
            page: currentPage,
            limit: perPage,
            total,
            totalPage: Math.ceil(total / perPage),
        },
        data: properties,
    });
})