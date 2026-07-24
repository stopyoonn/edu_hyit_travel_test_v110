import React, { useState, useEffect } from 'react';
import { Train, Plane, Car, Filter, RefreshCw, Check, Clock, ShieldCheck, Wifi, VolumeX, MapPin, ArrowRightLeft, Search, Calendar, Users } from 'lucide-react';
import { ActiveTab, TransitOption } from '../types';
import { INITIAL_TRANSIT_OPTIONS } from '../data/mockData';

interface TransitViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  options?: TransitOption[];
}

const POPULAR_PRESETS = [
  { origin: '서울', destination: '부산', label: '서울 ↔ 부산' },
  { origin: '서울', destination: '강릉', label: '서울 ↔ 강릉' },
  { origin: '서울', destination: '제주', label: '서울 ↔ 제주' },
  { origin: '런던', destination: '파리', label: '런던 ↔ 파리' },
  { origin: '도쿄', destination: '교토', label: '도쿄 ↔ 교토' },
  { origin: '뉴욕', destination: '워싱턴', label: '뉴욕 ↔ 워싱턴' },
];

export const TransitView: React.FC<TransitViewProps> = ({ options = INITIAL_TRANSIT_OPTIONS }) => {
  const [origin, setOrigin] = useState<string>('서울');
  const [destination, setDestination] = useState<string>('부산');
  const [departureDate, setDepartureDate] = useState<string>('2026-10-24');
  const [passengers, setPassengers] = useState<number>(1);

  const [selectedType, setSelectedType] = useState<'all' | 'train' | 'flight' | 'taxi'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [activePreferences, setActivePreferences] = useState<string[]>(['직항']);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [liveUpdatedTime, setLiveUpdatedTime] = useState<string>('방금 전');
  const [liveOptions, setLiveOptions] = useState<TransitOption[]>(options);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  // Toggle preference chip
  const togglePreference = (pref: string) => {
    setActivePreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  // Real-time polling / live status simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveUpdatedTime(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Fetch transit options based on current origin and destination
  const handleSearchLiveTransit = async (orig = origin, dest = destination) => {
    if (!orig.trim() || !dest.trim()) return;
    setLoadingSearch(true);
    try {
      const res = await fetch(`/api/transit/live?origin=${encodeURIComponent(orig.trim())}&destination=${encodeURIComponent(dest.trim())}&date=${encodeURIComponent(departureDate)}`);
      const data = await res.json();
      if (data.options) {
        setLiveOptions(data.options);
      }
      setLiveUpdatedTime('방금 전');
    } catch (e) {
      console.error('Transit update error', e);
    } finally {
      setTimeout(() => setLoadingSearch(false), 300);
    }
  };

  // Initial load search for default route
  useEffect(() => {
    handleSearchLiveTransit(origin, destination);
  }, []);

  const handleSwapLocations = () => {
    const nextOrigin = destination;
    const nextDest = origin;
    setOrigin(nextOrigin);
    setDestination(nextDest);
    handleSearchLiveTransit(nextOrigin, nextDest);
  };

  const handleApplyPreset = (preset: { origin: string; destination: string }) => {
    setOrigin(preset.origin);
    setDestination(preset.destination);
    handleSearchLiveTransit(preset.origin, preset.destination);
  };

  // Filter options
  const filteredOptions = liveOptions.filter((opt) => {
    if (selectedType !== 'all' && opt.type !== selectedType) return false;
    const itemKrwPrice = opt.priceKrw || opt.price;
    if (itemKrwPrice > maxPrice) return false;
    if (activePreferences.includes('직항') && !opt.direct) return false;
    if (activePreferences.includes('환불 가능') && !opt.refundable) return false;
    if (activePreferences.includes('Wi-Fi') && !opt.wifi) return false;
    if (activePreferences.includes('정숙 객차') && !opt.quietCar) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-24 animate-fadeIn">
      {/* Region & Location Selection Header Bar */}
      <div className="bg-neutral-900 text-white p-6 md:p-8 rounded-none shadow-md border border-black space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                지역 선택 및 여정 설정
              </span>
              <span className="w-6 h-px bg-neutral-700" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              {origin} <span className="text-neutral-500 font-normal">→</span> {destination}
            </h2>
          </div>

          <div className="flex items-center gap-2 font-sans text-xs text-neutral-300 bg-neutral-800 px-3 py-1.5 border border-neutral-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>실시간 노선 조회 가능</span>
          </div>
        </div>

        {/* Popular Route Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
            자주 찾는 인기 경로 선택
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PRESETS.map((p) => {
              const isCurrent = origin === p.origin && destination === p.destination;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`px-3 py-1.5 text-xs font-bold transition-all border ${
                    isCurrent
                      ? 'bg-white text-black border-white shadow-xs'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Region Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          {/* Departure Region */}
          <div className="md:col-span-4 bg-neutral-800 border border-neutral-700 p-3 flex flex-col justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1">
              <MapPin size={12} className="text-neutral-300" />
              출발 지역 / 도시
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="예: 서울, 런던, 도쿄"
              className="bg-transparent text-white font-bold text-sm outline-none placeholder:text-neutral-500 w-full"
            />
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwapLocations}
              title="출발지/도착지 위치 전환"
              className="w-10 h-10 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white flex items-center justify-center transition-all shadow-2xs"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          {/* Destination Region */}
          <div className="md:col-span-4 bg-neutral-800 border border-neutral-700 p-3 flex flex-col justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-1">
              <MapPin size={12} className="text-neutral-300" />
              도착 지역 / 도시
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="예: 부산, 파리, 교토"
              className="bg-transparent text-white font-bold text-sm outline-none placeholder:text-neutral-500 w-full"
            />
          </div>

          {/* Search Button */}
          <div className="md:col-span-3 flex items-stretch">
            <button
              type="button"
              onClick={() => handleSearchLiveTransit(origin, destination)}
              disabled={loadingSearch}
              className="w-full bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 py-3 px-4 shadow-sm"
            >
              {loadingSearch ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <Search size={15} />
              )}
              <span>노선 및 가격 조회</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters & Results */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Filters (3 Cols) */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-6">
          {/* Transit Mode Toggles */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500">
              이동 수단
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`flex items-center gap-3 px-4 py-3 border text-xs font-bold transition-all ${
                  selectedType === 'all'
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-black border-neutral-300 hover:border-black'
                }`}
              >
                <Filter size={18} />
                <span>전체 이동 수단</span>
              </button>

              <button
                onClick={() => setSelectedType('train')}
                className={`flex items-center gap-3 px-4 py-3 border text-xs font-bold transition-all ${
                  selectedType === 'train'
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-black border-neutral-300 hover:border-black'
                }`}
              >
                <Train size={18} />
                <span>기차</span>
              </button>

              <button
                onClick={() => setSelectedType('flight')}
                className={`flex items-center gap-3 px-4 py-3 border text-xs font-bold transition-all ${
                  selectedType === 'flight'
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-black border-neutral-300 hover:border-black'
                }`}
              >
                <Plane size={18} />
                <span>항공</span>
              </button>

              <button
                onClick={() => setSelectedType('taxi')}
                className={`flex items-center gap-3 px-4 py-3 border text-xs font-bold transition-all ${
                  selectedType === 'taxi'
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-black border-neutral-300 hover:border-black'
                }`}
              >
                <Car size={18} />
                <span>택시 / 셔틀</span>
              </button>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <div className="flex justify-between items-center">
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500">
                최대 가격대 (원화)
              </h3>
              <span className="font-mono text-xs font-bold text-black">₩{maxPrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-200 appearance-none cursor-pointer accent-black rounded-lg"
            />
            <div className="flex justify-between text-[11px] font-mono text-neutral-400">
              <span>₩10,000</span>
              <span>₩1,000,000+</span>
            </div>
          </div>

          {/* Preference Chips */}
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500">
              선호 사항
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '직항', icon: ShieldCheck },
                { label: '환불 가능', icon: Clock },
                { label: 'Wi-Fi', icon: Wifi },
                { label: '정숙 객차', icon: VolumeX },
              ].map(({ label, icon: Icon }) => {
                const active = activePreferences.includes(label);
                return (
                  <button
                    key={label}
                    onClick={() => togglePreference(label)}
                    className={`px-3 py-1.5 border rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                      active
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Results List (9 Cols) */}
        <section className="md:col-span-8 lg:col-span-9 space-y-4">
          {filteredOptions.length === 0 ? (
            <div className="p-12 text-center bg-white border border-neutral-300 rounded-lg space-y-3">
              <Filter size={32} className="mx-auto text-neutral-400" />
              <p className="font-display text-lg font-bold">조건에 맞는 이동 수단이 없습니다.</p>
              <p className="text-xs text-neutral-500">필터 가격대를 올리거나 선호 사항을 변경해 보세요.</p>
              <button
                onClick={() => {
                  setSelectedType('all');
                  setMaxPrice(1000000);
                  setActivePreferences([]);
                }}
                className="mt-2 px-4 py-2 bg-black text-white text-xs font-bold rounded"
              >
                필터 초기화
              </button>
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const krwPrice = opt.priceKrw || (opt.currency === '₩' ? opt.price : Math.round(opt.price * 1380));
              const localPriceVal = opt.localPrice;
              const localCurrSymbol = opt.localCurrency || (opt.currency !== '₩' ? opt.currency : null);
              const hasDifferentLocalCurrency = localCurrSymbol && localCurrSymbol !== '₩' && localPriceVal !== undefined;

              return (
                <div
                  key={opt.id}
                  className={`bg-white border p-6 relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-lg transition-all ${
                    isSelected
                      ? 'border-black ring-2 ring-black shadow-md bg-neutral-50/50'
                      : 'border-neutral-300 hover:border-black shadow-2xs'
                  }`}
                >
                  {/* Left Option details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      {opt.tag && (
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            opt.tagType === 'primary'
                              ? 'bg-black text-white'
                              : opt.tagType === 'secondary'
                              ? 'bg-white text-black border border-black'
                              : 'bg-neutral-100 text-black border border-neutral-300'
                          }`}
                        >
                          {opt.tag}
                        </span>
                      )}
                      <span className="font-sans text-xs font-bold text-neutral-700">
                        {opt.carrier} • {opt.code}
                      </span>
                    </div>

                    <div className="flex items-start gap-6">
                      {/* Timeline dot */}
                      <div className="relative flex flex-col items-center py-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                        <div className="w-[2px] h-12 bg-black my-1" />
                        <div className="w-2.5 h-2.5 rounded-full border border-black bg-white" />
                      </div>

                      {/* Station & Times */}
                      <div className="space-y-4">
                        <div>
                          <p className="font-display text-2xl font-extrabold leading-none text-black">
                            {opt.departureTime}
                          </p>
                          <p className="font-sans text-xs text-neutral-500">
                            {opt.departureStation}
                          </p>
                        </div>
                        <div>
                          <p className="font-display text-2xl font-extrabold leading-none text-black">
                            {opt.arrivalTime}
                          </p>
                          <p className="font-sans text-xs text-neutral-500">
                            {opt.arrivalStation}
                          </p>
                        </div>
                      </div>

                      {/* Duration info */}
                      <div className="hidden sm:block pl-6 border-l border-neutral-200">
                        <p className="font-sans text-[11px] font-semibold text-neutral-400 uppercase">
                          소요 시간
                        </p>
                        <p className="font-sans text-sm font-bold text-black mt-0.5">
                          {opt.duration}
                        </p>
                      </div>
                    </div>

                    {opt.liveStatus && (
                      <div className="text-[11px] font-mono text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded inline-block">
                        실시간: {opt.liveStatus.statusText}
                      </div>
                    )}
                  </div>

                  {/* Right Price & Select Button */}
                  <div className="flex flex-col items-start md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 md:h-32">
                    <div className="text-left md:text-right space-y-0.5">
                      <div className="flex items-baseline gap-1.5 justify-start md:justify-end">
                        <span className="font-display text-2xl font-extrabold text-black">
                          ₩{krwPrice.toLocaleString()}
                        </span>
                      </div>
                      {hasDifferentLocalCurrency && (
                        <p className="font-mono text-xs text-neutral-600 font-semibold">
                          현지 화폐: {localCurrSymbol}{typeof localPriceVal === 'number' ? (Number.isInteger(localPriceVal) ? localPriceVal.toLocaleString() : localPriceVal.toFixed(2)) : localPriceVal}
                        </p>
                      )}
                      <p className="font-sans text-xs text-neutral-500">{opt.seatClass}</p>
                    </div>

                    <button
                      onClick={() => setSelectedOptionId(opt.id)}
                      className={`w-full md:w-auto px-8 py-3 text-xs font-bold uppercase tracking-widest transition-all ${
                        isSelected
                          ? 'bg-emerald-800 text-white flex items-center justify-center gap-1.5 shadow-xs'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check size={14} />
                          <span>선택됨</span>
                        </>
                      ) : (
                        <span>선택하기</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};
