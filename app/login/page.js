"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import googleicon from "@/public/google.svg";

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "authenticated" && session) {
            router.push("/dashboard");
        }
    }, [session, router, status]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center min-h-[90%] w-[33%] space-y-4 m-auto text-center text-gray-300 rounded-lg pt-15 font-bold">
                <p className="text-5xs">Loading...</p>
            </div>
        ); // Matches your structure and styling
    }

    return (
        <>
            <div className="flex flex-col items-center min-h-[90%] w-[33%] space-y-4 m-auto text-center text-gray-300 rounded-lg pt-15 mt-5 font-bold">
                <h3 className="text-3xl">Ask, Answer, and Learn Together</h3>
                <p className="text-5xs">
                    Join our academic community to ask questions, answer other's queries, earn points and badges through gamification, and share helpful notes on various topics for fellow learners.
                </p>

                <div className="max-w-md w-full m-auto p-2 rounded shadow">
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                        className="w-full py-2 px-4 border border-gray-300 rounded-3xl hover:bg-gray-100 flex items-center justify-center space-x-4"
                        aria-label="Sign in with Google"
                    >
                        <Image src={googleicon} alt="Google" width={24} height={24} />
                        <span>Sign in with Google</span>
                    </button>
                </div>
            </div>
        </>
    );
}