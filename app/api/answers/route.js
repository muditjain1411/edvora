import dbConnect from "@/lib/dbConnect";
import Answers from "@/models/Answers";

export async function GET(req) {
    await dbConnect();
    try {
        const url = new URL(req.url);
        const questionId = url.searchParams.get("questionId");
        const answers = await Answers.find({ questionId: questionId }).populate("answeredBy");
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
        const { answer, questionId, userId } = await req.json();
        if (!answer || !questionId || !userId) {
            return new Response(
                JSON.stringify({ error: "Answer, questionId and userId are required" }),
                { status: 400 }
            );
        }

        const newAnswer = await Answers.create({ answer, questionId, answeredBy: userId });
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
