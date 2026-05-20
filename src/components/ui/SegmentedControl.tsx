import React from 'react';
import { motion } from 'motion/react';

interface Option {
  id: string;
  label: string;
}

interface Props {
  options: Option[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function SegmentedControl({ options, activeId, onChange, className = '' }: Props) {
  const activeIndex = options.findIndex(opt => opt.id === activeId);

  return (
    <div className={`relative flex bg-surface-dim p-1 rounded-full ${className}`}>
      {/* Indicator Slider */}
      <div className="absolute inset-1 z-0 pointer-events-none">
        <motion.div
          initial={false}
          animate={{
            x: `${activeIndex * 100}%`,
            width: `${100 / options.length}%`,
          }}
          transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
          className="h-full bg-surface rounded-full shadow-sm"
        />
      </div>

      {options.map((option) => {
        const isSelected = activeId === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`flex-1 relative z-10 py-2 px-3 md-label-m transition-all duration-200 ${
              isSelected ? 'text-content-primary font-semibold' : 'text-content-secondary hover:text-content-primary font-medium'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
