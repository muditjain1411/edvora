import React from 'react';

export default function QuestionCard({
    question,
    userName,
    userIcon,
    likes,
    dislikes
}) {
    return (
        <div className="w-[80vw] m-auto mt-4 border-neutral-700 border-2 rounded-lg shadow-md p-6 flex flex-col justify-between">
            {/* Question */}
            <div className="text-xl font-semibold text-white mb-6 flex-grow overflow-auto">
                {question}
            </div>

            {/* Bottom row: user icon, name, likes, dislikes */}
            <div className="flex items-center justify-between border-t pt-4">
                {/* User info */}
                <div className="flex items-center space-x-3">
                    <img
                        src={userIcon}
                        alt={`${userName} icon`}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-white">{userName}</span>
                </div>

                {/* Likes and dislikes */}
                <div className="flex items-center space-x-6 text-white">
                    <div className="flex items-center space-x-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 9l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        <span>{likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 15l3-3m0 0l3 3m-3-3v7" />
                        </svg>
                        <span>{dislikes}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}