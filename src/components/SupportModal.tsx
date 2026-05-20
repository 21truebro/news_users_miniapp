import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Icon } from './ui/Icon';
import { Button } from './ui/Button';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Как добавить локацию?',
    answer: 'Вы можете нажать кнопку «Добавить новую локацию» в меню настроек, указать удобное название и отметить интересующие округа Москвы.',
  },
  {
    question: 'Как работают фильтры ленты?',
    answer: 'В разделе «Настройки» перейдите в «Фильтр ленты», где вы сможете настроить рубрики новостей (Спорт, Происшествия и др.) или выбрать интересные вам сюжеты.',
  },
  {
    question: 'Как часто обновляется лента?',
    answer: 'Наша новостная лента анализирует информацию в реальном времени. В среднем крупные обновления событий происходят каждые 15-20 минут.',
  },
  {
    question: 'Что делать, если возникла ошибка?',
    answer: 'Если приложение работает некорректно, попробуйте перезагрузить его. При сохранении проблемы свяжитесь с нашей технической поддержкой.',
  },
];

export function SupportModal({ isOpen, onClose }: SupportModalProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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

          {/* Bottom Sheet Drawer style */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.95 }}
            className="fixed bottom-0 inset-x-0 bg-surface rounded-t-[32px] z-[101] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Handle */}
            <div className="w-full flex justify-center pt-3 pb-2 touch-none shrink-0">
              <div className="w-12 h-1.5 bg-border-strong rounded-full" />
            </div>

            {/* Scrollable Content */}
            <div className="px-6 pb-24 overflow-y-auto no-scrollbar flex-1">
              <div className="space-y-6 pt-2">
                <div>
                  <h2 className="md-title-l text-content-primary mb-1">Поддержка и помощь</h2>
                  <p className="md-body-m text-content-secondary">Ответы на популярные вопросы и контакты оператора</p>
                </div>

                {/* FAQ Section */}
                <section className="space-y-3">
                  <h3 className="md-label-s text-content-tertiary uppercase tracking-wider px-1">Частые вопросы</h3>
                  <div className="flex flex-col gap-2">
                    {FAQ_ITEMS.map((item, index) => {
                      const isExpanded = expandedIndex === index;
                      return (
                        <div 
                          key={index} 
                          className="bg-secondary/40 border border-border/50 rounded-[20px] overflow-hidden transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => toggleExpand(index)}
                            className="w-full flex items-center justify-between p-4 text-left cursor-pointer active:bg-secondary/20"
                          >
                            <span className="md-title-m text-content-primary pr-4">{item.question}</span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              className="text-content-secondary shrink-0"
                            >
                              <Icon name="expand_more" size={20} />
                            </motion.div>
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-4 pt-1 border-t border-border/30 md-body-m text-content-secondary leading-relaxed bg-white/[0.02]">
                                  {item.answer}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Contacts Section */}
                <section className="space-y-3">
                  <h3 className="md-label-s text-content-tertiary uppercase tracking-wider px-1">Связаться с нами</h3>
                  <div className="bg-surface-hover rounded-[24px] p-5 flex flex-col gap-4">
                    <a 
                      href="mailto:n.saltykov@proscom.ru" 
                      className="flex items-center gap-3.5 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-content-accent/10 flex items-center justify-center text-content-accent shrink-0 group-hover:scale-105 transition-transform">
                        <Icon name="mail" size={20} />
                      </div>
                      <div>
                        <span className="md-body-s text-content-tertiary block">Электронная почта</span>
                        <span className="md-title-m text-content-primary group-hover:text-content-accent transition-colors font-medium">n.saltykov@proscom.ru</span>
                      </div>
                    </a>

                    <div className="h-px bg-border/40" />

                    <a 
                      href="app_name_chanel" 
                      target="_blank" 
                      referrerPolicy="no-referrer"
                      className="flex items-center gap-3.5 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-content-accent/10 flex items-center justify-center text-content-accent shrink-0 group-hover:scale-105 transition-transform">
                        <Icon name="forum" size={20} />
                      </div>
                      <div>
                        <span className="md-body-s text-content-tertiary block">Чат в Max</span>
                        <span className="md-title-m text-content-primary group-hover:text-content-accent transition-colors font-medium">@app_name_chanel</span>
                      </div>
                    </a>

                    <div className="h-px bg-border/40" />

                    <a 
                      href="tel:+74951234567" 
                      className="flex items-center gap-3.5 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-content-accent/10 flex items-center justify-center text-content-accent shrink-0 group-hover:scale-105 transition-transform">
                        <Icon name="phone" size={20} />
                      </div>
                      <div>
                        <span className="md-body-s text-content-tertiary block">Телефон</span>
                        <span className="md-title-m text-content-primary group-hover:text-content-accent transition-colors font-medium">+7 (495) 123-45-67</span>
                      </div>
                    </a>
                  </div>
                </section>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="absolute bottom-0 inset-x-0 bg-white/20 backdrop-blur-[24px] border-t border-white/20 p-4 rounded-t-[24px] shadow-[0_-8px_32px_rgba(17,24,39,0.06)] z-10 shrink-0 pb-safe">
              <Button 
                onClick={onClose}
                variant="ghost"
                fullWidth
                size="md"
              >
                Закрыть
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
