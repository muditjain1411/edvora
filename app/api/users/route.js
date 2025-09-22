
import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";


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
}

export async function POST(request) {
    await dbConnect()
    const data = await request.json()
    const user = await Users.create(data)
    return Response.json(user)
}

export async function PUT(request) {
    await dbConnect();
    try {
        const { id, ...updateData } = await request.json(); // { id: userId, name: '...', profilePic: '...' }
        if (!id) {
            return Response.json({ error: "User  ID is required" }, { status: 400 });
        }
        const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return Response.json({ error: "User  not found" }, { status: 404 });
        }
        return Response.json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}