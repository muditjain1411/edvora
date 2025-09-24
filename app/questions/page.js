'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import QuestionCard from '@/components/QuestionCard'
import SearchBar from '@/components/SearchBar'
import { useSession } from 'next-auth/react'
import AskQuestionModal from '@/components/AskQuestionModal'
import { Suspense } from 'react'

const QuestionsContent = () => {
    const { data: session, status } = useSession();
    const [modalOpen, setModalOpen] = useState(false)
    const [questions, setQuestions] = useState([]);
    const [userEmail, setUserEmail] = useState(null);
    const [searchTerm, setSearchTerm] = useState("")
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Wait for session
        if (session?.user?.email) {
            setUserEmail(session.user.email);
        } else {
            setUserEmail(null);
        }
    }, [session, status]);

    // Extracted refetch function for reuse (e.g., after modal success)
    const refetchQuestions = useCallback(async () => {
        const currentSearch = searchParams.get('search') || '';
        const params = currentSearch ? `?search=${encodeURIComponent(currentSearch)}` : '';
        const url = `/api/questions${params}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Failed to fetch questions');
            setQuestions([]);
            return;
        }
        const data = await response.json();
        setQuestions(data);
    }, [searchParams]);

    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        setSearchTerm(currentSearch); // Update input value
        refetchQuestions(); // Use shared refetch
    }, [searchParams, refetchQuestions]);

    const handleSearch = (query) => {
        const trimmedQuery = query.trim();
        const newUrl = trimmedQuery ? `/questions?search=${encodeURIComponent(trimmedQuery)}` : '/questions';
        router.push(newUrl, { scroll: false });
        // Effect will refetch when searchParams updates
    };

    const handleInputChange = (val) => {
        setSearchTerm(val); // Update input immediately on typing (no fetch yet)
    };

    // Handle modal success (refetch and close)
    const handleModalSuccess = () => {
        setModalOpen(false);
        refetchQuestions(); // Refresh list to show new question
    };

    if (status === 'loading') {
        return (
            <main className='text-white w-full h-full flex items-center justify-center'>
                <p className="text-gray-400">Loading...</p>
            </main>
        );
    }

    return (
        <>
            <main className='text-white w-full h-full'>
                <div className='flex flex-col w-[85vw] m-auto'>

                    <div className='ml-4 mb-4'>
                        <h1 className='text-3xl font-bold'>Questions</h1>
                        <p id="QPText">Answer peer questions and earn points</p>
                    </div>
                    <div className='flex flex-row justify-between items-center w-full'>
                        <SearchBar
                            onSearch={handleSearch}
                            value={searchTerm}
                            onChange={handleInputChange}
                            isControlled={true}
                            placeholder="Search questions..."
                        />
                        <button onClick={() => setModalOpen(true)} className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-2xl cursor-pointer transition">Ask Question</button>
                    </div>
                    <div id="questions" className='flex flex-col space-y-4 mt-4 mx-auto w-[80vw]'>
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
                            <p className="text-gray-400">No questions found{searchTerm && ` for "${searchTerm}"`}.</p>
                        )}
                    </div>
                </div>
                <AskQuestionModal
                    isOpen={modalOpen}
                    onClose={() => { setModalOpen(false); }}
                    email={userEmail}
                    onSuccess={handleModalSuccess}
                />
            </main>
        </>
    )
}
export default function QuestionsPage() {
    return (
        <Suspense fallback={<div>Loading questions...</div>}>
            <QuestionsContent />
        </Suspense>
    );
}