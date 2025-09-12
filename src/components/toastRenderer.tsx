"use client";
import { useToast } from "@/hooks/toastHooks";

export default function ToastRenderer() {
    const { ToastContainerComponent } = useToast();
    return ToastContainerComponent; // ← the actual container
}