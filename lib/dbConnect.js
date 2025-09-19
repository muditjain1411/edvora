import mongoose from "mongoose"

const MONGODB_URI=process.env.MONGODB_URI;

if(!MONGODB_URI){
    throw new Error("Please add your Mongo URI to .env.local");
}
let isConnected = false;

export default async function dbConnect(){
    if(isConnected){
        console.log("Already connected to database");
        return;
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI);
        isConnected = db.connections[0].readyState === 1
        console.log("Connected to database");
    }
    catch(error){
        console.log("Error connecting to database",error);
    }
}