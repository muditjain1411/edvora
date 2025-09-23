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
        const email = url.searchParams.get("email"); // New param

        console.log('API Answers GET params:', { questionId, answerId, email });

        let answers;
        if (answerId) {
            // Single answer by ID
            console.log("Fetching single answer with ID:", answerId);
            answers = await Answers.findById(answerId).populate("answeredBy");
            console.log("Fetched answer:", answers ? [answers] : []);
        } else if (questionId) {
            // All answers for a specific question
            console.log("Fetching answers for question ID:", questionId);
            answers = await Answers.find({ questionId }).populate("answeredBy").sort({ createdAt: -1 });
            console.log("Fetched answers count:", answers.length);
        } else if (email) {
            // New: User's own answers (populates answeredBy and questionId)
            console.log('Fetching answers for email:', email);
            const userDoc = await Users.findOne({ email });
            console.log("Found userDoc:", userDoc);
            if (!userDoc) {
                console.log('User  not found for email:', email);
                answers = []; // Empty array (graceful)
            } else {
                answers = await Answers.find({ answeredBy: userDoc._id })
                    .populate("answeredBy")
                    .populate("questionId", "question askedBy") // Populate question details (text, asker)
                    .sort({ createdAt: -1 });
                console.log('Fetched user answers count:', answers.length);
            }
        } else {
            // Default: All answers (global; add auth if needed)
            console.log('Fetching all answers');
            answers = await Answers.find({}).populate("answeredBy").sort({ createdAt: -1 });
            console.log('All answers count:', answers.length);
        }

        return new Response(JSON.stringify(answers), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching answers:", error);
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

        const newAnswer = await Answers.create({
            questionId: questionId,
            answer: answer,
            imageUrls: imageUrls || [],
            answeredBy: userDoc._id
        })

        await awardPoints(userDoc, 10, 'answer', { answerGiven: 1 })

        console.log("Updated user with new answer");
        
        const populatedAnswer = await Answers.findById(newAnswer._id).populate("answeredBy")
        return new Response(
            JSON.stringify({ message: "Answer created", answer: populatedAnswer }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating answer:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}