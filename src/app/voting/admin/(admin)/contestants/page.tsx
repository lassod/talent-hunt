'use client';

import React, { useState, useEffect } from 'react';
import { MdAdd, MdPeople, MdDelete } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { ApiPaginatedResponse, PaginationMeta } from '@/utlis/api.dtos';
import {ConfirmationDialog} from "@/components/ConfirmationDialg";
import {useToast} from "@/hooks/toastHooks";

// Types
export interface Contestant {
    id: string;
    name: string;
    talent: string;
    image: string;
    totalVotes?: number;
}

// Default pagination
const defaultPagination: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const fetchContestants = async (page: number = 1): Promise<ApiPaginatedResponse<Contestant>> => {
    const { data } = await axios.get<ApiPaginatedResponse<Contestant>>(`/v1/contestants`);
    return data;
};

const ContestantsPage: React.FC = () => {
    const router = useRouter();

    const [contestants, setContestants] = useState<Contestant[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [selectedContestant, setSelectedContestant] = useState<Contestant | null>(null);

    const {showToast,ToastContainerComponent} = useToast()

    useEffect(() => {
        loadContestants();
    }, []);

    const loadContestants = async (page: number = 1) => {
        try {
            setLoading(true);
            setError('');
            const res = await fetchContestants(page);

            if (res.success && res.data) {
                setContestants(res.data.items);
                setPagination(res.data.metadata);
            } else {
                const msg = res.message || 'Failed to load contestants';
                setError(msg);
                showToast(
                     msg,
                    'error');
            }
        } catch (e: any) {
            const msg = e.response?.data?.message || 'Failed to load contestants';
            setError(msg);
            showToast(
                msg,
                'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddContestant = () => router.push('/voting/admin/contestants/create');

    /* ---- open confirmation ---- */
    const promptDelete = (c: Contestant) => {
        setSelectedContestant(c);
        setShowConfirm(true);
    };

    /* ---- actual delete ---- */
    const handleDeleteContestant = async () => {
        if (!selectedContestant) return;

        try {
            await axios.delete(`/v1/contestants/${selectedContestant.id}`);
            showToast(
                `${selectedContestant.name} has been deleted.`,
                'success');

            // close dialog + reload list
            setShowConfirm(false);
            setSelectedContestant(null);
            await loadContestants(pagination.page);
        } catch (e: any) {
            showToast(
                `${e.response?.data?.message} || 'Delete failed'`,
                'success');
        }
    };

    /* ---------------- render helpers ---------------- */
    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent" />
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => loadContestants(pagination.page)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );

    const hasContestants = contestants.length > 0;

    /* =================================================================== */
    /* ===========================  JSX  ================================= */
    /* =================================================================== */
    return (
        <div className="space-y-8 p-6">
            {/* ------- header ------- */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contestants</h1>
                <p className="text-gray-600">View and track all contestants on the show.</p>
            </div>

            {/* ------- stats / actions ------- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-gray-700 font-medium">Total contestants ({pagination.total})</p>
                    {pagination.totalPages > 1 && (
                        <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</p>
                    )}
                </div>

                <button
                    onClick={handleAddContestant}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                >
                    <MdAdd className="w-5 h-5" />
                    Add contestant
                </button>
            </div>

            {/* ------- content ------- */}
            {hasContestants ? (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contestants.map((c) => (
                                <div key={c.id} className="relative w-fit border border-gray-200 rounded-[16px] p-4 shadow-md">
                                    <img
                                        src={c.image}
                                        alt={c.name}
                                        className="w-[304px] h-[254px] object-contain rounded-[10px] mb-4"
                                    />
                                    <h3 className="font-semibold text-gray-900 mb-1">{c.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{c.talent}</p>
                                    {c.totalVotes !== undefined && (
                                        <p className="absolute top-4 right-4 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            Votes: {c.totalVotes}
                                        </p>
                                    )}

                                    {/* actions */}
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => router.push(`/voting/admin/contestants/${c.id}/edit`)}
                                            className="p-2"
                                        >
                                            <FiEdit className="w-6 h-6" />
                                        </button>
                                        <button onClick={() => promptDelete(c)} className="p-2 text-red-600">
                                            <MdDelete className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ------- pagination ------- */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => loadContestants(pagination.page - 1)}
                                    disabled={!pagination.hasPreviousPage}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <span className="px-3 py-1 text-sm bg-red-500 text-white rounded">{pagination.page}</span>

                                <button
                                    onClick={() => loadContestants(pagination.page + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                /* ------- empty state ------- */
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md mx-auto">
                        <div className="w-16 h-16 mx-auto mb-6 text-gray-400">
                            <MdPeople className="w-full h-full" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">No contestants yet</h2>
                        <p className="text-gray-600 mb-8">Add the first contestant to get started</p>
                        <Link href="/voting/admin/contestants/create">
                            <button className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium mx-auto">
                                <MdAdd className="w-5 h-5" />
                                Add contestant
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* ------- reusable confirmation dialog ------- */}
            <ConfirmationDialog
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleDeleteContestant}
                title="Delete contestant"
                description={
                    selectedContestant
                        ? `Are you sure you want to delete ${selectedContestant.name}? You can't undo this action.`
                        : ''
                }
                confirmText="Proceed"
                cancelText="Cancel"
            />
            {ToastContainerComponent}
        </div>
    );
};

export default ContestantsPage;
