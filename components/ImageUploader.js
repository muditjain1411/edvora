'use client';
export default function ImageUploader({ images, setImages }) {

    function handleImageChange(e) {
        const files = Array.from(e.target.files);
        setImages((prevImages) => {
            const newFiles = files.filter(
                (file) =>
                    !prevImages.some(
                        (img) => img.name === file.name && img.size === file.size
                    )
            );
            return [...prevImages, ...newFiles];
        });
        e.target.value = null;
    }
    function removeImage(index) {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    }

    return (
        <div className="w-full">
            <label className="block mb-2 font-semibold text-gray-700">
                Upload Image(s)
            </label>

            {/* Custom styled button */}
            <label
                htmlFor="file-upload"
                className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Select Images
            </label>
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
            />

            {images.length > 0 && (
                <div className="w-full mt-4 mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {images.map((image, idx) => {
                        const imageUrl = URL.createObjectURL(image);
                        return (
                            <div key={idx} className="relative border rounded overflow-hidden">
                                <a
                                    href={imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-32"
                                >
                                    <img
                                        src={imageUrl}
                                        alt={`preview ${idx}`}
                                        className="object-cover w-full h-32"
                                        onLoad={() => URL.revokeObjectURL(image)}
                                    />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-75"
                                    aria-label="Remove image"
                                >
                                    &times;
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}