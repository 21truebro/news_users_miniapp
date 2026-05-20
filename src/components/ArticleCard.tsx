import React from 'react';
import { Article } from '../types';
import { Tag } from './ui/Tag';
import { DistrictLabel } from './ui/DistrictLabel';
import { motion } from 'motion/react';
import { Icon } from './ui/Icon';

const springTransition = { type: "spring" as const, damping: 30, stiffness: 280, mass: 0.85 };

interface Props {
  article: Article;
  onClick: () => void;
  variant?: 'default' | 'compact';
  isBookmarked?: boolean;
  onToggleBookmarked?: (id: string, e: React.MouseEvent) => void;
}

export default function ArticleCard({ 
  article, 
  onClick, 
  variant = 'default',
  isBookmarked = false,
  onToggleBookmarked 
}: Props) {
  if (variant === 'compact') {
    const displayTitle = article.title.length > 70 ? article.title.slice(0, 70) + '...' : article.title;

    return (
      <motion.div
        layoutId={`card-${article.id}`}
        onClick={onClick}
        className="bg-surface rounded-[16px] overflow-hidden cursor-pointer flex h-28 transition-all duration-300 w-full relative"
        whileTap={{ scale: 0.98 }}
        transition={springTransition}
      >
        <motion.div layoutId={`image-container-${article.id}`} transition={springTransition} className="relative w-22 h-full bg-surface-dim shrink-0 overflow-hidden">
          <motion.img 
            layoutId={`image-${article.id}`}
            transition={springTransition}
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0 pr-10">
          <div>
            <motion.h3 layoutId={`title-${article.id}`} transition={springTransition} className="text-xs sm:text-sm text-content-primary line-clamp-3 leading-snug font-semibold mb-1">
              {displayTitle}
            </motion.h3>
          </div>

          <motion.div layoutId={`metadata-${article.id}`} transition={springTransition} className="flex items-center justify-between text-[11px] text-content-tertiary tracking-wide min-w-0">
            <div className="flex items-center gap-1.5 truncate pr-2 min-w-0">
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
            <span className="shrink-0 font-medium whitespace-nowrap">{article.timeAgo}</span>
          </motion.div>
        </div>

        {onToggleBookmarked && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmarked(article.id, e);
            }}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-surface-dim hover:bg-border/60 flex items-center justify-center text-content-primary active:scale-90 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-border/30"
          >
            <Icon 
              name={isBookmarked ? 'bookmark' : 'bookmark_border'} 
              size={18} 
              filled={isBookmarked} 
              className={isBookmarked ? "text-content-accent" : "text-content-secondary"}
            />
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={`card-${article.id}`}
      onClick={onClick}
      className="bg-surface border border-border/80 rounded-[16px] overflow-hidden cursor-pointer shadow-[0_2px_8px_rgba(17,24,39,0.03)] hover:shadow-[0_6px_20px_rgba(17,24,39,0.06)] hover:border-border-strong flex flex-col transition-shadow duration-300 relative"
      whileTap={{ scale: 0.98 }}
      transition={springTransition}
    >
      <motion.div layoutId={`image-container-${article.id}`} transition={springTransition} className="relative aspect-video w-full rounded-[16px] overflow-hidden bg-surface-dim z-10 shrink-0">
        <motion.img 
          layoutId={`image-${article.id}`}
          transition={springTransition}
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover aspect-video"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <motion.div layoutId={`tags-${article.id}`} transition={springTransition} className="absolute bottom-4 left-4 flex gap-2 flex-wrap z-10">
          {article.tags.map((tag, idx) => (
            <Tag key={idx} label={tag.label} icon={tag.icon} variant="on-image" />
          ))}
        </motion.div>

        {onToggleBookmarked && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmarked(article.id, e);
            }}
            className="absolute top-4 right-4 z-25 w-9 h-9 rounded-full bg-black/40 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer"
          >
            <Icon 
              name={isBookmarked ? 'bookmark' : 'bookmark_border'} 
              size={20} 
              filled={isBookmarked} 
              className={isBookmarked ? "text-content-accent" : "text-white"}
            />
          </button>
        )}
      </motion.div>
      <div className="px-5 py-4">
        <motion.h3 layoutId={`title-${article.id}`} transition={springTransition} className="md-title-m text-content-primary mb-3 line-clamp-2 leading-snug">
          {article.title}
        </motion.h3>

        <motion.div layoutId={`metadata-${article.id}`} transition={springTransition} className="flex items-center justify-between md-label-s text-content-tertiary tracking-wide">
          <div className="flex items-center gap-2 truncate pr-4">
            {article.districtCode && (
              <>
                <DistrictLabel districtCode={article.districtCode} className="text-content-secondary shrink-0" />
                <span className="text-content-tertiary border-l border-border-strong h-3 shrink-0" />
              </>
            )}
            <span className="truncate">
              {article.location}
            </span>
          </div>
          <span className="shrink-0 font-medium">{article.timeAgo}</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
