import dbConnect from "@/lib/dbConnect";
import Answers from "@/models/Answers";
import Users from "@/models/Users";

export async function POST(req, { params }) {
    await dbConnect();
    try {
        const { answerId } = params;
        const { userEmail } = await req.json();
        const userDoc = await Users.findOne({ email: userEmail });
        console.log("Found userDoc:", userDoc);
        if (!userDoc) {
            return new Response(
                JSON.stringify({ error: "User not found" }),
                { status: 404 }
            );
        }
        const answerDoc = await Answers.findById(answerId)
        if (!answerDoc) {
            return new Response(
                JSON.stringify({ error: "Answer not found" }),
                { status: 404 }
            );
        }
        if (answerDoc.dislikes.includes(userDoc._id)) {
            answerDoc.dislikes.pull(userDoc._id);
            await answerDoc.save();
            return new Response(
                JSON.stringify({ message: "Dislike removed" }),
                { status: 200 }
            );
        }
        if (answerDoc.likes.includes(userDoc._id)) {
            answerDoc.likes.pull(userDoc._id);
        }
        answerDoc.dislikes.push(userDoc._id);
        await answerDoc.save();
        return new Response(
            JSON.stringify({ message: "Answer disliked" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error disliking answer:", error);
        return new Response(
            JSON.stringify({ error: "Error disliking answer" }),
            { status: 500 }
        );
    }
}