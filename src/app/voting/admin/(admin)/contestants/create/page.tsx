'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineArrowCircleLeft} from 'react-icons/md';
import ImageUploader from "@/components/ImageUploader";

// Types
interface ContestantFormData {
    name: string;
    talent: string;
    email: string;
    image: File | null;
}

interface CreateContestantRequest {
    name: string;
    talent: string;
    email: string;
    imageData: string; // Base64 encoded image
}

interface ApiResponse {
    success: boolean;
    message?: string;
    contestant?: {
        id: string;
        name: string;
        talent: string;
        email: string;
        image: string;
    };
}

// API Functions
const uploadContestantImage = async (file: File): Promise<string> => {
    // Uncomment when API is ready
    // const formData = new FormData();
    // formData.append('image', file);
    //
    // try {
    //   const response = await fetch('/api/admin/upload/contestant-image', {
    //     method: 'POST',
    //     body: formData,
    //   });
    //
    //   if (!response.ok) {
    //     throw new Error('Failed to upload image');
    //   }
    //
    //   const data = await response.json();
    //   return data.imageUrl;
    // } catch (error) {
    //   console.error('Upload error:', error);
    //   throw error;
    // }

    // Mock upload - convert file to base64 for now
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
    });
};

const createContestant = async (contestantData: CreateContestantRequest): Promise<ApiResponse> => {
    // Uncomment when API is ready
    // try {
    //   const response = await fetch('/api/admin/contestants', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${localStorage.getItem('admin_token')}`, // Or however you handle auth
    //     },
    //     body: JSON.stringify(contestantData),
    //   });
    //
    //   if (!response.ok) {
    //     throw new Error('Failed to create contestant');
    //   }
    //
    //   return await response.json();
    // } catch (error) {
    //   console.error('Create contestant error:', error);
    //   throw error;
    // }

    // Mock API response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                message: 'Contestant created successfully',
                contestant: {
                    id: Date.now().toString(),
                    name: contestantData.name,
                    talent: contestantData.talent,
                    email: contestantData.email,
                    image: contestantData.imageData,
                }
            });
        }, 1500);
    });
};

const AddContestantPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<ContestantFormData>({
        name: '',
        talent: '',
        email: '',
        image: null,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleImageSelect = (file: File | null): void => {
        setFormData(prev => ({
            ...prev,
            image: file
        }));
    };

    const validateForm = (): string | null => {
        if (!formData.name.trim()) {
            return 'Contestant name is required';
        }

        if (!formData.talent.trim()) {
            return 'Talent is required';
        }

        if (!formData.email.trim()) {
            return 'Email is required';
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return 'Please enter a valid email address';
        }

        if (!formData.image) {
            return 'Contestant image is required';
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Upload image first
            const imageData = await uploadContestantImage(formData.image!);

            // Create contestant
            const response = await createContestant({
                name: formData.name.trim(),
                talent: formData.talent.trim(),
                email: formData.email.trim(),
                imageData,
            });

            if (response.success) {
                // Success - redirect back to contestants list
                router.push('/admin/contestants');
            } else {
                setError(response.message || 'Failed to create contestant');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to create contestant. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (): void => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gray-50  ">
            <div className=" ">

                {/* Header */}
                <div className="mb-8 bg-[#F8FAFC] w-full border-b border-[#E2E8F0] px-8 gap-4 p-5 flex ">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors "
                    >
                        <MdOutlineArrowCircleLeft className="w-5 h-5" />
                        <span className="font-medium text-[#18181B] text-[20px] leading-8">Edit page</span>
                    </button>
                </div>

                {/* Form Card */}
                <div className="w-full max-w-2xl px-4 mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

                    {/* Form Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Add new contestant
                        </h1>
                        <p className="text-gray-600">
                            Enter contestant details to add them to the show
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Image Upload */}
                        <div>
                            <ImageUploader
                                onImageSelect={handleImageSelect}
                                acceptedFormats={['image/jpeg', 'image/jpg', 'image/png']}
                                maxSizeMB={5}
                            />
                        </div>

                        {/* Contestant Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Contestant name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter name"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                                disabled={loading}
                            />
                        </div>

                        {/* Talent */}
                        <div>
                            <label htmlFor="talent" className="block text-sm font-medium text-gray-700 mb-2">
                                Talent
                            </label>
                            <input
                                type="text"
                                id="talent"
                                name="talent"
                                value={formData.talent}
                                onChange={handleInputChange}
                                placeholder="Enter contestant talent"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                                disabled={loading}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                                disabled={loading}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center font-medium"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                        Creating...
                                    </>
                                ) : (
                                    'Add contestant'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 sm:flex-initial bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    );
};

export default AddContestantPage;