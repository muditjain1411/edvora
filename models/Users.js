import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String }, 
    emailVerified: { type: Date },  

    
    profilePic: { type: String, default: "" }, 
    questionAsked: { type: Number, default: 0 },
    answerGiven: { type: Number, default: 0 },
    notesGiven: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 1 }, 
    badges: [{
        name: { type: String },
        description: { type: String },
        icon: { type: String },
        earnedAt: { type: Date, default: Date.now }
    }],  
    achievements: [{
        title: { type: String },
        description: { type: String },
        unlockedAt: { type: Date, default: Date.now }
    }],  
    lastLogin: { type: Date }, 
    aiUsed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true  
});
 
UserSchema.index({ points: -1, level: -1 });  


export default mongoose.models.Users || mongoose.model("Users", UserSchema, "users");