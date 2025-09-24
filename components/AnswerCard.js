"use client";

import { useState } from "react";
import Image from 'next/image';

export default function AnswerCard({ username, answer, likesCount, dislikesCount, userIcon }) {
    return (
        <div className="w-full border-2 rounded-2xl border-neutral-700 p-4">
            {/* Optional: User Avatar */}
            {userIcon && (
                <div className="flex items-center mb-2">
                    <Image
                        src={userIcon}
                        alt={`${username}'s avatar`}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full mr-3 object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <div className="text-sm text-neutral-700 font-semibold">
                        Answer by: {username}
                    </div>
                </div>
            )}
            {!userIcon && (
                <div className="mb-2 text-sm text-neutral-700 font-semibold">
                    Answer by: {username}
                </div>
            )}
            <div className="mb-4 text-white">{answer}</div>
            <div className="flex space-x-4">
                <div className="flex items-center space-x-1 text-green-600"
                    aria-label="Like">
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
                    <span>{likesCount}</span>
                </div>
                <div className="flex items-center space-x-1 text-red-600"
                    aria-label="Dislike">
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
                    <span>{dislikesCount}</span>
                </div>
            </div>
        </div>
    );
}