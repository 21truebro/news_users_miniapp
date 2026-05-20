import React from 'react';

interface SwitchGroupContainerProps {
  title: string;
  children: React.ReactNode;
}

export function SwitchGroupContainer({ title, children }: SwitchGroupContainerProps) {
  return (
    <section className="w-full">
      <label className="md-label-m text-content-secondary mb-3 block">
        {title}
      </label>
      <div className="bg-surface-dim/55 border border-border/40 rounded-[24px] px-5 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        {children}
      </div>
    </section>
  );
}
