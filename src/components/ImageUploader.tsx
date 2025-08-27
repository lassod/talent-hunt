'use client'
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { MdCloudUpload, MdClose } from 'react-icons/md';

interface ImageUploaderProps {
    onImageSelect: (file: File | null) => void;
    acceptedFormats?: string[];
    maxSizeMB?: number;
    preview?: string | null;
    className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
                                                         onImageSelect,
                                                         acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
                                                         maxSizeMB = 5,
                                                         preview,
                                                         className = ''
                                                     }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatAcceptedTypes = (): string => {
        return acceptedFormats
            .map(format => format.replace('image/', '').replace('+xml', '').toUpperCase())
            .join(', ');
    };

    const validateFile = (file: File): string | null => {
        // Check file type
        if (!acceptedFormats.includes(file.type)) {
            return `Invalid file type. Only ${formatAcceptedTypes()} formats are allowed.`;
        }

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
            return `File size too large. Maximum size is ${maxSizeMB}MB.`;
        }

        return null;
    };

    const handleFileSelect = (file: File): void => {
        setError('');

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        onImageSelect(file);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleUploadClick = (): void => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = (): void => {
        setPreviewUrl(null);
        setError('');
        onImageSelect(null);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Upload Area */}
            <div
                className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${isDragging
                    ? 'border-red-400 bg-red-50'
                    : previewUrl
                        ? 'border-green-300 bg-green-50'
                        : error
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50'
                }
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleUploadClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedFormats.join(',')}
                    onChange={handleFileInputChange}
                    className="hidden"
                />

                {previewUrl ? (
                    // Preview State
                    <div className="space-y-4">
                        <div className="relative inline-block">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-w-full max-h-40 rounded-lg shadow-sm object-cover"
                            />

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage();
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                title="Remove image"
                            >
                                <MdClose className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-sm text-green-600 font-medium">
                            Image uploaded successfully
                        </p>
                        <p className="text-xs text-gray-500">
                            Click to change image or drag and drop a new one
                        </p>
                    </div>
                ) : (
                    // Upload State
                    <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 text-gray-400">
                            <MdCloudUpload className="w-full h-full" />
                        </div>

                        <div>
                            <p className="text-gray-700 font-medium">
                <span className="text-red-600 underline cursor-pointer hover:text-red-700">
                  Click to upload image
                </span>
                                <span className="text-gray-500"> or drag and drop</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {formatAcceptedTypes()} formats only
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Maximum file size: {maxSizeMB}MB
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;