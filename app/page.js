'use client'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'

export default function LandingPage() {
  return (
    <main className='text-white min-h-screen bg-transparent'>
      {/* Hero Section with Search Bar */}
      <section className='flex flex-col items-center justify-center min-h-[60vh] px-4'>
        <div className='text-center max-w-4xl mx-auto'>
          <h1 className='text-5xl font-bold mb-6'>Welcome to Edvora</h1>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            Ask questions, share knowledge, and connect with peers. Search for existing questions or post your own!
          </p>


          <div className='flex flex-row items-center justify-center space-x-4 w-[60vw] mx-auto'>
            <SearchBar
              navigateOnSearch={true}
              placeholder="Search for questions..."
            />
            <Link
              href='/questions'
              className='px-6 py-3 w-3xs h-[50%] bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors'
            >
              Browse All Questions
            </Link>
          </div>

        </div>
      </section>


      <section className='py-16 px-8'>
        <h2 className='text-3xl font-bold text-center mb-8'>Why Join Us?</h2>
        <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          <div className='text-center p-6 bg-gray-800 rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>Earn Points</h3>
            <p className='text-gray-400'>Answer questions and build your reputation.</p>
          </div>
          <div className='text-center p-6 bg-gray-800 rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>Search Easily</h3>
            <p className='text-gray-400'>Find relevant questions instantly.</p>
          </div>
          <div className='text-center p-6 bg-gray-800 rounded-lg'>
            <h3 className='text-xl font-semibold mb-2'>Find Notes</h3>
            <p className='text-gray-400'>Find Notes Given By Peers</p>
          </div>
        </div>
      </section>
    </main>
  )
}