'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import { FaRegUser } from "react-icons/fa";
import axios from "@/lib/axios";
import {useToast} from "@/hooks/toastHooks";

// API Response interface
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

interface loginResponse {
    ticket: TicketData;
    token:string
}

interface TicketData {
    id: string;
    ticket: string;
    ticketName: string;
    status: string;
    votedFor:string
}

// API function to validate ticket
const validateTicket = async (ticketId: string): Promise<ApiResponse<loginResponse>> => {
    try {
        const response = await axios.post<ApiResponse<loginResponse>>('/v1/tickets', {
            ticket: ticketId
        });
        return response.data;
    } catch (error) {
        console.error('Error validating ticket:', error);
        throw error;
    }
};

function Home(){
    const router = useRouter();
    const [ticketId, setTicketId] = useState<string>('');
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const {showToast, ToastContainerComponent} = useToast()


    const handleValidateTicket = async (): Promise<void> => {
        if (!ticketId.trim()) {
            setError('Please enter a ticket ID');
            showToast( "Please enter a ticket ID" , 'error')
            return;
        }

        setIsValidating(true);
        setError('');

        try {
            const response = await validateTicket(ticketId.trim());

            if (response.success && response.data) {
                const { ticket, token } = response.data;

                // Check if ticket status allows voting
                if (ticket.status === 'voted') {
                    setTimeout(() => {
                        const candidateName = ticket.votedFor || '';
                        router.push(`/voting/${ticket.ticket}/casted-vote?candidate=${encodeURIComponent(candidateName)}`);
                    }, 1000);
                }

                if (ticket.status !== 'notvoted') {
                    setError('This ticket is not available for voting.');
                    showToast( "This ticket is not available for voting." , 'error')
                    return;
                }

                // Store ticket data and token in localStorage for voting process
                localStorage.setItem('validated_ticket', JSON.stringify(ticket));
                localStorage.setItem('voting_token', token);

                // Success - redirect to voting page

                showToast(`Welcome ${ticket.ticketName}! Redirecting to voting...` , 'success')

                setTimeout(() => {
                    router.push('/voting/cast-vote');
                }, 1000);

            } else {
                const errorMessage = response.message || 'Ticket validation failed. Please try again.';
                setError(errorMessage);
                showToast( errorMessage , 'error')
            }
        } catch (err: any) {
            let errorMessage = 'Ticket validation failed. Please try again.';

            if (err.response?.status === 404) {
                errorMessage = 'Ticket not found. Please check your ticket ID and try again.';
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            setError(errorMessage);
            showToast( errorMessage , 'error')
            console.error('Ticket validation failed:', err);
        } finally {
            setIsValidating(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTicketId(e.target.value);
        if (error) setError(''); // Clear error when user starts typing
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleValidateTicket();
        }
    };

    return (
        <div className="bg-[#FFF5F5] min-h-screen">
            <Navbar />

            {/* Main content with padding to account for fixed navbar */}
            <div className="pt-[76px] lg:pt-[184px] flex items-center justify-center min-h-screen px-4">
                <div className="rounded-[20px] p-6 lg:min-w-[451px] border bg-white border-[#E2E8F0] flex items-center flex-col">
                    <FaRegUser className="text-[#ED120F] w-[50px] h-[50px]" />
                    <p className="text-[18px] mt-2 leading-[28px] text-[#020617] font-medium">
                        Enter your ticket ID
                    </p>
                    <p className="text-[16px] mt-2 leading-[24px] text-(--osh-textsecondary) text-center">
                        Enter your ticket ID below to unlock your voting power!
                    </p>

                    {/* Input Section */}
                    <div className="w-full mt-6">
                        <label
                            htmlFor="ticketId"
                            className="block text-sm font-medium text-[#020617] mb-2"
                        >
                            Enter ticket ID
                        </label>

                        <input
                            type="text"
                            id="ticketId"
                            value={ticketId}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="E.g., TK1234"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#ED120F] focus:border-transparent outline-none transition-all duration-200 text-[#020617] placeholder-gray-400 ${
                                error ? 'border-red-300 bg-red-50' : 'border-[#E2E8F0]'
                            }`}
                            disabled={isValidating}
                        />

                        {/* Error Message */}
                        {error && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleValidateTicket}
                            disabled={!ticketId.trim() || isValidating}
                            className="w-full mt-4 bg-[#ED120F] hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
                        >
                            {isValidating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                    Validating...
                                </>
                            ) : (
                                'Validate ticket'
                            )}
                        </button>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-(--osh-textsecondary) leading-relaxed">
                            Your vote is protected by advanced security measures
                        </p>
                        <p className="text-sm text-(--osh-textsecondary) leading-relaxed">
                            One vote per ticket • Fraud prevention active
                        </p>
                    </div>
                </div>
            </div>
            {ToastContainerComponent}
        </div>
    );
}

export default Home;