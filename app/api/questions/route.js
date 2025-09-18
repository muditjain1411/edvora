import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";
import Questions from "@/models/Questions";

export async function GET(req) {
    await dbConnect();
    const questions = await Questions.find({});
    return new Response(JSON.stringify(questions), { status: 200 });
}

export async function POST(req) {
    await dbConnect();
    try {
        const { question, email } = await req.json();

        if (!question || !email) {
            return new Response(
                JSON.stringify({ error: "Question and user are required" }),
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

        await Questions.create({ question: question, askedBy: userDoc._id });

        return new Response(
            JSON.stringify({ message: "Question received" }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}
