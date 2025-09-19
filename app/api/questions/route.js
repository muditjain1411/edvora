import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";
import Questions from "@/models/Questions";

export async function GET(req) {
    await dbConnect();
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");
        const questionId = url.searchParams.get("questionId");

        let questions;
        if (userId) {
            questions = await Questions.find({ askedBy: userId }).populate("askedBy");
        } 
        else if (questionId) {
            console.log("Fetching question with ID:", questionId);
            questions = await Questions.find({ _id: questionId }).populate("askedBy");
            console.log("Fetched question:", questions);
        } else {
            questions = await Questions.find({}).populate("askedBy");
        }
        
        return new Response(JSON.stringify(questions), {
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
        const { question, email } = await req.json();
        console.log("Received question:", question, "email:", email);

        if (!question || !email) {
            return new Response(
                JSON.stringify({ error: "Question and user are required" }),
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

        const newQuestion = await Questions.create({ question: question, askedBy: userDoc._id });
        console.log("Created question:", newQuestion);
        await Users.findByIdAndUpdate(userDoc._id, { $inc: { questionAsked: 1 } });
        
        console.log("Updated user with new question");

        return new Response(
            JSON.stringify({ message: "Question received" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in POST /api/questions:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        );
    }
}
