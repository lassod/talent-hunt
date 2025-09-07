
'use client'
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData,
} from 'chart.js';
import { ArrowUp, ArrowDown } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// API Response interfaces
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

interface StatsData {
    totalVotes: number;
    totalContestant: number;
    leadingCandidate: string;
    averageVotes: number;
}

interface ContestantResult {
    id: string;
    name: string;
    talent: string;
    totalVotes: number;
    percentage: number;
    image: string;
    rank?: number;
    trend?: "rising" | "falling";
}

// API Functions
const fetchVotingStats = async (): Promise<ApiResponse<StatsData>> => {
    try {
        const response = await axios.get<ApiResponse<StatsData>>('/v1/votes/stats');
        return response.data;
    } catch (error) {
        console.error('Error fetching voting stats:', error);
        throw error;
    }
};

const fetchLeaderboard = async (): Promise<ApiResponse<ContestantResult[]>> => {
    try {
        const response = await axios.get<ApiResponse<ContestantResult[]>>('/v1/contestants/leaderboard');
        return response.data;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};

const AdminResults: React.FC = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [leaderboard, setLeaderboard] = useState<ContestantResult[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadResultsData();
        const interval = setInterval(loadResultsData, 4000);
        return () => clearInterval(interval);
    }, []);

    const loadResultsData = async (): Promise<void> => {
        await Promise.all([
            loadStats(),
            loadLeaderboard()
        ]);
    };

    const loadStats = async (): Promise<void> => {
        try {
            const response = await fetchVotingStats();
            if (response.success && response.data) {
                setStats(response.data);
            } else {
                toast({
                    title: "Error",
                    description: response.message || 'Failed to load voting statistics',
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load voting statistics';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            console.error(err);
        }
    };

    const loadLeaderboard = async (): Promise<void> => {
        try {
            setError('');
            const response = await fetchLeaderboard();
            if (response.success && response.data) {
                const rankedData = response.data.map((contestant, index) => ({
                    ...contestant,
                    rank: contestant.rank || index + 1,
                    trend: contestant.trend || (Math.random() > 0.5 ? "rising" : "falling") as "rising" | "falling"
                }));
                setLeaderboard(rankedData);
            } else {
                const errorMessage = response.message || 'Failed to load leaderboard';
                setError(errorMessage);
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load leaderboard';
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            console.error(err);
        }
    };

    // Generate chart data from leaderboard (top 12 contestants)
    const chartData: ChartData<'bar'> = {
        labels: leaderboard.slice(0, 12).map(c => c.name),
        datasets: [
            {
                label: "Votes %",
                data: leaderboard.slice(0, 12).map(c => c.percentage || 0),
                backgroundColor: "rgba(34,197,94,0.8)",
                borderRadius: 6,
            },
        ],
    };

    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.raw}%`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: (val) => `${val}%`,
                },
            },
        },
    };

    const handleRetry = (): void => {
        loadResultsData();
    };

    if (error && leaderboard.length === 0) {
        return (
            <div className="space-y-8 p-6">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={handleRetry}
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
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Results</h1>
                    <p className="text-sm text-gray-600">
                        Real-time voting results • Updates every 4 seconds
                    </p>
                </div>

                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    Present on projector
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Total votes</p>
                    <p className="text-3xl font-bold">{stats?.totalVotes || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Total Contestants</p>
                    <p className="text-3xl font-bold">{stats?.totalContestant || 0}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Leading</p>
                    <p className="text-3xl font-bold">{stats?.leadingCandidate || 'N/A'}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Avg. votes</p>
                    <p className="text-3xl font-bold">{stats?.averageVotes || 0}</p>
                </div>
            </div>

            {/* Vote Distribution Chart */}
            {leaderboard.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Vote Distribution</h3>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            )}

            {/* Leaderboard */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Leaderboard</h3>
                <div className="space-y-4">
                    {leaderboard.length > 0 ? (
                        leaderboard.map((contestant) => (
                            <div
                                key={contestant.id}
                                className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-0"
                            >
                                {/* Rank */}
                                <div className="text-red-500 font-bold w-6">#{contestant.rank}</div>

                                {/* Avatar */}
                                <img
                                    src={contestant.image}
                                    alt={contestant.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-gray-900">{contestant.name}</p>

                                        {/* Trend Badge */}
                                        {contestant.trend && (
                                            <span
                                                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                                    contestant.trend === "rising"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {contestant.trend === "rising" ? (
                                                    <ArrowUp className="w-3 h-3" />
                                                ) : (
                                                    <ArrowDown className="w-3 h-3" />
                                                )}
                                                {contestant.trend === "rising" ? "Rising" : "Falling"}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500">{contestant.talent}</p>
                                </div>

                                {/* Progress */}
                                <div className="lg:w-64">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${contestant.percentage || 0}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Votes */}
                                <div className="text-right min-w-[80px]">
                                    <p className="font-semibold text-gray-900">{contestant.totalVotes.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">{contestant.percentage || 0}%</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No voting results available yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminResults;

