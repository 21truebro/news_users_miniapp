import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/Button';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
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

          {/* Bottom Sheet Drawer */}
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
              <div className="space-y-6 pt-2 leading-relaxed">
                <div>
                  <h2 className="md-title-l text-content-primary mb-1">Условия использования</h2>
                  <p className="md-body-m text-content-secondary">Пользовательское соглашение и правила сервиса</p>
                </div>

                <div className="space-y-4 md-body-m text-content-secondary">
                  <section className="space-y-1">
                    <h3 className="md-title-m text-content-primary font-bold">1. Общие положения</h3>
                    <p>
                      Настоящее Пользовательское соглашение регулирует порядок использования мобильного новостного агрегатора и предоставляемых им картографических сервисов на территории Москвы.
                    </p>
                  </section>

                  <section className="space-y-1">
                    <h3 className="md-title-m text-content-primary font-bold">2. Права и обязанности пользователей</h3>
                    <p>
                      Пользователь обязуется использовать приложение исключительно в законных целях. Запрещается осуществлять попытки дестабилизации работы сервисов, взлома или несанкционированного сбора геоданных.
                    </p>
                  </section>

                  <section className="space-y-1">
                    <h3 className="md-title-m text-content-primary font-bold">3. Персональные данные и безопасность</h3>
                    <p>
                      Мы ценим вашу конфиденциальность. Сохраняемые «Мои локации» и выбранный фильтр ленты хранятся на вашем устройстве локально (либо в вашем защищённом личном кабинете) и используются исключительно для персонализации новостной выдачи. Мы не передаем ваши геоданные сторонним рекламным компаниям.
                    </p>
                  </section>

                  <section className="space-y-1">
                    <h3 className="md-title-m text-content-primary font-bold">4. Отказ от гарантированных обязательств</h3>
                    <p>
                      Информация в новостной ленте компилируется автоматически на основе публичных новостных источников и официальных пресс-релизов ведомств Москвы. Администрация старается обеспечить предельную точность, но не несёт юридической ответственности за возможные нестыковки в текстах новостных статей.
                    </p>
                  </section>

                  <section className="space-y-1">
                    <h3 className="md-title-m text-content-primary font-bold">5. Изменение соглашения</h3>
                    <p>
                      Администрация оставляет за собой право обновлять данные Условия в одностороннем порядке. Изменения вступают в силу с момента их публикации внутри мобильного приложения. Продолжение использования приложения означает согласие с новой редакцией соглашения.
                    </p>
                  </section>
                </div>
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
