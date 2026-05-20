import React from 'react';
import { Article, ContentBlock } from '../types';
import { IconButton } from './ui/IconButton';
import { Tag } from './ui/Tag';
import { DistrictLabel } from './ui/DistrictLabel';
import { motion, useDragControls } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icon } from './ui/Icon';

const springTransition = { type: "spring" as const, damping: 30, stiffness: 280, mass: 0.85 };

interface Props {
  article: Article;
  onBack: () => void;
  isBookmarked?: boolean;
  onToggleBookmarked?: () => void;
  reaction?: 'like' | 'dislike';
  onReact?: (type: 'like' | 'dislike') => void;
}

// Stateful Gallery Component
const InteractiveGallery = ({ images }: { images: string[] }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 my-4">
      {/* Container holding active image and arrows */}
      <div className="relative group overflow-hidden rounded-[24px] bg-black/[0.02] aspect-[4/3] border border-border/40 shadow-sm">
        <img 
          src={images[activeIndex]} 
          className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300 hover:scale-[1.01]" 
          alt={`Gallery image ${activeIndex + 1}`}
          onClick={() => setIsFullscreen(true)}
          referrerPolicy="no-referrer"
        />
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center text-content-primary shadow-sm active:scale-90 transition-all cursor-pointer z-10"
            >
              <Icon name="chevron_left" size={20} />
            </button>
            <button
              onClick={() => setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm flex items-center justify-center text-content-primary shadow-sm active:scale-90 transition-all cursor-pointer z-10"
            >
              <Icon name="chevron_right" size={20} />
            </button>
          </>
        )}

        {/* Counter overlay */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-mono text-white tracking-wider z-10">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center py-1 overflow-x-auto no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-12 h-9 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                idx === activeIndex ? 'border-content-accent opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[150] bg-black/95 flex flex-col justify-between p-4 pointer-events-auto">
          {/* Header */}
          <div className="flex justify-between items-center text-white p-2">
            <span className="font-mono text-sm tracking-wide">
              {activeIndex + 1} / {images.length}
            </span>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <Icon name="close" size={24} />
            </button>
          </div>

          {/* Main big image in center */}
          <div className="flex-1 flex items-center justify-center relative touch-none">
            <img 
              src={images[activeIndex]} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg" 
              alt={`Fullscreen ${activeIndex + 1}`} 
              referrerPolicy="no-referrer"
            />

            {/* Large navigation bounds */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <Icon name="chevron_left" size={32} />
                </button>
                <button
                  onClick={() => setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                >
                  <Icon name="chevron_right" size={32} />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="p-4 flex gap-2 overflow-x-auto justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  idx === activeIndex ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-100'
                }`}
              >
                <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Stateful AudioBlock Component
const AudioBlock = ({ 
  audioUrl, 
  audioTitle = "Аудиозапись", 
  audioDuration = "3:00" 
}: { 
  audioUrl?: string; 
  audioTitle?: string; 
  audioDuration?: string; 
}) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);

  React.useEffect(() => {
    if (audioDuration) {
      const parts = audioDuration.split(':');
      if (parts.length === 2) {
        setDuration(parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10));
      }
    }
  }, [audioDuration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.log("Audio play deferred or blocked", err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (timeInSecs: number) => {
    const minutes = Math.floor(timeInSecs / 60);
    const seconds = Math.floor(timeInSecs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="bg-surface-dim border border-border/60 rounded-[24px] p-5 my-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col gap-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-content-accent hover:bg-content-accent/90 text-white flex items-center justify-center active:scale-95 transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] cursor-pointer"
        >
          <Icon name={isPlaying ? 'pause' : 'play_arrow'} size={28} filled={true} className="text-white" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-mono text-content-tertiary mb-0.5 tracking-wider uppercase">Вставка аудио</p>
          <h4 className="md-title-s font-semibold text-content-primary truncate">{audioTitle}</h4>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 rounded-lg appearance-none bg-border cursor-pointer accent-content-accent focus:outline-none"
            style={{
              background: `linear-gradient(to right, var(--color-red-500, #ef4444) 0%, var(--color-red-500, #ef4444) ${
                duration ? (currentTime / duration) * 100 : 0
              }%, var(--border) ${
                duration ? (currentTime / duration) * 100 : 0
              }%, var(--border) 100%)`
            }}
          />
          
          <button 
            onClick={toggleMute}
            className="text-content-secondary hover:text-content-primary p-1 rounded-full cursor-pointer transition-colors"
          >
            <Icon name={isMuted ? 'volume_off' : 'volume_up'} size={20} />
          </button>
        </div>
        
        <div className="flex justify-between md-label-s font-mono text-content-tertiary">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

// Timeline Component
const UpdatesTimeline = ({ 
  updates 
}: { 
  updates?: { time: string; title?: string; content: string }[] 
}) => {
  if (!updates || updates.length === 0) return null;

  return (
    <div className="my-6">
      <div className="flex items-center gap-2.5 mb-5">
        <Icon name="history" className="text-content-accent" size={24} />
        <h4 className="md-title-s font-semibold text-content-primary">История обновлений</h4>
      </div>

      <div className="relative border-l border-border/80 ml-3 pl-6 space-y-6">
        {updates.map((upd, idx) => (
          <div key={idx} className="relative">
            <div className={`absolute -left-[36px] top-1 w-6 h-6 rounded-full bg-surface border-2 flex items-center justify-center shadow-sm ${
              idx === 0 ? 'border-content-accent' : 'border-border-strong'
            }`}>
              {idx === 0 ? (
                <span className="w-2.5 h-2.5 rounded-full bg-content-accent animate-ping absolute" />
              ) : null}
              <span className={`w-2 h-2 rounded-full ${
                idx === 0 ? 'bg-content-accent' : 'bg-content-tertiary'
              }`} />
            </div>

            <div className="flex flex-col gap-1 bg-surface-dim/40 rounded-[20px] p-4 border border-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:bg-surface-dim/60 transition-colors">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-content-accent/10 text-content-accent">
                  {upd.time}
                </span>
                {idx === 0 && (
                  <span className="text-[10px] font-bold text-content-accent uppercase tracking-wider">
                    Новое
                  </span>
                )}
              </div>
              {upd.title && (
                <h5 className="md-label-m font-bold text-content-primary mt-1.5">
                  {upd.title}
                </h5>
              )}
              <p className="md-body-s text-content-secondary leading-relaxed mt-0.5">
                {upd.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RenderBlock = ({ block }: { block: ContentBlock }) => {
  switch (block.type) {
    case 'text':
      return (
        <div className="md-body-l text-content-primary leading-relaxed pb-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{block.content || ''}</ReactMarkdown>
        </div>
      );
    case 'heading':
      if (block.level === 2) return <h2 className="md-headline-s text-content-primary mt-8 mb-4">{block.content}</h2>;
      return <h3 className="md-title-l text-content-primary mt-6 mb-3">{block.content}</h3>;
    case 'gallery':
      return <InteractiveGallery images={block.images || []} />;
    case 'audio':
      return (
        <AudioBlock 
          audioUrl={block.audioUrl} 
          audioTitle={block.audioTitle} 
          audioDuration={block.audioDuration} 
        />
      );
    case 'updates-timeline':
      return <UpdatesTimeline updates={block.updates} />;
    case 'quote':
      return (
        <div className="bg-surface-dim border-l-4 border-content-accent py-5 px-6 rounded-r-[20px] my-6 shadow-sm">
          <p className="md-body-l italic text-content-primary mb-4 leading-relaxed">"{block.quote?.text}"</p>
          <div className="flex items-center gap-4">
            {block.quote?.avatar && (
              <img src={block.quote.avatar} className="w-12 h-12 rounded-full border border-border object-cover" alt={block.quote.author} referrerPolicy="no-referrer" />
            )}
            <div>
              <p className="md-label-m text-content-primary font-semibold">{block.quote?.author}</p>
              <p className="md-label-s text-content-tertiary mt-0.5">{block.quote?.source}</p>
            </div>
          </div>
        </div>
      );
    case 'image-text':
      return (
        <div className="flex gap-5 items-start my-6">
          <img src={block.imageUrl} className="w-1/3 aspect-square object-cover rounded-[16px] shadow-sm" alt="Illustration" referrerPolicy="no-referrer" />
          <p className="flex-1 md-body-m text-content-primary leading-relaxed">{block.sideText}</p>
        </div>
      );
    case 'columns':
      const cols = block.content?.split('|') || [];
      return (
        <div className="grid grid-cols-2 gap-5 my-6">
          {cols.map((col, i) => (
            <p key={i} className="md-body-m text-content-primary">{col.trim()}</p>
          ))}
        </div>
      );
    case 'video':
      return (
        <div className="relative aspect-video w-full rounded-[24px] overflow-hidden my-6 shadow-md bg-content-primary">
          <iframe 
            src={block.videoUrl} 
            className="absolute inset-0 w-full h-full" 
            allowFullScreen 
            title="Video content"
            frameBorder="0"
          />
        </div>
      );
    default:
      return null;
  }
};

export default function ArticleView({ article, onBack, isBookmarked = false, onToggleBookmarked, reaction, onReact }: Props) {
  const dragControls = useDragControls();
  
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div 
      layoutId={`card-${article.id}`}
      className="w-full max-w-md mx-auto bg-surface rounded-t-[32px] overflow-hidden pointer-events-auto flex flex-col max-h-[96vh] shadow-2xl relative z-10"
      transition={springTransition}
      drag="y"
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.8 }}
      onDragEnd={(e, info) => {
        if (info.offset.y > 100 || info.velocity.y > 500) {
          onBack();
        }
      }}
    >
      <div className="absolute top-0 inset-x-0 z-30 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        
        <div 
          className="w-full flex justify-center pt-3 pb-2 touch-none relative z-10 pointer-events-auto cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-12 h-1.5 bg-white/50 rounded-full" />
        </div>

        <div className="px-5 flex justify-between items-center pointer-events-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ ...springTransition, delay: 0.1 }}
          >
            <IconButton 
              icon="arrow_back" 
              onClick={onBack} 
              variant="ghost"
            />
          </motion.div>
          <div className="flex gap-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ ...springTransition, delay: 0.15 }}
            >
              <IconButton 
                icon={isBookmarked ? "bookmark" : "bookmark_border"} 
                filled={isBookmarked}
                onClick={onToggleBookmarked}
                variant="ghost"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ ...springTransition, delay: 0.2 }}
            >
              <IconButton 
                icon="share" 
                variant="ghost"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="w-full h-full overflow-y-auto overscroll-contain flex flex-col no-scrollbar bg-surface">
        <motion.div layoutId={`image-container-${article.id}`} transition={springTransition} className="relative w-full aspect-[4/3] shrink-0 bg-surface-dim z-10">
          <motion.img 
            layoutId={`image-${article.id}`} 
            transition={springTransition}
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          <motion.div layoutId={`tags-${article.id}`} transition={springTransition} className="absolute bottom-5 left-5 right-5 flex gap-2 flex-wrap z-10">
            {article.tags.map((tag, idx) => (
              <Tag key={idx} label={tag.label} icon={tag.icon} variant="on-image" />
            ))}
          </motion.div>
        </motion.div>

        <div className="px-6 pt-8 pb-16 w-full flex-1">
          <motion.h3 layoutId={`title-${article.id}`} transition={springTransition} className="md-headline-m text-content-primary mb-6" style={{ textWrap: 'balance' }}>
            {article.title}
          </motion.h3>

          <motion.div layoutId={`metadata-${article.id}`} transition={springTransition} className="flex justify-between items-center md-label-s tracking-wide text-content-secondary mb-8 border-b border-border pb-6">
            <div className="flex items-center gap-2 truncate pr-4">
              {article.districtCode && (
                <>
                  <DistrictLabel districtCode={article.districtCode} className="text-content-secondary shrink-0" />
                  <span className="text-content-tertiary border-l border-border-strong h-3 shrink-0" />
                </>
              )}
              <span className="truncate text-content-secondary font-medium">{article.location}</span>
            </div>
            <span className="shrink-0 font-medium">{article.timeAgo}</span>
          </motion.div>

          <div className="space-y-6">
            {article.blocks.map((block, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, ease: [0.215, 0.61, 0.355, 1.0], delay: Math.min(idx * 0.05, 0.15) }}
              >
                <RenderBlock block={block} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 pt-6 flex flex-col gap-6 border-t border-border">
            <div className="flex justify-between items-center bg-surface-dim/50 rounded-full p-1 border border-border/50">
              <span className="md-label-s text-content-secondary pl-4">Оцените новость</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => onReact?.('dislike')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
                    reaction === 'dislike' 
                      ? 'bg-red-500/10 text-red-600' 
                      : 'hover:bg-surface-hover text-content-secondary'
                  }`}
                >
                  <Icon name="thumb_down" size={20} filled={reaction === 'dislike'} />
                  {article.dislikesCount !== undefined && <span className="font-medium text-sm">{article.dislikesCount + (reaction === 'dislike' ? 1 : 0)}</span>}
                </button>
                <button 
                  onClick={() => onReact?.('like')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full transition-all ${
                    reaction === 'like' 
                      ? 'bg-green-500/10 text-green-600' 
                      : 'hover:bg-surface-hover text-content-secondary'
                  }`}
                >
                  <Icon name="thumb_up" size={20} filled={reaction === 'like'} />
                  {article.likesCount !== undefined && <span className="font-medium text-sm">{article.likesCount + (reaction === 'like' ? 1 : 0)}</span>}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-content-tertiary">
              <span className="md-label-s">Опубликовано</span>
              <span className="md-label-m font-mono">{article.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
