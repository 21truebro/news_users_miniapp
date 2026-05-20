export type IconName = string;

export interface TagInfo {
  label: string;
  colorClass?: string; 
  icon?: IconName;
}

export interface ContentBlock {
  type: 'text' | 'gallery' | 'quote' | 'image-text' | 'columns' | 'video' | 'heading' | 'updates-timeline' | 'audio';
  content?: string;
  level?: 2 | 3; // for headings
  images?: string[]; // for gallery
  imageUrl?: string; // for image-text
  sideText?: string; // for image-text
  quote?: {
    text: string;
    author: string;
    source: string;
    avatar?: string;
  };
  videoUrl?: string; // for video (youtube)
  updates?: {
    time: string;
    title?: string;
    content: string;
  }[]; // for updates-timeline
  audioUrl?: string; // for audio
  audioTitle?: string; // for audio
  audioDuration?: string; // for audio
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  blocks: ContentBlock[];
  tags: TagInfo[];
  location: string;
  districtCode?: string;
  coordinates?: [number, number];
  distance?: string;
  timeAgo: string;
  timestamp: string; // "02.05.2026 12:00"
}

export interface Category {
  id: string;
  label: string;
  icon?: IconName;
}

export interface AppConfig {
  headerTitle: string;
  headerSubtitle: string;
  currentLocation: string;
}

export interface UserLocation {
  id: string;
  name: string;
  address: string;
  districtCode: string;
}
