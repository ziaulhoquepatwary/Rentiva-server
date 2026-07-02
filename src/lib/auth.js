import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

export const createAuth = (db) => {
    const origins = [
        process.env.FRONTEND_URL,
        "http://localhost:3000"
    ]


    return betterAuth({
        database: mongodbAdapter(db),

        baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",

        emailAndPassword: {
            enabled: true,
        },

        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            },
        },

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

        advanced: {
            defaultCookieAttributes: {
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                secure: process.env.NODE_ENV === "production" ? true : false,
                httpOnly: true,
            }
        },

        user: {
            additionalFields: {
                role: {
                    type: "string",
                    defaultValue: "tenant"
                },
                status: {
                    type: "string",
                    defaultValue: "pending"  // pending, approved, rejected
                },
                phone: {
                    type: "string",
                    defaultValue: ""
                },
                address: {
                    type: "string",
                    defaultValue: ""
                },
                bio: {
                    type: "string",
                    defaultValue: ""
                },
                lastActionDate: {
                    type: "date",
                    defaultValue: new Date()
                }
            },
        },

        trustedOrigins: origins
    });
};