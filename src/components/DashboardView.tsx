import React, { useState } from 'react';
import { PlusCircle, Bookmark, Plane, ChevronLeft, ChevronRight, Plus, ArrowUpRight } from 'lucide-react';
import { ActiveTab, ImageModalData, CollectionItem } from '../types';
import { USER_PROFILE, COLLECTIONS } from '../data/mockData';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenImageModal: (data: ImageModalData) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setActiveTab,
  onOpenImageModal,
}) => {
  const [collectionIndex, setCollectionIndex] = useState(0);

  const handleNextCollection = () => {
    setCollectionIndex((prev) => (prev + 1) % COLLECTIONS.length);
  };

  const handlePrevCollection = () => {
    setCollectionIndex((prev) => (prev - 1 + COLLECTIONS.length) % COLLECTIONS.length);
  };

  return (
    <div className="space-y-12 pb-24 animate-fadeIn">
      {/* Welcome & Status Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="font-sans text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-2">
            10월 14일 월요일
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-black leading-none">
            환영합니다, {USER_PROFILE.name}님.
          </h2>
        </div>

        {/* Black Current Trip Card */}
        <div className="bg-black text-white p-6 md:w-80 rounded-lg flex flex-col justify-between h-48 relative overflow-hidden group border border-neutral-800 shadow-xl">
          <div className="relative z-10">
            <p className="font-sans text-[11px] font-medium text-neutral-400 uppercase tracking-widest mb-1">
              현재 여행
            </p>
            <h3 className="font-display text-2xl font-bold">{USER_PROFILE.currentTrip.city}</h3>
          </div>
          <div className="relative z-10 flex justify-between items-end">
            <div>
              <p className="font-display text-4xl font-extrabold leading-none">
                {USER_PROFILE.currentTrip.daysLeft}
              </p>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mt-1">
                남은 일수
              </p>
            </div>
            <div className="p-2 bg-neutral-900 rounded-full border border-neutral-700 group-hover:scale-110 transition-transform">
              <Plane size={24} className="text-white transform -rotate-45" />
            </div>
          </div>
          {/* Subtle background circle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        </div>
      </section>

      {/* Quick Links Bento Grid */}
      <section className="grid grid-cols-12 gap-6">
        {/* New Trip Box */}
        <div
          onClick={() => setActiveTab('plan')}
          className="col-span-12 md:col-span-4 border border-neutral-300 bg-white p-8 flex flex-col justify-between hover:border-black transition-all group cursor-pointer min-h-[220px] rounded-lg shadow-xs hover:shadow-md"
        >
          <PlusCircle size={36} className="text-black group-hover:scale-110 transition-transform" />
          <div>
            <h4 className="font-display text-xl font-bold mb-1 flex items-center justify-between">
              <span>새로운 여행</span>
              <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </h4>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              정교하게 설계된 다음 이동 경로를 구성해 보세요.
            </p>
          </div>
        </div>

        {/* Saved Places Box */}
        <div
          onClick={() => setActiveTab('saved')}
          className="col-span-12 md:col-span-8 border border-neutral-300 bg-white p-8 flex items-center justify-between hover:border-black transition-all group cursor-pointer min-h-[220px] overflow-hidden relative rounded-lg shadow-xs hover:shadow-md"
        >
          <div className="max-w-md relative z-10">
            <Bookmark size={36} className="text-black mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="font-display text-xl font-bold mb-1">저장된 장소</h4>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed">
              모노크롬 여행을 위해 엄선된 24개의 위치를 확인하세요.
            </p>
          </div>
          {/* Background image preview with click lightbox */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpenImageModal({
                imageUrl: COLLECTIONS[1].imageUrl,
                title: "저장된 장소 아카이브",
                subtitle: "Monochrome Architecture",
                description: "엄선된 24개의 기하학적 모노크롬 위치 컬렉션.",
                location: "Stockholm & Copenhagen",
                tag: "Saved Places",
              });
            }}
            className="hidden md:block w-44 h-44 bg-neutral-100 rounded-lg rotate-12 absolute -right-4 -bottom-4 transition-transform group-hover:rotate-6 border border-neutral-300 overflow-hidden shadow-lg cursor-zoom-in"
            title="이미지 크게 보기 (클릭)"
          >
            <img
              src={COLLECTIONS[1].imageUrl}
              alt="Saved Places preview"
              className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Recent Itineraries */}
        <div className="col-span-12 border border-neutral-300 bg-white p-6 md:p-8 rounded-lg hover:border-black transition-all shadow-xs">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-display text-xl font-bold">최근 일정</h4>
            <button
              onClick={() => setActiveTab('itinerary')}
              className="font-sans text-xs font-bold underline underline-offset-4 hover:text-neutral-600 transition-colors"
            >
              모두 보기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Itinerary Item 1 */}
            <div
              onClick={() => setActiveTab('itinerary')}
              className="border-b md:border-b-0 md:border-r border-neutral-200 pb-4 md:pb-0 md:pr-6 cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                  최단시간
                </span>
                <p className="font-sans text-xs font-bold text-neutral-800">CPH → BER</p>
              </div>
              <div className="relative pl-5 border-l border-black space-y-3 py-1">
                <div>
                  <p className="font-sans text-xs font-bold text-black group-hover:underline">
                    08:15 — 코펜하겐 중앙역
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs text-neutral-600">13:45 — 베를린 중앙역</p>
                </div>
              </div>
            </div>

            {/* Itinerary Item 2 */}
            <div
              onClick={() => setActiveTab('transit')}
              className="border-b md:border-b-0 md:border-r border-neutral-200 pb-4 md:pb-0 md:pr-6 cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="border border-black text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                  최저가
                </span>
                <p className="font-sans text-xs font-bold text-neutral-800">LON → PAR</p>
              </div>
              <div className="relative pl-5 border-l border-black space-y-3 py-1">
                <div>
                  <p className="font-sans text-xs font-bold text-black group-hover:underline">
                    10:00 — 세인트 판크라스 국제역
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs text-neutral-600">13:20 — 파리 북역</p>
                </div>
              </div>
            </div>

            {/* Itinerary Item 3 */}
            <div
              onClick={() => setActiveTab('itinerary')}
              className="cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-neutral-200 text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-tighter">
                  추천
                </span>
                <p className="font-sans text-xs font-bold text-neutral-800">NYC → BOS</p>
              </div>
              <div className="relative pl-5 border-l border-black space-y-3 py-1">
                <div>
                  <p className="font-sans text-xs font-bold text-black group-hover:underline">
                    06:00 — 펜 역
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs text-neutral-600">09:40 — 사우스 역</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B&W Collections Section */}
      <section className="pt-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="font-sans text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">
              큐레이션
            </p>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-black">
              B&W 컬렉션
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevCollection}
              className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black rounded-sm"
              aria-label="이전 컬렉션"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextCollection}
              className="w-10 h-10 border border-neutral-300 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-black rounded-sm"
              aria-label="다음 컬렉션"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Collections Cards Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLLECTIONS.map((col: CollectionItem) => (
            <div
              key={col.id}
              onClick={() =>
                onOpenImageModal({
                  imageUrl: col.imageUrl,
                  title: col.title,
                  subtitle: col.destinationsCount,
                  description: col.description,
                  location: col.location,
                  tag: "Curated B&W Collection",
                })
              }
              className="group cursor-pointer flex flex-col border border-neutral-200 bg-white p-3 rounded-lg hover:border-black transition-all shadow-xs"
            >
              <div className="h-[360px] md:h-[420px] overflow-hidden mb-3 relative rounded bg-neutral-900">
                <img
                  src={col.imageUrl}
                  alt={col.title}
                  className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur text-white text-[10px] font-mono px-2 py-1 uppercase tracking-widest border border-neutral-700">
                  Click to Zoom
                </div>
              </div>
              <h5 className="font-display text-lg font-bold text-black group-hover:underline">
                {col.title}
              </h5>
              <p className="font-sans text-[11px] font-medium text-neutral-500 uppercase tracking-wider mt-0.5">
                {col.destinationsCount} • {col.location}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <button
        onClick={() => setActiveTab('plan')}
        className="fixed bottom-20 right-6 md:bottom-10 md:right-10 bg-black text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group active:scale-95 transition-all z-30 border border-neutral-700"
        title="새 일정 만들기"
      >
        <Plus size={28} className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="absolute right-16 bg-black text-white px-3 py-1.5 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-neutral-800 shadow-md">
          새 일정 만들기
        </span>
      </button>
    </div>
  );
};
