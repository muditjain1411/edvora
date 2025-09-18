"use client"
import { React } from 'react'
import Image from 'next/image'
import profile from '@/public/profile.svg'
import { signOut } from 'next-auth/react'
const Sidebar = (params) => {
    return (
        <div id="sidebar" className="min-h-[80vh] p-8 flex-1/5 w-full">
            <div id="profileDetails" className='flex flex-col items-center space-y-2'>
                <div className="w-24 h-24 bg-gray-300 rounded-full ring-neutral-700 ring-4 overflow-hidden">
                    <Image src={params.profilePic || profile} width={96} height={96} alt="Picture of the author" />
                </div>
                <h2 className="text-2xl font-bold">{params.name}</h2>
                <div className='flex'>
                    <div>Level {params.level}</div>
                </div>
            </div>
            <hr className='mt-2 mb-2' />
            <div id="links" className='flex flex-col space-y-6 mt-8 text-lg'>
                <button className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 ">Asked Questions</button>
                <button className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 ">Answered Questions</button>
                <button className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 ">Achievements</button>
                <button className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 ">Badges</button>
                <button className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 ">Edit Profile</button>
                <button onClick={() => signOut({ callbackUrl: "/" })
                    
                } className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 ">Sign Out</button>
            </div>
        </div>
    );
}

export default Sidebar
