import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    profilePic: { type: String, default: "" },

    questionAsked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Questions" }],
    answerGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answers" }],
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    aiUsed: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
})
export default mongoose.models.Users || mongoose.model("Users", UserSchema);