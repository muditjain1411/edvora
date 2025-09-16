import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
import askImage from '@/public/ask.svg'

const dashboard = () => {
    return (
        <main className='flex flex-row items-center justify-center'>
            <Sidebar />

            <div className="min-h-[78vh] p-8 flex-4/5 w-full mt-2 mb-2 border-l-1">
                <div className='w-full h-full grid-cols-3 grid-rows-2 gap-6 grid '>
                    <div id="QuesAsked" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>Questions Asked</h2>
                        <div className='text-5xl font-bold'>25</div>
                    </div>
                    <div id="quesAnswered" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>Questions Answered</h2>
                        <div className='text-5xl font-bold'>15</div>
                    </div>
                    <div id="AILimitLeft" className="border-2 border-neutral-700 w-full h-30 flex flex-col justify-center items-center text-center rounded-lg p-4">
                        <h2 className='text-2xl'>AI Limits Left</h2>
                        <div className='text-5xl font-bold'>5</div>
                    </div>
                    <div id="quickLinks" className='w-full h-auto col-span-full'>
                        <h1 className='text-3xl mt-2'>Quick Links</h1>
                        <div className='grid grid-cols-6 gap-4 mt-4'>
                            <div className='flex flex-col justify-center items-center p-4'>
                                <Link href="/dashboard"><Image className='bg-gray-300 rounded-full ring-neutral-700 ring-2' src={askImage} width={70} height={70}></Image></Link>
                                <h3 className="text-white font-bold py-2 px-4 text-center">Ask a Question</h3>
                            </div>
                            <div className='flex flex-col justify-center items-center p-4'>
                                <Link href="/dashboard"><Image className='bg-gray-300 rounded-full ring-neutral-700 ring-2' src={askImage} width={70} height={70}></Image></Link>
                                <h3 className="text-white font-bold py-2 px-4 text-center">View Questions</h3>
                            </div>
                            <div className='flex flex-col justify-center items-center p-4'>
                                <Link href="/dashboard"><Image className='bg-gray-300 rounded-full ring-neutral-700 ring-2' src={askImage} width={70} height={70}></Image></Link>
                                <h3 className="text-white font-bold py-2 px-4 text-center">Notes</h3>
                            </div>
                        </div>
                 
                    </div>

                </div>
            </div>
        </main>
    )
}

export default dashboard