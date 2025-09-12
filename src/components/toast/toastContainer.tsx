import React, { useState, useImperativeHandle, forwardRef } from 'react'
import Toast from './toast'

interface ToastData {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const ToastContainer = forwardRef((_, ref) => {
  const [toasts, setToasts] = useState<ToastData[]>([])

  // Allow external access to `addToast` method
  useImperativeHandle(ref, () => ({
    addToast(message: string, type: 'success' | 'error' | 'info') {
      const id = Math.random().toString(36).substring(7)
      const newToast = { id, message, type }
      setToasts((prev) => [...prev, newToast])

      // Automatically remove toast after 3 seconds
      setTimeout(() => removeToast(id), 3000)
    },
  }))

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed left-1/2 top-5 z-50 flex -translate-x-1/2 transform flex-col gap-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  )
})

// Add a display name for the forwardRef component
ToastContainer.displayName = 'ToastContainer'

export default ToastContainer
