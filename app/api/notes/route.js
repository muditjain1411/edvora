import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";
import Notes from "@/models/Notes";
import { awardPoints } from '@/lib/gamification'

export async function GET(req) {
    await dbConnect();
    try {
    const url = new URL(req.url, `http://${req.headers.host}`);
        const noteId = url.searchParams.get("noteId");
    const givenByEmail = url.searchParams.get("givenByEmail");

        let notesQuery;
        if (noteId) {
            notesQuery = Notes.findById(noteId).populate("givenBy", "name email");
        } else if (givenByEmail) {
            const user = await Users.findOne({});
            if (!user) {
                return new Response(JSON.stringify([]), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            }
            notesQuery = Notes.find({})
                .populate("givenBy", "name email")
                .sort({ createdAt: -1 });
        } else {
            notesQuery = Notes.find({})
                .populate("givenBy", "name email")
                .sort({ createdAt: -1 });
        }

        const notes = await notesQuery;
        return new Response(JSON.stringify(notes), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("GET Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

export async function POST(req) {
    await dbConnect();
    try {
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

    const { title, description, pdfUrl, email } = body;

   

        if (!title?.trim() || !description?.trim() || !pdfUrl || !email) {
            return new Response(
                JSON.stringify({ error: "Title, description, email, and pdfUrl are required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }


        const userDoc = await Users.findOne({ email });


        if (!userDoc) {

            return new Response(
                JSON.stringify({ error: "User  not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

    // ...existing code...
        const newNote = await Notes.create({
            title: title.trim(),
            description: description.trim(),
            pdfUrl,
            givenBy: userDoc._id,
        });
    // ...existing code...

        userDoc.notesGiven += 1;
        await awardPoints(userDoc, 20, 'note')

        const populatedNote = await Notes.findById(newNote._id).populate("givenBy", "name email");

        return new Response(
            JSON.stringify({ message: "Note created successfully", note: populatedNote }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("POST Error Details:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}