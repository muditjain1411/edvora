
import Link from 'next/link'
import React from 'react'

const Navbar = () => {



    return (
        <>
            <nav className="flex justify-between items-center px-10 py-4 text-gray-200 w-full bg-transparent">
                <Link href="/"><h1 className="text-5xl font-bold text-white">EDVORA</h1></Link>
                <div className='space-x-4 text-2xl'>
                    
                    <Link href="/dashboard" className="">Dashboard</Link>
                    <Link href="/questions" className="">Questions</Link>
                    <Link href="/notes" className="">Notes</Link>
                    <Link href="/about" className="">About</Link>
                </div>
            </nav>
            <hr className='mb-4'/>
        </>
    )
}

export default Navbar