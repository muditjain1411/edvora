"use client"
import { useSession } from 'next-auth/react'
import { React, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import askImage from '@/public/ask.svg'
import { useRouter } from 'next/navigation'
import AskQuestionModal from '@/components/AskQuestionModal'

const dashboard = () => {
    const { data: session, status } = useSession();
    const [modalOpen, setModalOpen] = useState(false)
    const [userData, setUserData] = useState({
        totalAILimit: 5,
        name: "Not Logged In",
        level: 1,
        points: 0, // Already existed; now used for gamification
        aiUsed: 0,
        profilePic: null,
        questionsAsked: 0,
        questionsAnswered: 0,
        notesGiven: 0, // New: From gamification
        streak: 0, // New: From gamification
        badges: [], // New: Array of badges
        achievements: [], // New: Array of achievements
    })
    const [dbuser, setDbUser] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const router = useRouter()

    // Updated: Refetch user data (now includes gamification fields)
    const refetchUserData = () => {
        if (!session?.user?.email) return;
        fetch(`/api/users?email=${session.user.email}`)
            .then(res => res.json())
            .then(data => setDbUser(data))
            .catch(() => setDbUser(null))
    }

    useEffect(() => {
        if (session?.user?.email) {
            setUserEmail(session.user.email);
            refetchUserData(); // Use the function for consistency
        } else {
            setDbUser(null)
        }
    }, [session]);

    useEffect(() => {
        if (!session && status !== "loading") {
            router.push("/")
        }
    }, [status, router])

    useEffect(() => {
        if (session && dbuser) {
            setUserData({
            totalAILimit: 5,
            name: dbuser.name || "Not Loaded",
            level: dbuser.level || 1,
            points: dbuser.points || 0,
            aiUsed: dbuser.aiUsed || 0,
            profilePic: dbuser.profilePic,
            questionsAsked: dbuser.questionAsked || 0,
            questionsAnswered: dbuser.answerGiven || 0,
            notesGiven: dbuser.notesGiven || 0, // New
            streak: dbuser.streak || 0, // New
            badges: dbuser.badges || [], // New
            achievements: dbuser.achievements || [], // New
        });
        }
    }, [session, dbuser]);

    const {
        totalAILimit,
        name,
        level,
        points,
        aiUsed,
        profilePic,
        questionsAsked,
        questionsAnswered,
        notesGiven, // New
        streak, // New
        badges, // New (not displayed here; shown in achievements page)
        achievements, // New (not displayed here; shown in achievements page)
    } = userData;

    // New: Compute progress to next level (exponential formula, client-side)
    const pointsToNextLevel = Math.floor(50 * Math.pow(1.5, level));
    const progress = Math.min((points % pointsToNextLevel) / pointsToNextLevel * 100, 100);

    return (<>
        <main className='flex flex-row items-center justify-center text-white'>
            <Sidebar
                name={name}
                level={level}
                profilePic={profilePic}
                points={points} // New: Pass points for sidebar progress bar
                progress={progress} // New: Pass for sidebar
                pointsToNextLevel={pointsToNextLevel} // New: Pass for sidebar
            />

            <div className="min-h-[78vh] p-8 flex-4/5 w-full mt-2 mb-2 border-l-1">
                <div className='w-full h-full grid-cols-2 md:grid-cols-4 grid-rows-2 gap-6 grid '> {/* Updated: 4 cols for new cards */}
                    {/* Existing: Questions Asked */}
                    <div id="QuesAsked" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>Questions Asked</h2>
                        <div className='text-5xl font-bold'>{questionsAsked}</div>
                    </div>
                    {/* Existing: Questions Answered */}
                    <div id="quesAnswered" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>Questions Answered</h2>
                        <div className='text-5xl font-bold'>{questionsAnswered}</div>
                    </div>
                    {/* New: Notes Given */}
                    <div id="notesGiven" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>Notes Given</h2>
                        <div className='text-5xl font-bold'>{notesGiven}</div>
                    </div>
                    {/* New: Streak */}
                    <div id="streak" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4 bg-yellow-900/20"> {/* Subtle yellow bg */}
                        <h2 className='text-2xl'>Login Streak</h2>
                        <div className='text-5xl font-bold text-yellow-400'>{streak} days</div>
                        <p className='text-sm text-yellow-300'>Next: +{10 * (streak + 1)} pts</p>
                    </div>
                    {/* New: Points (spans row for emphasis) */}
                    <div className="border-2 border-neutral-700 w-full h-30 col-span-full flex flex-col justify-center items-center text-center rounded-lg p-4 bg-blue-900/20">
                        <h2 className='text-2xl'>Total Points</h2>
                        <div className='text-6xl font-bold text-blue-400'>{points}</div>
                    </div>
                    {/* Existing: AI Limits (now in row 2) */}
                    <div id="AILimitLeft" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>AI Limits Left</h2>
                        <div className='text-5xl font-bold'>{totalAILimit - aiUsed}</div>
                    </div>
                </div>

                {/* Existing: Quick Links (unchanged) */}
                <div id="quickLinks" className='w-full h-auto col-span-full mt-8'>
                    <h1 className='text-3xl mt-2'>Quick Links</h1>
                    <div className='grid grid-cols-6 gap-4 mt-4'>
                        <button onClick={() => setModalOpen(true)} className="cursor-pointer">
                            <div className='flex flex-col justify-center items-center p-4'>
                                <Image className='bg-gray-300 rounded-full ring-neutral-700 ring-2' src={askImage} width={70} height={70} alt="ask"></Image>
                                <h3 className="text-white font-bold py-2 px-4 text-center">Ask a Question</h3>
                            </div>
                        </button>
                        <div className='flex flex-col justify-center items-center p-4'>
                            <Link href="/questions"><Image className='bg-gray-300 rounded-full ring-neutral-700 ring-2' src={askImage} width={70} height={70} alt="view"></Image></Link>
                            <h3 className="text-white font-bold py-2 px-4 text-center">View Questions</h3>
                        </div>
                        <div className='flex flex-col justify-center items-center p-4'>
                            <Link href="/notes"><Image className='bg-gray-300 rounded-full ring-neutral-700 ring-2' src={askImage} width={70} height={70} alt="view"></Image></Link>
                            <h3 className="text-white font-bold py-2 px-4 text-center">Notes</h3>
                        </div>
                        <AskQuestionModal
                            isOpen={modalOpen}
                            onClose={() => {
                                refetchUserData(); // Refetch user data when modal closes (updates gamification)
                                setModalOpen(false);
                            }}
                            email={userEmail}
                        />
                    </div>
                </div>
            </div>
        </main>
    </>
    )
}

export default dashboard