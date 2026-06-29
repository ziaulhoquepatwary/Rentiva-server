import mongoose from "mongoose";
import catchAsync from "../../utils/catchAsync.js";

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