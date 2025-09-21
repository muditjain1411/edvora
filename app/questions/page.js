'use client'
import { React, useState, useEffect } from 'react'
import Link from 'next/link'
import QuestionCard from '@/components/QuestionCard'


const questions = () => {
    const [questions, setQuestions] = useState([]);
    useEffect(() => {
        const fetchQuestions = async () => {
            const response = await fetch('/api/questions');
            const data = await response.json();
            setQuestions(data);
        };
        fetchQuestions();
    }, []);


    return (
        <>
            <main className='text-white'>
                <div className='ml-40'>
                    <h1 className='text-3xl'>Questions</h1>
                    <p id="QPText">Answer peer questions and earn points</p>
                </div>
                <div id="questions" className='flex flex-col space-y-4 mt-4'>
                    {questions.slice().reverse().map((q, idx) => (
                        <Link href={`/questions/${q._id}`} key={q._id || idx}>
                            <QuestionCard
                                key={q.id || idx}
                                question={q.question}
                                userName={q.askedBy.name}
                                userIcon={q.askedBy.profilePic}
                            />
                            </Link>
                        ))}
                </div>
            </main>
        </>
    )
}

export default questions