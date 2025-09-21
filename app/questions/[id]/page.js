"use client"
import AnswerCard from '@/components/AnswerCard';
import React, { useEffect, useState } from 'react';
import AnswerModal from '@/components/AnswerModal';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AnswersPage() {
    const { data: session } = useSession();
    const [modalOpen, setModalOpen] = useState(false);
    const [id, setId] = useState(null);
    const [questionText, setQuestionText] = useState("");
    const [answers, setAnswers] = useState([]);
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const currentId = window.location.pathname.split("/").pop();
        setId(currentId);
    }, []);

    useEffect(() => {
        if (session?.user?.email) {
            console.log("User email from session:", session.user.email);
            setUserEmail(session.user.email);
        }
    }, [session]);

    useEffect(() => {
        if (!id) return;

        const fetchQuestion = async () => {
            try {
                const response = await fetch(`/api/questions?questionId=${id}`);
                const data = await response.json();
                console.log("Fetched question data:", data);
                if (response.ok) {
                    setQuestionText(data[0].question);
                    console.log("Question text set to:", data[0].question);
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
                console.log("Fetched answers data:", data);
                if (response.ok) {
                    setAnswers(data);
                } else {
                    console.error("Error fetching answers:", data.error);
                }
            } catch (error) {
                console.error("Network error fetching answers:", error);
            }
        };

        fetchQuestion();
        fetchAnswers();
    }, [id]);

    return (
        <main className="text-white m-auto mt-4 w-[80vw] border-2 border-neutral-700 rounded-lg p-6">
            <div className="flex justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold">Question:</h1>
                    <p className="text-3xl">{questionText}</p>
                </div>
                <div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-neutral-700 text-white px-4 py-2 rounded-2xl cursor-pointer"
                    >
                        Answer the question
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-3">
                {answers.slice().reverse().map((a, idx) => (
                    <Link href={`/questions/${a.questionId}/${a._id}`} key={a._id || idx}>
                        <AnswerCard
                            answer={a.answer}
                            username={a.answeredBy.name}
                            likesCount={Object.keys(a.likes || {}).length || 0}
                            dislikesCount={Object.keys(a.dislikes || {}).length || 0}
                        />
                    </Link>
                ))}
                {answers.length === 0 && (
                    <div className="text-gray-500 mt-8 text-center w-full border-2 border-neutral-700 rounded-2xl p-4">No answers yet</div>
                )}
            </div>

            <AnswerModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                email={userEmail}
                questionText={questionText}
                questionId={id}
            />
        </main>
    );
}