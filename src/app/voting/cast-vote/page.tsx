'use client';

import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import {ConfirmationDialog} from "@/components/ConfirmationDialg";
import { useRouter } from 'next/navigation';
// Interfaces
interface Candidate {
    id: string;
    name: string;
    role: string;
    image: string;
    votes?: number;
}

interface VotingSession {
    ticketId: string;
    selectedCandidateId: string | null;
    votingFor: string;
    hasVoted: boolean;
}

interface VotingData {
    candidates: Candidate[];
    session: VotingSession;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalCandidates: number;
        candidatesPerPage: number;
    };
}

// API Functions
const fetchVotingData = async (page: number = 1): Promise<VotingData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                candidates: [
                    { id: '1', name: 'Sarah Lawal', role: 'Singer', image: 'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY', votes: 1250 },
                    { id: '2', name: 'John Doe', role: 'Singer', image: 'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY', votes: 980 },
                    { id: '3', name: 'Jane Smith', role: 'Singer', image: 'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY', votes: 1100 },
                    { id: '4', name: 'Alex Brown', role: 'Singer', image: 'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY', votes: 850 },
                    { id: '5', name: 'Emily White', role: 'Singer', image: 'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY', votes: 750 },
                    { id: '6', name: 'Michael Green', role: 'Singer', image: 'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY', votes: 920 },
                    { id: '7', name: 'Lisa Black', role: 'Singer', image: 'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY', votes: 680 },
                    { id: '8', name: 'David Blue', role: 'Singer', image: 'https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY', votes: 540 },
                ],
                session: {
                    ticketId: 'TK1234',
                    selectedCandidateId: '1',
                    votingFor: 'Sarah Lawal',
                    hasVoted: false,
                },
                pagination: {
                    currentPage: 1,
                    totalPages: 12,
                    totalCandidates: 100,
                    candidatesPerPage: 8,
                },
            });
        }, 500);
    });
};

const castVote = async (candidateId: string, ticketId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
    });
};

// Component
const VotingPage: React.FC = () => {
    const [votingData, setVotingData] = useState<VotingData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [castingVote, setCastingVote] = useState<boolean>(false);
    const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false); // State for dialog visibility

    const router = useRouter()

    useEffect(() => {
        loadVotingData();
    }, []);

    const loadVotingData = async (page: number = 1): Promise<void> => {
        try {
            setLoading(true);
            const data = await fetchVotingData(page);
            setVotingData(data);
            setSelectedCandidate(data.session.selectedCandidateId);
        } catch (error) {
            console.error('Failed to load voting data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCandidateSelect = (candidateId: string): void => {
        if (votingData?.session.hasVoted) return;
        setSelectedCandidate(candidateId);
    };

    const handleCastVote = (): void => {
        if (!selectedCandidate || !votingData || castingVote) return;
        setShowConfirm(true); // Show confirmation dialog
    };

    const confirmVote = async (): Promise<void> => {
        if (!selectedCandidate || !votingData) return;
        try {
            setCastingVote(true);
            const success = await castVote(selectedCandidate, votingData.session.ticketId);
            if (success) {
                setVotingData(prev =>
                    prev ? { ...prev, session: { ...prev.session, hasVoted: true } } : null
                );
                console.log('Vote cast successfully!');
            }
            await router.push('casted-vote');
        } catch (error) {
            console.error('Failed to cast vote:', error);
        } finally {
            setCastingVote(false);
            setShowConfirm(false); // Close dialog
        }
    };

    const handlePageChange = (page: number): void => {
        loadVotingData(page);
    };

    if (loading) {
        return (
            <div className="bg-[#FFF5F5] min-h-screen">
                <Navbar />
                <div className="fixed top-[76px] lg:top-[184px] left-0 right-0 z-40 bg-[#FFF5F5] border-b border-white/20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-center items-center h-16">
                            <div className="animate-pulse text-[#020617]">Loading voting data...</div>
                        </div>
                    </div>
                </div>
                <div className="pt-[200px] lg:pt-[280px] flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ED120F] border-t-transparent"></div>
                </div>
            </div>
        );
    }

    if (!votingData) {
        return (
            <div className="bg-[#FFF5F5] min-h-screen">
                <Navbar />
                <div className="fixed top-[76px] lg:top-[184px] left-0 right-0 z-40 bg-[#FFF5F5] border-b border-white/20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex justify-center items-center h-16">
                            <div className="text-[#020617]">Unable to load voting session</div>
                        </div>
                    </div>
                </div>
                <div className="pt-[200px] lg:pt-[280px] flex items-center justify-center min-h-[50vh]">
                    <div className="text-center">
                        <p className="text-[#020617] text-lg mb-4">Failed to load voting data</p>
                        <button
                            onClick={() => loadVotingData()}
                            className="px-6 py-2 bg-[#ED120F] text-white rounded-lg font-medium hover:opacity-90 transition-all duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { candidates, session, pagination } = votingData;

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
                            <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  🎫 Ticket: {session.ticketId}
                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-start lg:items-end gap-2">
                            <button
                                onClick={handleCastVote}
                                disabled={!selectedCandidate || session.hasVoted || castingVote}
                                className="px-6 py-2 bg-[#ED120F] text-white rounded-lg font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                            >
                                {castingVote ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Casting vote...
                                    </>
                                ) : session.hasVoted ? (
                                    'Vote Cast!'
                                ) : (
                                    'Cast your vote'
                                )}
                            </button>
                            <span className="text-sm text-[#475569]">
                Voting for: {candidates.find(c => c.id === selectedCandidate)?.name || session.votingFor}
              </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-[200px] max-w-7xl lg:pt-[280px] container mx-auto px-4 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                    {candidates.map((candidate) => {
                        const isSelected = selectedCandidate === candidate.id;

                        return (
                            <div
                                key={candidate.id}
                                onClick={() => handleCandidateSelect(candidate.id)}
                                className={[
                                    'relative bg-white w-fit rounded-[20px] flex flex-col gap-5 overflow-hidden border transition-all duration-200',
                                    'shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
                                    isSelected ? 'border-[#ED120F]' : 'border-gray-200 hover:border-gray-300',
                                    session.hasVoted ? 'cursor-not-allowed opacity-75' : '',
                                ].join(' ')}
                            >
                                <div className="relative px-5 py-4">
                                    <img
                                        src={candidate.image}
                                        alt={candidate.name}
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
                                    <h3 className="font-medium text-[#020617] mb-1">{candidate.name}</h3>
                                    <p className="text-sm text-[#ED120F]">{candidate.role}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-sm text-[#475569]">
            Show {pagination.candidatesPerPage} from {pagination.totalCandidates} candidates
          </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1 || loading}
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
                                        pagination.currentPage === pageNum
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
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages || loading}
                            className="p-2 rounded hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
            <ConfirmationDialog
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmVote}
                loading={castingVote}
                title="Cast your vote"
                description={`Are you sure you want to vote for ${candidates.find(c => c.id === selectedCandidate)?.name}? You can't undo this action.`}
                confirmText="Proceed"
                cancelText="Cancel"
            />
        </div>
    );
};

export default VotingPage;