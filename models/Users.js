import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true }, 
    profilePic: { type: String, default: "" },

    questionAsked: { type: Number, default: 0 },
    answerGiven: { type: Number, default: 0 },
    notesGiven: { type: Number, default: 0 }, 

    
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 1 }, 
    badges: [{
        name: String,
        description: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
    }],
    achievements: [{
        title: String,
        description: String,
        unlockedAt: { type: Date, default: Date.now }
    }],
    lastLogin: { type: Date },

    aiUsed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Optional: Add indexes for performance (e.g., queries on points/streak)
// Removed duplicate UserSchema.index({ email: 1 }); — handled by unique: true
UserSchema.index({ points: -1, level: -1 }); // For leaderboards

export default mongoose.models.Users || mongoose.model("Users", UserSchema);