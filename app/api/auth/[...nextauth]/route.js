import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import Users from "@/models/Users";
import { updateStreak } from "@/lib/gamification";
import dbConnect from "@/lib/dbConnect";

const handler = NextAuth({
    adapter: MongoDBAdapter(clientPromise),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },

    callbacks: {
        async session({ session }) {
            // Enrich session with user data from Atlas 'users' collection
            try {
                const db = await clientPromise;
                const dbUser = await db.db().collection("users").findOne({
                    email: session.user.email
                });
                if (dbUser) {
                    session.user.id = dbUser._id.toString();  // Required for JWT
                    // Map your fields (no gamification triggers here—just read)
                    session.user.profilePic = dbUser.profilePic || dbUser.image || "";
                    session.user.streak = dbUser.streak;
                    session.user.points = dbUser.points;
                    session.user.level = dbUser.level;
                    session.user.badges = dbUser.badges;  // Array for UI
                    session.user.achievements = dbUser.achievements;
                    session.user.questionAsked = dbUser.questionAsked;
                    session.user.answerGiven = dbUser.answerGiven;
                    session.user.notesGiven = dbUser.notesGiven;
                    // Add more if needed, e.g., session.user.aiUsed = dbUser .aiUsed;
                }
            } catch (error) {
                console.error("Error in session callback:", error);
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            // Adapter auto-creates/links user in 'users' and 'accounts'
            // We add custom logic: Manual create if needed, then init + streak
            try {
                const db = await clientPromise;
                let rawUser = await db.db().collection("users").findOne({
                    email: user.email
                });

                if (!rawUser) {
                    // Manual fallback: Adapter didn't create—insert base user (mimic adapter)
                    console.log(`Manual user creation for: ${user.email} (adapter failed)`);
                    const baseUserResult = await db.db().collection("users").insertOne({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        emailVerified: user.emailVerified || null,
                        // No custom fields yet—init below
                    });
                    if (!baseUserResult.acknowledged) {
                        throw new Error("Manual user creation failed");
                    }
                    rawUser = await db.db().collection("users").findOne({ email: user.email });  // Re-fetch
                    if (!rawUser) {
                        throw new Error("Manual creation succeeded but fetch failed");
                    }
                    console.log(`Manually created base user in Atlas: ${user.email} (_id: ${rawUser._id})`);
                } else {
                    console.log(`Adapter created/found user: ${user.email}`);
                }

                // Now init custom fields if missing (new or partial user)
                const needsInitialization = !rawUser.streak || rawUser.streak === undefined ||
                    !rawUser.profilePic || rawUser.profilePic === undefined ||
                    rawUser.points === undefined;

                if (needsInitialization) {
                    await db.db().collection("users").updateOne(
                        { _id: rawUser._id },
                        {
                            $set: {
                                // Map Google image to your profilePic
                                profilePic: rawUser.image || user.image || "",
                                // Your custom fields with defaults (matches schema)
                                questionAsked: 0,
                                answerGiven: 0,
                                notesGiven: 0,
                                points: 0,
                                level: 1,
                                streak: 1,  // Temp 0; updateStreak will set to 1 for first login
                                badges: [],  // Empty array
                                achievements: [],  // Empty array
                                lastLogin: new Date(),  // Set initial for streak logic
                                aiUsed: 0,
                            }
                        }
                    );
                    console.log(`Initialized custom fields for: ${user.email}`);
                } else {
                    console.log(`Custom fields already present for returning user: ${user.email}`);
                }

                // Always: Hydrate to Mongoose and run gamification (streak update)
                // For new: streak=1, +10 points
                // For returning: Increment if consecutive
                await dbConnect();  // Ensure Mongoose connected
                const mongooseUser = await Users.findById(rawUser._id);  // Hydrate with schema/defaults
                if (mongooseUser) {
                    await updateStreak(mongooseUser);  // Your full logic (awardPoints, checks, etc.)
                    console.log(`Streak/gamification processed for: ${user.email}`);
                } else {
                    console.error(`Failed to hydrate Mongoose user for: ${user.email}`);
                }
            } catch (error) {
                console.error("Error in signIn callback:", error);
                // DON'T block sign-in—log and proceed (user may still be created by adapter/manual)
            }

            return true;  // ALWAYS allow sign-in (even on errors)
        },
    },
});

export { handler as GET, handler as POST };