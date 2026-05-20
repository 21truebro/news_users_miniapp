import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
  filled?: boolean;
}

export function Icon({ name, size = 24, filled = false, className = '', style, ...props }: IconProps) {
  return (
    <span 
      className={`material-symbols-outlined select-none inline-flex items-center justify-center ${className}`} 
      style={{ 
        fontSize: size, 
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 300`,
        width: size,
        height: size,
        ...style
      }} 
      {...props}
    >
      {name}
    </span>
  );
}
