'use client'
import React from 'react';
import Navbar from "@/components/Navbar";
import { FaCheck } from "react-icons/fa";
import { MdOutlineVerifiedUser } from "react-icons/md";

interface VotingSuccessProps {
    ticketId?: string;
    candidateName?: string;
}

const VotingSuccess: React.FC<VotingSuccessProps> = ({
                                                         ticketId = 'TK1234',
                                                         candidateName = 'Sarah Lawal'
                                                     }) => {
    return (
        <div className="bg-[var(--osh-pink)] min-h-screen">
            <Navbar />

            {/* Main content with padding to account for fixed navbar */}
            <div className="pt-[76px] lg:pt-[184px] flex items-center justify-center min-h-screen px-4">
                <div className="bg-white rounded-[20px] p-8 lg:p-12 max-w-md w-full text-center shadow-sm border border-[#E2E8F0]">

                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-[var(--osh-green)] rounded-full flex items-center justify-center">
                            <FaCheck className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-2xl text-center font-semibold text-[var(--osh-textprimary)] mb-4">
                        Thank you for voting!
                    </h1>

                    <p className="text-base text-[var(--osh-textsecondary)] mb-8 leading-relaxed">
                        Your support makes a difference! Results will be announced at the end of the show.
                    </p>

                    {/* Vote Details */}
                    <div className="space-y-3 rounded-xl bg-[var(--osh-pink)] py-5 mb-8">
                        <div className="flex justify-center items-center gap-2">
                            <span className="text-sm text-[var(--osh-textprimary)] font-medium">Ticket:</span>
                            <span className="text-sm font-semibold text-[var(--osh-red)]">{ticketId}</span>
                        </div>

                        <div className="flex justify-center items-center gap-2">
                            <span className="text-sm text-[var(--osh-textprimary)] font-medium">Voted for:</span>
                            <span className="text-sm font-semibold text-[var(--osh-red)]">{candidateName}</span>
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div className="flex justify-center items-center gap-2 text-[var(--osh-green)]">
                        <MdOutlineVerifiedUser className="w-4 h-4" />
                        <span className="text-sm font-medium">Vote secured & verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotingSuccess;
