'use client';

import React from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gift, Percent, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (p: number | null) => {
    if (p === null || isNaN(p)) return '';
    return (p * 1000).toLocaleString('vi-VN') + 'đ';
  };

  // Determine styling based on promo type
  let badgeColor = '';
  let badgeIcon = null;
  let promoText = product.promotion;
  
  // Custom glowing colors for dark mode to fix legibility
  let sectionColor = 'text-indigo-400';
  let boxBg = 'bg-indigo-950/30 border-indigo-500/10';
  let boxTitleColor = 'text-indigo-400';
  let boxTextColor = 'text-indigo-100';

  if (product.type === 'discount_50') {
    badgeColor = 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400/20';
    badgeIcon = <Percent className="w-3.5 h-3.5 mr-1" />;
    promoText = 'Mua 1 Tặng 1 (Giảm 50%)';
    sectionColor = 'text-emerald-400';
    boxBg = 'bg-emerald-950/40 border border-emerald-500/20';
    boxTitleColor = 'text-emerald-400';
    boxTextColor = 'text-emerald-100';
  } else if (product.type === 'discount_33') {
    badgeColor = 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400/20';
    badgeIcon = <Percent className="w-3.5 h-3.5 mr-1" />;
    promoText = 'Mua 2 Tặng 1 (Giảm 33%)';
    sectionColor = 'text-amber-400';
    boxBg = 'bg-amber-950/40 border border-amber-500/20';
    boxTitleColor = 'text-amber-400';
    boxTextColor = 'text-amber-100';
  } else {
    badgeColor = 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500/20';
    badgeIcon = <Gift className="w-3.5 h-3.5 mr-1" />;
  }

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_12px_30px_-10px_rgba(99,102,241,0.25)] flex flex-col justify-between">
      {/* Background radial glow on hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div>
        {/* Image container: solid white so white-background product images look native and perfect */}
        <div className="relative aspect-square w-full overflow-hidden bg-white p-4 flex items-center justify-center border-b border-white/5">
          <img
            src={`/anh/${product.image}`}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Promotion Badge Overlay */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className={`px-2.5 py-1 text-xs font-semibold tracking-wide shadow-lg flex items-center border ${badgeColor}`}>
              {badgeIcon}
              {product.type === 'gift_promo' ? 'Quà Tặng' : promoText}
            </Badge>
          </div>

          {/* Item Code Overlay (bottom-left) */}
          {product.item_code && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/70 text-slate-300 border border-white/10 backdrop-blur-sm">
                Code: {product.item_code}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4 relative z-10">
          {/* Section Category */}
          <span className={`text-[10px] font-bold tracking-wider uppercase ${sectionColor}`}>
            {product.section}
          </span>
          
          {/* Name */}
          <h3 className="mt-1 font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            {product.price_normal ? (
              <>
                <span className="text-xl font-bold text-slate-50 tracking-tight">
                  {formatPrice(product.price_discount)}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price_normal)}
                </span>
              </>
            ) : (
              <div className="flex items-center gap-1.5 py-0.5 text-amber-400">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                <span className="text-xs font-bold tracking-wide uppercase">
                  Ưu đãi quà tặng
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      {/* Footer Info Box: Customized with bright, high-contrast glow themes */}
      <CardFooter className="px-4 pb-4 pt-0 bg-transparent border-t-0 p-0 block relative z-10">
        <div className={`w-full border rounded-xl p-3 flex flex-col gap-0.5 ${boxBg}`}>
          <span className={`text-[9px] font-extrabold uppercase tracking-widest ${boxTitleColor}`}>
            {product.type === 'gift_promo' ? 'Ưu đãi đi kèm' : 'Chi tiết chương trình'}
          </span>
          <p className={`text-xs font-bold leading-relaxed line-clamp-2 ${boxTextColor}`}>
            {product.promotion}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
