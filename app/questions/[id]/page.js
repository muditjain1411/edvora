
import AnswerCard from '@/components/AnswerCard';
import React from 'react';

// Next.js 13+ uses generateStaticParams or receives params as a prop
export default function AnswerPage({ params }) {
    const { id } = params;
    // Placeholder for fetching question data
    const questionText = `This is the question for ID: ${id}`;

    return (
        <main className="text-white m-auto mt-4 w-[80vw] border-2 border-neutral-700 rounded-lg p-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Question:</h1>
                <p className="mb-6">{questionText}</p>
            </div>
            {/* Answers and form will go here */}
            <div className='flex flex-col space-y-4'>
            <AnswerCard
                username="john_doe"
                answer="This is an example answer to demonstrate the answer card styling."
                />
            <AnswerCard
                username="john_doe"
                answer="This is an example answer to demonstrate the answer card styling."
                />
            <AnswerCard
                username="john_doe"
                answer="This is an example answer to demonstrate the answer card styling."
                />
                </div>
        </main>
    );
}

  


