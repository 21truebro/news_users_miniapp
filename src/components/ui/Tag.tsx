import React from 'react';
import { Icon } from './Icon';

interface Props {
  label: string;
  icon?: string;
  className?: string;
  variant?: 'default' | 'on-image';
}

export function Tag({ label, icon, className = '', variant = 'default' }: Props) {
  const isImageVariant = variant === 'on-image';
  const baseClasses = "flex items-center gap-1.5 px-2 py-1 rounded-pill md-label-s tracking-wide";
  const colorClasses = isImageVariant 
    ? "bg-black/40 backdrop-blur-md text-white border border-white/20" 
    : "bg-surface border border-border-strong text-content-secondary";
  const iconColor = isImageVariant ? "text-white/60" : "text-content-tertiary";

  return (
    <span className={`${baseClasses} ${colorClasses} ${className}`}>
      {icon && <Icon name={icon} size={14} className={iconColor} />}
      {label}
    </span>
  );
}
