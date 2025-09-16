import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import profile from '@/public/profile.svg'
const Sidebar = () => {
  return (
      <div id="sidebar" className="min-h-[80vh] p-8 flex-1/5 w-full">
          <div id="profileDetails" className='flex flex-col items-center space-y-2'>
              <div className="w-24 h-24 bg-gray-300 rounded-full ring-neutral-700 ring-4"><Image src={profile.png} alt="Picture of the author" width={500} height={500} /></div>
              <h2 className="text-2xl font-bold">John Doe</h2>
              <div className='flex'>
                  <div>Level 1</div>
              </div>
          </div>
          <hr className='mt-2 mb-2' />
          <div id="links" className='flex flex-col space-y-2 text-lg'>
              <Link href='/'>Asked Questions</Link>
              <Link href='/'>Answered Questions</Link>
              <Link href='/'>Achievements</Link>
              <Link href='/'>Badges</Link>
              <Link href='/'>Edit Profile</Link>
              <Link href='/'>Sign Out</Link>
          </div>
      </div>
  )
}

export default Sidebar
