import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
    {
        qid: { type: String, required: true, unique: true },
        Question: { type: String, required: true },
        askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
        
    },
    { timestamps: true }
);

export default mongoose.models.Questions || mongoose.model("Questions", QuestionSchema);
