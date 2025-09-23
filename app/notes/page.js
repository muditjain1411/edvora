"use client";
import React, { useEffect, useState, useCallback } from 'react';  // ← Added useCallback import
import NotesModal from '@/components/NotesModal';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';  // For redirect
import dynamic from 'next/dynamic';

const NotesCard = dynamic(() => import('@/components/NotesCard'), {
  ssr: false,
  loading: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"><p>Loading notes...</p></div>,
});

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;  // Wait for session to load

    if (!session?.user?.email) {
      // Redirect to login if not authenticated
      router.push('/api/auth/signin');
      return;
    }

    setUserEmail(session.user.email);
  }, [session, status, router]);

  // ← FIXED: Wrapped in useCallback to stabilize (prevents recreation on every render)
  // Deps: [userEmail, router] – only re-creates if these change (e.g., after login)
  const fetchNotes = useCallback(async (email = null) => {
    if (!userEmail) return;  // Explicitly skip if not logged in (client-side gate)

    setLoading(true);
    setError(null);
    try {
      const url = email ? `/api/notes?givenByEmail=${encodeURIComponent(email)}` : '/api/notes';
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {  // Handle potential future auth errors gracefully
          router.push('/api/auth/signin');
          return;
        }
        throw new Error('Failed to fetch notes');
      }
      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
      console.log("Fetched notes:", data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [userEmail, router]);  // ← Deps for useCallback: userEmail (used in if-check) and router (for redirect)

  // ← FIXED: Added 'fetchNotes' to deps array (now stable via useCallback, no loops)
  useEffect(() => {
    if (userEmail) {
      fetchNotes();  // Fetch only if logged in
    }
  }, [userEmail, fetchNotes]);  // ← Now includes fetchNotes (satisfies ESLint)

  const handleNoteAdded = () => {
    fetchNotes(userEmail);  // ← Uses the stable callback
    setModalOpen(false);
  };

  // Show loading spinner while session checks
  if (status === 'loading') {
    return <div className="text-white text-center py-8">Loading...</div>;
  }

  // If no session, we've already redirected, but this is a safety net
  if (!session) {
    return (
      <div className="text-white text-center py-8 min-h-screen flex items-center justify-center">
        <div>
          <h2 className="text-2xl mb-4">Please log in to view notes</h2>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="text-white text-center py-8">Loading notes...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <>
      <main className='text-white min-h-screen bg-transparent py-8'>
        <div className='flex justify-between items-center w-[80vw] m-auto mb-4'>
          <h1 className='text-3xl'>Notes</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-2xl cursor-pointer transition"
          >
            Add Note
          </button>
        </div>

        <div className='w-[85vw] m-auto'>
          {notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
              {notes.map((n) => (
                <NotesCard
                  key={n._id}
                  title={n.title}
                  description={n.description}
                  pdfUrl={n.pdfUrl}
                  givenBy={n.givenBy?.name || 'Unknown'}
                  id={n._id}
                />
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400">No notes available.</p>
          )}
        </div>

        <NotesModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          email={userEmail}
          onNoteAdded={handleNoteAdded}
        />
      </main>
    </>
  );
};

export default Notes;