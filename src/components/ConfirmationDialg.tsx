'use client';

import { FC, ReactNode } from 'react';

interface Props {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    confirmClass?: string;
    onClose: () => void;
    onConfirm: () => void;
    children?: ReactNode;
}

export const ConfirmationDialog: FC<Props> = ({
                                                  open,
                                                  title,
                                                  description,
                                                  confirmText = 'Proceed',
                                                  cancelText = 'Cancel',
                                                  loading = false,
                                                  confirmClass = '',
                                                  onClose,
                                                  onConfirm,
                                                  children,
                                              }) => {
    if (!open) return null;

    return (
        /* backdrop */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* modal card */}
            <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>

                {description && (
                    <p className="mt-2 text-sm text-gray-600">{description}</p>
                )}

                {/* optional extra content */}
                {children && <div className="mt-4">{children}</div>}

                {/* buttons */}
                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium cursor-pointer text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:flex-none"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 rounded-md bg-[#ED120F] px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-50 sm:flex-none ${confirmClass}`}
                    >
                        {loading ? 'Loading…' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};