'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import QuestionCard from '@/components/QuestionCard'
import { useSession } from 'next-auth/react'

const AskedQuestions = () => {
    const { data: session, status } = useSession();
    const [questions, setQuestions] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return; // Wait for session to load
        if (session?.user?.email) {
            setUserEmail(session.user.email);
        } else {
            setUserEmail(null); // No user logged in
        }
        setLoading(false);
    }, [session, status]);

    useEffect(() => {
        if (!userEmail) return; // Don't fetch if no email

        const fetchQuestions = async () => {
            try {
                const url = `/api/questions?email=${encodeURIComponent(userEmail)}`;
                const response = await fetch(url);
                if (!response.ok) {
                    console.error('Failed to fetch questions');
                    setQuestions([]);
                    return;
                }
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setQuestions([]);
            }
        };
        fetchQuestions();
    }, [userEmail]); // Re-fetch only when userEmail changes

    if (loading) {
        return (
            <main className='text-white min-h-screen bg-transparent flex items-center justify-center'>
                <p className='text-gray-400'>Loading your questions...</p>
            </main>
        );
    }

    if (!session) {
        return (
            <main className='text-white min-h-screen bg-transparent flex items-center justify-center'>
                <p className='text-gray-400'>Please sign in to view your questions.</p>
            </main>
        );
    }

    return (
        <main className='text-white min-h-screen bg-transparent'>
            <div className='flex flex-col w-[85vw] m-auto pt-8'>
                <Link
                    href="/dashboard"
                    className="text-blue-400 hover:underline mb-6 inline-block text-lg font-semibold"
                >
                    ← Back to Dashboard
                </Link>
                <div className='ml-4 mb-4'>
                    <h1 className='text-3xl font-bold'>Your Asked Questions</h1>
                    <p className='text-gray-400 mt-2'>Questions you&aposve posted.</p>
                </div>
                <div className='flex flex-col space-y-4 w-full'>
                    {questions.length > 0 ? (
                        questions.map((q) => (
                            <Link href={`/questions/${q._id}`} key={q._id}>
                                <QuestionCard
                                    question={q.question}
                                    userName={q.askedBy.name}
                                    userIcon={q.askedBy.profilePic}
                                />
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-400">You haven&apost asked any questions yet. <Link href="/ask" className="text-blue-400 hover:underline">Ask one now!</Link></p>
                    )}
                </div>
            </div>
        </main>
    )
}

export default AskedQuestions