import React from 'react';
import { districts } from '../../districtsData';

interface Props {
  districtCode: string;
  className?: string;
}

export function DistrictLabel({ districtCode, className = '' }: Props) {
  // Try direct key lookup first (e.g. 'CAO'), then search by code property (e.g. 'ЦАО')
  let district = districts[districtCode];
  if (!district) {
    district = Object.values(districts).find(d => d.code === districtCode) || null;
  }

  if (!district) return null;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div 
        className="w-2.5 h-2.5 rounded-full" 
        style={{ backgroundColor: district.color }}
      />
      <span className="md-label-s">
        {district.code}
      </span>
    </div>
  );
}
