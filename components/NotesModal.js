import { useState } from "react";
import { uploadFile } from '@/lib/uploadPdfFirebase';
import { PdfUploader } from '@/components/PdfUploader';

export default function NotesModal({ isOpen, onClose, email, onNoteAdded }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pdf, setPdf] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen || !email) return null;  // Don't open if no email (not logged in)

    async function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !pdf || !email) {
            alert("Please fill in all fields. You must be logged in.");
            return;
        }

        setSubmitting(true);
        try {
            const pdfUrl = await uploadFile(pdf);

            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,  // Include email from session (required for backend user lookup)
                    title: title.trim(),
                    description: description.trim(),
                    pdfUrl,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to submit note");
            }

            alert("Note submitted successfully!");
            onNoteAdded();  // Trigger refetch
            handleCancel();
        } catch (error) {
            console.error("Submission error:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    }

    function handleCancel() {
        setTitle("");
        setDescription("");
        setPdf(null);
        onClose();
    }

    const isSubmitDisabled = !title.trim() || !description.trim() || !pdf || submitting || !email;

    return (
        <>
            <div
                className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm z-40"
                onClick={handleCancel}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-lg shadow-lg max-w-[50vw] w-full p-6 relative bg-neutral-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-2xl font-semibold mb-4 text-white">Add Note</h2>

                    <label htmlFor="title" className="block text-sm font-medium mb-1 text-gray-300">
                        Note Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        placeholder="Enter your note title here"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-600 rounded-md p-2 mb-4 bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <label htmlFor="description" className="block text-sm font-medium mb-1 text-gray-300">
                        Note Description
                    </label>
                    <textarea
                        id="description"
                        className="w-full border border-gray-600 rounded-md p-2 mb-4 bg-neutral-700 text-white focus:outline-none min-h-[10vh] max-h-[70vh] overflow-y-auto"
                        rows={5}
                        placeholder="Type your note description here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <label className="block text-sm font-medium mb-1 text-gray-300">
                        Upload PDF (Required)
                    </label>
                    <PdfUploader pdf={pdf} setPdf={setPdf} />

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-md border border-gray-600 hover:bg-gray-700 text-white transition"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitDisabled}
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}