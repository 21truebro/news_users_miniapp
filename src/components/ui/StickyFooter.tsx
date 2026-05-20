import React from 'react';

interface StickyFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function StickyFooter({ children, className = '' }: StickyFooterProps) {
  return (
    <div 
      className={`
        mt-auto shrink-0 w-full px-4 py-4 pb-4 
        bg-white/[0.05] backdrop-blur-[24px] 
        border-t border-white/[0.08] 
        rounded-t-[24px]
        shadow-[0_-8px_32px_rgba(17,24,39,0.06)] 
        flex flex-col items-center gap-2 
        z-20
        ${className}
      `}
    >
      {children}
    </div>
  );
}
