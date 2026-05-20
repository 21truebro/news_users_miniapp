import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './Icon';

interface Option {
  id: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  placeholder?: string;
}

export function Dropdown({ options, activeId, onChange, className = '', placeholder = 'Выбрать...' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeOption = options.find((opt) => opt.id === activeId);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 flex items-center justify-between bg-surface-dim hover:bg-surface-hover active:scale-[0.99] px-5 rounded-full transition-all duration-200 text-left cursor-pointer group"
      >
        <span className={`md-label-m ${activeOption ? 'text-content-primary font-medium' : 'text-content-tertiary'}`}>
          {activeOption ? activeOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="text-content-tertiary group-hover:text-content-secondary transition-colors flex items-center justify-center"
        >
          <Icon name="expand_more" size={20} />
        </motion.div>
      </button>

      {/* Backdrop for click outside */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-[140]"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Options List */}
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-0 right-0 mt-2 bg-surface border border-border rounded-[20px] shadow-xl overflow-hidden z-[141] py-1.5"
            >
              <div className="max-h-[220px] overflow-y-auto no-scrollbar">
                {options.map((option) => {
                  const isSelected = option.id === activeId;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleSelect(option.id)}
                      className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-surface-dim transition-colors cursor-pointer text-left group/item"
                    >
                      <span
                        className={`md-label-m transition-colors ${
                          isSelected
                            ? 'text-content-accent font-semibold'
                            : 'text-content-secondary group-hover/item:text-content-primary'
                        }`}
                      >
                        {option.label}
                      </span>
                      {isSelected && (
                        <span className="text-content-accent shrink-0">
                          <Icon name="check" size={18} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
