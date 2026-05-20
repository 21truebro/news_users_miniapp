import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export function Input({ label, error, leftIcon, rightIcon, className = '', containerClassName = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="md-label-s text-content-tertiary ml-1">
          {label}
        </label>
      )}
      <div 
        className={`
          flex items-center w-full bg-secondary rounded-full border transition-all duration-200
          ${error ? 'border-red-500' : 'border-border focus-within:border-content-accent'}
          ${className}
        `}
      >
        {leftIcon && (
          <div className="pl-5 text-content-tertiary flex items-center">
            {leftIcon}
          </div>
        )}
        <input 
          className={`w-full bg-transparent py-3.5 md-body-m text-content-primary placeholder:text-content-tertiary focus:outline-none ${leftIcon ? 'pl-3' : 'pl-6'} ${rightIcon ? 'pr-3' : 'pr-6'}`}
          {...props}
        />
        {rightIcon && (
          <div className="pr-5 text-content-accent flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 ml-1">
          {error}
        </p>
      )}
    </div>
  );
}
