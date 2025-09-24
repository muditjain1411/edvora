"use client"
import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'

const Navbar = () => {

    const { data: session } = useSession();

    return (
        <>
            <nav className="flex justify-between items-center px-10 py-4 text-gray-200 w-full bg-transparent border-b border-white mb-4">
                <Link href="/"><h1 className="text-5xl font-bold text-white">EDVORA</h1></Link>
                <div className='space-x-4 text-2xl'>

                    {(!session) ? (
                        <>
                            <Link href="/login" className="">Login</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard" className="">Dashboard</Link>
                        </>

                    )}
                    <Link href="/questions" className="">Questions</Link>
                    <Link href="/notes" className="">Notes</Link>

                </div>
            </nav >
            
        </>
    )
}

export default Navbar