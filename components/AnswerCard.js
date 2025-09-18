"use client";

import { useState } from "react";

export default function AnswerCard({ username, answer }) {
    const [likes, setLikes] = useState(0);
    const [dislikes, setDislikes] = useState(0);

    return (
        <div className="w-full border-2 border-neutral-700 p-4">
            <div className="mb-2 text-sm text-neutral-700 font-semibold">
                Answer by: {username}
            </div>
            <div className="mb-4 text-white">{answer}</div>
            <div className="flex space-x-4">
                <button
                    onClick={() => setLikes(likes + 1)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-800"
                    aria-label="Like"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 9l-3 3m0 0l-3-3m3 3V4"
                        />
                    </svg>
                    <span>{likes}</span>
                </button>
                <button
                    onClick={() => setDislikes(dislikes + 1)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-800"
                    aria-label="Dislike"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 9l-3 3m0 0l-3-3m3 3V4"
                        />
                    </svg>
                    <span>{dislikes}</span>
                </button>
            </div>
        </div>
    );
}