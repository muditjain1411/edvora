import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users"; // your custom schema
// import resend from "resend" // if you configured resend

const handler = NextAuth({
    adapter: MongoDBAdapter(clientPromise),

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        EmailProvider({
            async sendVerificationRequest({ identifier, url }) {
                await resend.emails.send({
                    from: process.env.EMAIL_FROM,
                    to: identifier,
                    subject: "Your sign-in link for Edvora",
                    html: <p>Click <a href="${url}">here</a> to sign in.</p>,
                });
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },

    callbacks: {
        async session({ session }) {
            await dbConnect();
            const dbUser = await Users.findOne({ email: session.user.email });
            if (dbUser) {
                session.user.id = dbUser._id.toString();
            }
            return session;
        },

        async signIn({ user }) {
            await dbConnect();
            const existingUser = await Users.findOne({ email: user.email });

            if (!existingUser) {
                await Users.create({
                    email: user.email,
                    name: user.name,
                    profilePic: user.image, // match schema field name
                });
            }

            return true; // allow sign in
        },
    },
});

export { handler as GET, handler as POST };