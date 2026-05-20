import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SegmentedControl } from './ui/SegmentedControl';
import { IconButton } from './ui/IconButton';
import { Switch } from './ui/Switch';
import { SwitchGroup } from './ui/SwitchGroup';
import { SwitchGroupContainer } from './ui/SwitchGroupContainer';
import { Button } from './ui/Button';
import { Dropdown } from './ui/Dropdown';
import { StickyFooter } from './ui/StickyFooter';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  initialFilters: any;
}

const rubricOptions = [
  'Происшествия', 'Транспорт', 'Культура', 
  'Спорт', 'Общество', 'Погода', 'Прочее'
];

const plotOptions = [
  'ДТП на МКАД', 'Веломарафон', 'Приезд Си Цзиньпиня в Москву',
  'Реновация в Кузьминках', 'Открытие БКЛ'
];

export function FilterModal({ isOpen, onClose, onApply, initialFilters }: FilterModalProps) {
  const [relevance, setRelevance] = useState(initialFilters.relevance);
  const [timeFilter, setTimeFilter] = useState(initialFilters.timeFilter);
  const [selectedRubrics, setSelectedRubrics] = useState<string[]>(initialFilters.selectedRubrics);
  const [selectedPlots, setSelectedPlots] = useState<string[]>(initialFilters.selectedPlots);

  // Sync state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setRelevance(initialFilters.relevance);
      setTimeFilter(initialFilters.timeFilter);
      setSelectedRubrics(initialFilters.selectedRubrics);
      setSelectedPlots(initialFilters.selectedPlots);
    }
  }, [isOpen, initialFilters]);

  const toggleRubric = (name: string) => {
    setSelectedRubrics(prev => 
      prev.includes(name) ? prev.filter(r => r !== name) : [...prev, name]
    );
  };

  const togglePlot = (name: string) => {
    setSelectedPlots(prev => 
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    );
  };

  const handleReset = () => {
    setRelevance('all');
    setTimeFilter('hour');
    setSelectedRubrics([]);
    setSelectedPlots([]);
  };

  const handleSave = () => {
    onApply({ ...initialFilters, relevance, timeFilter, selectedRubrics, selectedPlots });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Bottom Sheet Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring' as const, damping: 30, stiffness: 350, mass: 0.95 }}
            className="fixed bottom-0 inset-x-0 bg-surface rounded-t-[32px] z-[101] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden relative"
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-4 touch-none shrink-0">
              <div className="w-12 h-1.5 bg-border-strong rounded-full" />
            </div>

            <div className="px-6 pb-36 overflow-y-auto no-scrollbar flex-1">
              <div className="space-y-6 pt-1">
                {/* Relevance Section */}
                <section>
                  <label className="md-label-m text-content-secondary mb-3 block">Актуальность</label>
                  <Dropdown 
                    options={[
                      { id: 'all', label: 'Все события' },
                      { id: 'actual', label: 'Актуальные' },
                      { id: 'finished', label: 'Завершенные' }
                    ]}
                    activeId={relevance}
                    onChange={setRelevance}
                  />
                </section>

                {/* Time Section */}
                <section>
                  <label className="md-label-m text-content-secondary mb-3 block">Время</label>
                  <SegmentedControl 
                    options={[
                      { id: 'hour', label: 'ТОП за час' },
                      { id: 'day', label: 'ТОП за сегодня' }
                    ]}
                    activeId={timeFilter}
                    onChange={setTimeFilter}
                  />
                </section>

                {/* Rubrics Section Container */}
                <SwitchGroupContainer title="Рубрики">
                  <SwitchGroup 
                    options={rubricOptions}
                    selected={selectedRubrics}
                    onToggle={toggleRubric}
                  />
                </SwitchGroupContainer>

                {/* Plots Section Container */}
                <SwitchGroupContainer title="Сюжеты">
                  <SwitchGroup 
                    options={plotOptions}
                    selected={selectedPlots}
                    onToggle={togglePlot}
                  />
                </SwitchGroupContainer>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <StickyFooter className="absolute bottom-0 inset-x-0 pb-safe">
              <Button 
                variant="primary"
                fullWidth
                size="md"
                onClick={handleSave}
              >
                Применить
              </Button>
              
              <Button 
                variant="ghost"
                size="md"
                onClick={handleReset}
              >
                Сбросить
              </Button>
            </StickyFooter>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
