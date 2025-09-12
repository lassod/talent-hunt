

import React, { useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  description?: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export default function Toast({ message, description, type, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true)

    const timer = setTimeout(() => {
      handleClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Wait for exit animation
  }

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          styles: 'border-green-200 bg-gradient-to-r from-green-50 to-green-100 text-green-800 shadow-green-100/50',
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          iconBg: 'bg-green-200/30'
        }
      case 'error':
        return {
          styles: 'border-red-200 bg-gradient-to-r from-red-50 to-red-100 text-red-800 shadow-red-100/50',
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          iconBg: 'bg-red-200/30'
        }
      case 'info':
        return {
          styles: 'border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 shadow-blue-100/50',
          icon: <Info className="h-5 w-5 text-blue-600" />,
          iconBg: 'bg-blue-200/30'
        }
      default:
        return {
          styles: 'border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 shadow-gray-100/50',
          icon: <Info className="h-5 w-5 text-gray-600" />,
          iconBg: 'bg-gray-200/30'
        }
    }
  }

  const config = getToastConfig()

  return (
    <div
      className={`
        toast-container 
        ${isVisible ? 'animate-slide-in opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        transition-all duration-300 ease-out
        flex items-center gap-3 rounded-xl border border-opacity-50 
        px-4 py-3 shadow-lg backdrop-blur-sm
        ${config.styles}
        min-w-80 max-w-md
      `}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 rounded-full p-1 ${config.iconBg}`}>
        {config.icon}
      </div>

      {/* Message */}
      <div className="flex justify-center flex-col gap-1">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>

        {/* Description */}
        <div className="flex-1 min-w-0">
          <p className="text-xs  leading-tight">{description}</p>
        </div>
      </div>


      {/* Close Button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-full p-1 hover:bg-black/5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current"
        aria-label="Close notification"
      >
        <X className="h-4 w-4 text-current opacity-70 hover:opacity-100 transition-opacity" />
      </button>
    </div>
  )
}
