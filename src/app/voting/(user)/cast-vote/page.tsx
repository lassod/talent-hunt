'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import {ConfirmationDialog} from "@/components/ConfirmationDialg";
import { useRouter } from 'next/navigation';
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import {ApiHelper} from "@/utlis/ApiHelper";

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

// Data interfaces
interface Contestant {
    id: string;
    name: string;
    talent: string;
    image: string;
    totalVotes?: number;
}

interface ValidatedTicket {
    id: string;
    ticket: string;
    ticketName: string;
    status: string;
    createdAt: string;
    updatedAt: string;
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
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

const baseUrl = ApiHelper.getApiUrl()

// API Functions
const fetchContestants = async (page: number = 1): Promise<ApiPaginatedResponse<Contestant>> => {
    try {
        const response = await axios.get<ApiPaginatedResponse<Contestant>>(`${baseUrl}/v1/contestants`);
        return response.data;
    } catch (error) {
        console.error('Error fetching contestants:', error);
        throw error;
    }
};

const castVote = async (contestantId: string): Promise<ApiResponse<any>> => {
    try {
        const token = localStorage.getItem('voting_token');
        const ticketString = localStorage.getItem('validated_ticket');

        if (!ticketString) {
            throw new Error('No validated ticket found');
        }

        const ticket: ValidatedTicket = JSON.parse(ticketString);

        const response = await axios.post<ApiResponse<any>>(
            `${baseUrl}/v1/votes`,
            {
                ticketId: ticket.id,
                contestantId
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error casting vote:', error);
        throw error;
    }
};

// Component
const VotingPage: React.FC = () => {
    const [contestants, setContestants] = useState<Contestant[]>([]);
    const [pagination, setPagination] = useState<PaginationMeta>(defaultPagination);
    const [ticketData, setTicketData] = useState<ValidatedTicket | null>(null);

    const [loading, setLoading] = useState<boolean>(true);
    const [castingVote, setCastingVote] = useState<boolean>(false);
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const router = useRouter();

    useEffect(() => {
        initializeVoting();
    }, []);

    const initializeVoting = async (): Promise<void> => {
        // Get ticket data from localStorage
        try {
            const validatedTicket = localStorage.getItem('validated_ticket');
            if (validatedTicket) {
                const ticket: ValidatedTicket = JSON.parse(validatedTicket);
                setTicketData(ticket);
            }
        } catch (err) {
            console.error('Error parsing ticket data:', err);
        }

        // Load contestants
        await loadContestants(1);
    };

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

    const handleCandidateSelect = (candidateId: string): void => {
        setSelectedCandidate(candidateId);
    };

    const handleCastVote = (): void => {
        if (!selectedCandidate || castingVote) return;
        setShowConfirm(true);
    };

    const confirmVote = async (): Promise<void> => {
        if (!selectedCandidate) return;

        try {
            setCastingVote(true);
            const response = await castVote(selectedCandidate);

            if (response.success) {
                toast({
                    title: "Vote Cast Successfully!",
                    description: "Thank you for voting!",
                });

                // Clear token from localStorage after successful vote
                localStorage.removeItem('voting_token');
                localStorage.removeItem('validated_ticket');

                // Redirect to success page
                router.push(`/voting/${ticketData?.ticket}/casted-vote`);
            } else {
                const errorMessage = response.message || 'Failed to cast vote';
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to cast vote';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            console.error('Failed to cast vote:', err);
        } finally {
            setCastingVote(false);
            setShowConfirm(false);
        }
    };

    const handlePageChange = (page: number): void => {
        if (page !== pagination.page && page > 0 && page <= pagination.totalPages) {
            loadContestants(page);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#FFF5F5] min-h-screen">
                <Navbar />
                <div className="fixed top-[76px] lg:top-[184px] left-0 right-0 z-40 bg-[#FFF5F5] border-b border-white/20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-center items-center h-16">
                            <div className="animate-pulse text-[#020617]">Loading contestants...</div>
                        </div>
                    </div>
                </div>
                <div className="pt-[200px] lg:pt-[280px] flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ED120F] border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (error && contestants.length === 0) {
        return (
            <div className="bg-[#FFF5F5] min-h-screen">
                <Navbar />
                <div className="fixed top-[76px] lg:top-[184px] left-0 right-0 z-40 bg-[#FFF5F5] border-b border-white/20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-center items-center h-16">
                            <div className="text-[#020617]">Unable to load contestants</div>
                        </div>
                    </div>
                </div>
                <div className="pt-[200px] lg:pt-[280px] flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <p className="text-[#020617] text-lg mb-4">{error}</p>
                        <button
                            onClick={() => loadContestants(pagination.page)}
                            className="px-6 py-2 bg-[#ED120F] text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const selectedContestant = contestants.find(c => c.id === selectedCandidate);

    return (
        <div className="bg-[#FFF5F5] min-h-screen">
            <Navbar />
            <div className="fixed top-[76px] lg:top-[184px] left-0 right-0 z-40 bg-[#FFF5F5] border-b border-white/20">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-semibold text-[#020617] mb-2">
                                Vote now and make your voice heard
                            </h1>
                            {ticketData && (
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        🎫 Ticket: {ticketData.ticket}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-start lg:items-end gap-2">
                            <button
                                onClick={handleCastVote}
                                disabled={!selectedCandidate || castingVote}
                                className="px-6 py-2 bg-[#ED120F] text-white rounded-lg font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                            >
                                {castingVote ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Casting vote...
                                    </>
                                ) : (
                                    'Cast your vote'
                                )}
                            </button>
                            <span className="text-sm text-[#475569]">
                                {selectedContestant ? `Voting for: ${selectedContestant.name}` : 'Select a contestant to vote'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-[200px] max-w-7xl lg:pt-[280px] container mx-auto px-4 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                    {contestants.map((contestant) => {
                        const isSelected = selectedCandidate === contestant.id;

                        return (
                            <div
                                key={contestant.id}
                                onClick={() => handleCandidateSelect(contestant.id)}
                                className={[
                                    'relative bg-white w-fit rounded-[20px] flex flex-col gap-5 overflow-hidden border transition-all duration-200',
                                    'shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
                                    isSelected ? 'border-[#ED120F]' : 'border-gray-200 hover:border-gray-300',
                                ].join(' ')}
                            >
                                <div className="relative px-5 py-4">
                                    <img
                                        src={contestant.image}
                                        alt={contestant.name}
                                        className="h-[200px] md:w-[250px] md:h-[254px] rounded-[10px] object-cover"
                                    />
                                    {isSelected && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="#F2C94C"
                                                    className="w-20 h-20 drop-shadow"
                                                >
                                                    <path d="M12 2l2.9 6.1 6.7.9-4.8 4.7 1.2 6.8L12 17.8 6 20.5l1.2-6.8L2.4 9l6.7-.9L12 2z" />
                                                </svg>
                                            </div>
                                            <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                                                <span className="text-[#ED120F] font-extrabold text-3xl tracking-wide">
                                                    Selected
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="pb-4 text-center">
                                    <h3 className="font-medium text-[#020617] mb-1">{contestant.name}</h3>
                                    <p className="text-sm text-[#ED120F]">{contestant.talent}</p>
                                    {contestant.totalVotes !== undefined && (
                                        <p className="text-xs text-gray-500 mt-1">{contestant.totalVotes} votes</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <span className="text-sm text-[#475569]">
                            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} contestants
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={!pagination.hasPreviousPage || loading}
                                className="p-2 rounded hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ←
                            </button>
                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const pageNum = i + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        disabled={loading}
                                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                            pagination.page === pageNum
                                                ? 'bg-[#ED120F] text-white'
                                                : 'text-[#020617] hover:bg-white hover:shadow-sm'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            {pagination.totalPages > 5 && (
                                <>
                                    <span className="px-2 text-[#475569]">...</span>
                                    <button
                                        onClick={() => handlePageChange(pagination.totalPages)}
                                        disabled={loading}
                                        className="px-3 py-1 rounded text-sm font-medium text-[#020617] hover:bg-white hover:shadow-sm"
                                    >
                                        {pagination.totalPages}
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={!pagination.hasNextPage || loading}
                                className="p-2 rounded hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationDialog
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmVote}
                loading={castingVote}
                title="Cast your vote"
                description={`Are you sure you want to vote for ${selectedContestant?.name}? You can't undo this action.`}
                confirmText="Proceed"
                cancelText="Cancel"
            />
        </div>
    );
};

export default VotingPage;