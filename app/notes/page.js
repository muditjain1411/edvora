"use client"
import React, { useEffect, useState } from 'react'
import NotesModal from '@/components/NotesModal'
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const NotesCard = dynamic(() => import('@/components/NotesCard'), {
  ssr: false,
  loading: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><p>Loading notes...</p></div>,
});



const notes = () => {
  const [notes, setNotes] = useState([])
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
          if (session?.user?.email) {
              console.log("User email from session:", session.user.email);
              setUserEmail(session.user.email);
          }
      }, [session]);

   useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    }
    fetchNotes()
  }, [])

  console.log("fetched notes:", notes)
  

  return (
    <>
      <main className='text-white'>
        <div className='flex justify-between items-center w-[80vw] m-auto mb-4'>
          <h1 className='text-3xl'>Notes</h1>
          <button onClick={() => setModalOpen(true)} className="bg-neutral-700 text-white px-4 py-2 rounded-2xl cursor-pointer">Add Note</button>
        </div>

        <div className=''>
          <div className="grid grid-cols-4 w-[85vw] m-auto gap-2 mt-2">
            {notes && notes.length > 0 ? (
              notes.map((n, idx) => {
                console.log("Processing item:", n); // Keep your log for debugging
                return (
                  <div key={n._id || idx}> {/* Use _id as primary key for React efficiency */}
                    <NotesCard
                      title={n.title}
                      description={n.description}
                      pdfUrl={n.pdfUrl}
                      givenBy={n.givenBy?.name}
                    />
                  </div>
                );
              })
            ) : (
              <p>No notes available.</p> // Fallback if array is empty or undefined
            )}
           
          </div>

        </div>
        <NotesModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          email={userEmail}
        />

      </main>

    </>
  )
}

export default notes