// components/ui/Button.tsx
import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-stone-900 text-white hover:bg-stone-700',
  secondary: 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400',
  ghost:     'text-stone-500 hover:text-stone-900 hover:bg-stone-100',
  danger:    'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
}

const sizeClasses: Record<Size, string> = {
  sm:  'px-3 py-1.5 text-xs rounded-lg',
  md:  'px-4 py-2.5 text-sm rounded-lg',
  lg:  'px-6 py-3 text-sm rounded-xl',
}

const Button = forwardRef<HTMLButtonElement, Props>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-medium transition-colors
        disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  )
})

Button.displayName = 'Button'
export default Button
