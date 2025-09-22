import dbConnect from "@/lib/dbConnect"
import Users from "@/models/Users"
import Notes from "@/models/Notes"

export async function GET(req) {
    await dbConnect()
    try {
        const url = new URL(req.url)
        const noteId = url.searchParams.get("noteId")

        let notes;
        if (noteId) {
            notes = await Notes.findById(noteId).populate("givenBy")
        } else {
            notes = await Notes.find({}).populate("givenBy")
        }

        return new Response(JSON.stringify(notes), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500 }
        )
    }
}

export async function POST(req) {
    await dbConnect();
    try {
        // Parse JSON with error handling
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            return new Response(
                JSON.stringify({ error: "Invalid JSON in request body" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        const { title, description, email, pdfUrl } = body;
        console.log("Received data:", { title, description, email, pdfUrl });

        if (!title || !description || !email || !pdfUrl) {
            console.log("Validation failed: Missing required fields");
            return new Response(
                JSON.stringify({ error: "Title, description, email and pdfUrl are required" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                }
            );
        }

        console.log("Searching for user with email:", email);
        const userDoc = await Users.findOne({ email: email });
        console.log("Found userDoc:", userDoc);

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
            title: title,
            description: description,
            pdfUrl: pdfUrl,
            givenBy: userDoc._id
        });
        console.log("Note created successfully:", newNote);

        return new Response(
            JSON.stringify({ message: "Note created", note: newNote }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        console.log("POST Error Details:", error); // Log full error stack
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}