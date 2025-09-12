'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MdOutlineArrowCircleLeft} from 'react-icons/md';
import ImageUploader from "@/components/ImageUploader";
import axios from "@/lib/axios";
import {ApiResponse} from "@/utlis/api.dtos";
import {useToast} from "@/hooks/toastHooks";

// Types
interface ContestantFormData {
    name: string;
    talent: string;
    image: File | null;
}

interface CreateContestantResponse {
    id: string;
    name: string;
    talent: string;
    imageUrl: string;
    // Add other fields that your API returns
}

const createContestant = async (payload: {
    name: string;
    talent: string;
    image: File;
}): Promise<ApiResponse<CreateContestantResponse>> => {
    const form = new FormData();
    form.append('name', payload.name);
    form.append('talent', payload.talent);
    form.append('image', payload.image);

    const { data } = await axios.post<ApiResponse<CreateContestantResponse>>('/v1/contestants', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

const AddContestantPage: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<ContestantFormData>({
        name: '',
        talent: '',
        image: null,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const {showToast, ToastContainerComponent} = useToast()

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

        if (!formData.image) {
            setError('Contestant image is required');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await createContestant({
                name: formData.name.trim(),
                talent: formData.talent.trim(),
                image: formData.image,
            });

            if (response.success) {
                showToast( "Contestant created successfully!" , 'error')


                router.push('/voting/admin/contestants');
            } else {
                const errorMessage = response.message || 'Failed to create contestant';
                setError(errorMessage);
                showToast( errorMessage , 'error')


            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create contestant. Please try again.';
            setError(errorMessage);
            showToast( errorMessage , 'error')

        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (): void => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div>
                {/* Header */}
                <div className="mb-8 bg-[#F8FAFC] w-full border-b border-[#E2E8F0] px-8 gap-4 p-5 flex">
                    <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
            {ToastContainerComponent}
        </div>
    );
};

export default AddContestantPage;