'use client';

import React from 'react';

// Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'new' | 'rising' | 'premiere' | 'award' | 'rated' | 'neutral' | 'featured' | 'award-winner';
}

export function Badge({ variant = 'neutral', className, ...props }: BadgeProps) {
  const variants = {
    new: 'bg-[#6366F120] text-[#818CF8]',
    rising: 'bg-[#22C55E20] text-[#4ADE80]',
    premiere: 'bg-[#F5C51820] text-[#FDE047]',
    award: 'bg-[#F5C51820] text-[#FDE047]',
    rated: 'bg-[#EF444420] text-[#F87171]',
    neutral: 'bg-[#1E1E30] text-[#8888A8]',
    featured: 'bg-[#6366F1] text-white',
    'award-winner': 'bg-[#F5C518] text-[#080810]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-500 tracking-wide ${variants[variant]} ${className || ''}`}
      {...props}
    />
  );
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    const variants = {
      primary: 'bg-accent-indigo text-white hover:bg-accent-indigo-dark active:scale-95 shadow-accent-indigo',
      secondary: 'bg-white/8 text-white border border-white/15 hover:bg-white/12 backdrop-blur-md',
      ghost: 'text-text-secondary hover:text-white border border-border-primary',
      gold: 'bg-accent-gold text-background hover:bg-accent-gold/90 font-700',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-[11px]',
      md: 'px-4 py-2 text-[12px]',
      lg: 'px-6 py-3 text-[13px]',
      icon: 'h-10 w-10 flex-shrink-0',
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded font-500 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className || ''}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className, ...props }, ref) => (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-[11px] font-600 uppercase tracking-wide text-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`bg-background-surface border rounded-lg px-3.5 py-2.5 text-white placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-indigo focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
          error ? 'border-accent-red' : 'border-border-primary hover:border-border-secondary'
        } ${className || ''}`}
        {...props}
      />
    </div>
  )
);
Input.displayName = 'Input';

// OTP Input Component
export interface OTPInputProps {
  value: string[];
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  refs?: React.MutableRefObject<(HTMLInputElement | null)[]>;
  error?: boolean;
}

export function OTPInput({ value, onChange, onKeyDown, refs, error }: OTPInputProps) {
  return (
    <div className="flex gap-2 justify-center">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            if (refs && el) refs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          className={`w-12 h-16 text-center text-2xl font-700 bg-background-surface border-2 rounded-lg text-white placeholder:text-text-tertiary focus:outline-none focus:ring-0 transition-all duration-200 ${
            error ? 'border-accent-red' : digit ? 'border-accent-indigo' : 'border-border-primary hover:border-border-secondary'
          }`}
        />
      ))}
    </div>
  );
}

// Card Component
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, ...props }, ref) => (
    <div
      ref={ref}
      className={`rounded-xl backdrop-blur-md transition-all duration-300 ${
        variant === 'elevated'
          ? 'bg-background-card/80 border border-border-primary shadow-card'
          : variant === 'outlined'
            ? 'bg-transparent border border-border-primary'
            : 'bg-background-card/50 border border-border-primary/50'
      } ${className || ''}`}
      {...props}
    />
  )
);
Card.displayName = 'Card';
