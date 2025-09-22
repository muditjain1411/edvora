import { useState } from "react";
import { uploadFile } from '@/lib/uploadPdfFirebase'

import PdfUploader from '@/components/pdfUploader'

export default function NotesModal({ isOpen, onClose, email }) {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pdf, setPdf] = useState(null);
    


    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();

        // Basic validation
        if (!title.trim() || !description.trim()) {
            alert("Please fill in the title and description.");
            return;
        }

        try {
        const pdfUrl = await uploadFile(pdf)

            // Submit note data to your API (pdfUrl should be set by PdfUploader if uploaded)
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    title: title,
                    description: description,
                    pdfUrl: pdfUrl 
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to submit note");
            }

            alert("Note submitted successfully!");
            // Reset all states
            
            setTitle("");
            setDescription("");
            setPdf("");
            onClose();

        } catch (error) {
            console.error("Submission error:", error);
            alert(`Error: ${error.message}`);
        }
    }

    function handleCancel() {
        // Reset all states
        setNote("");
        setTitle("");
        setDescription("");
        onClose();
    }

    const isSubmitDisabled = !title.trim() || !description.trim();

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
                    className="rounded-lg shadow-lg max-w-[50vw] w-full p-6 relative bg-neutral-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] max-h-[80vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-2xl font-semibold mb-4">Add Note</h2>

                    {/* Title Input */}
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Note Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Enter your note title here"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {/* Description Textarea */}
                    <label htmlFor="description" className="block text-sm font-medium mb-1">
                        Note Description
                    </label>
                    <textarea
                        id="description"
                        className="w-full border border-gray-300 rounded-md p-2 mb-4 field-sizing-content focus:outline-none min-h-[10vh] max-h-[70vh] overflow-y-auto"
                        rows={5}
                        placeholder="Type your note description here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    {/* PDF Upload */}
                    <label className="block text-sm font-medium mb-1">
                        Upload PDF (Optional)
                    </label>
                    <PdfUploader pdf={pdf} setPdf={setPdf} />

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}