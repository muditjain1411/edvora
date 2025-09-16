import React from 'react'
import Image from 'next/image'
import QuestionCard from '@/components/QuestionCard'

const questions = () => {
    return (
        <>
            <main className='text-white'>
                <h1 className='text-3xl'>Questions</h1>
                <p id="QPText">Answer peer questions and earn points</p>

                <div id="questions" className='flex flex-col space-y-4 mt-4'>

                    <QuestionCard
                        question="How do I fetch data in Next.js?"
                        userName="Alice"
                        userIcon="/alice.png"
                        likes={45}
                        dislikes={2}
                    />

                <QuestionCard userName="Bob Johnson" userIcon="/bob.png" question="What is the difference between padding and margin in CSS?" />
                <QuestionCard userName="Charlie Brown" userIcon="/charlie.png" question="How can I make my website responsive?" />
                <QuestionCard userName="Diana Prince" userIcon="/diana.png" question="What are some best practices for web accessibility?" />
                </div>

            </main>
        </>
    )
}

export default questions