import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local");
}
const uri = process.env.MONGODB_URI;

// Ensure essential TLS params in URI (Atlas handles the rest)
const url = new URL(uri);
if (!url.searchParams.has('tls')) {
    url.searchParams.set('tls', 'true');  // Enable TLS explicitly
}
if (!url.searchParams.has('retryWrites')) {
    url.searchParams.set('retryWrites', 'true');
}
if (!url.searchParams.has('w')) {
    url.searchParams.set('w', 'majority');
}
const finalUri = url.toString();

const options = {
    tls: true,
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        console.log("Connecting to Atlas (development mode)...");
        client = new MongoClient(finalUri, options);
        global._mongoClientPromise = client.connect().catch((error) => {
            console.error("Atlas Connection Failed:", error.message);
            // Log full error for debugging
            console.error("Full Error:", error);
            throw error;
        });
    }
    clientPromise = global._mongoClientPromise;
} else {
    console.log("Connecting to Atlas (production mode)...");
    client = new MongoClient(finalUri, options);
    clientPromise = client.connect().catch((error) => {
        console.error("Atlas Connection Failed:", error.message);
        console.error("Full Error:", error);
        throw error;
    });
}

export default clientPromise;