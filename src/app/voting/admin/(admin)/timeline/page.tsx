'use client'
import React, { useState, useEffect } from 'react';
import { MdAccessTime, MdStop, MdSchedule } from 'react-icons/md';
import { IoPlayOutline } from "react-icons/io5";

import axios from "@/lib/axios";
import { toast } from "@/components/ui/use-toast";

// API Response interface
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

// Types
interface TimelineData {
    id: string;
    startDate: string | null;
    endDate: string | null;
    status: 'not_started' | 'active' | 'ended';
    createdAt: string;
    updatedAt: string;
}

// API Functions
const fetchTimeline = async (): Promise<ApiResponse<TimelineData>> => {
    try {
        const response = await axios.get<ApiResponse<TimelineData>>('/v1/timelines');
        return response.data;
    } catch (error) {
        console.error('Error fetching timeline:', error);
        throw error;
    }
};

const startVotingNow = async (): Promise<ApiResponse<TimelineData>> => {
    try {
        const response = await axios.post<ApiResponse<TimelineData>>('/v1/timelines');
        return response.data;
    } catch (error) {
        console.error('Error starting voting:', error);
        throw error;
    }
};

const updateTimeline = async (timelineId: string, startDate: string, endDate: string): Promise<ApiResponse<TimelineData>> => {
    try {
        const response = await axios.patch<ApiResponse<TimelineData>>(`/v1/timelines/${timelineId}`, {
            startDate,
            endDate
        });
        return response.data;
    } catch (error) {
        console.error('Error updating timeline:', error);
        throw error;
    }
};

