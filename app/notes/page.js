import NotesCard from '@/components/NotesCard'
import React from 'react'


const notes = () => {
  const note = {
    title: "React Hooks Overview",
    description: "A brief overview of React hooks and their usage.",
    content: "React hooks are functions that let you use state and other React features without writing a class. The most commonly used hooks are useState, useEffect, and useContext. They simplify component logic and promote code reuse.",
    
    imgUrl: "https://images.unsplash.com/photo-1506765515384-028b60a970df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    givenBy: "John Doe"
  }
  return (
    <>
      <main className='text-white'>
        <h1 className='text-3xl'>Notes</h1>
        <div className=''>
          <p>No notes available. Start by creating a new note!</p>

          <div className="grid grid-cols-4 w-[85vw] m-auto gap-2 mt-2">
          <NotesCard
            title={note.title}
            description={note.description}
            content={note.content}
            imgUrl={note.imgUrl}
            givenBy={note.givenBy}
            />
          <NotesCard
            title={note.title}
            description={note.description}
            content={note.content}
            imgUrl={note.imgUrl}
            givenBy={note.givenBy}
            />
          <NotesCard
            title={note.title}
            description={note.description}
            content={note.content}
            imgUrl={note.imgUrl}
            givenBy={note.givenBy}
            />
          <NotesCard
            title={note.title}
            description={note.description}
            content={note.content}
            imgUrl={note.imgUrl}
            givenBy={note.givenBy}
            />
          <NotesCard
            title={note.title}
            description={note.description}
            content={note.content}
            imgUrl={note.imgUrl}
            givenBy={note.givenBy}
            />
          <NotesCard
            title={note.title}
            description={note.description}
            content={note.content}
            imgUrl={note.imgUrl}
            givenBy={note.givenBy}
            />
          <NotesCard
            title={note.title}
            description={note.description}
            content={note.content}
            imgUrl={note.imgUrl}
            givenBy={note.givenBy}
            />
            </div>

        </div>
      </main>
    </>
  )
}

export default notes