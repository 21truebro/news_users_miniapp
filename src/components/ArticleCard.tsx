import React from 'react';
import { Article } from '../types';
import { Tag } from './ui/Tag';
import { DistrictLabel } from './ui/DistrictLabel';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from 'motion/react';
import { Icon } from './ui/Icon';

const springTransition = { type: "spring" as const, damping: 30, stiffness: 280, mass: 0.85 };

interface Props {
  article: Article;
  onClick: () => void;
  variant?: 'default' | 'compact';
  isBookmarked?: boolean;
  reaction?: 'like' | 'dislike' | null;
  onReact?: (type: 'like' | 'dislike', e: React.MouseEvent) => void;
  onRemoveBookmark?: (e: React.MouseEvent) => void;
}

const AnimatedReaction = ({ type, count, isActive, onClick }: { type: 'like' | 'dislike', count: number, isActive: boolean, onClick?: (e: React.MouseEvent) => void }) => {
  const isLike = type === 'like';
  const iconName = isLike ? 'thumb_up' : 'thumb_down';
  const activeColor = isLike ? 'text-green-500' : 'text-red-500';
  
  return (
    <motion.div 
      className={`flex items-center gap-1 transition-colors ${isActive ? activeColor : 'text-content-tertiary hover:text-content-secondary'}`}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick(e);
        }
      }}
      animate={isActive ? { scale: [1, 1.25, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Icon name={iconName} size={14} filled={isActive} />
      <span className="text-xs font-medium w-4 text-left">
        <AnimatePresence mode="popLayout">
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.div>
  );
};

export default function ArticleCard({ 
  article, 
  onClick, 
  variant = 'default',
  isBookmarked = false,
  reaction,
  onReact,
  onRemoveBookmark
}: Props) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const dislikeOpacity = useTransform(x, [0, -80], [0, 1]);

  const handleDragEnd = (e: any, info: any) => {
    const offset = info.offset.x;
    if (offset > 80 && onReact) {
      onReact('like', e);
    } else if (offset < -80 && onReact) {
      onReact('dislike', e);
    }
    controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
  };

  const currentLikes = (article.likesCount || 0) + (reaction === 'like' ? 1 : 0);
  const currentDislikes = (article.dislikesCount || 0) + (reaction === 'dislike' ? 1 : 0);

  const SwipeBackground = () => (
    <div className="absolute inset-0 flex items-center justify-between px-8 bg-surface-dim rounded-[16px]">
      <motion.div style={{ opacity: likeOpacity, x: useTransform(x, [0, 80], [-20, 0]), rotate: useTransform(x, [0, 80], [-30, 0]) }} className="text-green-500 flex items-center justify-center">
        <Icon name="thumb_up" size={28} filled />
      </motion.div>
      <motion.div style={{ opacity: dislikeOpacity, x: useTransform(x, [0, -80], [20, 0]), rotate: useTransform(x, [0, -80], [30, 0]) }} className="text-red-500 flex items-center justify-center">
        <Icon name="thumb_down" size={28} filled />
      </motion.div>
    </div>
  );

  if (variant === 'compact') {
    const displayTitle = article.title.length > 70 ? article.title.slice(0, 70) + '...' : article.title;

    return (
      <motion.div
        layoutId={`card-${article.id}`}
        onClick={onClick}
        className="bg-surface border border-border/60 rounded-[16px] overflow-hidden cursor-pointer flex flex-col justify-between p-4 transition-all duration-300 w-full min-h-[96px] relative z-10 shadow-sm hover:shadow-md"
        whileTap={{ scale: 0.98 }}
        transition={springTransition}
      >
        {onRemoveBookmark && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemoveBookmark(e); }} 
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-surface-dim/80 backdrop-blur-md text-content-secondary hover:text-content-primary transition-colors z-20 pointer-events-auto"
          >
            <Icon name="bookmark" size={18} filled={true} />
          </button>
        )}
        <motion.h3 layoutId={`title-${article.id}`} transition={springTransition} className={`text-sm text-content-primary line-clamp-2 leading-snug font-semibold mb-3 ${onRemoveBookmark ? 'pr-8' : ''}`}>
          {displayTitle}
        </motion.h3>

        <motion.div layoutId={`metadata-${article.id}`} transition={springTransition} className="flex flex-col gap-2.5 text-[11px] text-content-tertiary tracking-wide min-w-0 w-full mt-auto">
          <div className="flex items-center gap-1.5 truncate text-xs w-full">
            {article.districtCode && (
              <>
                <DistrictLabel districtCode={article.districtCode} className="text-content-secondary shrink-0 scale-95 origin-left" />
                <span className="text-content-tertiary border-l border-border-strong h-2.5 shrink-0" />
              </>
            )}
            <span className="truncate">
              {article.location}
            </span>
          </div>
          
          <div className="h-px w-full bg-border/40" />

          <div className="flex items-center justify-between w-full">
              <span className="shrink-0 font-medium whitespace-nowrap">{article.timeAgo}</span>
              <div className="flex items-center gap-2 shrink-0 bg-surface-dim/40 rounded-full px-2 py-0.5">
                {onReact && (
                  <>
                    <AnimatedReaction 
                      type="dislike" 
                      count={currentDislikes} 
                      isActive={reaction === 'dislike'} 
                      onClick={(e) => onReact('dislike', e)}
                    />
                    <div className="w-px h-3 bg-border/80 mx-0.5" />
                    <AnimatedReaction 
                      type="like" 
                      count={currentLikes} 
                      isActive={reaction === 'like'} 
                      onClick={(e) => onReact('like', e)}
                    />
                  </>
                )}
              </div>
            </div>
          </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full rounded-[16px] overflow-hidden">
      {onReact && <SwipeBackground />}
      <motion.div
        layoutId={`card-${article.id}`}
        onClick={onClick}
        style={{ x }}
        drag={onReact ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="bg-surface border border-border/80 rounded-[16px] overflow-hidden cursor-pointer shadow-[0_2px_8px_rgba(17,24,39,0.03)] hover:shadow-[0_6px_20px_rgba(17,24,39,0.06)] hover:border-border-strong flex flex-col transition-shadow duration-300 relative z-10"
        whileTap={{ scale: 0.98 }}
        transition={springTransition}
      >
      <motion.div layoutId={`image-container-${article.id}`} transition={springTransition} className="relative aspect-video w-full rounded-[16px] overflow-hidden bg-surface-dim z-10 shrink-0 pointer-events-none">
        <motion.img 
          layoutId={`image-${article.id}`}
          transition={springTransition}
          src={article.imageUrl} 
          alt={article.title} 
          draggable={false}
          className="w-full h-full object-cover aspect-video"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        
        {onRemoveBookmark && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemoveBookmark(e); }} 
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors z-20 pointer-events-auto"
          >
            <Icon name="bookmark" size={18} filled={true} />
          </button>
        )}

        <motion.div layoutId={`tags-${article.id}`} transition={springTransition} className="absolute bottom-4 left-4 flex gap-2 flex-wrap z-10">
          {article.tags.map((tag, idx) => (
             <Tag key={idx} label={tag.label} icon={tag.icon} variant="on-image" />
          ))}
        </motion.div>
      </motion.div>
      <div className="px-5 py-4 flex flex-col">
        <motion.h3 layoutId={`title-${article.id}`} transition={springTransition} className="md-title-m text-content-primary mb-3 line-clamp-2 leading-snug">
          {article.title}
        </motion.h3>

        <motion.div layoutId={`metadata-${article.id}`} transition={springTransition} className="flex flex-col gap-3 md-label-s text-content-tertiary tracking-wide mt-auto">
          <div className="flex items-center gap-1.5 truncate text-xs w-full">
            {article.districtCode && (
              <>
                <DistrictLabel districtCode={article.districtCode} className="text-content-secondary shrink-0 scale-95 origin-left" />
                <span className="text-content-tertiary border-l border-border-strong h-3 shrink-0" />
              </>
            )}
            <span className="truncate">
              {article.location}
            </span>
          </div>
          
          <div className="h-px w-full bg-border/40" />

          <div className="flex items-center justify-between w-full">
            <span className="shrink-0 font-medium whitespace-nowrap">{article.timeAgo}</span>
            <div className="flex items-center gap-2 shrink-0 bg-surface-dim/40 rounded-full px-2.5 py-1">
              {onReact && (
                <>
                  <AnimatedReaction 
                    type="dislike" 
                    count={currentDislikes} 
                    isActive={reaction === 'dislike'} 
                    onClick={(e) => onReact('dislike', e)}
                  />
                  <div className="w-px h-3 bg-border/80 mx-1" />
                  <AnimatedReaction 
                    type="like" 
                    count={currentLikes} 
                    isActive={reaction === 'like'} 
                    onClick={(e) => onReact('like', e)}
                  />
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      </motion.div>
    </div>
  );
}
