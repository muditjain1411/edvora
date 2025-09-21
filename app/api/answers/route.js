import dbConnect from "@/lib/dbConnect";
import Answers from "@/models/Answers";
import Users from "@/models/Users";

export async function GET(req) {
    await dbConnect();
    try {
        const url = new URL(req.url);
        const questionId = url.searchParams.get("questionId");
        const answerId = url.searchParams.get("answerId");
        if (answerId) {
            const answer = await Answers.findById(answerId).populate("answeredBy");
            return new Response(JSON.stringify(answer), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }else{
            const answers = await Answers.find({ questionId: questionId }).populate("answeredBy");
            return new Response(JSON.stringify(answers), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    await dbConnect();
    try {
        const { answer, questionId, email, imageUrls } = await req.json()
        console.log("Received data:", { answer, questionId, email, imageUrls });
        if (!answer || !questionId || !email) {
            return new Response(
                JSON.stringify({ error: "Answer, questionId and email are required" }),
                { status: 400 }
            );
        }
        const userDoc = await Users.findOne({ email: email });
        console.log("Found userDoc:", userDoc);
        if (!userDoc) {
            return new Response(
                JSON.stringify({ error: "User  not found" }),
                { status: 404 }
            );
        }

        const newAnswer = await Answers.create({ questionId:questionId, answer:answer, imageUrls:imageUrls,answeredBy: userDoc._id });
        await Users.findByIdAndUpdate(userDoc._id, { $inc: { answerGiven: 1 } });

        console.log("Updated user with new answer");
        return new Response(
            JSON.stringify({ message: "Answer created", answer: newAnswer }),
            { status: 201 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}
