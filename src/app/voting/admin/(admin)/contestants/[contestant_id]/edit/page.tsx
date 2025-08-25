'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MdOutlineArrowCircleLeft, MdImage } from 'react-icons/md';

// Types
interface Contestant {
    id: string;
    name: string;
    talent: string;
    email: string;
    image: string;
    votes: number;
}

interface UpdateContestantData {
    name: string;
    talent: string;
    email: string;
    image?: File | null;
}

// API Functions (commented - using your NestJS backend)
const fetchContestant = async (id: string): Promise<Contestant> => {
    // Uncomment when using your NestJS backend
    // try {
    //   const response = await fetch(`/api/contestants/${id}`, {
    //     headers: {
    //       'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
    //     },
    //   });
    //
    //   if (!response.ok) throw new Error('Failed to fetch contestant');
    //   return await response.json();
    // } catch (error) {
    //   console.error('Error fetching contestant:', error);
    //   throw error;
    // }

    // Mock data for now
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: id,
                name: 'Mira Passaquindici',
                talent: 'Singer',
                email: 'mira@gmail.com',
                image: 'https://fastly.picsum.photos/id/1/300/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY',
                votes: 10
            });
        }, 500);
    });
};

const updateContestant = async (id: string, data: UpdateContestantData): Promise<{ success: boolean; message?: string }> => {
    // Uncomment when using your NestJS backend
    // try {
    //   const formData = new FormData();
    //   formData.append('name', data.name);
    //   formData.append('talent', data.talent);
    //   formData.append('email', data.email);
    //   if (data.image) {
    //     formData.append('image', data.image);
    //   }
    //
    //   const response = await fetch(`/api/contestants/${id}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
    //     },
    //     body: formData,
    //   });
    //
    //   if (!response.ok) throw new Error('Failed to update contestant');
    //   return await response.json();
    // } catch (error) {
    //   console.error('Error updating contestant:', error);
    //   throw error;
    // }

    // Mock success response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Contestant updated successfully' });
        }, 1000);
    });
};

const EditContestantPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const contestantId = params.contestant_id as string;

    const [contestant, setContestant] = useState<Contestant | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        talent: '',
        email: ''
    });
    const [newImage, setNewImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadContestant();
    }, [contestantId]);

    const loadContestant = async (): Promise<void> => {
        try {
            setLoading(true);
            const data = await fetchContestant(contestantId);
            setContestant(data);
            setFormData({
                name: data.name,
                talent: data.talent,
                email: data.email
            });
            setImagePreview(data.image);
        } catch (err) {
            setError('Failed to load contestant');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (error) setError('');
    };

    const handleChangeImageClick = (): void => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                setError('Invalid file type. Only JPEG and PNG are allowed.');
                return;
            }

            // Validate file size (5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                setError('File size too large. Maximum size is 5MB.');
                return;
            }

            setNewImage(file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
            setError('');
        }
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return 'Please enter a valid email address';
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
            setUpdating(true);
            setError('');

            const response = await updateContestant(contestantId, {
                name: formData.name.trim(),
                talent: formData.talent.trim(),
                email: formData.email.trim(),
                image: newImage,
            });

            if (response.success) {
                router.push('/admin/contestants');
            } else {
                setError(response.message || 'Failed to update contestant');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to update contestant. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = (): void => {
        router.back();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!contestant) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Contestant not found</p>
                    <button
                        onClick={() => router.push('/admin/contestants')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Back to Contestants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 ">
            <div className="">

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

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md mx-auto">

                        {/* Form Header */}
                        <div className="text-center mb-6">
                            <h1 className="text-lg text-center  font-semibold text-gray-900">
                                Edit  contestant
                            </h1>
                            <p className="text-sm my-2 text-gray-500">
                                Enter your ticket ID below to unlock your voting power!
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

                            {/* Current Image with Change Option */}
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto">
                                    <img
                                        src={imagePreview}
                                        alt="Contestant"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleChangeImageClick}
                                    className="mt-3 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                >
                                    Change image
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Contestant Name */}
                            <div className="text-left">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contestant name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ED120F] focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
                                    disabled={updating}
                                />
                            </div>

                            {/* Talent */}
                            <div className="text-left">
                                <label htmlFor="talent" className="block text-sm font-medium text-gray-700 mb-1">
                                    Talent
                                </label>
                                <input
                                    type="text"
                                    id="talent"
                                    name="talent"
                                    value={formData.talent}
                                    onChange={handleInputChange}
                                    placeholder="Enter contestant talent"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ED120F] focus:border-transparent outline-none text-gray-900 placeholder-gray-400"
                                    disabled={updating}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="flex-1 bg-[#ED120F] text-white py-2 rounded-md hover:bg-red-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {updating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2 inline-block"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update'
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={updating}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-all duration-200 font-medium"
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

export default EditContestantPage;