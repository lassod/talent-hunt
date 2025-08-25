'use client'
import React from 'react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface StatsData {
    totalVotes: number;
    totalContestants: number;
    leading: string;
    avgVotes: number;
}

interface ContestantResult {
    id: string;
    rank: number;
    name: string;
    role: string;
    votes: number;
    percentage: number;
    trend: "rising" | "falling";
    avatar: string;
}

const AdminResults: React.FC = () => {
    // Sample stats
    const stats: StatsData = {
        totalVotes: 200,
        totalContestants: 20,
        leading: "Precious",
        avgVotes: 6
    };

    // Chart Data (typed)
    const chartData: ChartData<'bar'> = {
        labels: ["Jane", "Femi", "Mike", "Ada", "Mandy", "Josh", "Jide", "Amanda", "Silver", "Onyin", "Nike", "Deola"],
        datasets: [
            {
                label: "Votes %",
                data: [18, 38, 18, 22, 55, 22, 22, 9, 35, 25, 25, 40],
                backgroundColor: "rgba(34,197,94,0.8)", // Tailwind green-500 w/ opacity
                borderRadius: 6,
            },
        ],
    };

    // Chart Options (typed)
    const chartOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.raw}%`, // TS knows ctx.raw is number
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

    // Contestant Leaderboard
    const contestantResults: ContestantResult[] = [
        {
            id: '1',
            rank: 1,
            name: 'Sarah Lawal',
            role: 'Singer',
            votes: 18500,
            percentage: 50,
            trend: "rising",
            avatar: 'https://fastly.picsum.photos/id/1/50/50.jpg'
        },
        {
            id: '2',
            rank: 2,
            name: 'John Doe',
            role: 'Dancer',
            votes: 16200,
            percentage: 45,
            trend: "falling",
            avatar: 'https://fastly.picsum.photos/id/2/50/50.jpg'
        },
        {
            id: '3',
            rank: 3,
            name: 'Sarah Lawal',
            role: 'Singer',
            votes: 890,
            percentage: 42,
            trend: "falling",
            avatar: 'https://fastly.picsum.photos/id/3/50/50.jpg?hmac=lKmNC3Nt3XNUgUKS7HuWgKsUyoGVGjvYfL5NmOcSRk4'
        },
        {
            id: '4',
            rank: 4,
            name: 'Sarah Lawal',
            role: 'Singer',
            votes: 750,
            percentage: 38,
            trend: "falling",
            avatar: 'https://fastly.picsum.photos/id/4/50/50.jpg?hmac=lKmNC3Nt3XNUgUKS7HuWgKsUyoGVGjvYfL5NmOcSRk4'
        },
        {
            id: '5',
            rank: 5,
            name: 'Sarah Lawal',
            role: 'Singer',
            votes: 680,
            percentage: 35,
            trend: "rising",
            avatar: 'https://fastly.picsum.photos/id/5/50/50.jpg?hmac=lKmNC3Nt3XNUgUKS7HuWgKsUyoGVGjvYfL5NmOcSRk4'
        },
        {
            id: '6',
            rank: 6,
            name: 'Sarah Lawal',
            role: 'Singer',
            votes: 620,
            percentage: 32,
            trend: "falling",
            avatar: 'https://fastly.picsum.photos/id/6/50/50.jpg?hmac=lKmNC3Nt3XNUgUKS7HuWgKsUyoGVGjvYfL5NmOcSRk4'
        }
    ];

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
                    <p className="text-3xl font-bold">{stats.totalVotes}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Total Contestants</p>
                    <p className="text-3xl font-bold">{stats.totalContestants}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Leading</p>
                    <p className="text-3xl font-bold">{stats.leading}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Avg. votes</p>
                    <p className="text-3xl font-bold">{stats.avgVotes}</p>
                </div>
            </div>

            {/* Vote Distribution */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Vote Distribution</h3>
                <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Leaderboard */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Leaderboard</h3>
                <div className="space-y-4">
                    {contestantResults.map((c) => (
                        <div
                            key={c.id}
                            className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-0"
                        >
                            {/* Rank */}
                            <div className="text-red-500 font-bold w-6">#{c.rank}</div>

                            {/* Avatar */}
                            <img
                                src={c.avatar}
                                alt={c.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900">{c.name}</p>

                                    {/* Trend Badge */}
                                    <span
                                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                                            c.trend === "rising"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                    {c.trend === "rising" ? (
                        <ArrowUp className="w-3 h-3" />
                    ) : (
                        <ArrowDown className="w-3 h-3" />
                    )}
                                        {c.trend === "rising" ? "Rising" : "Falling"}
                  </span>
                                </div>
                                <p className="text-sm text-gray-500">{c.role}</p>
                            </div>

                            {/* Progress */}
                            <div className="lg:w-64">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${c.percentage}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Votes */}
                            <div className="text-right min-w-[80px]">
                                <p className="font-semibold text-gray-900">{c.votes.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">{c.percentage}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminResults;
