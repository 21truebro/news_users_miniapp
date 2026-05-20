import React from 'react';
import { Article } from '../types';
import ArticleCard from './ArticleCard';
import { articles } from '../data';

interface Props {
  articles: Article[];
  onSelect: (article: Article) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string) => void;
}

export default function Feed({ 
  articles, 
  onSelect, 
  filters, 
  onFiltersChange,
  bookmarkedIds = [],
  onToggleBookmark
}: Props) {

  return (
    <div className="w-full max-w-md mx-auto pt-4 pb-24 px-4 flex flex-col gap-5">
      {/* List */}
      <div className="flex flex-col gap-4">
        {articles.map(article => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            isBookmarked={bookmarkedIds.includes(article.id)}
            onToggleBookmarked={onToggleBookmark}
            onClick={() => onSelect(article)} 
          />
        ))}
      </div>
    </div>
  );
}
