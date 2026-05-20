import React from 'react';
import { Icon } from './Icon';

export interface ListViewItem {
  id: string;
  title: string;
  icon?: string;
  rightElement?: React.ReactNode;
  onClick?: () => void;
  description?: string;
}

interface ListViewProps {
  items: ListViewItem[];
  className?: string;
}

export function ListView({ items, className = '' }: ListViewProps) {
  return (
    <div className={`flex flex-col bg-surface border border-border rounded-[24px] overflow-hidden ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <div
            onClick={item.onClick}
            className={`
              flex items-center justify-between p-5 transition-all duration-200
              ${item.onClick ? 'cursor-pointer hover:bg-surface-hover active:bg-surface-dim' : ''}
            `}
          >
            <div className="flex items-center gap-4 min-w-0">
              {item.icon && (
                <div className="flex items-center justify-center text-content-secondary shrink-0">
                  <Icon name={item.icon} size={24} />
                </div>
              )}
              <div className="min-w-0">
                <span className="md-title-m text-content-primary font-medium block truncate">
                  {item.title}
                </span>
                {item.description && (
                  <span className="md-body-s text-content-tertiary block mt-0.5">
                    {item.description}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center shrink-0 ml-4">
              {item.rightElement !== undefined ? (
                item.rightElement
              ) : (
                item.onClick && <Icon name="chevron_right" size={20} className="text-content-tertiary" />
              )}
            </div>
          </div>
          {index < items.length - 1 && <div className="h-px bg-border/60 mx-5" />}
        </React.Fragment>
      ))}
    </div>
  );
}
