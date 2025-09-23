import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";
import Questions from "@/models/Questions";
import { awardPoints } from "@/lib/gamification"

export async function GET(req) {
    await dbConnect();
    try {
        const url = new URL(req.url);
        const email = url.searchParams.get("email");
        const questionId = url.searchParams.get("questionId");
        const search = url.searchParams.get("search");

        console.log('API GET params:', { email, questionId, search });

        let questions;
        if (questionId) {
            // Priority: Single question fetch (ignores email/search)
            console.log("Fetching question with ID:", questionId);
            questions = await Questions.find({ _id: questionId }).populate("askedBy");
            console.log("Fetched question:", questions);
        } else if (search && search.trim()) {
            // Priority: Global search (ignores email)
            console.log('Performing search for:', search);
            const stopWords = ['of', 'the', 'and', 'or', 'in', 'to', 'a', 'an', 'is', 'are'];
            const words = search.toLowerCase().split(/\s+/).filter(w => w.length > 1 && !stopWords.includes(w));
            console.log('Search words:', words);
            if (words.length === 0) {
                questions = await Questions.find({}).populate("askedBy").sort({ createdAt: -1 });
            } else {
                // Create regex for whole words with word boundaries
                const wordPatterns = words.map(w => `\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
                const regex = new RegExp(wordPatterns.join('|'), 'i');
                console.log('Search regex:', regex);
                questions = await Questions.find({
                    question: { $regex: regex }
                }).populate("askedBy");
                console.log('Raw search results count:', questions.length);

                // Pre-compute scores for efficiency, then sort once
                const scoredQuestions = questions.map(q => ({
                    ...q,
                    relevanceScore: words.reduce((sum, word) => {
                        return sum + (q.question.toLowerCase().includes(word) ? 1 : 0);
                    }, 0)
                }));
                scoredQuestions.sort((a, b) => {
                    return b.relevanceScore - a.relevanceScore || (new Date(b.createdAt) - new Date(a.createdAt));
                });
                questions = scoredQuestions.map(({ relevanceScore, ...q }) => q); // Remove temp score
                console.log('Sorted search results count:', questions.length);
            }
        } else if (email) {
            // User-specific questions (only if no search/questionId)
            console.log('Fetching questions for email:', email);
            const userDoc = await Users.findOne({ email });
            console.log("Found userDoc:", userDoc);
            if (!userDoc) {
                console.log('User  not found for email:', email);
                questions = []; // Empty array instead of error (graceful)
            } else {
                const userId = userDoc._id;
                questions = await Questions.find({ askedBy: userId }).populate("askedBy").sort({ createdAt: -1 });
                console.log('Fetched questions for user:', questions.length);
            }
        } else {
            // Default: All questions
            console.log('Fetching all questions');
            questions = await Questions.find({}).populate("askedBy").sort({ createdAt: -1 });
        }

        console.log('Final questions count:', questions.length);
        return new Response(JSON.stringify(questions), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
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
        
        await awardPoints(userDoc, 10, 'question', { questionAsked: 1 });

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