// Utility functions
const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const formatCountdown = (milliseconds: number): string => {
    if (milliseconds <= 0) return '0 seconds';

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}hr ${minutes}min ${seconds}secs`;
    } else if (minutes > 0) {
        return `${minutes}min ${seconds}secs`;
    } else {
        return `${seconds} seconds`;
    }
};

const formatDateTimeForInput = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
};

const TimelinePage: React.FC = () => {
    const [timeline, setTimeline] = useState<TimelineData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    // Form states
    const [newStartTime, setNewStartTime] = useState<string>('');
    const [newEndTime, setNewEndTime] = useState<string>('');

    useEffect(() => {
        loadTimeline();

        // Update current time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timeline) {
            // Set default values or existing values for form inputs
            const now = new Date();
            const defaultStart = new Date(now.getTime() + 60 * 1000); // 1 minute from now
            const defaultEnd = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

            setNewStartTime(timeline.startDate ? formatDateTimeForInput(timeline.startDate) : formatDateTimeForInput(defaultStart.toISOString()));
            setNewEndTime(timeline.endDate ? formatDateTimeForInput(timeline.endDate) : formatDateTimeForInput(defaultEnd.toISOString()));
        }
    }, [timeline]);

    const loadTimeline = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await fetchTimeline();

            if (response.success && response.data) {
                setTimeline(response.data);
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to load timeline",
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load timeline';
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

    const handleStartNow = async (): Promise<void> => {
        try {
            setUpdating(true);
            const response = await startVotingNow();

            if (response.success && response.data) {
                setTimeline(response.data);
                toast({
                    title: "Voting Started",
                    description: "Voting has been started successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to start voting",
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to start voting';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateSchedule = async (): Promise<void> => {
        if (!timeline) {
            toast({
                title: "Error",
                description: "Timeline data not available",
                variant: "destructive",
            });
            return;
        }

        if (!newStartTime || !newEndTime) {
            toast({
                title: "Validation Error",
                description: "Please select both start and end times",
                variant: "destructive",
            });
            return;
        }

        const start = new Date(newStartTime);
        const end = new Date(newEndTime);

        if (end <= start) {
            toast({
                title: "Validation Error",
                description: "End time must be after start time",
                variant: "destructive",
            });
            return;
        }

        try {
            setUpdating(true);
            const response = await updateTimeline(timeline.id, start.toISOString(), end.toISOString());

            if (response.success && response.data) {
                setTimeline(response.data);
                toast({
                    title: "Schedule Updated",
                    description: "Voting schedule has been updated successfully",
                });
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to update schedule",
                    variant: "destructive",
                });
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update schedule';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const getStatusBadge = () => {
        if (!timeline) return null;

        const statusConfig = {
            not_started: { text: 'Not started', className: 'bg-gray-100 text-gray-700' },
            active: { text: 'Active', className: 'bg-green-100 text-green-700' },
            ended: { text: 'Ended', className: 'bg-red-100 text-red-700' }
        };

        const config = statusConfig[timeline.status];
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
                {config.text}
            </span>
        );
    };

    const getCountdownText = () => {
        if (!timeline) return '';

        const now = currentTime.getTime();

        // Handle cases where dates might be null
        if (timeline.status === 'not_started') {
            if (timeline.startDate) {
                const startTime = new Date(timeline.startDate).getTime();
                const timeUntilStart = startTime - now;
                if (timeUntilStart > 0) {
                    return `${formatCountdown(timeUntilStart)} until voting starts`;
                } else {
                    return 'Voting can start now';
                }
            } else {
                return 'Schedule not set - click "Start now" to begin';
            }
        } else if (timeline.status === 'active') {
            if (timeline.endDate) {
                const endTime = new Date(timeline.endDate).getTime();
                const timeRemaining = endTime - now;
                if (timeRemaining > 0) {
                    return `${formatCountdown(timeRemaining)} remaining`;
                } else {
                    return 'Voting time has expired';
                }
            } else {
                return 'Voting is active';
            }
        } else {
            return 'Voting has ended';
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="animate-pulse bg-white p-6 rounded-lg border">
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                    <div className="animate-pulse bg-white p-6 rounded-lg border">
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Timeline</h1>
                <p className="text-gray-600">View and update the countdown</p>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Voting Status */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Voting Status</h2>
                        {getStatusBadge()}
                    </div>

                    <div className="space-y-6">
                        {/* Status Display */}
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Enter ticket ID</p>
                            <div className="flex items-center gap-2 text-gray-700">
                                <MdAccessTime className="w-5 h-5" />
                                <span>{getCountdownText()}</span>
                            </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleStartNow}
                                disabled={updating || timeline?.status === 'active'}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                    timeline?.status === 'active' || updating
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                }`}
                            >
                                {updating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                        Starting...
                                    </>
                                ) : (
                                    <>
                                        <IoPlayOutline className="w-4 h-4" />
                                        Start now
                                    </>
                                )}
                            </button>

                            <button
                                disabled={timeline?.status !== 'active'}
                                className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-200 text-gray-500 cursor-not-allowed"
                            >
                                <MdStop className="w-4 h-4" />
                                Stop
                            </button>
                        </div>
                    </div>
                </div>

                {/* Schedule Voting */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                        <MdSchedule className="w-5 h-5 text-gray-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Schedule voting</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Start Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start time
                            </label>
                            <input
                                type="datetime-local"
                                value={newStartTime}
                                onChange={(e) => setNewStartTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                disabled={updating}
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End time
                            </label>
                            <input
                                type="datetime-local"
                                value={newEndTime}
                                onChange={(e) => setNewEndTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                                disabled={updating}
                            />
                        </div>

                        {/* Update Button */}
                        <button
                            onClick={handleUpdateSchedule}
                            disabled={updating}
                            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            {updating ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                                    Updating...
                                </>
                            ) : (
                                'Update schedule'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Current Schedule Display */}
            {timeline && (timeline.startDate || timeline.endDate) && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Current Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">Start: </span>
                            <span className="font-medium text-gray-900">
                                {timeline.startDate ? formatDateTime(timeline.startDate) : 'Not set'}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">End: </span>
                            <span className="font-medium text-gray-900">
                                {timeline.endDate ? formatDateTime(timeline.endDate) : 'Not set'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimelinePage;