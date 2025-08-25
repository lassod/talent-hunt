'use client'
import React, { useState } from 'react'
import Navbar from "@/components/Navbar";
import { FaRegUser } from "react-icons/fa";

function Home(){
    const [ticketId, setTicketId] = useState<string>('');
    const [isValidating, setIsValidating] = useState<boolean>(false);

    const handleValidateTicket = async (): Promise<void> => {
        if (!ticketId.trim()) return;

        setIsValidating(true);

        try {
            // Add your validation logic here
            // Example: await validateTicketAPI(ticketId);

            // Simulate API call for now
            setTimeout(() => {
                setIsValidating(false);
                console.log('Validating ticket:', ticketId);
                // Handle successful validation
            }, 1000);

        } catch (error) {
            setIsValidating(false);
            console.error('Ticket validation failed:', error);
            // Handle validation error
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setTicketId(e.target.value);
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
                            className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:ring-2 focus:ring-[#ED120F] focus:border-transparent outline-none transition-all duration-200 text-[#020617] placeholder-gray-400"
                            disabled={isValidating}
                        />

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
        </div>
    );
}

export default Home;