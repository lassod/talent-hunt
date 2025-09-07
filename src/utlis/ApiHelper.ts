export class ApiHelper {
    public static getApiUrl(): string {
        return process.env.NEXT_PUBLIC_BACKEND_URL!;
    }
}