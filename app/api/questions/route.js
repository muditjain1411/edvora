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

        

        let questions;
        if (questionId) {
            
            questions = await Questions.find({ _id: questionId }).populate("askedBy");
            
        } else if (search && search.trim()) {

            
            const stopWords = ['of', 'the', 'and', 'or', 'in', 'to', 'a', 'an', 'is', 'are'];
            const words = search.toLowerCase().split(/\s+/).filter(w => w.length > 1 && !stopWords.includes(w));
            
            if (words.length === 0) {
                questions = await Questions.find({}).populate("askedBy").sort({ createdAt: -1 });
            } else {
                
                const wordPatterns = words.map(w => `\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`);
                const regex = new RegExp(wordPatterns.join('|'), 'i');
                
                questions = await Questions.find({
                    question: { $regex: regex }
                }).populate("askedBy");
                

                
                const scoredQuestions = questions.map(q => ({
                    ...q,
                    relevanceScore: words.reduce((sum, word) => {
                        return sum + (q.question.toLowerCase().includes(word) ? 1 : 0);
                    }, 0)
                }));
                scoredQuestions.sort((a, b) => {
                    return b.relevanceScore - a.relevanceScore || (new Date(b.createdAt) - new Date(a.createdAt));
                });
                questions = scoredQuestions.map(({ relevanceScore, ...q }) => q); 
                
            }
        } else if (email) {
            
            
            const userDoc = await Users.findOne({ email });
            
            if (!userDoc) {
                
                questions = []; 
            } else {
                const userId = userDoc._id;
                questions = await Questions.find({ askedBy: userId }).populate("askedBy").sort({ createdAt: -1 });
                
            }
        } else {
            
            questions = await Questions.find({}).populate("askedBy").sort({ createdAt: -1 });
        }

        
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

        const newQuestion = await Questions.create({ question: question, askedBy: userDoc._id });
        
        
        await awardPoints(userDoc, 10, 'question', { questionAsked: 1 });

        

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