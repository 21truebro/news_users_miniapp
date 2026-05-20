import React from 'react';
import { Icon } from './Icon';
import { motion } from 'motion/react';

interface Props extends React.ComponentProps<typeof motion.button> {
  icon: string;
  filled?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'flat';
}

export function IconButton({ icon, filled, className = '', variant = 'default', ...props }: Props) {
  const baseClasses = "shrink-0 rounded-full flex items-center justify-center transition-all duration-200 relative overflow-hidden active:opacity-70";
  
  let variantClasses = "";
  
  switch (variant) {
    case 'primary':
      variantClasses = "bg-content-accent text-white";
      break;
    case 'secondary':
      variantClasses = "bg-surface text-content-primary shadow-sm border border-border";
      break;
    case 'ghost':
      variantClasses = "bg-white/10 text-white backdrop-blur-md";
      break;
    case 'flat':
      variantClasses = "bg-transparent text-content-secondary hover:text-content-primary hover:bg-surface-hover";
      break;
    case 'default':
    default:
      variantClasses = "bg-surface-dim text-content-primary hover:bg-border";
      break;
  }

  const sizeClasses = className.includes('w-') ? '' : 'w-11 h-11';

  return (
    <motion.button 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} 
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      <motion.div
        variants={{
          hover: { scale: 1.12, rotate: 2 },
          tap: { scale: 0.88, rotate: -2 }
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="flex items-center justify-center w-full h-full relative z-10"
      >
        <Icon name={icon} size={24} filled={filled} />
      </motion.div>
    </motion.button>
  );
}
