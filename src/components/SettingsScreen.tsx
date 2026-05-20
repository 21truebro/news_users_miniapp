import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Icon } from './ui/Icon';
import { UserLocation } from '../types';
import { DistrictLabel } from './ui/DistrictLabel';
import { AddLocationModal } from './AddLocationModal';
import { ListView } from './ui/ListView';
import { Switch } from './ui/Switch';
import { SupportModal } from './SupportModal';
import { TermsModal } from './TermsModal';

export default function SettingsScreen({ onOpenFilters }: { onOpenFilters: () => void }) {
  const [locations, setLocations] = useState<UserLocation[]>([
    { id: '1', name: 'ДОМ', address: 'ул. Тверская, 1', districtCode: 'ЦАО' },
    { id: '2', name: 'РАБОТА', address: 'Кутузовский пр-т, 12', districtCode: 'ЗАО' },
  ]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [editingLocation, setEditingLocation] = useState<UserLocation | null>(null);

  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleDelete = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    setDeletingId(null);
  };

  const handleAddLocation = (data: { id?: string; name: string; address: string; districts: string[] }) => {
    if (data.id) {
       setLocations(prev => prev.map(l => l.id === data.id ? {
         ...l,
         name: data.name,
         address: data.address,
         districtCode: data.districts.join(', ')
       } : l));
    } else {
      const newLocation: UserLocation = {
        id: Date.now().toString(),
        name: data.name,
        address: data.address,
        districtCode: data.districts.join(', ')
      };
      setLocations(prev => [...prev, newLocation]);
    }
    setIsAddingLocation(false);
    setEditingLocation(null);
  };

  return (
    <div className="w-full h-full bg-app-bg pt-safe pb-24 overflow-y-auto">
      <div className="px-5 pt-8">
        <h2 className="md-label-s text-content-tertiary uppercase tracking-wider mb-4 px-1">Настройки</h2>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onOpenFilters}
            className="flex items-center justify-between w-full p-5 bg-surface border border-border rounded-[24px] text-content-primary hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <Icon name="tune" size={24} className="text-content-secondary" />
              <span className="md-title-m">Фильтр ленты</span>
            </div>
            <Icon name="chevron_right" size={20} className="text-content-tertiary" />
          </button>
        </div>
      </div>

      <div className="px-5 pt-8">
        <h2 className="md-label-s text-content-tertiary uppercase tracking-wider mb-4 px-1">Мои локации</h2>
        
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {locations.map(location => (
              <LocationItem 
                key={location.id} 
                location={location} 
                onDeleteRequest={() => setDeletingId(location.id)} 
                  onEditRequest={() => setEditingLocation(location)}
              />
            ))}
          </AnimatePresence>

          <button 
            onClick={() => setIsAddingLocation(true)}
            className="flex items-center justify-center gap-2 w-full py-4 mt-2 rounded-2xl border-2 border-dashed border-border text-content-secondary hover:bg-surface/50 transition-colors active:scale-[0.98]"
          >
            <Icon name="add_location" size={20} />
            <span className="md-title-m">Добавить новую локацию</span>
          </button>
        </div>
      </div>

      <div className="px-5 pt-8">
        <h2 className="md-label-s text-content-tertiary uppercase tracking-wider mb-4 px-1">Приложение</h2>
        <ListView 
          items={[
            {
              id: 'dark-theme',
              title: 'Тёмная тема',
              icon: 'dark_mode',
              rightElement: (
                <Switch 
                  checked={isDark} 
                  onChange={(checked) => setIsDark(checked)} 
                />
              )
            },
            {
              id: 'support',
              title: 'Поддержка',
              icon: 'help',
              onClick: () => setIsSupportOpen(true),
            },
            {
              id: 'terms',
              title: 'Условия использования',
              icon: 'description',
              onClick: () => setIsTermsOpen(true),
            }
          ]}
        />
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-surface rounded-[32px] p-8 shadow-2xl"
            >
              <h3 className="md-title-l text-content-primary mb-3 text-center">Удалить локацию?</h3>
              <p className="md-body-m text-content-secondary mb-8 text-center">
                Вы уверены, что хотите удалить эту локацию из списка отслеживаемых?
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDelete(deletingId)}
                  className="w-full py-4 rounded-2xl bg-[#FF3B30] text-white md-title-m active:scale-[0.98] transition-all hover:bg-[#FF453A]"
                >
                  Да, удалить
                </button>
                <button 
                  onClick={() => setDeletingId(null)}
                  className="w-full py-4 rounded-2xl bg-secondary text-content-primary md-title-m active:scale-[0.98] transition-transform"
                >
                  Отмена
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isAddingLocation || editingLocation) && (
          <AddLocationModal 
            onClose={() => {
              setIsAddingLocation(false);
              setEditingLocation(null);
            }} 
            onApply={handleAddLocation}
            initialLocation={editingLocation || undefined}
          />
        )}
      </AnimatePresence>

      <SupportModal 
        isOpen={isSupportOpen} 
        onClose={() => setIsSupportOpen(false)} 
      />

      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
      />
    </div>
  );
}

function LocationItem({ location, onDeleteRequest, onEditRequest }: { location: UserLocation; onDeleteRequest: () => void; onEditRequest: () => void }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative overflow-hidden"
    >
      {/* Background Delete Action Area */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 bg-[#FF3B30] flex items-center justify-end px-6 rounded-3xl"
        onClick={onDeleteRequest}
      >
        <div className="flex flex-col items-center gap-1 text-white">
          <Icon name="delete" size={24} />
          <span className="md-label-s font-semibold">Удалить</span>
        </div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        style={{ x }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) {
            onDeleteRequest();
          }
          // Reset position
          x.set(0);
        }}
        onClick={onEditRequest}
        className="relative z-10 bg-surface rounded-[24px] p-5 border border-border flex flex-col gap-2 cursor-pointer active:cursor-grabbing transition-shadow hover:shadow-md"
      >
        <div className="flex items-center justify-between">
          <h3 className="md-title-m text-content-primary font-bold uppercase tracking-tight truncate min-w-0">{location.name}</h3>
        </div>
        <p className="md-body-m text-content-tertiary">{location.address}</p>

        {location.districtCode && (
          <div className="flex flex-wrap gap-2">
            {location.districtCode.split(', ').map(code => (
              <div key={code} className="bg-secondary/60 border border-border/50 rounded-full px-2.5 py-1">
                <DistrictLabel districtCode={code} />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
