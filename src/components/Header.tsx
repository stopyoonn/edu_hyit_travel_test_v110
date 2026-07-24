import React from 'react';
import { Menu } from 'lucide-react';
import { ActiveTab, ImageModalData } from '../types';
import { USER_PROFILE } from '../data/mockData';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenImageModal: (data: ImageModalData) => void;
  isLiveUpdating?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenImageModal,
  isLiveUpdating = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#f9f9f9]/90 backdrop-blur-md border-b border-neutral-200 transition-all duration-200">
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
        {/* Left: Brand logo & Mobile menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('home')}
            className="p-2 rounded hover:bg-neutral-200/60 transition-colors text-black"
            aria-label="메뉴 열기"
          >
            <Menu size={22} />
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className="font-display font-black text-xl md:text-2xl tracking-tighter text-black flex items-center gap-2"
          >
            <span>VOYAGER</span>
            {isLiveUpdating && (
              <span className="flex h-2 w-2 relative" title="실시간 데이터 동기화 중">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
            )}
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 font-sans text-xs font-semibold tracking-wider">
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-3 py-2 rounded transition-colors uppercase ${
              activeTab === 'plan'
                ? 'text-black font-bold bg-neutral-200/80'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            검색
          </button>
          <button
            onClick={() => setActiveTab('transit')}
            className={`px-3 py-2 rounded transition-colors uppercase ${
              activeTab === 'transit'
                ? 'text-black font-bold bg-neutral-200/80'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            이동 수단
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-3 py-2 rounded transition-colors uppercase ${
              activeTab === 'itinerary'
                ? 'text-black font-bold bg-neutral-200/80'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            일정
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-2 rounded transition-colors uppercase ${
              activeTab === 'saved'
                ? 'text-black font-bold bg-neutral-200/80'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
            }`}
          >
            저장됨
          </button>
        </nav>

        {/* Right: Traveler Avatar profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              onOpenImageModal({
                imageUrl: USER_PROFILE.avatarUrl,
                title: `${USER_PROFILE.fullName} 프로필`,
                subtitle: "Voyager Premium Traveler",
                description: "현대적인 모노크롬 여행 디렉터 아카이브 프로필.",
                location: "스톡홀름, SE",
                tag: "VIP Director",
              })
            }
            className="group relative w-9 h-9 rounded-full overflow-hidden border border-neutral-300 hover:border-black transition-all focus:outline-none ring-2 ring-transparent hover:ring-black/20"
            title="프로필 이미지 보기 (클릭)"
          >
            <img
              src={USER_PROFILE.avatarUrl}
              alt={USER_PROFILE.name}
              className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-110 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
