'use client'
import { useRef } from 'react'
import ToastContainer from "@/components/toast/toastContainer";

// Define the interface for the ToastContainer methods
interface ToastContainerRef {
  addToast: (message: string, type: 'success' | 'error' | 'info') => void
}

export function useToast() {
  const toastContainerRef = useRef<ToastContainerRef>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    if (toastContainerRef.current) {
      toastContainerRef.current.addToast(message, type)
    }
  }

  return {
    ToastContainerComponent: <ToastContainer ref={toastContainerRef} />,
    showToast,
  }
}
