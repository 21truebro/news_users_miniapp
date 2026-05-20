import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './ui/Icon';
import { Switch } from './ui/Switch';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { SwitchGroupContainer } from './ui/SwitchGroupContainer';
import { districts } from '../districtsData';

import { UserLocation } from '../types';

interface AddLocationModalProps {
  onClose: () => void;
  onApply: (data: { id?: string; name: string; address: string; districts: string[] }) => void;
  initialLocation?: UserLocation;
}

const MOCK_ADDRESSES = [
  { address: 'Пресненская наб., 12', district: 'CAO' },
  { address: 'ул. Тверская, 1', district: 'CAO' },
  { address: 'Кутузовский пр-т, 12', district: 'ZAO' },
  { address: 'Ленинский пр-т, 30', district: 'UZAO' },
];

export function AddLocationModal({ onClose, onApply, initialLocation }: AddLocationModalProps) {
  const [name, setName] = useState(initialLocation?.name || '');
  const [address, setAddress] = useState(initialLocation?.address || '');
  const [suggestions, setSuggestions] = useState<typeof MOCK_ADDRESSES>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(
    initialLocation ? initialLocation.districtCode.split(', ') : []
  );
  const [touched, setTouched] = useState(false);

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length > 2) {
      const filtered = MOCK_ADDRESSES.filter(a => a.address.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
      setSelectedDistricts([]);
    }
  };

  const selectAddress = (suggestion: typeof MOCK_ADDRESSES[0]) => {
    setAddress(suggestion.address);
    setSelectedDistricts([suggestion.district]);
    setSuggestions([]);
  };

  const toggleDistrict = (code: string) => {
    setSelectedDistricts(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const isFormValid = name.trim() !== '' && selectedDistricts.length > 0;

  const handleSave = () => {
    setTouched(true);
    if (isFormValid) {
      onApply({ id: initialLocation?.id, name, address, districts: selectedDistricts });
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col justify-end md:justify-center items-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.9 }}
        className="relative w-full max-w-sm bg-surface rounded-t-[32px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Drag Handle for mobile */}
        <div className="w-full flex justify-center pt-3 pb-2 touch-none shrink-0 md:hidden">
          <div className="w-12 h-1.5 bg-border-strong rounded-full" />
        </div>

        {/* Scrollable Content Area */}
        <div className="px-6 pb-24 overflow-y-auto no-scrollbar flex-1">
          <div className="flex flex-col gap-6 pt-5">
            {/* Header Block */}
            <div className="shrink-0">
              <h2 className="md-title-l text-content-primary mb-1">Настройка локации</h2>
              <p className="md-body-m text-content-secondary">Настройте параметры для получения актуальных новостей</p>
            </div>

            <Input 
              label="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Введите название"
              error={touched && name.trim() === '' ? 'Название обязательно' : undefined}
            />

            <div className="relative">
              <Input
                label="Адрес"
                value={address}
                onChange={(e) => handleAddressChange(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Введите адрес"
                rightIcon={
                  <button 
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            // In a real app, you would use a reverse geocoding API here
                            setAddress('ул. Тверская, 1');
                          },
                          (error) => {
                            console.error("Error getting location:", error);
                            alert("Не удалось определить местоположение");
                          }
                        );
                      } else {
                        alert("Геолокация не поддерживается вашим браузером");
                      }
                    }}
                    className="flex items-center justify-center text-content-accent hover:text-content-accent/80 transition-colors"
                  >
                    <Icon name="my_location" size={20} />
                  </button>
                }
              />
              
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-lg z-20 py-2 max-h-48 overflow-y-auto">
                  {suggestions.map(s => (
                    <button key={s.address} onClick={() => selectAddress(s)} className="w-full px-4 py-3 text-left hover:bg-secondary md-body-m flex items-center justify-between">
                      {s.address}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <SwitchGroupContainer title="Округа Москвы">
              <div className="flex flex-col">
                {Object.entries(districts).map(([code, info], idx) => {
                  const isSelected = selectedDistricts.includes(code);
                  return (
                    <React.Fragment key={code}>
                      <div 
                        className="flex items-center justify-between py-3.5 cursor-pointer active:opacity-60 transition-opacity"
                        onClick={() => toggleDistrict(code)}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: info.color}} />
                          <span className={`md-body-m transition-colors ${isSelected ? 'text-content-primary font-medium' : 'text-content-secondary'}`}>
                            {info.name} ({info.code})
                          </span>
                        </div>
                        <Switch 
                          checked={isSelected}
                          onChange={() => toggleDistrict(code)}
                        />
                      </div>
                      {idx < Object.entries(districts).length - 1 && <div className="h-px bg-border" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </SwitchGroupContainer>
          </div>
        </div>

        {/* Action Footer with elegant frosted glass background */}
        <div className="absolute bottom-0 inset-x-0 bg-white/20 backdrop-blur-[20px] border-t border-white/20 p-4 rounded-t-[24px] shadow-[0_-8px_32px_rgba(17,24,39,0.06)] z-10 shrink-0">
          <Button 
            onClick={handleSave}
            variant="primary"
            size="lg"
            fullWidth
            disabled={!isFormValid}
          >
            Сохранить
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
