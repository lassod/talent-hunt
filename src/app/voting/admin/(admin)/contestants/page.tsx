// 'use client'
// import React, { useState, useEffect } from 'react';
// import { MdAdd, MdPeople } from 'react-icons/md';
//
// // Types
// interface Contestant {
//     id: string;
//     name: string;
//     role: string;
//     image: string;
//     votes?: number;
//     dateAdded: string;
// }
//
// interface ContestantsData {
//     contestants: Contestant[];
//     totalCount: number;
// }
//
// // API Functions
// const fetchContestants = async (): Promise<ContestantsData> => {
//     // Uncomment when API is ready
//     // try {
//     //   const response = await fetch('/api/(admin)/contestants');
//     //   if (!response.ok) throw new Error('Failed to fetch contestants');
//     //   return await response.json();
//     // } catch (error) {
//     //   console.error('Error fetching contestants:', error);
//     //   throw error;
//     // }
//
//     // Mock data for now
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({
//                 contestants: [], // Empty for initial state
//                 totalCount: 20 // This would come from your database
//             });
//         }, 500);
//     });
// };
//
// const ContestantsPage: React.FC = () => {
//     const [contestantsData, setContestantsData] = useState<ContestantsData | null>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string>('');
//
//     useEffect(() => {
//         loadContestants();
//     }, []);
//
//     const loadContestants = async (): Promise<void> => {
//         try {
//             setLoading(true);
//             setError('');
//             const data = await fetchContestants();
//             setContestantsData(data);
//         } catch (err) {
//             setError('Failed to load contestants');
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const handleAddContestant = (): void => {
//         // Handle add contestant - could open modal or navigate to form
//         console.log('Add contestant clicked');
//         // You can add navigation logic here:
//         // router.push('/(admin)/contestants/add');
//     };
//
//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
//             </div>
//         );
//     }
//
//     if (error) {
//         return (
//             <div className="flex items-center justify-center min-h-[400px]">
//                 <div className="text-center">
//                     <p className="text-red-600 mb-4">{error}</p>
//                     <button
//                         onClick={loadContestants}
//                         className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }
//
//     const hasContestants = contestantsData && contestantsData.contestants.length > 0;
//
//     return (
//         <div className="space-y-8">
//             {/* Page Header */}
//             <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Contestants</h1>
//                 <p className="text-gray-600">View and track all contestants on the show.</p>
//             </div>
//
//             {/* Stats and Actions Bar */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                     <p className="text-gray-700 font-medium">
//                         Total contestants ({contestantsData?.totalCount || 0})
//                     </p>
//                 </div>
//
//                 <button
//                     onClick={handleAddContestant}
//                     className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
//                 >
//                     <MdAdd className="w-5 h-5" />
//                     Add contestant
//                 </button>
//             </div>
//
//             {/* Content Area */}
//             {hasContestants ? (
//                 // Contestants Grid/List (when there are contestants)
//                 <div className="bg-white rounded-lg border border-gray-200 p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {contestantsData.contestants.map((contestant) => (
//                             <div key={contestant.id} className="border border-gray-200 rounded-lg p-4">
//                                 <img
//                                     src={contestant.image}
//                                     alt={contestant.name}
//                                     className="w-full aspect-[4/5] object-cover rounded-lg mb-4"
//                                 />
//                                 <h3 className="font-semibold text-gray-900 mb-1">{contestant.name}</h3>
//                                 <p className="text-gray-600 text-sm mb-2">{contestant.role}</p>
//                                 <p className="text-gray-500 text-xs">
//                                     Added: {new Date(contestant.dateAdded).toLocaleDateString()}
//                                 </p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             ) : (
//                 // Empty State
//                 <div className="flex items-center justify-center min-h-[400px]">
//                     <div className="text-center max-w-md mx-auto">
//                         {/* Icon */}
//                         <div className="w-16 h-16 mx-auto mb-6 text-gray-400">
//                             <MdPeople className="w-full h-full" />
//                         </div>
//
//                         {/* Empty State Text */}
//                         <h2 className="text-xl font-semibold text-gray-900 mb-3">
//                             No contestants yet
//                         </h2>
//
//                         <p className="text-gray-600 mb-8">
//                             Add first contestant to get started
//                         </p>
//
//                         {/* CTA Button */}
//                         <button
//                             onClick={handleAddContestant}
//                             className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium mx-auto"
//                         >
//                             <MdAdd className="w-5 h-5" />
//                             Add contestant
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default ContestantsPage;



'use client'
import React, { useState, useEffect } from 'react';
import { MdAdd, MdPeople, MdEdit, MdDelete } from 'react-icons/md';
import Link from "next/link";

// Types
interface Contestant {
    id: string;
    name: string;
    role: string;
    image: string;
    votes?: number;
    dateAdded: string;
}

interface ContestantsData {
    contestants: Contestant[];
    totalCount: number;
}

// API Functions
const fetchContestants = async (): Promise<ContestantsData> => {
    // Uncomment when API is ready
    // try {
    //   const response = await fetch('/api/admin/contestants');
    //   if (!response.ok) throw new Error('Failed to fetch contestants');
    //   return await response.json();
    // } catch (error) {
    //   console.error('Error fetching contestants:', error);
    //   throw error;
    // }

    // Mock data for now
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                contestants: [], // Empty for initial state
                totalCount: 20 // This would come from your database
            });
        }, 500);
    });
};

const ContestantsPage: React.FC = () => {
    const [contestantsData, setContestantsData] = useState<ContestantsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        loadContestants();
    }, []);

    const loadContestants = async (): Promise<void> => {
        try {
            setLoading(true);
            setError('');
            const data = await fetchContestants();
            setContestantsData(data);
        } catch (err) {
            setError('Failed to load contestants');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddContestant = (): void => {
        // Handle add contestant - could open modal or navigate to form
        console.log('Add contestant clicked');
        // You can add navigation logic here:
        // router.push('/admin/contestants/add');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={loadContestants}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const hasContestants = contestantsData && contestantsData.contestants.length > 0;

    return (
        <div className="space-y-8 p-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Contestants</h1>
                <p className="text-gray-600">View and track all contestants on the show.</p>
            </div>

            {/* Stats and Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <p className="text-gray-700 font-medium">
                        Total contestants ({contestantsData?.totalCount || 0})
                    </p>
                </div>

                <button
                    onClick={handleAddContestant}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                >
                    <MdAdd className="w-5 h-5" />
                    Add contestant
                </button>
            </div>

            {/* Content Area */}
            {hasContestants ? (
                // Contestants Grid/List (when there are contestants)
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {contestantsData.contestants.map((contestant) => (
                            <div key={contestant.id} className="border border-gray-200 rounded-lg p-4">
                                <img
                                    src={contestant.image}
                                    alt={contestant.name}
                                    className="w-full aspect-[4/5] object-cover rounded-lg mb-4"
                                />
                                <h3 className="font-semibold text-gray-900 mb-1">{contestant.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{contestant.role}</p>
                                <p className="text-gray-500 text-xs">
                                    Added: {new Date(contestant.dateAdded).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Empty State
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center max-w-md mx-auto">
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto mb-6 text-gray-400">
                            <MdPeople className="w-full h-full" />
                        </div>

                        {/* Empty State Text */}
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                            No contestants yet
                        </h2>

                        <p className="text-gray-600 mb-8">
                            Add first contestant to get started
                        </p>

                        {/* CTA Button */}
                        <Link href='/voting/admin/contestants/create'>
                        <button
                            onClick={handleAddContestant}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium mx-auto"
                        >
                            <MdAdd className="w-5 h-5" />
                            Add contestant
                        </button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContestantsPage;