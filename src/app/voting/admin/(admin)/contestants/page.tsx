'use client'
import React, { useState, useEffect } from 'react';
import { MdAdd, MdPeople, MdEdit, MdDelete } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi'
import Link from "next/link";
import { useRouter } from 'next/navigation';
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";
import {ApiPaginatedResponse, PaginationMeta} from "@/utlis/api.dtos";

// Types
export interface Contestant {
    id: string;
    name: string;
    talent: string;
    image: string;
    totalVotes?: number;
}
// Default pagination initialization
const defaultPagination: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

// API Functions
const fetchContestants = async (page: number = 1): Promise<ApiPaginatedResponse<Contestant>> => {
    try {
        const response = await axios.get<ApiPaginatedResponse<Contestant>>(`/v1/contestants`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contestants:', error);
        throw error;
    }
};

const ContestantsPage: React.FC = () => {
    const router = useRouter();
    const [contestants, setContestants] = useState<Contestant[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadContestants();
    }, []);

    const loadContestants = async (page: number = 1): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            const response = await fetchContestants(page);

            if (response.success && response.data) {
                setContestants(response.data.items);
                setPagination(response.data.metadata);
            } else {
                const errorMessage = response.message || 'Failed to load contestants';
                setError(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load contestants';
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddContestant = (): void => {
        router.push('/voting/admin/contestants/create');
    };

    const handleDeleteContestant = async (id: string, name: string): Promise<void> => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) {
            return;
        }

        try {
            // Add your delete API call here
            // await deleteContestant(id);

            toast({
                title: "Success",
                description: `${name} has been deleted successfully.`,
            });

            // Reload contestants after deletion
            loadContestants(pagination.page);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.response?.data?.message || 'Failed to delete contestant',
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => loadContestants(pagination.page)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const hasContestants = contestants.length > 0;

    return (
        <div className="space-y-8 p-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contestants</h1>
                <p className="text-gray-600">View and track all contestants on the show.</p>
            </div>

            {/* Stats and Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-gray-700 font-medium">
                        Total contestants ({pagination.total})
                    </p>
                    {pagination.totalPages > 1 && (
                        <p className="text-sm text-gray-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </p>
                    )}
                </div>

                <button
                    onClick={handleAddContestant}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                >
                    <MdAdd className="w-5 h-5" />
                    Add contestant
                </button>
            </div>

            {/* Content Area */}
            {hasContestants ? (
                <>
                    {/* Contestants Grid/List */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contestants.map((contestant) => (
                                <div key={contestant.id} className="hover:border w-fit relative border-gray-200 rounded-[16px] p-4 shadow-md transition-shadow">
                                    <img
                                        src={contestant.image}
                                        alt={contestant.name}
                                        className="w-[304px] h-[254px] object-contain  rounded-[10px] mb-4"
                                    />
                                    <h3 className="font-semibold text-gray-900 mb-1">{contestant.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{contestant.talent}</p>
                                    {contestant.totalVotes !== undefined && (
                                        <p className="text-green-400 w-fit absolute top-4 right-4 px-3 p-1 bg-green-100 rounded-full text-sm mb-2">Votes: {contestant.totalVotes}</p>
                                    )}
                                    {/*<p className="text-gray-500 text-xs mb-4">*/}
                                    {/*    Added: {new Date(contestant.dateAdded).toLocaleDateString()}*/}
                                    {/*</p>*/}

                                    {/* Action buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => router.push(`/voting/admin/contestants/${contestant.id}/edit`)}
                                            className=" p-2"
                                        >
                                            <FiEdit className="w-6 h-6" />

                                        </button>
                                        <button
                                            onClick={() => handleDeleteContestant(contestant.id, contestant.name)}
                                            className=" p-2  text-red-600 "
                                        >
                                            <MdDelete className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                {pagination.total} results
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => loadContestants(pagination.page - 1)}
                                    disabled={!pagination.hasPreviousPage}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                <span className="px-3 py-1 text-sm bg-red-500 text-white rounded">
                                    {pagination.page}
                                </span>

                                <button
                                    onClick={() => loadContestants(pagination.page + 1)}
                                    disabled={!pagination.hasNextPage}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                // Empty State
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md mx-auto">
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto mb-6 text-gray-400">
                            <MdPeople className="w-full h-full" />
                        </div>

                        {/* Empty State Text */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            No contestants yet
                        </h2>

                        <p className="text-gray-600 mb-8">
                            Add first contestant to get started
                        </p>

                        {/* CTA Button */}
                        <Link href='/voting/admin/contestants/create'>
                            <button
                                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium mx-auto"
                            >
                                <MdAdd className="w-5 h-5" />
                                Add contestant
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContestantsPage;