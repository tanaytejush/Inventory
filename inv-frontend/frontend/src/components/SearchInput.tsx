import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../lib/ui'
import { Search, X } from 'lucide-react'

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="search"
          className={cn(
            'block w-full pl-12 pr-12 py-3 h-12 border border-black rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-black font-medium transition-all duration-200',
            className
          )}
          placeholder="Search..."
          value={value}
          ref={ref}
          {...props}
        />
        {value && onClear && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <button
              type="button"
              onClick={onClear}
              className="h-6 w-6 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    )
  }
)