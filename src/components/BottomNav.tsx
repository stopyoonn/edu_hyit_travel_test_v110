import React from 'react';
import { Search, Train, Calendar, Bookmark } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f9f9f9]/95 backdrop-blur-md border-t border-neutral-300 py-2 px-4 flex justify-around items-center shadow-lg">
      {/* Search / Plan */}
      <button
        onClick={() => setActiveTab('plan')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
          activeTab === 'plan' ? 'text-black' : 'text-neutral-400 hover:text-neutral-700'
        }`}
      >
        <Search size={20} className={activeTab === 'plan' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className={`text-[10px] mt-1 font-sans ${activeTab === 'plan' ? 'font-bold' : 'font-medium'}`}>
          검색
        </span>
      </button>

      {/* Transit */}
      <button
        onClick={() => setActiveTab('transit')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
          activeTab === 'transit' ? 'text-black' : 'text-neutral-400 hover:text-neutral-700'
        }`}
      >
        <Train size={20} className={activeTab === 'transit' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className={`text-[10px] mt-1 font-sans ${activeTab === 'transit' ? 'font-bold' : 'font-medium'}`}>
          이동 수단
        </span>
      </button>

      {/* Itinerary */}
      <button
        onClick={() => setActiveTab('itinerary')}
        className={`flex flex-col items-center justify-center transition-all ${
          activeTab === 'itinerary'
            ? 'bg-black text-white rounded-full px-4 py-1.5 shadow-sm scale-105'
            : 'text-neutral-400 hover:text-neutral-700 px-3 py-1'
        }`}
      >
        <Calendar size={20} className={activeTab === 'itinerary' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className={`text-[10px] mt-0.5 font-sans ${activeTab === 'itinerary' ? 'font-bold' : 'font-medium'}`}>
          일정
        </span>
      </button>

      {/* Saved */}
      <button
        onClick={() => setActiveTab('saved')}
        className={`flex flex-col items-center justify-center px-3 py-1 transition-all ${
          activeTab === 'saved' ? 'text-black' : 'text-neutral-400 hover:text-neutral-700'
        }`}
      >
        <Bookmark size={20} className={activeTab === 'saved' ? 'stroke-[2.5]' : 'stroke-2'} />
        <span className={`text-[10px] mt-1 font-sans ${activeTab === 'saved' ? 'font-bold' : 'font-medium'}`}>
          저장됨
        </span>
      </button>
    </nav>
  );
};
