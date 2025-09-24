'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AnswerCard from '@/components/UserAnswerCard'
import { useSession } from 'next-auth/react'

const AnsweredQuestions = () => {
    const { data: session, status } = useSession();
    const [answers, setAnswers] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;
        if (session?.user?.email) {
            setUserEmail(session.user.email);
        } else {
            setUserEmail(null);
        }
        setLoading(false);
    }, [session, status]);

    useEffect(() => {
        if (!userEmail) return;

        const fetchAnswers = async () => {
            try {
                const url = `/api/answers?email=${encodeURIComponent(userEmail)}`;
                const response = await fetch(url);
                if (!response.ok) {
                    console.error('Failed to fetch answers');
                    setAnswers([]);
                    return;
                }
                const data = await response.json();
                setAnswers(data);
            } catch (error) {
                console.error('Error fetching answers:', error);
                setAnswers([]);
            }
        };
        fetchAnswers();
    }, [userEmail]); // Re-fetch only when userEmail changes

    if (loading) {
        return (
            <main className='text-white min-h-screen bg-transparent flex items-center justify-center'>
                <p className='text-gray-400'>Loading your Answers...</p>
            </main>
        );
    }

    if (!session) {
        return (
            <main className='text-white min-h-screen bg-transparent flex items-center justify-center'>
                <p className='text-gray-400'>Please sign in to view your answers.</p>
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
                    <h1 className='text-3xl font-bold'>Your Answers</h1>
                    <p className='text-gray-400 mt-2'>Questions you&apos;ve answered.</p>
                </div>
                <div className='flex flex-col space-y-4 w-full'>
                    {answers.length > 0 ? (
                        answers.map((a, index) => (
                            <Link href={`/questions/${a.questionId?._id}`} key={a._id || index}>
                                <AnswerCard
                                    questionText={a.questionId?.question || ''}
                                    answer={a.answer}
                                    likesCount={(a.likes || []).length}
                                    dislikesCount={(a.dislikes || []).length}
                                />
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-400">
                            You haven&apos;t answered any questions yet.{' '}
                            <Link href="/questions" className="text-blue-400 hover:underline">
                                Browse questions to answer
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </main>
    )
}

export default AnsweredQuestions