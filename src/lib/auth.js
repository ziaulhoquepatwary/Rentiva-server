import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const createAuth = (db) => {
    return betterAuth({
        database: mongodbAdapter(db),

        baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

        session: {
            expiresIn: "10d",

            fields: {
                user: [
                    "role",
                    "status",
                    "phone",
                    "address",
                    "bio",
                    "lastActionDate",
                ],
            },
        },

        user: {
            additionalFields: {
                role: {
                    type: "string",
                },
                status: {
                    type: "string", // pending, approved, rejected
                },
                phone: {
                    type: "string",
                },
                address: {
                    type: "string"
                },
                bio: {
                    type: "string",
                },
                lastActionDate: {
                    type: "date",
                }
            },
        },
    });
};