import React from 'react';
import { Bookmark, MapPin, Share2, Eye } from 'lucide-react';
import { ImageModalData } from '../types';
import { COLLECTIONS } from '../data/mockData';

interface SavedViewProps {
  onOpenImageModal: (data: ImageModalData) => void;
}

export const SavedView: React.FC<SavedViewProps> = ({ onOpenImageModal }) => {
  const savedPlaces = [
    {
      id: 'p-1',
      title: '경복궁 근정전',
      category: '역사 건축물',
      location: '서울 종로구 사직로 161',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOQtAlwsjhZzUEw5p1IEcLRd4W5mo5Uu8Qn1V13PIsowY80ANgKVxXiLJU_A42VwV4FiMbr8QDgPxo81YIcWu9L7UCYD57fn29Tdkwwh1TqEfl4gMVZUJWLJm6fkHjZLhADSM0T7tEP7L6pgbUlWD4NgjG1QP-yyDaXs6yLnsx9Y4b1jKPIOKGHha-psZ7czLO2MUhx3gZSQVNSrASHVXlA9XNXGSUDZJkUc5GPJHhwbLoreGGN_CrUm0Ez5u__SIg77rxMjyGLDp6',
      notes: '수문장 교대의식 오전 10시. 맑은 아침 자연광 구도가 아름다움.',
    },
    {
      id: 'p-2',
      title: '북촌 한옥마을 33번지',
      category: '전통 골목길',
      location: '서울 종로구 계동길 37',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSi3EcASHVq3aGOsjaowZWrVxWiColzOtUK6ufz-7jIwDDZSlm7ie1--uokkOrByVIBNO-ujSp6aPQe176XVDD-vRE5AMfMJlnjgh6SYZHM3K3OJ-AN4s_FTLoJVYsjD36eUAupX5qrxOl02LzCtyrhQFxhkRJXvV1kMw_YbNpSZDL2ssJJb_241LiLGeMwPXp1L_EcaJ8d_cBkSqLrHUYDr-QOwzMVBRTYC6vvnNHP9ASDbmGbBsr6So602Znp5GgaroZu4lnk_XZ',
      notes: '기와지붕 너머로 펼쳐지는 N서울타워 스카이라인 뷰 조망 지점.',
    },
    {
      id: 'p-3',
      title: '스톡홀름 시청사 옥상 테라스',
      category: '모노크롬 스카이라인',
      location: 'Stockholm, Sweden',
      imageUrl: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?q=80&w=1200&auto=format&fit=crop',
      notes: '노벨상 연회가 열리는 기하학적 벽돌 양식의 대표 건축물.',
    },
  ];

  return (
    <div className="space-y-8 pb-24 animate-fadeIn">
      <div className="flex justify-between items-end pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark size={16} className="text-black" />
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500">
              아카이브
            </span>
          </div>
          <h2 className="font-display text-3xl font-extrabold text-black">저장된 장소 & B&W 컬렉션</h2>
        </div>
        <p className="font-mono text-xs text-neutral-500 hidden sm:block">총 24개 위치 저장됨</p>
      </div>

      {/* Saved Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {savedPlaces.map((place) => (
          <div
            key={place.id}
            onClick={() =>
              onOpenImageModal({
                imageUrl: place.imageUrl,
                title: place.title,
                subtitle: place.category,
                description: place.notes,
                location: place.location,
                tag: 'Saved Place',
              })
            }
            className="group bg-white border border-neutral-300 rounded-lg overflow-hidden hover:border-black transition-all cursor-zoom-in shadow-2xs"
          >
            <div className="h-56 overflow-hidden relative bg-neutral-900">
              <img
                src={place.imageUrl}
                alt={place.title}
                className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                {place.category}
              </div>
              <div className="absolute bottom-3 right-3 bg-white/90 text-black p-1.5 rounded-full shadow-md group-hover:bg-black group-hover:text-white transition-colors">
                <Eye size={14} />
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h4 className="font-display text-base font-bold text-black group-hover:underline">
                {place.title}
              </h4>
              <p className="text-xs text-neutral-500 flex items-center gap-1 font-sans">
                <MapPin size={12} className="text-black" />
                <span>{place.location}</span>
              </p>
              <p className="text-xs text-neutral-600 border-t border-neutral-100 pt-2 italic">
                "{place.notes}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Collections Highlight Banner */}
      <section className="bg-neutral-900 text-white p-8 rounded-xl border border-neutral-800 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
            Featured Gallery
          </span>
          <Share2 size={16} className="text-neutral-400" />
        </div>
        <h3 className="font-display text-2xl font-bold">엄선된 흑백 건축 가이드북</h3>
        <p className="text-xs text-neutral-300 max-w-xl font-sans leading-relaxed">
          VOYAGER 큐레이터가 엄선한 모노크롬 투어 아카이브. 고화질 실사 이미지 핫링크와 위치 메타데이터가 완벽히 연결되어 있습니다.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() =>
                onOpenImageModal({
                  imageUrl: c.imageUrl,
                  title: c.title,
                  subtitle: c.destinationsCount,
                  description: c.description,
                  location: c.location,
                  tag: 'Curated Gallery',
                })
              }
              className="text-left bg-neutral-800/80 p-3 rounded border border-neutral-700 hover:border-white transition-colors group"
            >
              <p className="text-xs font-bold text-white group-hover:underline">{c.title}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">{c.destinationsCount}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
