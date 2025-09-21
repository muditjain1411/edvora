"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function AnswerPage() {
  const [answerId, setAnswerId] = useState(null)
  const [questionId, setQuestionId] = useState(null)
  const [answerText, setAnswerText] = useState("")
  const [questionText, setQuestionText] = useState("")
  const [answers, setAnswers] = useState([])
  const [userEmail, setUserEmail] = useState(null)
  const { data: session } = useSession()

  useEffect(() => {
          if (session?.user?.email) {
              console.log("User email from session:", session.user.email);
              setUserEmail(session.user.email);
          }
      }, [session]);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const second = pathParts[pathParts.length - 2];
    const third = pathParts[pathParts.length - 1];
    setAnswerId(third);
    setQuestionId(second);
  }, []);

  useEffect(() => {
    if (!questionId) return;
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions?questionId=${questionId}`);
        const data = await response.json();
        console.log("Fetched question data:", data);
        if (response.ok) {
          setQuestionText(data[0].question);
          console.log("Question text set to:", data[0].question);
        } else {
          console.error("Error fetching question:", data.error);
        }
      } catch (error) {
        console.error("Network error fetching question:", error);
      }
    };
    fetchQuestion();
  }, [questionId]);

  useEffect(() => {
    if (!questionId || !answerId) return;
    const fetchAnswers = async () => {
      try {
        const response = await fetch(`/api/answers?questionId=${questionId}&answerId=${answerId}`);
        const data = await response.json();
        console.log("Fetched answer data:", data);
        if (response.ok) {
          setAnswers(Array.isArray(data) ? data : [data]);
          if (Array.isArray(data)) {
            if (data.length > 0) {
              setAnswerText(data[0].answer);
            } else {
              setAnswerText("");
            }
          } else {
            setAnswerText(data.answer || "");
          }
        } else {
          console.error("Error fetching answers:", data.error);
        }
      } catch (error) {
        console.error("Network error fetching answers:", error);
      }
    };
    fetchAnswers();
  }, [questionId, answerId]);

  useEffect(() => {
    console.log("Answers state updated:", answers);
  }, [answers]);

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/answers/${answerId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Error liking the answer");
    }
  };
  const handleDislike = async () => {
    try {
      const response = await fetch(`/api/answers/${answerId}/dislike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert("Error disliking the answer");
    }
  };


  return (
    <main className="text-white m-auto mt-4 w-[80vw] border-2 border-neutral-700 rounded-lg p-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Question:</h1>
        <p className="mb-6 text-3xl">{questionText}</p>
      </div>
      <div className="answer">
        <h1 className="text-2xl font-bold mb-2">Answer:</h1>
        <p className="text-2xl">{answerText}</p>

        
        <div className="mt-4 flex flex-col gap-4">
          {answers.length > 0 && answers[0].imageUrls && answers[0].imageUrls.map((url, idx) => (
            <div key={idx} className="w-full relative">
              <Image src={url} width={1920} height={1080} alt={`Answer image ${idx + 1}`} className="object-cover w-full h-full rounded-lg" unoptimized/>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button onClick={() => handleLike()} className="bg-green-600 px-4 py-2 rounded-2xl cursor-pointer">Like</button>
          <button onClick={() => handleDislike()} className="bg-red-600 px-4 py-2 rounded-2xl cursor-pointer">Dislike</button>
        </div>
      </div>
    </main>
  )
}