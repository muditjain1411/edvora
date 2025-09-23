import dbConnect from "@/lib/dbConnect";
import Answers from "@/models/Answers";
import Users from "@/models/Users";
import { awardPoints } from "@/lib/gamification"

export async function GET(req) {
    await dbConnect();
    try {
        const url = new URL(req.url);
        const questionId = url.searchParams.get("questionId");
        const answerId = url.searchParams.get("answerId");
        const email = url.searchParams.get("email"); 

        let answers;
        if (answerId) {
            answers = await Answers.findById(answerId).populate("answeredBy");
        } else if (questionId) {
            answers = await Answers.find({ questionId }).populate("answeredBy").sort({ createdAt: -1 });
        } else if (email) {
            const userDoc = await Users.findOne({ email });
            if (!userDoc) {
                answers = [];
            } else {
                answers = await Answers.find({ answeredBy: userDoc._id })
                    .populate("answeredBy")
                    .populate("questionId", "question askedBy")
                    .sort({ createdAt: -1 });
            }
        } else {
            answers = await Answers.find({}).populate("answeredBy").sort({ createdAt: -1 });
        }

        return new Response(JSON.stringify(answers), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
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
    if (!answer || !questionId || !email) {
            return new Response(
                JSON.stringify({ error: "Answer, questionId and email are required" }),
                { status: 400 }
            );
        }
        const userDoc = await Users.findOne({ email: email });
        if (!userDoc) {
            return new Response(
                JSON.stringify({ error: "User  not found" }),
                { status: 404 }
            );
        }

        const newAnswer = await Answers.create({
            questionId: questionId,
            answer: answer,
            imageUrls: imageUrls || [],
            answeredBy: userDoc._id
        })

        await awardPoints(userDoc, 10, 'answer', { answerGiven: 1 })

        
        const populatedAnswer = await Answers.findById(newAnswer._id).populate("answeredBy")
        return new Response(
            JSON.stringify({ message: "Answer created", answer: populatedAnswer }),
            { status: 201 }
        );
    } catch (error) {
        // ...existing code...
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}