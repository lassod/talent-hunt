'use client'
import React, { useState, useEffect } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

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

interface VotersData {
    voters: Voter[];
    stats: VotersStats;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalVoters: number;
        votersPerPage: number;
    };
}

// API Functions (commented for NestJS backend)
const fetchVoters = async (page: number = 1, limit: number = 8): Promise<VotersData> => {
    // Uncomment when using your NestJS backend
    // try {
    //   const response = await fetch(`/api/voters?page=${page}&limit=${limit}`, {
    //     headers: {
    //       'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
    //     },
    //   });
    //
    //   if (!response.ok) throw new Error('Failed to fetch voters');
    //   return await response.json();
    // } catch (error) {
    //   console.error('Error fetching voters:', error);
    //   throw error;
    // }

    // Mock data for now
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                voters: [
                    {
                        id: '1',
                        name: 'Olivia Rhye',
                        ticketId: 'TK1234',
                        votedFor: 'olivia Lawal',
                        votedAt: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: '2',
                        name: 'Olivia Rhye',
                        ticketId: 'TK1234',
                        votedFor: 'olivia Lawal',
                        votedAt: '2024-01-15T10:31:00Z'
                    },
                    {
                        id: '3',
                        name: 'Olivia Rhye',
                        ticketId: 'TK1234',
                        votedFor: 'olivia Lawal',
                        votedAt: '2024-01-15T10:32:00Z'
                    },
                    {
                        id: '4',
                        name: 'Olivia Rhye',
                        ticketId: 'TK1234',
                        votedFor: 'olivia Lawal',
                        votedAt: '2024-01-15T10:33:00Z'
                    },
                    {
                        id: '5',
                        name: 'Olivia Rhye',
                        ticketId: 'TK1234',
                        votedFor: 'olivia Lawal',
                        votedAt: '2024-01-15T10:34:00Z'
                    },
                    {
                        id: '6',
                        name: 'Olivia Rhye',
                        ticketId: 'TK1234',
                        votedFor: 'olivia Lawal',
                        votedAt: '2024-01-15T10:35:00Z'
                    },
                    {
                        id: '7',
                        name: 'Olivia Rhye',
                        ticketId: 'TK1234',
                        votedFor: 'olivia Lawal',
                        votedAt: '2024-01-15T10:36:00Z'
                    },
                ],
                stats: {
                    totalVotes: 200,
                    totalContestants: 20,
                    leadingContestant: 'Precious',
                    avgVotes: 6
                },
                pagination: {
                    currentPage: page,
                    totalPages: 12,
                    totalVoters: 120,
                    votersPerPage: 8
                }
            });
        }, 500);
    });
};

const VotersPage: React.FC = () => {
    const [votersData, setVotersData] = useState<VotersData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        loadVoters(currentPage);
    }, [currentPage]);

    const loadVoters = async (page: number): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchVoters(page);
            setVotersData(data);
        } catch (err) {
            setError('Failed to load voters');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number): void => {
        if (page !== currentPage && page > 0 && votersData && page <= votersData.pagination.totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPaginationButtons = (): JSX.Element[] => {
        if (!votersData) return [];

        const { currentPage, totalPages } = votersData.pagination;
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

    if (loading) {
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

    if (!votersData) {
        return null;
    }

    const { voters, stats, pagination } = votersData;

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
                    <p className="text-3xl font-bold text-gray-900">{stats.totalVotes}</p>
                </div>

                {/* Total Contestants */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Contestants</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalContestants}</p>
                </div>

                {/* Leading Contestant */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-1">Leading</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.leadingContestant}</p>
                </div>

                {/* Average Votes */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-600 mb-1">Avg.votes</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.avgVotes}</p>
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
                        </tr>
                        </thead>
                        <tbody>
                        {voters.map((voter, index) => (
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
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer with Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                        Show {voters.length} from {pagination.totalVoters} payouts
                    </p>

                    <div className="flex items-center gap-1">
                        {/* Previous Button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
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
                            disabled={currentPage === pagination.totalPages}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <MdChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotersPage;