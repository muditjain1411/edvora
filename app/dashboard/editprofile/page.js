'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const EditProfile = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        profilePic: '',
    });
    const [isHoveringPic, setIsHoveringPic] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    // Fallback image: Use Google avatar from session, or static placeholder
    const getFallbackImage = () => {
        return session?.user?.image || 'https://via.placeholder.com/150?text=Avatar';
    };

    // Dynamic image source: Custom if set, else fallback
    const getCurrentImageSrc = () => {
        return formData.profilePic || getFallbackImage();
    };

    useEffect(() => {
        if (status === 'loading') return;
        if (!session?.user?.email) {
            router.push('/api/auth/signin');
            return;
        }

        // Fetch current user data
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users?email=${encodeURIComponent(session.user.email)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const userData = await response.json();
                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    profilePic: userData.profilePic || '', // Empty if no custom pic
                });
            } catch (err) {
                setError('Failed to load profile data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [session, status, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // For preview: Create temp URL (but don't upload yet)
            setFormData((prev) => ({ ...prev, profilePic: URL.createObjectURL(file) }));
            setError('');
        }
    };

    // Helper: Delete image from Firebase Storage
    const deleteImageFromStorage = async (imageUrl) => {
        if (!imageUrl || imageUrl === getFallbackImage()) return; // Skip fallback

        try {
            // Extract file path from URL (e.g., gs://bucket/path/to/file.jpg -> /path/to/file.jpg)
            const httpsReference = ref(storage, imageUrl);
            await deleteObject(httpsReference);
            console.log('Old image deleted successfully');
        } catch (err) {
            console.warn('Failed to delete old image (may not exist):', err);
            // Don't throw - continue with upload
        }
    };

    // Helper: Upload image to Firebase Storage
    const uploadImageToStorage = async (file, userId) => {
        if (!file || !userId) return null;

        const fileExt = file.name.split('.').pop();
        const storageRef = ref(storage, `profiles/${userId}/profile.${fileExt}`);

        try {
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            console.log('New image uploaded successfully');
            return downloadURL;
        } catch (err) {
            throw new Error('Failed to upload image: ' + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            let finalProfilePic = formData.profilePic;

            // If file selected, handle Firebase upload/delete
            if (selectedFile) {
                // Delete old image if exists
                if (user?.profilePic) {
                    await deleteImageFromStorage(user.profilePic);
                }

                // Upload new image
                const newUrl = await uploadImageToStorage(selectedFile, user._id);
                if (!newUrl) {
                    throw new Error('Failed to upload image');
                }
                finalProfilePic = newUrl;
            } else if (!formData.profilePic) {
                // No custom pic: Use fallback (but don't store empty in DB)
                finalProfilePic = ''; // Backend can handle displaying fallback
            }

            // Prepare update payload
            const updatePayload = {
                id: user._id,
                name: formData.name,
                profilePic: finalProfilePic, // Updated URL or empty (for fallback)
            };

            // Update user via API
            const response = await fetch('/api/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setSelectedFile(null); // Clear file

            alert('Profile updated successfully!');
            router.push('/profile'); // Redirect after save
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setSaving(false);
        }
        router.push('/dashboard');
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                profilePic: user.profilePic || '',
            });
        }
        setSelectedFile(null);
        router.back();
    };

    if (loading) {
        return (
            <main className="text-white min-h-screen bg-transparent flex items-center justify-center">
                <p className="text-gray-400">Loading profile...</p>
            </main>
        );
    }

    if (!session) {
        return (
            <main className="text-white min-h-screen bg-transparent flex items-center justify-center">
                <p className="text-gray-400">Please sign in to edit your profile.</p>
            </main>
        );
    }

    return (
        <main className="text-white min-h-screen bg-transparent p-8">
            {/* Top Edit Profile Option/Header */}
            <div className="flex justify-between items-center mb-8 w-full max-w-md mx-auto">
                <h1 className="text-3xl font-bold">Edit Profile</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-400 border border-gray-600 rounded-lg hover:text-white hover:border-white transition-colors"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                {/* Profile Picture Section */}
                <div className="relative">
                    <div
                        className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-700 cursor-pointer group"
                        onMouseEnter={() => setIsHoveringPic(true)}
                        onMouseLeave={() => setIsHoveringPic(false)}
                    >
                        <img
                            src={getCurrentImageSrc()}
                            alt="Profile Picture"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = getFallbackImage(); }} // Fallback on load error
                        />
                        {isHoveringPic && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200">
                                <span className="text-white text-sm font-semibold">Change Picture</span>
                            </div>
                        )}
                    </div>
                    {/* File Input (Hidden, click image or button to trigger) */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profilePicFile"
                    />
                    <label
                        htmlFor="profilePicFile"
                        className="block mt-2 text-center text-blue-400 hover:underline cursor-pointer"
                    >
                        Select New Image
                    </label>
                    {/* Fallback URL Input (Optional, for manual URLs) */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Or enter image URL:</label>
                        <input
                            type="url"
                            name="profilePic"
                            value={formData.profilePic}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Name Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                {/* Email (Read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email (cannot be changed):</label>
                    <input
                        type="email"
                        value={session.user.email}
                        disabled
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white bg-opacity-50 cursor-not-allowed"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <p className="text-red-400 text-sm text-center">{error}</p>
                )}
            </form>

            {/* Back Link */}
            <div className="mt-8 text-center">
                <Link href="/profile" className="text-blue-400 hover:underline">
                    ← Back to Profile
                </Link>
            </div>
        </main>
    );
};

export default EditProfile;