import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
    {
        // qid: { type: String, required: true, unique: true },
        question: { type: String, required: true },
        askedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        
        
    },
    { timestamps: true }
);

export default mongoose.models.Questions || mongoose.model("Questions", QuestionSchema);
