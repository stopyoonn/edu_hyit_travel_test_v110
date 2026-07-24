import React, { useState } from 'react';
import { ArrowLeft, Share2, Sparkles, MoreVertical, Footprints, CheckCircle, PlusCircle, RefreshCw } from 'lucide-react';
import { ActiveTab, ImageModalData, ItineraryData, ItineraryStop } from '../types';
import { INITIAL_ITINERARY } from '../data/mockData';

interface ItineraryViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenImageModal: (data: ImageModalData) => void;
  itineraryData?: ItineraryData | null;
  onRegenerateItinerary?: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  setActiveTab,
  onOpenImageModal,
  itineraryData = INITIAL_ITINERARY,
  onRegenerateItinerary,
}) => {
  const [activeDay, setActiveDay] = useState(1);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const data = itineraryData || INITIAL_ITINERARY;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: data.title,
        text: 'Voyager 최적화 일정을 공유합니다.',
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  return (
    <div className="max-w-[768px] mx-auto space-y-6 pb-28 animate-fadeIn">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 -ml-2 rounded hover:bg-neutral-200/80 transition-colors text-black flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft size={20} />
          <span>대시보드로</span>
        </button>
        <h2 className="font-display text-lg font-bold text-black tracking-tight">Voyager Itinerary</h2>
        <button
          onClick={handleShare}
          className="p-2 rounded hover:bg-neutral-200/80 transition-colors text-black relative"
          title="일정 공유하기"
        >
          <Share2 size={20} />
          {showShareToast && (
            <span className="absolute right-0 top-10 bg-black text-white text-[10px] py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-30 font-mono">
              일정 링크가 복사되었습니다!
            </span>
          )}
        </button>
      </div>

      {/* Sticky Day Tabs Header */}
      <div className="sticky top-16 z-30 bg-[#f9f9f9]/95 backdrop-blur-md pt-2 pb-1 border-b border-neutral-200">
        <h3 className="font-display text-2xl md:text-3xl font-extrabold text-black mb-3">
          {data.title}
        </h3>

        <div className="flex border-b border-neutral-300 gap-8 overflow-x-auto no-scrollbar">
          {[1, 2, 3].map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`pb-3 font-sans text-sm font-bold tracking-wider transition-all whitespace-nowrap border-b-2 ${
                activeDay === day
                  ? 'border-black text-black'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              {day}일차
            </button>
          ))}
        </div>

        {/* Theme score & Optimization badge */}
        <div className="flex justify-between items-center py-3 px-4 bg-white border border-neutral-200 rounded-lg mt-3">
          <h4 className="font-sans text-xs font-bold text-neutral-700">
            역사 테마 일치도: <span className="text-black font-extrabold">{data.themeScore}%</span>
          </h4>
          <span className="text-[10px] font-bold bg-black text-white px-2.5 py-1 rounded-xs uppercase tracking-wider">
            {data.optimized ? '최적화됨' : 'AI 동기화중'}
          </span>
        </div>
      </div>

      {/* Recommendation Insight Box */}
      <section className="bg-neutral-100 p-5 rounded-xl border border-neutral-300 space-y-2">
        <div className="flex items-center gap-2 text-black font-bold text-sm">
          <Sparkles size={18} className="fill-black" />
          <span>이 일정을 추천하는 이유</span>
        </div>
        <p className="text-xs md:text-sm text-neutral-700 leading-relaxed font-sans">
          {data.insight}
        </p>
      </section>

      {/* Itinerary Timeline */}
      <div className="relative space-y-8 pl-2">
        {/* Continuous Timeline Vertical Line */}
        <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-neutral-300" />

        {data.stops.map((stop: ItineraryStop, idx: number) => (
          <React.Fragment key={idx}>
            {/* Timeline Item Stop */}
            <div className="flex gap-4 relative z-10">
              {/* Step Badge */}
              <div className="bg-black text-white size-8 rounded-full flex items-center justify-center border-2 border-[#f9f9f9] shrink-0 font-mono text-xs font-bold shadow-xs">
                {stop.order}
              </div>

              {/* Content Box */}
              <div className="flex flex-col gap-3 flex-1 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      도착 - {stop.arrivalTime}
                    </p>
                    <h4 className="font-display text-xl font-bold text-black">{stop.name}</h4>
                  </div>
                  <button className="p-1 text-neutral-400 hover:text-black">
                    <MoreVertical size={18} />
                  </button>
                </div>

                {/* Photo with duration badge & image modal trigger */}
                <div
                  onClick={() =>
                    onOpenImageModal({
                      imageUrl: stop.imageUrl,
                      title: stop.name,
                      subtitle: `도착 ${stop.arrivalTime} • ${stop.durationEstimate}`,
                      description: stop.quote || `${stop.name} 정교한 모노크롬 장소 기행`,
                      location: stop.locationTag || "서울",
                      tag: `Stop ${stop.order}`,
                    })
                  }
                  className="rounded-xl overflow-hidden aspect-video relative group cursor-zoom-in border border-neutral-300 bg-neutral-900 shadow-xs hover:border-black transition-all"
                  title="고화질 사진 보기 (클릭)"
                >
                  <img
                    src={stop.imageUrl}
                    alt={stop.name}
                    className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur text-white text-[10px] font-medium px-2.5 py-1 rounded border border-neutral-700">
                    {stop.durationEstimate}
                  </div>
                </div>

                {stop.quote && (
                  <p className="text-xs text-neutral-600 italic border-l-2 border-black pl-3 py-0.5">
                    {stop.quote}
                  </p>
                )}
              </div>
            </div>

            {/* Real-time Transit Status Bar */}
            {stop.transitStatus && (
              <div className="ml-4 pl-8 py-2 border-l-2 border-dashed border-neutral-300 flex items-center justify-between text-xs text-neutral-600 bg-neutral-50/60 p-3 rounded-r-lg border-y border-r border-neutral-200">
                <div className="flex items-center gap-2">
                  <Footprints size={16} className="text-black" />
                  <span className="font-medium text-black">
                    {stop.transitStatus.statusText}
                  </span>
                </div>
                <div className="flex gap-1" title="실시간 교통 혼잡도 (원활)">
                  <div className="w-2 h-1.5 bg-black rounded-full" />
                  <div className="w-2 h-1.5 bg-neutral-300 rounded-full" />
                  <div className="w-2 h-1.5 bg-neutral-300 rounded-full" />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Add New Stop Button */}
        <button
          onClick={onRegenerateItinerary || (() => setActiveTab('plan'))}
          className="ml-10 w-[calc(100%-2.5rem)] flex items-center justify-center gap-2 py-4 border-2 border-dashed border-neutral-300 rounded-xl text-neutral-600 hover:border-black hover:text-black transition-colors bg-white font-sans text-xs font-bold"
        >
          <PlusCircle size={18} />
          <span>새 일정 추가 / AI 다시 추천</span>
        </button>
      </div>

      {/* CTA Section */}
      <div className="mt-8 flex flex-col gap-3 pt-4">
        <button
          onClick={() => setIsConfirmed(!isConfirmed)}
          className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
            isConfirmed
              ? 'bg-emerald-800 text-white'
              : 'bg-black text-white hover:bg-neutral-800'
          }`}
        >
          <span>{isConfirmed ? '1일차 일정 확정됨' : '1일차 일정 확정'}</span>
          <CheckCircle size={18} />
        </button>

        <button
          onClick={() => setActiveTab('plan')}
          className="w-full bg-white border border-neutral-300 py-3.5 rounded-xl font-bold text-xs text-black hover:border-black transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          <span>일정 전체 수정하기</span>
        </button>
      </div>
    </div>
  );
};
