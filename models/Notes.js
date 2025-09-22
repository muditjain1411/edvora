import mongoose from "mongoose"

const NotesSchema = new mongoose.Schema(
    {
       
        title: { type: String, required: true },
        description: { type: String, required: true },
        pdfUrl:{type: String, required: true},
        givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    },
    { timestamps: true }
);

export default mongoose.models.Notes || mongoose.model("Notes", NotesSchema);
