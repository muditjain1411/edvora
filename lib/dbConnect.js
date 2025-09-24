import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local");
}

// Ensure TLS in URI
const url = new URL(MONGODB_URI);
if (!url.searchParams.has('tls')) {
    url.searchParams.set('tls', 'true');
}
const finalUri = url.toString();

let isConnected = false;

export default async function dbConnect() {
    if (isConnected) {
        console.log("Already connected to Atlas");
        return;
    }
    try {
        const db = await mongoose.connect(finalUri, {
            tls: true,
            tlsAllowInvalidCertificates: false,
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("Connected to Atlas via Mongoose");
    } catch (error) {
        console.error("Atlas Mongoose Connection Failed:", error.message);
        console.error("Full Error:", error);
        throw error;
    }
}