import React from 'react'

const landing = () => {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Ask, Answer, Learn</h1>
        <p className="text-lg mb-6">One place for students to ask & share academic knowledge.</p>
      </div>
      <form id="askQuestion" className='flex items-center gap-1 h-10' action="">
        <input type="text" placeholder="Type your question here..." className="w-[50%] p-4 border border-gray-300 rounded-lg h-10" />
        <button type="submit" className="px-6 py-3 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Ask Question</button>
      </form>
    </main>
  )
}

export default landing