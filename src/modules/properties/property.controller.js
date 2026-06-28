import mongoose from "mongoose";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import Property from "./property.model.js";
import { propertyValidationSchema } from "./property.validation.js";
import Favorite from "../favorites/favorite.model.js";


export const createProperty = catchAsync(async (req, res) => {
    const body = req.body;
    let currentUser = req.user.id;

    const parsed = propertyValidationSchema.safeParse(body);

    if (!parsed.success) {
        throw new AppError(400, `Validation failed ${parsed.error}`)
    };

    const newProperty = await Property.create({
        ...parsed.data,
        ownerId: currentUser,
        status: "Pending",
        bookingStatus: "Available",
        rejectionFeedback: "",
    });

    return res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: newProperty,
    })

});

export const getAllProperty = catchAsync(async (req, res) => {
    const { location, propertyType, minPrice, maxPrice, sortBy } = req.query;
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

    let sortOption = { createdAt: -1 };

    switch (sortBy) {
        case "price_asc":
            sortOption = { rent: 1 };
            break;

        case "price_desc":
            sortOption = { rent: -1 };
            break;

        case "oldest":
            sortOption = { createdAt: 1 };
            break;

        case "newest":
        default:
            sortOption = { createdAt: -1 };
            break;
    }

    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;

    const total = await Property.countDocuments(filter);

    const properties = await Property.find(filter)
        .select("title location propertyType rent images")
        .sort(sortOption)
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
});

export const getSingleProperty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    // console.log(userId);
    

    const property = await Property.findById(id);

    if (!property) {
        throw new AppError(404, "Property not found");
    }

    let isSaved = false;
    if (userId) {
        const favorite = await Favorite.findOne({ userId, propertyId: id });
        isSaved = !!favorite;
    }

    const owner = await mongoose.connection.collection("user").findOne(
        { _id: new mongoose.Types.ObjectId(property.ownerId) }
    )

    res.status(200).json({
        success: true,
        message: "Property fetched successfully",
        data: {
            property,
            ownerName: owner?.name || "Unknown User",
            isSaved
        },
    });
});

export const getMyProperties = catchAsync(async (req, res) => {
    const userId = req.user.id

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const status = req.query.status || "Approved";

    const filter = {
        ownerId: userId,
        status: status,
    };

    const total = await Property.countDocuments(filter);

    const properties = await Property.find(filter)
        .select("title location propertyType rent images status rejectionFeedback")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        message: `My ${status} properties fetched successfully`,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: properties,
    });
});

export const updateProperty = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const body = req.body;

    const property = await Property.findById(id);

    if (!property) {
        throw new AppError(404, "Property not found");
    }

    // Only owner can update
    if (property.ownerId.toString() !== userId) {
        throw new AppError(403, "You are not authorized");
    }

    // Prevent updating protected fields
    delete req.body.status;
    delete req.body.rejectionFeedback;
    delete req.body.ownerId;

    const updatedProperty = await Property.findByIdAndUpdate(
        id,
        body,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "Property updated successfully",
        data: updatedProperty,
    });
});

export const updatePropertyStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status, rejectionFeedback } = req.body;

    const property = await Property.findById(id);

    if (!property) {
        throw new AppError(404, "Property not found");
    }

    const updatedProperty = await Property.findByIdAndUpdate(
        id,
        {
            status,
            rejectionFeedback,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "Property status updated successfully",
        data: updatedProperty,
    });
});

export const deleteProperty = catchAsync(async (req, res) => {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
        throw new AppError(404, "Property not found");
    }

    await Property.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Property deleted successfully",
    });
})