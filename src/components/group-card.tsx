'use client';

import React, { useState } from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Gift, Percent, Sparkles, Layers, AlertCircle } from 'lucide-react';

export interface PromoGroup {
  id: string;
  name: string;
  products: Product[];
  promotion: string;
  type: 'discount_50' | 'discount_33' | 'gift_promo';
  section: string;
}

interface GroupCardProps {
  group: PromoGroup;
}

export function GroupCard({ group }: GroupCardProps) {
  const [showDetail, setShowDetail] = useState(false);

  const formatPrice = (p: number | null) => {
    if (p === null || isNaN(p)) return '';
    return (p * 1000).toLocaleString('vi-VN') + 'đ';
  };

  const isMultiItem = group.products.length > 1;

  // Determine colors based on type
  let badgeColor = '';
  let badgeIcon = null;
  let promoLabel = group.promotion;
  let sectionColor = 'text-indigo-400';
  let boxBg = 'bg-indigo-950/30 border-indigo-500/10';
  let boxTitleColor = 'text-indigo-400';
  let boxTextColor = 'text-indigo-100';

  if (group.type === 'discount_50') {
    badgeColor = 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-400/20';
    badgeIcon = <Percent className="w-3.5 h-3.5 mr-1" />;
    promoLabel = 'Mua 1 Tặng 1 (Giảm 50%)';
    sectionColor = 'text-emerald-400';
    boxBg = 'bg-emerald-950/40 border border-emerald-500/20';
    boxTitleColor = 'text-emerald-400';
    boxTextColor = 'text-emerald-100';
  } else if (group.type === 'discount_33') {
    badgeColor = 'bg-amber-500 hover:bg-amber-600 text-white border-amber-400/20';
    badgeIcon = <Percent className="w-3.5 h-3.5 mr-1" />;
    promoLabel = 'Mua 2 Tặng 1 (Giảm 33%)';
    sectionColor = 'text-amber-400';
    boxBg = 'bg-amber-950/40 border border-amber-500/20';
    boxTitleColor = 'text-amber-400';
    boxTextColor = 'text-amber-100';
  } else {
    badgeColor = 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500/20';
    badgeIcon = <Gift className="w-3.5 h-3.5 mr-1" />;
  }

  return (
    <>
      {/* Clickable Card Trigger */}
      <div onClick={() => setShowDetail(true)} className="cursor-pointer h-full">
        <Card className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_12px_30px_-10px_rgba(99,102,241,0.25)] flex flex-col justify-between h-full">
          {/* Background radial glow on hover */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-t from-indigo-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div>
            {/* Images Gallery Container */}
            <div className="bg-slate-950/20 p-4 border-b border-white/5">
              {/* Badge Overlay */}
              <div className="flex justify-between items-center mb-3">
                <Badge className={`px-2.5 py-0.5 text-[10px] font-semibold tracking-wide shadow-sm flex items-center border ${badgeColor}`}>
                  {badgeIcon}
                  {group.type === 'gift_promo' ? 'Quà Tặng Nhóm' : promoLabel}
                </Badge>

                {isMultiItem && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Nhóm {group.products.length} món đi chung
                  </span>
                )}
              </div>

              {/* Images Grid */}
              <div className="flex flex-wrap gap-2 items-center justify-start min-h-[80px]">
                {group.products.map((p) => (
                  <div 
                    key={p.name + p.item_code}
                    className={`relative bg-white rounded-xl overflow-hidden p-1.5 flex items-center justify-center border border-slate-200/50 shadow-sm transition-transform duration-300 hover:scale-110 ${
                      isMultiItem ? 'w-16 h-16' : 'w-24 h-24 mx-auto'
                    }`}
                    title={p.name}
                  >
                    <img 
                      src={`/anh/${p.image}`} 
                      alt={p.name}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            <CardContent className="p-4 relative z-10">
              {/* Section Category */}
              <span className={`text-[10px] font-bold tracking-wider uppercase ${sectionColor}`}>
                {group.section}
              </span>
              
              {/* Group / Product Title */}
              <h3 className="mt-1 font-bold text-slate-100 leading-snug group-hover:text-indigo-300 transition-colors duration-200 text-sm">
                {group.name}
              </h3>

              {/* List of included products if multi-item */}
              {isMultiItem && (
                <ul className="mt-3.5 space-y-2 border-t border-white/5 pt-3">
                  <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">Danh sách món trong nhóm:</span>
                  {group.products.slice(0, 3).map((p) => (
                    <li key={p.name} className="text-xs text-slate-200 flex items-start gap-1.5 leading-relaxed font-semibold">
                      <span className="text-indigo-400 font-bold mt-0.5">•</span>
                      <span className="truncate">
                        {p.name} 
                        {p.item_code && (
                          <span className="text-[10px] font-mono text-slate-400 ml-1.5 px-1 py-0.2 rounded bg-white/5 border border-white/5">
                            {p.item_code}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                  {group.products.length > 3 && (
                    <li className="text-[10px] text-indigo-400 font-bold italic pl-3">
                      + Xem thêm {group.products.length - 3} món khác...
                    </li>
                  )}
                </ul>
              )}

              {/* If single product, show price standard display */}
              {!isMultiItem && group.products[0] && (
                <div className="mt-3 flex items-baseline gap-2">
                  {group.products[0].price_normal ? (
                    <>
                      <span className="text-lg font-bold text-slate-5 tracking-tight">
                        {formatPrice(group.products[0].price_discount)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(group.products[0].price_normal)}
                      </span>
                    </>
                  ) : (
                    <div className="flex items-center gap-1.5 py-0.5 text-amber-400">
                      <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
                      <span className="text-xs font-bold tracking-wide uppercase">
                        Ưu đãi quà tặng
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </div>

          {/* Footer Info Box */}
          <CardFooter className="px-4 pb-4 pt-0 bg-transparent border-t-0 p-0 block relative z-10">
            <div className={`w-full border rounded-xl p-3 flex flex-col gap-0.5 ${boxBg}`}>
              <span className={`text-[9px] font-extrabold uppercase tracking-widest ${boxTitleColor}`}>
                Chương trình áp dụng
              </span>
              <p className={`text-xs font-bold leading-relaxed line-clamp-2 ${boxTextColor}`}>
                {group.promotion}
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Group Detail Modal/Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-5xl md:min-h-[750px] border border-white/10 bg-slate-900 text-white shadow-2xl rounded-3xl p-8 backdrop-blur-lg focus:outline-none max-h-[90vh] overflow-y-auto flex flex-col justify-between">
          <DialogHeader className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className={`px-2.5 py-0.5 text-[10px] font-bold border ${badgeColor}`}>
                {group.type === 'gift_promo' ? 'Quà Tặng Nhóm' : promoLabel}
              </Badge>
              <span className={`text-[10px] font-bold tracking-wider uppercase ${sectionColor}`}>
                {group.section}
              </span>
            </div>
            
            <DialogTitle className="text-2xl font-black text-slate-50 leading-snug pt-1">
              {group.name}
            </DialogTitle>
            
            <DialogDescription className="text-slate-400 text-xs">
              Nhóm bao gồm {group.products.length} sản phẩm áp dụng chung chương trình khuyến mãi.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 flex-1 items-stretch">
            {/* Left side: Images Grid */}
            <div className="space-y-3.5 flex flex-col justify-between h-full">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Hình ảnh các sản phẩm</span>
              <div className="grid grid-cols-2 gap-4 max-h-[580px] overflow-y-auto pr-1 flex-1 mt-2">
                {group.products.map((p) => (
                  <div 
                    key={p.name + p.item_code}
                    className="bg-white rounded-2xl p-4 flex flex-col items-center justify-between border border-white/5 shadow-sm select-none min-h-[220px]"
                  >
                    <div className="flex-1 flex items-center justify-center overflow-hidden max-h-32 w-full">
                      <img 
                        src={`/anh/${p.image}`} 
                        alt={p.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <span className="text-[10px] text-slate-800 font-extrabold text-center line-clamp-2 mt-3 leading-tight">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Info details */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-3.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Chương trình khuyến mãi của nhóm</span>
                
                <div className={`p-5 rounded-2xl border ${boxBg} space-y-2`}>
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest block ${boxTitleColor}`}>
                    Ưu đãi áp dụng
                  </span>
                  <p className={`text-base font-extrabold leading-relaxed ${boxTextColor}`}>
                    {group.promotion}
                  </p>
                </div>
              </div>

              {/* Product detailed pricing list */}
              <div className="space-y-3.5 flex-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Danh sách & Báo giá chi tiết</span>
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                  {group.products.map((p) => (
                    <div key={p.name} className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1.5">
                      <div className="flex justify-between items-start gap-3">
                        <span className="text-sm font-extrabold text-slate-100 leading-snug">{p.name}</span>
                        {p.item_code && (
                          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-black/35 border border-white/5 shrink-0">
                            {p.item_code}
                          </span>
                        )}
                      </div>
                      
                      {p.price_normal && p.price_discount ? (
                        <div className="flex justify-between items-center pt-0.5">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm font-black text-emerald-400">
                              {formatPrice(p.price_discount)}
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              {formatPrice(p.price_normal)}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-500 font-bold">
                            T.Kiệm {formatPrice(p.price_normal - p.price_discount)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-amber-400 font-bold flex items-center gap-1.5 pt-0.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Áp dụng quà tặng kèm</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
