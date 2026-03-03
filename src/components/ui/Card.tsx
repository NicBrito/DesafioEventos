import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'rounded-apple-lg border border-black/[0.05] bg-apple-card p-6 shadow-apple-lift',
        className
      )}
      {...props}
    />
  );
};