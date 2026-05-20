import React, { useState, useEffect, useMemo } from 'react';
import { YMaps, Map, Placemark, Clusterer } from '@pbe/react-yandex-maps';
import { Article } from '../types';
import { Icon } from './ui/Icon';
import { IconButton } from './ui/IconButton';
import ArticleCard from './ArticleCard';
import { AnimatePresence, motion } from 'motion/react';

interface MapScreenProps {
  articles: Article[];
  onArticleSelect: (article: Article) => void;
  addressQuery?: string;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string) => void;
}

export default function MapScreen({ 
  articles, 
  onArticleSelect, 
  addressQuery,
  bookmarkedIds = [],
  onToggleBookmark
}: MapScreenProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [ymaps, setYmaps] = useState<any>(null);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [showBreakingToast, setShowBreakingToast] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([55.751244, 37.618423]);
  const [topArticle, setTopArticle] = useState<Article | null>(null);

  const carouselRef = React.useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = React.useRef(false);
  const programmaticScrollTimeout = React.useRef<any>(null);
  const justSwiped = React.useRef(false);
  const scrollTimeoutRef = React.useRef<any>(null);

  // Set default preview article to first one if loaded and center map
  useEffect(() => {
    if (articles.length > 0 && !previewArticle) {
      const firstArticle = articles[0];
      setPreviewArticle(firstArticle);
      if (firstArticle.coordinates) {
        setMapCenter(firstArticle.coordinates);
      }
    }
  }, [articles, previewArticle]);

  // Smootly scrolls programmatic target to center
  const scrollToArticle = (articleId: string) => {
    if (!carouselRef.current) return;
    const activeEl = carouselRef.current.querySelector(`[data-article-id="${articleId}"]`) as HTMLElement;
    if (activeEl) {
      isProgrammaticScroll.current = true;
      if (programmaticScrollTimeout.current) {
        clearTimeout(programmaticScrollTimeout.current);
      }
      
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      
      programmaticScrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 600);
    }
  };

  // Scroll carousel when preview article is programmatically changed (e.g. from map pins clicking)
  useEffect(() => {
    if (previewArticle) {
      if (justSwiped.current) {
        // Already positioned by manual swipe, keep it, just reset the flag
        justSwiped.current = false;
        return;
      }
      scrollToArticle(previewArticle.id);
    }
  }, [previewArticle]);

  // Handler for carousel scroll detection & snapping correlation with map locations
  const handleScroll = () => {
    if (isProgrammaticScroll.current) return;
    if (!carouselRef.current) return;
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (isProgrammaticScroll.current) return;
      const container = carouselRef.current;
      if (!container) return;
      
      const cards = container.children;
      const containerLeft = container.getBoundingClientRect().left;
      const containerCenter = containerLeft + container.clientWidth / 2;
      
      let closestArticle: Article | null = null;
      let minDiff = Infinity;
      
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const diff = Math.abs(containerCenter - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          const articleId = card.getAttribute('data-article-id');
          closestArticle = articles.find(a => a.id === articleId) || null;
        }
      }
      
      if (closestArticle && (!previewArticle || previewArticle.id !== closestArticle.id)) {
        justSwiped.current = true;
        setPreviewArticle(closestArticle);
        if (closestArticle.coordinates) {
          setMapCenter(closestArticle.coordinates);
        }
      }
    }, 100);
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (programmaticScrollTimeout.current) clearTimeout(programmaticScrollTimeout.current);
    };
  }, []);
  
  // Custom center if user location not loaded yet
  const defaultState = useMemo(() => ({
    center: mapCenter,
    zoom: 12,
    controls: []
  }), [mapCenter]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  // Update map center when address search query changes
  useEffect(() => {
    if (ymaps && addressQuery && ymaps.geocode) {
      ymaps.geocode(addressQuery).then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0);
        if (firstGeoObject) {
          const coords = firstGeoObject.geometry.getCoordinates();
          setMapCenter(coords);
        }
      });
    }
  }, [addressQuery, ymaps]);

  const handleBoundsChange = (e: any) => {
    if (!ymaps) return;
    const map = e.get('target');
    const center = map.getCenter();
    
    // Decouple native scroll panning from defaultState update to avoid bouncy jitter loops
    // Find closest article for TOP toast
    let closest: Article | null = null;
    let minDistance = Infinity;
    articles.forEach(article => {
      if (article.coordinates) {
        const d = Math.pow(article.coordinates[0] - center[0], 2) + Math.pow(article.coordinates[1] - center[1], 2);
        if (d < minDistance) {
          minDistance = d;
          closest = article;
        }
      }
    });

    if (closest && (!topArticle || topArticle.id !== (closest as Article).id)) {
      setTopArticle(closest);
      setShowBreakingToast(true); // show it again if it changes
    }
  };

  const getMarkerColor = (article: Article) => {
    if (article.tags.some(t => t.label === 'События')) return '#FC661B';
    if (article.tags.some(t => t.label === 'Парки')) return '#34C759';
    return '#007AFF';
  };

  const getIconContent = (article: Article) => {
    // Determine icon from tags or use a generic one
    let iconName = 'article';
    const tagWithIcon = article.tags.find(t => t.icon);
    if (tagWithIcon && tagWithIcon.icon) {
      iconName = tagWithIcon.icon;
    }
    
    return `
      <div style="background-color: ${getMarkerColor(article)}; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 3px solid white; transition: transform 0.2s; ${previewArticle?.id === article.id ? 'transform: scale(1.15); border-color: #007AFF; box-shadow: 0 0 0 4px rgba(0,122,255,0.2);' : ''}">
        <span class="material-symbols-outlined" style="font-size: 24px;">${iconName}</span>
      </div>
    `;
  };

  return (
    <div className="relative w-full h-full bg-surface overflow-hidden">
      <YMaps query={{ apikey: '65234452-c9e4-4f6b-ac33-692ada2572c6' }}>
        <Map
          defaultState={{ center: [55.751244, 37.618423], zoom: 12, controls: [] }}
          state={userLocation && !addressQuery ? { center: userLocation, zoom: 12, controls: [] } : defaultState}
          width="100%"
          height="100%"
          modules={['templateLayoutFactory', 'geocode']}
          onLoad={(ymapsInstance: any) => {
            setYmaps(ymapsInstance);
            if (!topArticle && articles[0]) setTopArticle(articles[0]);
          }}
          onBoundsChange={handleBoundsChange}
          onClick={() => setPreviewArticle(null)}
          options={{
            suppressMapOpenBlock: true,
            yandexMapDisablePoiInteractivity: true,
          }}
        >
          {userLocation && (
            <Placemark
              geometry={userLocation}
              options={{
                preset: 'islands#blueCircleDotIcon',
              }}
            />
          )}

          <Clusterer
            options={{
              preset: 'islands#invertedBlueClusterIcons',
              groupByCoordinates: false,
              clusterDisableClickZoom: false,
              clusterHideIconOnBalloonOpen: false,
              geoObjectHideIconOnBalloonOpen: false
            }}
          >
            {articles.map((article) => {
              if (!article.coordinates) return null;
              
              const isReady = ymaps && ymaps.templateLayoutFactory && ymaps.templateLayoutFactory.createClass;
              
              return (
                <Placemark
                  key={`${article.id}-${previewArticle?.id === article.id}`}
                  geometry={article.coordinates}
                  options={isReady ? {
                    iconLayout: 'default#imageWithContent',
                    iconImageHref: 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="0" height="0" %3E%3C/svg%3E',
                    iconImageSize: [44, 44],
                    iconImageOffset: [-22, -22],
                    iconContentLayout: ymaps.templateLayoutFactory.createClass(getIconContent(article)),
                  } : undefined}
                  onClick={(e: any) => {
                    setPreviewArticle(article);
                    if (article.coordinates) {
                      setMapCenter(article.coordinates);
                    }
                  }}
                />
              );
            })}
          </Clusterer>
        </Map>
      </YMaps>

      {/* Floating Header & Actions removed */}

      {/* Swipeable Carousel of Compact Article Cards */}
      <div className="absolute bottom-24 inset-x-0 z-20 flex flex-col pointer-events-none">
        <div 
          ref={carouselRef}
          onScroll={handleScroll}
          className="w-full overflow-x-auto flex gap-3 px-8 md:px-[calc(50vw-200px)] py-4 pointer-events-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {articles.map((article) => {
            const isSelected = previewArticle?.id === article.id;
            return (
              <div
                key={article.id}
                data-article-id={article.id}
                className={`
                  w-[calc(100vw-64px)] md:w-[400px] shrink-0 snap-center transition-all duration-300 cursor-pointer rounded-[16px]
                  ${isSelected 
                    ? 'scale-100 opacity-100 shadow-[0_16px_40px_rgba(17,24,39,0.12)]' 
                    : 'scale-95 opacity-80 shadow-none'
                  }
                `}
              >
                <ArticleCard 
                  article={article} 
                  variant="compact"
                  isBookmarked={bookmarkedIds.includes(article.id)}
                  onToggleBookmarked={onToggleBookmark ? (id) => onToggleBookmark(id) : undefined}
                  onClick={() => {
                    if (isSelected) {
                      onArticleSelect(article);
                    } else {
                      setPreviewArticle(article);
                      if (article.coordinates) {
                        setMapCenter(article.coordinates);
                      }
                    }
                  }} 
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
