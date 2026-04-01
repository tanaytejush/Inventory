import { ReactNode, useEffect } from 'react'
import { cn } from '../lib/ui'
import { Button } from './Button'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-60" onClick={onClose} />
      <div className={cn('relative bg-white border border-black rounded-2xl shadow-card max-w-md w-full mx-4 max-h-[90vh] overflow-auto', className)}>
        {title && (
          <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <h2 className="text-xl font-bold tracking-tight text-black">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2 h-auto">
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

interface DialogActionsProps {
  children: ReactNode
  className?: string
}

export function DialogActions({ children, className }: DialogActionsProps) {
  return (
    <div className={cn('flex gap-3 justify-end pt-6 border-t border-gray-200 mt-6', className)}>
      {children}
    </div>
  )
}