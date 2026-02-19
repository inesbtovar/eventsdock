// components/ui/Input.tsx
import { forwardRef } from 'react'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  hint?: string
}

const Input = forwardRef<HTMLInputElement, Props>(({
  label,
  error,
  hint,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-stone-700 mb-1.5">
          {label}
          {props.required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full border rounded-lg px-4 py-2.5 text-sm bg-white
          focus:outline-none focus:ring-1 transition-colors
          ${error
            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
            : 'border-stone-200 focus:border-stone-500 focus:ring-stone-100'
          }
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-stone-400">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
