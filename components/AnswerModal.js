import { useState } from "react";
import ImageUploader from '@/components/ImageUploader'
import { uploadFile } from '@/lib/uploadImageFirebase'

export default function AnswerModal({ isOpen, onClose, email, questionText, questionId, onAnswerSubmitted }) {
    const [Answer, setAnswer] = useState("");
    const [images, setImages] = useState([]);

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        if (Answer.trim() === "") return alert("Answer cannot be empty");
        try {
            const imageUrls = [];
            for (const image of images) {
                const url = await uploadFile(image);
                imageUrls.push(url);
            }
            const res = await fetch("/api/answers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    questionId: questionId,
                    answer: Answer,
                    imageUrls: imageUrls,
                }),
            });
            if (!res.ok) {
                throw new Error("Failed to submit answer");
            }
            alert("Answer submitted!");
            setAnswer("");
            setImages([]);
            if (typeof onAnswerSubmitted === 'function') {
                await onAnswerSubmitted();
            }
            onClose();
        } catch (error) {
            alert(error.message);
        }
    }

    function handleCancel() {
        setAnswer("");
        setImages([]);
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
                    className="rounded-lg shadow-lg max-w-[50vw] w-full p-6 relative bg-neutral-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]  max-h-[80vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-xl font-semibold mb-4">Question</h2>
                    <div className="rounded-md p-2 mb-4">{questionText}</div>
                    <h2 className="text-xl font-semibold mb-4">Answer</h2>
                    <textarea
                        className="w-full border border-gray-300 rounded-md p-2 mb-4 field-sizing-content focus:outline-none min-h-[10vh] max-h-[70vh] overflow-y-auto"
                        rows={5}
                        placeholder="Type your answer here..."
                        value={Answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                    />
                    <ImageUploader images={images} setImages={setImages} />

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