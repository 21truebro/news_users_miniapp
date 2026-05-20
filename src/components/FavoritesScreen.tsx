import React from 'react';
import { Article } from '../types';
import ArticleCard from './ArticleCard';
import { Icon } from './ui/Icon';

interface Props {
  articles: Article[];
  bookmarkedIds: string[];
  onSelect: (article: Article) => void;
  onToggleBookmark: (articleId: string) => void;
  reactions: Record<string, 'like' | 'dislike' | null>;
  onReact: (id: string, type: 'like' | 'dislike') => void;
}

export default function FavoritesScreen({ articles, bookmarkedIds, onSelect, onToggleBookmark, reactions, onReact }: Props) {
  // Filter bookmarked articles
  const favoriteArticles = articles.filter(article => bookmarkedIds.includes(article.id));

  return (
    <div className="w-full max-w-md mx-auto pt-6 pb-32 px-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="md-headline-m font-semibold text-content-primary">Избранное</h1>
        <p className="md-body-m text-content-tertiary">
          {favoriteArticles.length === 0 
            ? 'Нет отслеживаемых новостей' 
            : `Сохранено новостей: ${favoriteArticles.length}`
          }
        </p>
      </div>

      {favoriteArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-surface-dim/40 border border-border/40 rounded-[28px] text-center gap-4 mt-4">
          <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center text-content-tertiary shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-border/50">
            <Icon name="bookmark_border" size={32} className="text-content-tertiary" />
          </div>
          <div className="flex flex-col gap-1.5 max-w-[280px]">
            <h3 className="md-title-m font-medium text-content-secondary">Список пуст</h3>
            <p className="md-body-s text-content-tertiary leading-relaxed">
              Добавляйте важные новости в избранное, чтобы быстро возвращаться к ним позже
            </p>
          </div>
        </div>
      ) : (
        /* List */
        <div className="flex flex-col gap-4">
          {favoriteArticles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              isBookmarked={true}
              onClick={() => onSelect(article)} 
              reaction={reactions[article.id]}
              onReact={(type, e) => onReact(article.id, type)}
              onRemoveBookmark={(e) => onToggleBookmark(article.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
