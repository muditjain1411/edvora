"use client";

import { useState } from "react";

export default function AskQuestionModal({ isOpen, onClose, email}) {
    const [question, setQuestion] = useState("");

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        if (question.trim() === "") return;
        try {
            const res = await fetch("/api/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, email }),
            });
            if (!res.ok) {
                throw new Error("Failed to submit question");
            }
            alert("Question submitted!");
            
        } catch (error) {
            alert(error.message);
        }
        setQuestion("");
        onClose();

    }
    function handleCancel() {
        setQuestion("");
        onClose();
    }

    return (
        <>
            {/* Blurred background */}
            <div
                className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm z-40"
                onClick={handleCancel}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-lg shadow-lg max-w-[50vw] w-full p-6 relative bg-neutral-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
                    onClick={(e) => e.stopPropagation()}>
                        
                    <h2 className="text-xl font-semibold mb-4">Ask a Question</h2>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2 mb-4 field-sizing-content focus:outline-none min-h-[10vh] max-h-[70vh] overflow-y-auto"
                        rows={5}
                        placeholder="Type your question here..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        required
                    />

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}