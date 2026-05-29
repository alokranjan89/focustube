import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2'
  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-focus to-blue-500 text-white shadow-lg shadow-slate-950/20 hover:brightness-105',
    secondary: 'bg-slate-800 text-slate-100 hover:bg-slate-700',
    ghost: 'bg-transparent text-slate-200 hover:bg-slate-800'
  }

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />
}
