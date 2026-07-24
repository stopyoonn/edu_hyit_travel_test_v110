import React, { useState } from 'react';
import { Navigation, MapPin, Calendar, Utensils, Landmark, Trees, ShoppingBag, Palette, Wine, ArrowRight, Train, Plane, ChevronRight, Loader2 } from 'lucide-react';
import { ActiveTab, ImageModalData, ItineraryData } from '../types';
import { SAVED_ITINERARIES } from '../data/mockData';

interface PlanViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenImageModal: (data: ImageModalData) => void;
  onGeneratedItinerary?: (data: ItineraryData) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({
  setActiveTab,
  onOpenImageModal,
  onGeneratedItinerary,
}) => {
  const [origin, setOrigin] = useState('서울');
  const [destination, setDestination] = useState('경복궁 & 북촌');
  const [selectedDates, setSelectedDates] = useState('10월 14일 — 10월 17일');
  const [selectedTastes, setSelectedTastes] = useState<string[]>(['역사', '예술']);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleTaste = (taste: string) => {
    setSelectedTastes((prev) =>
      prev.includes(taste) ? prev.filter((t) => t !== taste) : [...prev, taste]
    );
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          startDate: '10월 14일',
          endDate: '10월 17일',
          preferences: selectedTastes,
        }),
      });

      const data = await response.json();
      if (onGeneratedItinerary && data) {
        onGeneratedItinerary(data);
      }
      setActiveTab('itinerary');
    } catch (err) {
      console.error('Itinerary generation error:', err);
      setActiveTab('itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-12 pb-24 animate-fadeIn">
      {/* Title Section */}
      <div>
        <h2 className="font-display text-3xl md:text-4xl font-extrabold text-black mb-2">
          여행을 정교하게 계획하세요
        </h2>
        <p className="text-sm text-neutral-600 font-sans">
          안목 있는 여행자를 위한 정밀한 일정 관리 서비스.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search & Preference Form (7 Cols) */}
        <form onSubmit={handlePlanSubmit} className="lg:col-span-7 space-y-8">
          {/* Location & Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin & Destination Box */}
            <div className="p-6 bg-white border border-neutral-300 rounded-lg space-y-6 shadow-2xs">
              <div className="space-y-2">
                <label className="font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  출발지
                </label>
                <div className="flex items-center gap-3 border-b border-neutral-300 py-2 focus-within:border-black transition-colors">
                  <Navigation size={18} className="text-neutral-500" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="현재 위치"
                    className="w-full bg-transparent font-sans text-sm font-semibold text-black placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  도착지
                </label>
                <div className="flex items-center gap-3 border-b border-neutral-300 py-2 focus-within:border-black transition-colors">
                  <MapPin size={18} className="text-neutral-500" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="목적지 도시"
                    className="w-full bg-transparent font-sans text-sm font-semibold text-black placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="p-6 bg-white border border-neutral-300 rounded-lg flex flex-col justify-between shadow-2xs">
              <div>
                <label className="font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 block">
                  날짜
                </label>
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-semibold text-neutral-500">
                  <span className="text-neutral-400 font-bold">월</span>
                  <span className="text-neutral-400 font-bold">화</span>
                  <span className="text-neutral-400 font-bold">수</span>
                  <span className="text-neutral-400 font-bold">목</span>
                  <span className="text-neutral-400 font-bold">금</span>
                  <span className="text-neutral-400 font-bold">토</span>
                  <span className="text-neutral-400 font-bold">일</span>

                  <span className="p-1 text-neutral-300">12</span>
                  <span className="p-1 text-neutral-300">13</span>
                  <span className="p-1 bg-black text-white font-bold rounded-full">14</span>
                  <span className="p-1 bg-neutral-200 text-black">15</span>
                  <span className="p-1 bg-neutral-200 text-black">16</span>
                  <span className="p-1 bg-black text-white font-bold rounded-full">17</span>
                  <span className="p-1 text-neutral-700">18</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center text-xs font-bold text-black">
                <span>{selectedDates}</span>
                <Calendar size={18} className="text-black" />
              </div>
            </div>
          </div>

          {/* Travel Tastes / Chips */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500">
              여행 취향
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { name: '미식', icon: Utensils },
                { name: '역사', icon: Landmark },
                { name: '자연', icon: Trees },
                { name: '쇼핑', icon: ShoppingBag },
                { name: '예술', icon: Palette },
                { name: '나이트라이프', icon: Wine },
              ].map(({ name, icon: Icon }) => {
                const active = selectedTastes.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleTaste(name)}
                    className={`px-4 py-2 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all ${
                      active
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-black text-white py-5 rounded-lg font-display font-bold text-sm hover:bg-neutral-800 active:scale-[0.99] transition-all flex justify-center items-center gap-3 shadow-md"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>AI 정밀 경로 생성 중...</span>
              </>
            ) : (
              <>
                <span>여행 계획하기</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Featured Inspiration & Saved Itineraries (5 Cols) */}
        <aside className="lg:col-span-5 flex flex-col gap-6">
          {/* Featured Destination Card */}
          <div
            onClick={() =>
              onOpenImageModal({
                imageUrl:
                  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop',
                title: '도쿄 프로토콜',
                subtitle: '추천 여행지 • 도쿄',
                description: '세계에서 가장 정돈된 대도시에서 효율성과 전통을 경험하세요.',
                location: 'Tokyo, Japan',
                tag: 'Featured destination',
              })
            }
            className="relative h-72 md:h-80 rounded-lg overflow-hidden group cursor-zoom-in border border-neutral-300 shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1200&auto=format&fit=crop"
              alt="Tokyo Protocol"
              className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider mb-2 inline-block">
                추천 여행지
              </span>
              <h4 className="font-display text-2xl font-bold">도쿄 프로토콜</h4>
              <p className="text-xs text-neutral-300 mt-1 max-w-xs font-sans">
                세계에서 가장 정돈된 대도시에서 효율성과 전통을 경험하세요.
              </p>
            </div>
          </div>

          {/* Saved Itineraries Box */}
          <div className="bg-white border border-neutral-300 p-6 rounded-lg shadow-2xs">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">
              저장된 일정
            </h3>
            <div className="space-y-4">
              {SAVED_ITINERARIES.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveTab('transit')}
                  className="flex items-center gap-4 group cursor-pointer p-2 rounded hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-neutral-100 flex items-center justify-center rounded border border-neutral-200 shrink-0">
                    {item.type === 'train' ? (
                      <Train size={18} className="text-black" />
                    ) : (
                      <Plane size={18} className="text-black" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-bold text-black truncate group-hover:underline">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-neutral-500 font-sans">
                      {item.duration} • {item.theme}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-neutral-400 group-hover:text-black transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
