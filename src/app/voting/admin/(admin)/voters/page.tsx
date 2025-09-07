

'use client'
import React, { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

// API Response interfaces
interface ApiPaginatedResponse<T = any> {
    success: boolean;
    data: {
        items: T[];
        metadata: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    };
    message?: string;
}

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

// Types
interface Voter {
    id: string;
    name: string;
    ticketId: string;
    votedFor: string;
    votedAt: string;
}

interface VotersStats {
    totalVotes: number;
    totalContestants: number;
    leadingContestant: string;
    avgVotes: number;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Default pagination initialization
const defaultPagination: PaginationMeta = {
    total: 0,
    page: 1,
    limit: 8,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

// API Functions
const fetchVoters = async (page: number = 1, limit: number = 8): Promise<ApiPaginatedResponse<Voter>> => {
    try {
        const response = await axios.get<ApiPaginatedResponse<Voter>>(`/v1/votes?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching voters:', error);
        throw error;
    }
};

const fetchVotersStats = async (): Promise<ApiResponse<VotersStats>> => {
    try {
        const response = await axios.get<ApiResponse<VotersStats>>('/v1/votes/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching voters stats:', error);
        throw error;
    }
};

const VotersPage: React.FC = () => {
    const [voters, setVoters] = useState<Voter[]>([]);
    const [stats, setStats] = useState<VotersStats | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
    const [loading, setLoading] = useState<boolean>(true);
    const [statsLoading, setStatsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        loadVotersData();
    }, []);

    useEffect(() => {
        loadVoters(currentPage);
    }, [currentPage]);

    const loadVotersData = async (): Promise<void> => {
        // Load both stats and initial voters data
        await Promise.all([
            loadVotersStats(),
            loadVoters(1)
        ]);
    };

    const loadVoters = async (page: number): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            const response = await fetchVoters(page, 8);

            if (response.success && response.data) {
                setVoters(response.data.items);
                setPagination(response.data.metadata);
            } else {
                const errorMessage = response.message || 'Failed to load voters';
                setError(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load voters';
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

    const loadVotersStats = async (): Promise<void> => {
        try {
            setStatsLoading(true);
            const response = await fetchVotersStats();

            if (response.success && response.data) {
                setStats(response.data);
            } else {
                toast({
                    title: "Error",
                    description: response.message || 'Failed to load voter statistics',
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.response?.data?.message || 'Failed to load voter statistics',
                variant: "destructive",
            });
            console.error(err);
        } finally {
            setStatsLoading(false);
        }
    };

    const handlePageChange = (page: number): void => {
        if (page !== currentPage && page > 0 && page <= pagination.totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPaginationButtons = (): JSX.Element[] => {
        if (!pagination) return [];

        const { page: currentPage, totalPages } = pagination;
        const buttons: JSX.Element[] = [];

        // Always show first 5 pages
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === i
                            ? 'bg-red-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Add ellipsis and last page if total pages > 5
        if (totalPages > 5) {
            buttons.push(
                <span key="ellipsis" className="px-2 py-2 text-gray-400">
          ...
        </span>
            );

            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentPage === totalPages
                            ? 'bg-red-500 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {totalPages}
                </button>
            );
        }

        return buttons;
    };

    if (loading && statsLoading) {
        return (
            <div className="flex items-center p-6 justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center p-6 justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => loadVoters(currentPage)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Voters</h1>
                <p className="text-gray-600">View and track all voters on the show</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Votes */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total votes</p>
                    {statsLoading ? (
                        <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalVotes || 0}</p>
                    )}
                </div>

                {/* Total Contestants */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Contestants</p>
                    {statsLoading ? (
                        <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalContestants || 0}</p>
                    )}
                </div>

                {/* Leading Contestant */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-1">Leading</p>
                    {statsLoading ? (
                        <div className="animate-pulse h-8 bg-gray-200 rounded w-24"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats?.leadingContestant || 'N/A'}</p>
                    )}
                </div>

                {/* Average Votes */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg.votes</p>
                    {statsLoading ? (
                        <div className="animate-pulse h-8 bg-gray-200 rounded w-16"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats?.avgVotes || 0}</p>
                    )}
                </div>
            </div>

            {/* Voters Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-4 px-6 font-medium text-gray-700">Name</th>
                            <th className="text-left py-4 px-6 font-medium text-gray-700">Ticket ID</th>
                            <th className="text-left py-4 px-6 font-medium text-gray-700">Voted for</th>
                            <th className="text-left py-4 px-6 font-medium text-gray-700">Voted at</th>
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            // Loading skeleton
                            [...Array(8)].map((_, index) => (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-4 px-6">
                                        <div className="animate-pulse h-4 bg-gray-200 rounded w-32"></div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="animate-pulse h-4 bg-gray-200 rounded w-20"></div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="animate-pulse h-4 bg-gray-200 rounded w-28"></div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
                                    </td>
                                </tr>
                            ))
                        ) : voters.length > 0 ? (
                            voters.map((voter, index) => (
                                <tr
                                    key={voter.id}
                                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'} hover:bg-gray-50 transition-colors`}
                                >
                                    <td className="py-4 px-6">
                                        <p className="font-medium text-gray-900">{voter.name}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-gray-700">{voter.ticketId}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-gray-700">{voter.votedFor}</p>
                                    </td>
                                    <td className="py-4 px-6">
                                        <p className="text-gray-700">
                                            {new Date(voter.votedAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-12 text-center">
                                    <p className="text-gray-500">No voters found</p>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer with Pagination */}
                {pagination.totalPages > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} voters
                        </p>

                        <div className="flex items-center gap-1">
                            {/* Previous Button */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!pagination.hasPreviousPage}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <MdChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {renderPaginationButtons()}
                            </div>

                            {/* Next Button */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <MdChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotersPage;