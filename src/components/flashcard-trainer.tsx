'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Rotate3d, 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  XCircle, 
  RotateCcw,
  Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FlashcardTrainerProps {
  products: Product[];
}

export function FlashcardTrainer({ products }: FlashcardTrainerProps) {
  // Shuffle helper
  const shuffleArray = (array: Product[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const [cards, setCards] = useState<Product[]>(() => shuffleArray(products));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rememberedIds, setRememberedIds] = useState<Set<string>>(new Set());
  const [forgottenIds, setForgottenIds] = useState<Set<string>>(new Set());

  const currentProduct = cards[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCards(shuffleArray(products));
      setCurrentIndex(0);
      setRememberedIds(new Set());
      setForgottenIds(new Set());
    }, 150);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(0);
      setRememberedIds(new Set());
      setForgottenIds(new Set());
    }, 150);
  };

  const markRemembered = (id: string) => {
    const newRemembered = new Set(rememberedIds);
    newRemembered.add(id);
    setRememberedIds(newRemembered);

    // Remove from forgotten if it was there
    const newForgotten = new Set(forgottenIds);
    newForgotten.delete(id);
    setForgottenIds(newForgotten);

    handleNext();
  };

  const markForgotten = (id: string) => {
    const newForgotten = new Set(forgottenIds);
    newForgotten.add(id);
    setForgottenIds(newForgotten);

    // Remove from remembered if it was there
    const newRemembered = new Set(rememberedIds);
    newRemembered.delete(id);
    setRememberedIds(newRemembered);

    handleNext();
  };

  // Stats calculation
  const progressPercent = Math.round(((rememberedIds.size + forgottenIds.size) / cards.length) * 100);
  
  // Format price helper
  const formatPrice = (p: number | null) => {
    if (p === null || isNaN(p)) return '';
    return (p * 1000).toLocaleString('vi-VN') + 'đ';
  };

  if (cards.length === 0) return null;

  // Uniquely identify product for tracking (name + item_code combo)
  const productKey = currentProduct.name + (currentProduct.item_code || '');

  return (
    <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center">
      {/* Top statistics Dashboard */}
      <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex gap-4">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Đã nhớ</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{rememberedIds.size}</span>
          </div>
          <div className="w-px h-8 bg-white/10 my-auto" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chưa nhớ</span>
            <span className="text-lg font-bold text-amber-500 mt-0.5 block">{forgottenIds.size}</span>
          </div>
          <div className="w-px h-8 bg-white/10 my-auto" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Còn lại</span>
            <span className="text-lg font-bold text-slate-300 mt-0.5 block">
              {cards.length - rememberedIds.size - forgottenIds.size}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShuffle} 
            title="Trộn thẻ ngẫu nhiên"
            className="text-slate-400 hover:text-white hover:bg-white/10 h-9 w-9 rounded-xl"
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleReset} 
            title="Làm mới tiến trình"
            className="text-slate-400 hover:text-white hover:bg-white/10 h-9 w-9 rounded-xl"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Study progress bar */}
      <div className="w-full space-y-1.5 px-1">
        <div className="flex justify-between text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
          <span>Tiến độ học</span>
          <span>{rememberedIds.size + forgottenIds.size} / {cards.length} ({progressPercent}%)</span>
        </div>
        <Progress value={progressPercent} className="h-1.5 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-purple-500" />
      </div>

      {/* 3D Flashcard Container */}
      <div 
        className="w-full max-w-md aspect-[3/4] cursor-pointer group"
        onClick={handleFlip}
        style={{ perspective: '1200px' }}
      >
        <div 
          className="relative w-full h-full rounded-3xl transition-transform duration-500 select-none shadow-2xl"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* FRONT SIDE (Product view) */}
          <div 
            className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-slate-900/90 p-6 flex flex-col justify-between backdrop-blur-md"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Top Tag & Flip indicator */}
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5">
                {currentProduct.section}
              </Badge>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold uppercase tracking-wider">
                <Rotate3d className="w-3.5 h-3.5" /> Chạm để lật
              </span>
            </div>

            {/* Product Image */}
            <div className="flex-1 my-6 flex items-center justify-center p-4 bg-slate-950/40 rounded-2xl border border-white/5 overflow-hidden">
              <img 
                src={`/anh/${currentProduct.image}`} 
                alt={currentProduct.name}
                className="max-h-56 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Product Title */}
            <div className="text-center space-y-1.5">
              <h2 className="text-lg font-bold text-slate-100 line-clamp-2 leading-snug px-2">
                {currentProduct.name}
              </h2>
              {currentProduct.item_code && (
                <span className="text-xs font-mono text-slate-500">Mã hàng: {currentProduct.item_code}</span>
              )}
            </div>
          </div>

          {/* BACK SIDE (Promotion view) */}
          <div 
            className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-indigo-950/95 p-6 flex flex-col justify-between backdrop-blur-md"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Đáp Án Khuyến Mãi</span>
              <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                <Rotate3d className="w-3.5 h-3.5" /> Chạm để quay lại
              </span>
            </div>

            {/* Promo Details Board */}
            <div className="flex-1 my-6 flex flex-col justify-center items-center text-center space-y-6 px-4">
              <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              {/* Promo Header Badge */}
              <Badge className={`px-3.5 py-1 text-sm font-semibold border ${
                currentProduct.type === 'discount_50' 
                  ? 'bg-emerald-500 border-emerald-400/20 text-white' 
                  : currentProduct.type === 'discount_33'
                  ? 'bg-amber-500 border-amber-400/20 text-white'
                  : 'bg-indigo-600 border-indigo-500/20 text-white'
              }`}>
                {currentProduct.type === 'discount_50' 
                  ? 'MUA 1 TẶNG 1 (GIẢM 50%)' 
                  : currentProduct.type === 'discount_33'
                  ? 'MUA 2 TẶNG 1 (GIẢM 33%)'
                  : 'QUÀ TẶNG KÈM'}
              </Badge>

              {/* Detailed text */}
              <div className="space-y-4">
                <p className="text-base font-bold text-slate-100 leading-relaxed">
                  {currentProduct.promotion}
                </p>

                {/* Price displays if available */}
                {currentProduct.price_normal && (
                  <div className="flex justify-center items-baseline gap-3 pt-2">
                    <span className="text-2xl font-black text-emerald-400 tracking-tight">
                      {formatPrice(currentProduct.price_discount)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(currentProduct.price_normal)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card footer details */}
            <div className="text-center pt-3 border-t border-indigo-500/20">
              <span className="text-xs text-indigo-300 font-semibold line-clamp-1">{currentProduct.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual recall rating actions */}
      <div className="w-full max-w-sm flex items-center justify-between gap-4 pt-2">
        <Button 
          variant="ghost" 
          onClick={handlePrev}
          className="bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl px-5 py-6 font-semibold transition-all shrink-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Trước
        </Button>

        {isFlipped ? (
          <div className="flex items-center gap-2.5 flex-1 justify-center">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                markForgotten(productKey);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl py-6 px-4 shadow-[0_4px_12px_rgba(245,158,11,0.2)] flex-1 text-xs font-semibold flex items-center justify-center gap-1.5 border-none"
            >
              <XCircle className="w-4 h-4" /> Chưa nhớ
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                markRemembered(productKey);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 px-4 shadow-[0_4px_12px_rgba(16,185,129,0.2)] flex-1 text-xs font-semibold flex items-center justify-center gap-1.5 border-none"
            >
              <Check className="w-4 h-4" /> Đã nhớ
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleFlip}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6 px-6 font-semibold flex-1 shadow-[0_4px_12px_rgba(99,102,241,0.3)] text-xs flex items-center justify-center gap-1.5 border-none"
          >
            <Rotate3d className="w-4 h-4" /> Lật xem đáp án
          </Button>
        )}

        <Button 
          variant="ghost" 
          onClick={handleNext}
          className="bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl px-5 py-6 font-semibold transition-all shrink-0"
        >
          Sau <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Helpful Hint */}
      <div className="text-[11px] text-slate-500 font-medium text-center max-w-sm pt-2">
        Mẹo: Xem hình ảnh và tên sản phẩm, cố gắng nhớ xem nó được giảm giá bao nhiêu hay được tặng quà gì, sau đó bấm nút Lật thẻ để so khớp kết quả!
      </div>
    </div>
  );
}
