import catchAsync from "../../utils/catchAsync.js";
import Property from "../properties/property.model.js";
import Favorite from "./favorite.model.js";


export const toggleFavorite = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { propertyId } = req.body;

    if (!propertyId) {
        return res.status(400).json({ success: false, message: "Property ID is required" });
    }

    const existingFavorite = await Favorite.findOne({ userId, propertyId });

    if (existingFavorite) {
        await Favorite.deleteOne({ _id: existingFavorite._id });
        return res.status(200).json({
            success: true,
            isSaved: false,
            message: "Removed from favorites successfully",
        });
    }

    await Favorite.create({ userId, propertyId });
    return res.status(201).json({
        success: true,
        isSaved: true,
        message: "Added to favorites successfully",
    });
});

export const checkFavoriteStatus = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const { propertyId } = req.params;

    const existingFavorite = await Favorite.findOne({ userId, propertyId });

    res.status(200).json({
        success: true,
        isSaved: !!existingFavorite,
    });
});

export const getTenantFavorites = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const favoriteRecords = await Favorite.find({ userId });

    const propertyIds = favoriteRecords.map(fav => fav.propertyId);

    const total = await Property.countDocuments({ _id: { $in: propertyIds } });

    const favoriteProperties = await Property.find({ _id: { $in: propertyIds } })
        .select("title location propertyType rent images rentType")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        message: "Tenant favorite properties fetched successfully",
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: favoriteProperties,
    });
});