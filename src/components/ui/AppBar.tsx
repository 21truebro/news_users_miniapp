import React from 'react';
import { IconButton } from './IconButton';


interface Props {
  title: string;
  onFilter?: () => void;
}

export function AppBar({ title, onFilter }: Props) {
  return (
    <div className="flex flex-col gap-4 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="md-title-l text-content-primary leading-tight">{title}</h1>
        <IconButton icon="tune" variant="flat" onClick={onFilter} />
      </div>
    </div>
  );
}
