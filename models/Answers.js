import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
    {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Questions", required: true },
        answer: { type: String, required: true },
        answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
        dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    },
    { timestamps: true }
);

export default mongoose.models.Answers || mongoose.model("Answers", AnswerSchema);
