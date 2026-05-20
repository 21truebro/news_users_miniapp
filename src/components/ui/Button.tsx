import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface Props extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  disabled = false,
  ...props 
}: Props) {
  const baseClasses = "relative overflow-hidden font-medium transition-all flex items-center justify-center active:scale-[0.98] active:brightness-95";
  
  const variants = {
    primary: disabled ? "bg-secondary text-content-tertiary" : "bg-content-accent text-white shadow-lg border border-white/10",
    secondary: disabled ? "bg-secondary text-content-tertiary" : "bg-surface-dim text-content-primary hover:bg-surface-hover border border-border",
    ghost: "bg-transparent text-content-accent hover:bg-surface-dim",
    text: "bg-transparent text-content-secondary hover:text-content-primary",
  };

  const sizes = {
    sm: "h-9 px-4 rounded-xl md-body-m",
    md: "h-12 px-6 rounded-[16px] md-body-m",
    lg: "h-14 px-8 rounded-[20px] md-body-l",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} ${disabled ? 'cursor-not-allowed' : ''}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
