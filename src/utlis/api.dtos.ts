export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface ApiPaginatedResponse<T = any> {
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

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}