import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync.js";
import Property from "../properties/property.model.js";
import Booking from "../bookings/booking.model.js";

export const getAllUser = catchAsync(async (req, res) => {
    const { search, role, page = 1, limit = 12 } = req.query;
    const db = mongoose.connection.collection("user");

    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }

    if (role) {
        query.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    const [users, totalUsers] = await Promise.all([
        db.find(query).skip(skip).limit(parsedLimit).toArray(),
        db.countDocuments(query)
    ]);

    res.status(200).json({
        success: true,
        count: users.length,
        totalUsers,
        totalPages: Math.ceil(totalUsers / parsedLimit),
        currentPage: parseInt(page),
        data: users,
    });
});

export const updateUserRole = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ["tenant", "owner", "admin"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role. Role must be tenant, owner, or admin."
        });
    }

    const db = mongoose.connection.collection("user");

    const result = await db.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(userId) },
        { $set: { role: role } },
        { returnDocument: "after" }
    );

    if (!result) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        success: true,
        message: `User role successfully updated to ${role}`,
        data: result
    });
});

export const getPendingProperties = catchAsync(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    const totalProperties = await Property.countDocuments({ status: "Pending" });

    const properties = await Property.aggregate([
        { $match: { status: "Pending" } },
        {
            $addFields: {
                ownerObjectId: { $toObjectId: "$ownerId" }
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "ownerObjectId",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: {
                path: "$ownerDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                location: 1,
                propertyType: 1,
                rent: 1,
                rentType: 1,
                bedrooms: 1,
                bathrooms: 1,
                propertySize: 1,
                amenities: 1,
                images: 1,
                status: 1,
                bookingStatus: 1,
                ownerId: 1,
                createdAt: 1,
                ownerInfo: {
                    name: "$ownerDetails.name",
                    email: "$ownerDetails.email",
                    phone: "$ownerDetails.phone",
                    image: "$ownerDetails.image"
                }
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parsedLimit }
    ]);

    res.status(200).json({
        success: true,
        count: properties.length,
        totalProperties,
        totalPages: Math.ceil(totalProperties / parsedLimit),
        currentPage: parseInt(page),
        data: properties,
    });
});

export const updatePendingProperty = catchAsync(async (req, res) => {
    const { propertyId } = req.params;
    const { status, rejectionFeedback } = req.body;

    const validStatuses = ["Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid status. Admin can only set status to Approved or Rejected."
        });
    }

    if (status === "Rejected" && (!rejectionFeedback || rejectionFeedback.trim() === "")) {
        return res.status(400).json({
            success: false,
            message: "Rejection feedback is required when rejecting a property."
        });
    }

    const updateData = { status };
    if (status === "Rejected") {
        updateData.rejectionFeedback = rejectionFeedback;
    } else {
        updateData.rejectionFeedback = "";
    }

    const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    if (!updatedProperty) {
        return res.status(404).json({
            success: false,
            message: "Property not found."
        });
    }

    res.status(200).json({
        success: true,
        message: `Property status successfully updated to ${status}.`,
        data: updatedProperty
    });
});

export const getRunningBookings = catchAsync(async (req, res) => {
    const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const matchStage = {
        $match: {
            endDate: { $gte: todayStr }
        }
    };

    const activeBookingsPipeline = [
        matchStage,
        {
            $lookup: {
                from: "properties",
                localField: "propertyId",
                foreignField: "_id",
                as: "propertyDetails"
            }
        },
        {
            $unwind: {
                path: "$propertyDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                ownerObjectId: {
                    $cond: {
                        if: { $ifNull: ["$propertyDetails.ownerId", false] },
                        then: { $toObjectId: "$propertyDetails.ownerId" },
                        else: null
                    }
                }
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "ownerObjectId",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: {
                path: "$ownerDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                bookingId: "$_id",
                payableAmount: 1,
                startDate: 1,
                endDate: 1,
                paymentStatus: 1,
                tenant: {
                    id: "$tenantId",
                    name: "$tenantName",
                    email: "$tenantEmail",
                    image: "$tenantImage"
                },
                owner: {
                    $cond: {
                        if: { $ifNull: ["$ownerDetails", false] },
                        then: {
                            id: "$ownerDetails._id",
                            name: "$ownerDetails.name",
                            email: "$ownerDetails.email",
                            image: { $ifNull: ["$ownerDetails.image", "$ownerDetails.avatar"] }
                        },
                        else: null
                    }
                },
                property: {
                    $cond: {
                        if: { $ifNull: ["$propertyDetails", false] },
                        then: {
                            id: "$propertyDetails._id",
                            title: "$propertyDetails.title",
                            location: "$propertyDetails.location",
                            image: { $arrayElemAt: ["$propertyDetails.images", 0] },
                            propertyType: "$propertyDetails.propertyType",
                            rent: "$propertyDetails.rent"
                        },
                        else: null
                    }
                }
            }
        },
        { $sort: { endDate: 1 } },
        { $skip: skip },
        { $limit: parsedLimit }
    ];

    const [activeBookings, totalCountData] = await Promise.all([
        Booking.aggregate(activeBookingsPipeline),
        Booking.countDocuments(matchStage.$match)
    ]);

    res.status(200).json({
        success: true,
        message: "Running bookings retrieved successfully using aggregation",
        totalBookings: totalCountData,
        totalPages: Math.ceil(totalCountData / parsedLimit),
        currentPage: parsedPage,
        count: activeBookings.length,
        data: activeBookings,
    });
});

export const getBookingHistory = catchAsync(async (req, res) => {
    const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const matchStage = {
        $match: {
            endDate: { $lt: todayStr }
        }
    };

    const pastBookingsPipeline = [
        matchStage,
        {
            $lookup: {
                from: "properties",
                localField: "propertyId",
                foreignField: "_id",
                as: "propertyDetails"
            }
        },
        {
            $unwind: {
                path: "$propertyDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $addFields: {
                ownerObjectId: {
                    $cond: {
                        if: { $ifNull: ["$propertyDetails.ownerId", false] },
                        then: { $toObjectId: "$propertyDetails.ownerId" },
                        else: null
                    }
                }
            }
        },
        {
            $lookup: {
                from: "user",
                localField: "ownerObjectId",
                foreignField: "_id",
                as: "ownerDetails"
            }
        },
        {
            $unwind: {
                path: "$ownerDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 0,
                bookingId: "$_id",
                payableAmount: 1,
                startDate: 1,
                endDate: 1,
                paymentStatus: 1,
                tenant: {
                    id: "$tenantId",
                    name: "$tenantName",
                    email: "$tenantEmail",
                    image: "$tenantImage"
                },
                owner: {
                    $cond: {
                        if: { $ifNull: ["$ownerDetails", false] },
                        then: {
                            id: "$ownerDetails._id",
                            name: "$ownerDetails.name",
                            email: "$ownerDetails.email",
                            image: { $ifNull: ["$ownerDetails.image", "$ownerDetails.avatar"] }
                        },
                        else: null
                    }
                },
                property: {
                    $cond: {
                        if: { $ifNull: ["$propertyDetails", false] },
                        then: {
                            id: "$propertyDetails._id",
                            title: "$propertyDetails.title",
                            location: "$propertyDetails.location",
                            image: { $arrayElemAt: ["$propertyDetails.images", 0] },
                            propertyType: "$propertyDetails.propertyType",
                            rent: "$propertyDetails.rent"
                        },
                        else: null
                    }
                }
            }
        },
        { $sort: { endDate: -1 } }, 
        { $skip: skip },
        { $limit: parsedLimit }
    ];

    const [pastBookings, totalCountData] = await Promise.all([
        Booking.aggregate(pastBookingsPipeline),
        Booking.countDocuments(matchStage.$match)
    ]);

    res.status(200).json({
        success: true,
        message: "Booking history retrieved successfully using aggregation",
        totalBookings: totalCountData,
        totalPages: Math.ceil(totalCountData / parsedLimit),
        currentPage: parsedPage,
        count: pastBookings.length,
        data: pastBookings,
    });
});