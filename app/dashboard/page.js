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
    const [dbuser, setDbUser] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const router = useRouter()

    let totalAILimit = 5
    let name = "Not Logged In"
    let level = 1
    let points = 0
    let aiUsed = 0
    let profilePic = null
    let questionsAsked = 0
    let questionsAnswered = 0



    useEffect(() => {
        if (session?.user?.email) {
            setUserEmail(session.user.email);
            fetch(`/api/users?email=${session.user.email}`)
                .then(res => res.json())
                .then(data => setDbUser(data))
                .catch(() => setDbUser(null))
        } else {
            setDbUser(null)
        }
    }, [session]);

    useEffect(() => {

        if (!session && status !== "loading") {
            router.push("/")
        }

    }, [status, router])

    if (session && session.user) {
        
        name = dbuser?.name || "Not Loaded"
        level = dbuser?.level || 1
        points = dbuser?.points || 0
        aiUsed = dbuser?.aiUsed || 0
        profilePic = dbuser?.profilePic
        questionsAsked = dbuser?.questionsAsked || 0
        questionsAnswered = dbuser?.questionsAnswered || 0
    }

    return (
        <main className='flex flex-row items-center justify-center text-white'>
            <Sidebar name={name} level={level} profilePic={profilePic} />

            <div className="min-h-[78vh] p-8 flex-4/5 w-full mt-2 mb-2 border-l-1">
                <div className='w-full h-full grid-cols-3 grid-rows-2 gap-6 grid '>
                    <div id="QuesAsked" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>Questions Asked</h2>
                        <div className='text-5xl font-bold'>{questionsAsked}</div>
                    </div>
                    <div id="quesAnswered" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>Questions Answered</h2>
                        <div className='text-5xl font-bold'>{questionsAnswered}</div>
                    </div>
                    <div id="AILimitLeft" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>AI Limits Left</h2>
                        <div className='text-5xl font-bold'>{totalAILimit - aiUsed}</div>
                    </div>
                    <div id="quickLinks" className='w-full h-auto col-span-full'>
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
                                <Link href="/notes"><Image className='bg-gray-300 rounded-full ring-neutral-700 ring-2' src={askImage} width={70} height={70} alt="notes"></Image></Link>
                                <h3 className="text-white font-bold py-2 px-4 text-center">Notes</h3>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <AskQuestionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} email={userEmail} />
        </main>
    )
}

export default dashboard