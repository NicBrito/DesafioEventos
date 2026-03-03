import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'bg-apple-blue text-white shadow-sm hover:opacity-90',
      secondary: 'bg-apple-bg text-apple-blue hover:bg-[#E5E5EA]',
      ghost: 'bg-transparent text-apple-blue hover:bg-apple-bg',
      danger: 'bg-apple-error text-white hover:opacity-90',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'h-[44px] px-6 rounded-apple font-semibold text-sm transition-all',
          'active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';