import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";
import Notes from "@/models/Notes";
import { awardPoints } from '@/lib/gamification'

export async function GET(req) {
    await dbConnect();
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);  // For App Router compatibility
        const noteId = url.searchParams.get("noteId");
        const givenByEmail = url.searchParams.get("givenByEmail");  // Optional filter

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
                .sort({ createdAt: -1 });  // Newest first
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

        const { title, description, pdfUrl, email } = body;  // email is now required

        console.log("Received data:", { title, description, email, pdfUrl });  // Debug log

        if (!title?.trim() || !description?.trim() || !pdfUrl || !email) {
            console.log("Validation failed: Missing required fields");
            return new Response(
                JSON.stringify({ error: "Title, description, email, and pdfUrl are required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        console.log("Searching for user with email:", email);
        const userDoc = await Users.findOne({ email });
        console.log("Found userDoc:", userDoc ? userDoc._id : null);  // Debug log

        if (!userDoc) {
            console.log("User  not found for email:", email);
            return new Response(
                JSON.stringify({ error: "User  not found" }),
                {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        console.log("Creating note with givenBy:", userDoc._id);
        const newNote = await Notes.create({
            title: title.trim(),
            description: description.trim(),
            pdfUrl,
            givenBy: userDoc._id,
        });
        console.log("Note created successfully:", newNote._id);

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