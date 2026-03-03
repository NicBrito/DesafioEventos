import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'flex h-[44px] w-full rounded-apple border border-black/10 bg-white px-4 py-2 text-sm text-black',
          'placeholder:text-apple-gray focus:outline-none focus:ring-2 focus:ring-apple-blue/50 focus:border-apple-blue',
          'transition-all duration-200',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';