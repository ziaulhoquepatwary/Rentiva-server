import catchAsync from "../../utils/catchAsync.js";
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