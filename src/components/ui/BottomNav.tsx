import React from 'react';
import { Icon } from './Icon';

interface BottomNavProps {
  currentView: 'feed' | 'map' | 'favorites' | 'settings';
  onChange: (view: 'feed' | 'map' | 'favorites' | 'settings') => void;
}

export function BottomNav({ currentView, onChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-[40px] inset-x-0 z-40 flex justify-center pointer-events-none">
      <div className="bg-surface/75 backdrop-blur-[12px] rounded-full p-2 flex items-center gap-2 shadow-[0_12px_40px_rgba(17,24,39,0.08)] border border-border/60 pointer-events-auto">
        <NavButton 
          icon="view_day" 
          isActive={currentView === 'feed'} 
          onClick={() => onChange('feed')} 
        />
        <div className="w-px h-6 bg-border/60" />
        <NavButton 
          icon="map" 
          isActive={currentView === 'map'} 
          onClick={() => onChange('map')} 
        />
        <div className="w-px h-6 bg-border/60" />
        <NavButton 
          icon="bookmark" 
          isActive={currentView === 'favorites'} 
          onClick={() => onChange('favorites')} 
        />
        <div className="w-px h-6 bg-border/60" />
        <NavButton 
          icon="settings" 
          isActive={currentView === 'settings'} 
          onClick={() => onChange('settings')} 
        />
      </div>
    </div>
  );
}

function NavButton({ icon, isActive, onClick }: { icon: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-95 ${
        isActive 
          ? 'bg-content-accent text-white shadow-md' 
          : 'text-content-secondary hover:bg-surface-hover hover:text-content-primary'
      }`}
    >
      <Icon name={icon} size={24} filled={isActive} />
    </button>
  );
}
