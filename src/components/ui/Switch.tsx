import React from 'react';
import { motion } from 'motion/react';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked, onChange, disabled }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none items-center ${
        checked ? 'bg-content-accent' : 'bg-border-strong'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <motion.span
        initial={false}
        animate={{ 
          x: checked ? 20 : 0,
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 400, 
          damping: 35,
          mass: 0.8
        }}
        className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0"
      />
    </button>
  );
}
