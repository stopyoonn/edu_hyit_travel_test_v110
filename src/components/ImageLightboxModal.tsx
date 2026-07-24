import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCcw, Share2, Bookmark, Download, MapPin, Camera, Check } from 'lucide-react';
import { ImageModalData } from '../types';

interface ImageLightboxModalProps {
  data: ImageModalData | null;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({ data, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<'normal' | 'contrast' | 'noir' | 'sepia'>('normal');
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.3, 0.7));
  const handleResetZoom = () => {
    setZoom(1);
    setFilter('normal');
  };

  const getFilterStyle = () => {
    switch (filter) {
      case 'contrast':
        return 'contrast-125 brightness-95 grayscale';
      case 'noir':
        return 'contrast-150 brightness-90 grayscale saturate-0';
      case 'sepia':
        return 'sepia contrast-110 brightness-95';
      default:
        return 'grayscale-0';
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(data.imageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-5xl bg-white text-black overflow-hidden shadow-2xl border border-black flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-black text-white p-2 rounded-full hover:bg-neutral-800 transition-colors"
            title="닫기 (Close)"
          >
            <X size={20} />
          </button>

          {/* Main Image Stage */}
          <div className="relative flex-1 bg-neutral-950 flex items-center justify-center overflow-hidden min-h-[320px] md:min-h-[500px]">
            <div className="overflow-auto w-full h-full flex items-center justify-center p-4">
              <motion.img
                src={data.imageUrl}
                alt={data.title}
                style={{ transform: `scale(${zoom})` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`max-h-[75vh] w-auto object-contain transition-all duration-300 ${getFilterStyle()}`}
              />
            </div>

            {/* Image Overlay Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/75 backdrop-blur text-white px-4 py-2 text-xs font-mono border border-neutral-700">
              <div className="flex gap-2 items-center">
                <button onClick={handleZoomIn} className="p-1 hover:text-neutral-300" title="확대">
                  <ZoomIn size={16} />
                </button>
                <button onClick={handleZoomOut} className="p-1 hover:text-neutral-300" title="축소">
                  <ZoomOut size={16} />
                </button>
                <button onClick={handleResetZoom} className="p-1 hover:text-neutral-300" title="초기화">
                  <RotateCcw size={16} />
                </button>
                <span className="ml-2 text-neutral-400">Zoom: {Math.round(zoom * 100)}%</span>
              </div>

              {/* Filter Toggles */}
              <div className="hidden sm:flex gap-1 items-center">
                <span className="text-neutral-400 mr-1">Tone:</span>
                <button
                  onClick={() => setFilter('normal')}
                  className={`px-2 py-0.5 border text-[10px] ${filter === 'normal' ? 'bg-white text-black border-white' : 'border-neutral-700 text-neutral-300'}`}
                >
                  Original
                </button>
                <button
                  onClick={() => setFilter('contrast')}
                  className={`px-2 py-0.5 border text-[10px] ${filter === 'contrast' ? 'bg-white text-black border-white' : 'border-neutral-700 text-neutral-300'}`}
                >
                  B&W Contrast
                </button>
                <button
                  onClick={() => setFilter('noir')}
                  className={`px-2 py-0.5 border text-[10px] ${filter === 'noir' ? 'bg-white text-black border-white' : 'border-neutral-700 text-neutral-300'}`}
                >
                  Noir
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Metadata & Controls */}
          <div className="w-full md:w-80 bg-neutral-50 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-200">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  {data.tag && (
                    <span className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 mb-2">
                      {data.tag}
                    </span>
                  )}
                  <h3 className="text-xl font-bold font-display leading-tight">{data.title}</h3>
                </div>
              </div>

              {data.location && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-3 font-medium">
                  <MapPin size={14} className="text-black" />
                  <span>{data.location}</span>
                </div>
              )}

              {data.subtitle && (
                <p className="text-xs text-neutral-500 font-medium mb-3">{data.subtitle}</p>
              )}

              {data.description ? (
                <p className="text-xs text-neutral-700 leading-relaxed mb-6 border-l-2 border-black pl-3 py-0.5 italic">
                  {data.description}
                </p>
              ) : (
                <p className="text-xs text-neutral-600 leading-relaxed mb-6">
                  VOYAGER 고화질 모노크롬 사진 가이드. 기하학적 라인과 자연광의 대조를 경험하세요.
                </p>
              )}

              <div className="space-y-2 border-t border-neutral-200 pt-4 text-[11px] text-neutral-600">
                <div className="flex justify-between">
                  <span className="text-neutral-400">포맷 (Format):</span>
                  <span className="font-mono">RAW / JPEG (High-Res)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">컬렉션 (Source):</span>
                  <span>Voyager Monolith Archive</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">핫링크 상태:</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check size={12} /> 연결됨 (Verified)
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-col gap-2">
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border transition-colors ${
                  isSaved
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-neutral-300 hover:border-black'
                }`}
              >
                <Bookmark size={14} className={isSaved ? 'fill-white' : ''} />
                {isSaved ? '저장된 장소에 추가됨' : '저장된 장소에 추가'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2 px-3 text-xs font-semibold bg-white border border-neutral-300 hover:border-black text-black flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 size={13} />
                  {copied ? '링크 복사됨!' : '핫링크 복사'}
                </button>
                <a
                  href={data.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 text-xs font-semibold bg-white border border-neutral-300 hover:border-black text-black flex items-center justify-center gap-1.5 transition-colors"
                  title="원본 새 창 열기"
                >
                  <Download size={13} />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
