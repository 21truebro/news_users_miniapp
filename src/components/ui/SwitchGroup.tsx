import React from 'react';
import { Switch } from './Switch';

interface SwitchGroupProps {
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
}

export function SwitchGroup({ options, selected, onToggle }: SwitchGroupProps) {
  return (
    <div className="flex flex-col">
      {options.map((option, idx) => {
        const isSelected = selected.includes(option);
        return (
          <React.Fragment key={option}>
            <div 
              onClick={() => onToggle(option)}
              className="flex items-center justify-between py-3.5 cursor-pointer active:opacity-60 transition-opacity"
            >
              <span className={`md-body-m transition-colors ${isSelected ? 'text-content-primary font-medium' : 'text-content-secondary'}`}>
                {option}
              </span>
              <div className="">
                <Switch 
                  checked={isSelected} 
                  onChange={() => onToggle(option)} 
                />
              </div>
            </div>
            {idx < options.length - 1 && <div className="h-px bg-border" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
