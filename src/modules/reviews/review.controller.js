import mongoose from "mongoose";
import AppError from "../../utils/AppError.js";
import catchAsync from "../../utils/catchAsync.js";
import Property from "../properties/property.model.js";
import Review from "./review.model.js";



export const createReview = catchAsync(async (req, res) => {
    const { propertyId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!propertyId || !rating || !comment) {
        throw new AppError(400, "Property ID, rating, and comment are required");
    }

    const property = await Property.findById(propertyId);
    if (!property) {
        throw new AppError(404, "Property not found");
    }

    const tenant = await mongoose.connection.collection("user").findOne(
        { _id: new mongoose.Types.ObjectId(userId) }
    );

    if (!tenant) {
        throw new AppError(404, "Tenant profile not found")
    }

    const existingReview = await Review.findOne({ propertyId, tenantId: userId });

    if (existingReview) {
        throw new AppError(400, "You have already submitted a review for this property");
    }

    const newReview = await Review.create({
        propertyId,
        tenantId: userId,
        tenantName: tenant.name || "Anonymous",
        tenantEmail: tenant.email,
        tenantImage: tenant.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZLiDzOwzVVxlpY-1q0ElGEiZ43hV-MwnAbuaGY8KzOg&s=10",
        rating: Number(rating),
        comment
    });

    res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        data: newReview
    });
});

export const getPropertyReviews = catchAsync(async (req, res) => {
    const { propertyId } = req.params;

    const reviews = await Review.find({ propertyId }).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Property reviews fetched successfully",
        count: reviews.length,
        data: reviews
    });
});

export const deleteReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    const review = await Review.findById(id);
    if (!review) {
        throw new AppError(404, "Review not found");
    }

    if (review.tenantId.toString() !== userId) {
        throw new AppError(403, "You are not authorized to delete this review");
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
});