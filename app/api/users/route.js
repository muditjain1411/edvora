
import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";
import Questions from "@/models/Questions";
import Answers from "@/models/Answers";

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (email) {
        const user = await Users.findOne({ email });
        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }
        return Response.json(user);
    }
    const users = await Users.find({});
    return Response.json(users);

    const questionAsked = await Questions.countDocuments({ askedBy: userId });
    const answerGiven = await Answers.countDocuments({ answeredBy: userId });
    users.questionsAsked = questionAsked;
    users.questionAnswered = answerGiven;
    await users.save();
    return Response.json(users);
}

export async function POST(request) {
    await dbConnect()
    const data = await request.json()
    const user = await Users.create(data)
    return Response.json(user)
}