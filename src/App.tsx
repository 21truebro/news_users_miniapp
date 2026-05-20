import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Feed from './components/Feed';
import MapScreen from './components/MapScreen';
import ArticleView from './components/ArticleView';
import { FilterModal } from './components/FilterModal';
import { BottomNav } from './components/ui/BottomNav';
import SettingsScreen from './components/SettingsScreen';
import FavoritesScreen from './components/FavoritesScreen';
import { Article } from './types';
import { articles } from './data';

export default function App() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [currentView, setCurrentView] = useState<'feed' | 'map' | 'favorites' | 'settings'>('feed');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [reactions, setReactions] = useState<{ [articleId: string]: 'like' | 'dislike' }>(() => {
    try {
      const saved = localStorage.getItem('article_reactions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('bookmarked_articles', JSON.stringify(next));
      return next;
    });
  };

  const handleReaction = (id: string, type: 'like' | 'dislike') => {
    setReactions(prev => {
      const current = prev[id];
      const next = { ...prev };
      if (current === type) {
        delete next[id]; // Toggle off
      } else {
        next[id] = type;
      }
      localStorage.setItem('article_reactions', JSON.stringify(next));
      return next;
    });
  };
  const [filters, setFilters] = useState({
    relevance: 'all',
    timeFilter: 'hour',
    address: '',
    selectedDistricts: [] as string[],
    selectedRubrics: [] as string[],
    selectedPlots: [] as string[]
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredArticles = articles.filter(article => {
    if (filters.address && !article.location.toLowerCase().includes(filters.address.toLowerCase())) {
      return false;
    }
    if (filters.selectedDistricts.length > 0 && article.districtCode && !filters.selectedDistricts.includes(article.districtCode)) {
      return false;
    }
    if (filters.selectedRubrics.length > 0) {
      const hasRubric = article.tags.some(tag => filters.selectedRubrics.includes(tag.label));
      if (!hasRubric) return false;
    }
    return true;
  });

  return (
    <div className="w-full min-h-[100dvh] bg-app-bg text-content-primary font-sans relative flex flex-col overflow-hidden">
      <div className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          {currentView === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <Feed 
                articles={filteredArticles}
                onSelect={setSelectedArticle} 
                filters={filters} 
                onFiltersChange={setFilters} 
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
                reactions={reactions}
                onReact={handleReaction}
              />
            </motion.div>
          )}
          {currentView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="absolute inset-0"
            >
              <MapScreen 
                articles={filteredArticles}
                onArticleSelect={setSelectedArticle} 
                addressQuery={filters.address}
                bookmarkedIds={bookmarkedIds}
                onToggleBookmark={handleToggleBookmark}
                reactions={reactions}
                onReact={handleReaction}
              />
            </motion.div>
          )}
          {currentView === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="absolute inset-0 overflow-y-auto"
            >
              <FavoritesScreen 
                articles={articles}
                bookmarkedIds={bookmarkedIds}
                onSelect={setSelectedArticle}
                onToggleBookmark={handleToggleBookmark}
                reactions={reactions}
                onReact={handleReaction}
              />
            </motion.div>
          )}
          {currentView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="absolute inset-0"
            >
              <SettingsScreen onOpenFilters={() => setIsFilterOpen(true)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav currentView={currentView} onChange={setCurrentView} />

      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)}
        initialFilters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
      />

      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 bg-black/40 pointer-events-auto"
              onClick={() => setSelectedArticle(null)}
            />
            {/* The Bottom Sheet */}
            <ArticleView 
              article={selectedArticle} 
              onBack={() => setSelectedArticle(null)} 
              isBookmarked={bookmarkedIds.includes(selectedArticle.id)}
              onToggleBookmarked={() => handleToggleBookmark(selectedArticle.id)}
              reaction={reactions[selectedArticle.id]}
              onReact={(type) => handleReaction(selectedArticle.id, type)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
