import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-2xl shadow-sm',
        hover && 'hover:shadow-md hover:border-primary/20 transition-all duration-200',
        paddingStyles[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}