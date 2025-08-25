'use client'

import Navbar from "@/components/Navbar";
import { FaCheck } from "react-icons/fa";
import { MdOutlineVerifiedUser } from "react-icons/md";

interface VotingSuccessProps {
    searchParams: {
        ticketId?: string;
        candidateName?: string;
    };
}

export default function VotingSuccess({ searchParams }: VotingSuccessProps) {
    const ticketId = searchParams.ticketId ?? "TK1234"; // fallback for now
    const candidateName = searchParams.candidateName ?? "Sarah Lawal"; // fallback for now

    return (
        <div className="bg-[#FFF5F5] min-h-screen">
            <Navbar />

            {/* Main content with padding to account for fixed navbar */}
            <div className="pt-[76px] lg:pt-[184px] flex items-center justify-center min-h-screen px-4">
                <div className="bg-white rounded-[20px] p-8 lg:p-12 max-w-md w-full text-center shadow-sm border border-[#E2E8F0]">

                    {/* Success Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-[#289A55] rounded-full flex items-center justify-center">
                            <FaCheck className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-2xl text-center font-semibold text-[#020617] mb-4">
                        Thank you for voting!
                    </h1>

                    <p className="text-base text-[#475569] mb-8 leading-relaxed">
                        Your support makes a difference! Results will be announced at the end of the show.
                    </p>

                    {/* Vote Details */}
                    <div className="space-y-3 rounded-xl bg-[#FFF5F5] py-5 mb-8">
                        <div className="flex justify-center items-center gap-2">
                            <span className="text-sm text-[#020617] font-medium">Ticket:</span>
                            <span className="text-sm font-semibold text-[#ED120F]">{ticketId}</span>
                        </div>

                        <div className="flex justify-center items-center gap-2">
                            <span className="text-sm text-[#020617] font-medium">Voted for:</span>
                            <span className="text-sm font-semibold text-[#ED120F]">{candidateName}</span>
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div className="flex justify-center items-center gap-2 text-[#289A55]">
                        <MdOutlineVerifiedUser className="w-4 h-4" />
                        <span className="text-sm font-medium">Vote secured & verified</span>
                    </div>
                </div>
            </div>
        </div>
    );
}