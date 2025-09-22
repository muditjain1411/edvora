'use client';
import { useMemo, useEffect } from 'react';

export default function PdfUploader({ pdf, setPdf }) {
    const pdfUrl = useMemo(() => {
        return pdf ? URL.createObjectURL(pdf) : null;
    }, [pdf]);

    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    function handlePdfChange(e) {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setPdf(file);
        }
        e.target.value = null;
    }

    function removePdf() {
        setPdf(null);
    }

    return (
        <div className="w-full">
            <label className="block mb-2 font-semibold text-gray-700">
                Upload PDF
            </label>

            {/* Custom styled button */}
            <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Select PDF
            </label>
            <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                className="hidden"
            />

            {pdf && (
                <div className="w-full mt-4">
                    <div className="relative border rounded overflow-hidden w-full">
                        <iframe
                            src={pdfUrl}
                            className="w-full h-64"
                            title="PDF Preview"
                        />
                        <button
                            type="button"
                            onClick={removePdf}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-75"
                            aria-label="Remove PDF"
                        >
                            &times;
                        </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Uploaded: {pdf.name} ({(pdf.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                </div>
            )}
        </div>
    );
}