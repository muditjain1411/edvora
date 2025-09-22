"use client";

export default function AnswerCard({answer, likesCount, dislikesCount, questionText }) {
    return (
        <div className="w-full border-2 rounded-2xl border-neutral-700 p-4">
            <div className="mb-2 text-xl text-white font-semibold">
                Question: {questionText}
            </div>
            <h1 className="text-xl font-bold">Your Answer</h1>
            <div className="mb-4 text-white">{answer}</div>
            <div className="flex space-x-4">
                <div className="flex items-center space-x-1 text-green-600"
                    aria-label="Like">
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
                    
                    <span>{likesCount}</span>
                </div>
                <div className="flex items-center space-x-1 text-red-600"
                    aria-label="Dislike">
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
                    
                    <span>{dislikesCount}</span>
                </div>
            </div>
        </div>
    );
}