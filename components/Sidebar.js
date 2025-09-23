"use client"
import { useState } from 'react' // Added for potential expansions
import Image from 'next/image'
import profile from '@/public/profile.svg'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
// Optional: import { ChevronUpDownIcon } from '@heroicons/react/24/outline'; // For progress bar arrow if needed

const Sidebar = ({ name, level, points, progress, profilePic }) => { // Updated: Destructure new props
    return (
        <div id="sidebar" className="min-h-[80vh] p-8 flex-1/5 w-full">
            <div id="profileDetails" className='flex flex-col items-center space-y-2'>
                <div className="w-24 h-24 bg-gray-300 rounded-full ring-neutral-700 ring-4 overflow-hidden">
                    <Image src={profilePic || profile} width={96} height={96} alt="Picture of the author" />
                </div>
                <h2 className="text-2xl font-bold">{name}</h2>
                <div className='flex flex-col items-center space-y-1 w-full'>
                    <div className='flex items-center space-x-2'>
                        <span className="text-lg font-semibold">Level {level}</span>
                    </div>
                    {/* New: Mini progress bar for level */}
                    <div className="w-full bg-neutral-700 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                            style={{ width: `${progress}%` }} // Dynamic width
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                        {Math.floor(points % pointsForNextLevel(level))} / {pointsForNextLevel(level)} to next {/* Assumes helper below */}
                    </p>
                </div>
            </div>
            <hr className='mt-2 mb-2' />
            <div id="links" className='flex flex-col space-y-6 mt-8 text-lg'>
                <Link href='/dashboard/askedquestion' className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 text-center"><div>Asked Questions</div></Link>
                <Link href='/dashboard/answeredquestion' className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 text-center"><div>Answered Questions</div></Link>
                <Link href='/dashboard/achievements' className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 text-center"><div>Achievements & Badges</div></Link> {/* Existing link */}
                <Link href='/dashboard/editprofile' className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 text-center"><div>Edit Profile</div></Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer border-b-2 rounded-2xl border-neutral-700 text-center"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}

// Helper function for sidebar (exponential points to next level; move to utils if shared)
function pointsForNextLevel(currentLevel) {
    return Math.floor(50 * Math.pow(1.5, currentLevel));
}

export default Sidebar