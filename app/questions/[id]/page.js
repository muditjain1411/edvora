
"use client"
import AnswerCard from '@/components/AnswerCard';
import React, { useEffect, useState } from 'react';


export default function AnswerPage() {
    const [id, setId] = useState(null);
    const [questionText, setQuestionText] = useState("");
    const [answers,setAnswers] = useState([])

    useEffect(() => {
        const currentId = window.location.pathname.split("/").pop();
        setId(currentId);
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchQuestion = async () => {
            try {
                const response = await fetch(`/api/questions?questionId=${id}`);
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

        const fetchAnswers = async () => {
            try {
                const response = await fetch(`/api/answers?questionId=${id}`);
                const data = await response.json();
                console.log("Fetched answers data:", data);
                if (response.ok) {
                    setAnswers(data)
                    console.log("Answers are: ",data)
                } else {
                    console.error("Error fetching answers:", data.error);
                }
            } catch (error) {
                console.error("Network error fetching answers:", error);
            }
        };
        fetchAnswers();
    }, [id]);

    return (
        <main className="text-white m-auto mt-4 w-[80vw] border-2 border-neutral-700 rounded-lg p-6">
            <div>
                <h1 className="text-2xl font-bold mb-2">Question:</h1>
                <p className="mb-6">{questionText}</p>
            </div>
            {/* {display answers} */}
        </main>
    );
}

  


