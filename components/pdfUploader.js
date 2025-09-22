'use client';
import { useMemo, useEffect } from 'react';

export default function PdfUploader({ pdf, setPdf, disabled = false }) {
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
        if (disabled) return;
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please select a PDF file only.');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {  // 10MB limit
                alert('File size must be less than 10MB.');
                return;
            }
            setPdf(file);
        }
        e.target.value = null;
    }

    function removePdf() {
        if (disabled) return;
        setPdf(null);
    }

    return (
        <div className="w-full">
            <label className="block mb-2 font-semibold text-gray-300">
                Upload PDF
            </label>

            <label
                htmlFor="file-upload"
                className={`cursor-pointer inline-block px-4 py-2 rounded hover:bg-blue-700 ${disabled ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
            >
                Select PDF
            </label>
            <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handlePdfChange}
                disabled={disabled}
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
                        {!disabled && (  // Hide remove button if disabled
                            <button
                                type="button"
                                onClick={removePdf}
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-75"
                                aria-label="Remove PDF"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                        Uploaded: {pdf.name} ({(pdf.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                </div>
            )}
        </div>
    );
}