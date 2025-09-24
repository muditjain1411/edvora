"use client"
import AnswerCard from '@/components/AnswerCard';
import React, { useEffect, useState } from 'react';
import AnswerModal from '@/components/AnswerModal';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AnswersPage() {
    const { data: session, status } = useSession();
    const [modalOpen, setModalOpen] = useState(false);
    const [id, setId] = useState(null);
    const [questionText, setQuestionText] = useState("");
    const [answers, setAnswers] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentId = window.location.pathname.split("/").pop();
        setId(currentId);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (status === 'loading') return; // Wait for session to load
        if (session?.user?.email) {
            console.log("User email from session:", session.user.email);
            setUserEmail(session.user.email);
        }
    }, [session, status]);

    // Fetch question and answers
    const fetchQuestion = async () => {
        try {
            const response = await fetch(`/api/questions?questionId=${id}`);
            const data = await response.json();
            if (response.ok) {
                setQuestionText(data[0]?.question || "");
            } else {
                console.error("Error fetching question:", data.error);
            }
        } catch (error) {
            console.error("Network error fetching question:", error);
        }
    };

    const fetchAnswers = async () => {
        try {
            const response = await fetch(`/api/answers?questionId=${id}`);
            const data = await response.json();
            if (response.ok) {
                setAnswers(data);
            } else {
                console.error("Error fetching answers:", data.error);
            }
        } catch (error) {
            console.error("Network error fetching answers:", error);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchQuestion();
        fetchAnswers();
    }, [id]);

    // Callback to refresh answers after modal submission
    const handleAnswerSubmitted = async () => {
        await fetchAnswers();
    };

    if (status === 'loading' || loading) {
        return (
            <main className="text-white m-auto mt-4 w-[80vw] border-2 border-neutral-700 rounded-lg p-6 flex items-center justify-center">
                <p className="text-gray-400">Loading...</p>
            </main>
        );
    }

    return (
        <main className="text-white m-auto mt-4 w-[80vw] border-2 border-neutral-700 rounded-lg p-6">
            <div className="flex justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold">Question:</h1>
                    <p className="text-3xl">{questionText || "Loading question..."}</p>
                </div>
                {session && (
                    <div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-neutral-700 text-white px-4 py-2 rounded-2xl cursor-pointer"
                        >
                            Answer the question
                        </button>
                    </div>
                )}
            </div>

            {/* Answers Section: Only show if logged in */}
            {session ? (
                <div className="flex flex-col gap-2 mt-3">
                    {answers.length > 0 ? (
                        answers.slice().reverse().map((a, idx) => (
                            <Link href={`/questions/${a.questionId}/${a._id}`} key={a._id || idx}>
                                <AnswerCard
                                    answer={a.answer}
                                    username={a.answeredBy?.name || 'Anonymous'}
                                    likesCount={(a.likes || []).length}
                                    dislikesCount={(a.dislikes || []).length}
                                />
                            </Link>
                        ))
                    ) : (
                        <div className="text-gray-500 mt-8 text-center w-full border-2 border-neutral-700 rounded-2xl p-4">
                            No answers yet
                        </div>
                    )}
                </div>
            ) : (
                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-lg">Please sign in to view answers.</p>
                    <Link href="/login" className="text-blue-400 hover:underline mt-2 block">
                        Sign in here
                    </Link>
                </div>
            )}

            <AnswerModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                email={userEmail || undefined}
                questionText={questionText}
                questionId={id}
                onAnswerSubmitted={handleAnswerSubmitted}
            />
        </main>
    );
}