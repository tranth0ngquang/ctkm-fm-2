'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/product-card';
import { GroupCard, PromoGroup } from '@/components/group-card';
import { Input } from '@/components/ui/input';
import { looseMatch } from '@/lib/search';
import { Search, ArrowUpDown, Layers, X, Grid, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductGridProps {
  products: Product[];
}

type PromoFilter = 'all' | 'discount_50' | 'discount_33' | 'gift_promo';
type SortKey = 'name' | 'code' | 'price_low' | 'price_high';
type ViewMode = 'individual' | 'group';

export function ProductGrid({ products }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<PromoFilter>('all');
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [viewMode, setViewMode] = useState<ViewMode>('group'); // Group mode default as requested by user ("Ví dụ dễ xem hơn")

  // Clear all filters
  const handleReset = () => {
    setSearchQuery('');
    setActiveTab('all');
    setSortBy('name');
  };

  // 1. Individual mode calculation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Query filter
    if (searchQuery.trim() !== '') {
      result = result.filter(
        (p) =>
          looseMatch(p.name, searchQuery) ||
          looseMatch(p.item_code || '', searchQuery) ||
          looseMatch(p.promotion, searchQuery) ||
          looseMatch(p.section, searchQuery)
      );
    }

    // Tab Promotion Type filter
    if (activeTab !== 'all') {
      result = result.filter((p) => p.type === activeTab);
    }

    // Sorting logic
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'vi');
      }
      if (sortBy === 'code') {
        return (a.item_code || '').localeCompare(b.item_code || '');
      }
      if (sortBy === 'price_low') {
        const priceA = a.price_discount ?? 999999;
        const priceB = b.price_discount ?? 999999;
        return priceA - priceB;
      }
      if (sortBy === 'price_high') {
        const priceA = a.price_discount ?? -1;
        const priceB = b.price_discount ?? -1;
        return priceB - priceA;
      }
      return 0;
    });

    return result;
  }, [products, searchQuery, activeTab, sortBy]);

  // 2. Group mode calculation
  const groupedProducts = useMemo(() => {
    const groupsMap = new Map<string, PromoGroup>();
    let singleGroupCounter = 0;

    products.forEach((p) => {
      if (p.group_id) {
        if (!groupsMap.has(p.group_id)) {
          groupsMap.set(p.group_id, {
            id: p.group_id,
            name: p.group_name || p.name,
            products: [],
            promotion: p.promotion,
            type: p.type,
            section: p.section,
          });
        }
        groupsMap.get(p.group_id)!.products.push(p);
      } else {
        // Individual item group
        const singleId = `single_${p.name}_${p.item_code || singleGroupCounter++}`;
        groupsMap.set(singleId, {
          id: singleId,
          name: p.name,
          products: [p],
          promotion: p.promotion,
          type: p.type,
          section: p.section,
        });
      }
    });

    let groupsList = Array.from(groupsMap.values());

    // Filter groups by tab category
    if (activeTab !== 'all') {
      groupsList = groupsList.filter((g) => g.type === activeTab);
    }

    // Filter groups by search query
    if (searchQuery.trim() !== '') {
      groupsList = groupsList.filter((g) => {
        // Match group name, promotion details, or section
        if (
          looseMatch(g.name, searchQuery) ||
          looseMatch(g.promotion, searchQuery) ||
          looseMatch(g.section, searchQuery)
        ) {
          return true;
        }
        // Match any product in the group
        return g.products.some(
          (p) =>
            looseMatch(p.name, searchQuery) ||
            looseMatch(p.item_code || '', searchQuery)
        );
      });
    }

    // Sorting groups
    groupsList.sort((a, b) => {
      // Prioritize groups with multiple products to be on top, then alphabetical
      const aSize = a.products.length;
      const bSize = b.products.length;
      if (aSize !== bSize) {
        return bSize - aSize;
      }
      return a.name.localeCompare(b.name, 'vi');
    });

    return groupsList;
  }, [products, activeTab, searchQuery]);

  // Statistics for badges
  const stats = useMemo(() => {
    return {
      all: products.length,
      discount_50: products.filter((p) => p.type === 'discount_50').length,
      discount_33: products.filter((p) => p.type === 'discount_33').length,
      gift_promo: products.filter((p) => p.type === 'gift_promo').length,
    };
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Search and Filters panel */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg shadow-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search Input wrapper */}
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors duration-200" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên, mã vạch hoặc quà tặng..."
            className="pl-10 pr-10 py-5 bg-slate-950/40 border-white/10 text-slate-100 placeholder:text-slate-400 rounded-xl focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode & Sorting Panel */}
        <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto justify-end">
          {/* Display Mode Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('group')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'group'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Theo nhóm
            </button>
            <button
              onClick={() => setViewMode('individual')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === 'individual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Từng món
            </button>
          </div>

          {/* Sort Selector: only display in individual mode */}
          {viewMode === 'individual' && (
            <div className="flex items-center gap-2 bg-slate-950/40 px-3 py-2 rounded-xl border border-white/10">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="bg-transparent border-none text-xs text-slate-300 focus:outline-none cursor-pointer font-medium pr-1"
              >
                <option value="name" className="bg-slate-900 text-slate-200">Sắp xếp: Tên A-Z</option>
                <option value="code" className="bg-slate-900 text-slate-200">Sắp xếp: Mã hàng</option>
                <option value="price_low" className="bg-slate-900 text-slate-200">Sắp xếp: Giá thấp → cao</option>
                <option value="price_high" className="bg-slate-900 text-slate-200">Sắp xếp: Giá cao → thấp</option>
              </select>
            </div>
          )}

          {(searchQuery || activeTab !== 'all' || sortBy !== 'name') && (
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-3 py-2 rounded-xl h-auto"
            >
              Đặt lại bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Categories / Tabs pill layout */}
      <div className="flex flex-wrap gap-2.5 pb-2 border-b border-white/5">
        {[
          { id: 'all', label: 'Tất Cả', count: stats.all, color: 'border-white/10 text-slate-300' },
          {
            id: 'discount_50',
            label: 'Mua 1 Tặng 1',
            count: stats.discount_50,
            color: 'border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400',
          },
          {
            id: 'discount_33',
            label: 'Mua 2 Tặng 1',
            count: stats.discount_33,
            color: 'border-amber-500/20 hover:border-amber-500/40 text-amber-400',
          },
          {
            id: 'gift_promo',
            label: 'Quà Tặng Kèm',
            count: stats.gift_promo,
            color: 'border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400',
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PromoFilter)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? tab.id === 'all'
                    ? 'bg-white text-slate-950 border-white'
                    : tab.id === 'discount_50'
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                    : tab.id === 'discount_33'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-indigo-600 text-white border-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.3)]'
                  : `bg-slate-900/40 hover:bg-slate-800/40 ${tab.color}`
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive
                    ? 'bg-black/20 text-current'
                    : 'bg-white/10 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Items count summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>
            {viewMode === 'group' ? (
              <span>
                Hiển thị <strong>{groupedProducts.length}</strong> nhóm khuyến mãi
              </span>
            ) : (
              <span>
                Hiển thị <strong>{filteredProducts.length}</strong> trên <strong>{products.length}</strong> sản phẩm
              </span>
            )}
          </span>
        </div>
        {searchQuery && (
          <span>
            Kết quả tìm kiếm cho &ldquo;{searchQuery}&rdquo;
          </span>
        )}
      </div>

      {/* Display Grid based on ViewMode */}
      {viewMode === 'group' ? (
        groupedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {groupedProducts.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          /* Empty search results for groups */
          <div className="py-16 px-4 text-center rounded-2xl border border-white/5 bg-slate-950/20 backdrop-blur-sm max-w-md mx-auto flex flex-col items-center justify-center">
            <div className="p-4 bg-white/5 border border-white/10 rounded-full mb-4">
              <Search className="w-8 h-8 text-slate-500 animate-pulse" />
            </div>
            <h4 className="text-base font-semibold text-slate-200">Không tìm thấy nhóm sản phẩm nào</h4>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Thử tìm kiếm với từ khóa khác hoặc xóa bớt bộ lọc đang chọn.
            </p>
            <Button
              onClick={handleReset}
              className="mt-5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2"
            >
              Xóa bộ lọc và tìm lại
            </Button>
          </div>
        )
      ) : (
        /* Individual Mode */
        filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.name + product.item_code} product={product} />
            ))}
          </div>
        ) : (
          /* Empty search results for individual products */
          <div className="py-16 px-4 text-center rounded-2xl border border-white/5 bg-slate-950/20 backdrop-blur-sm max-w-md mx-auto flex flex-col items-center justify-center">
            <div className="p-4 bg-white/5 border border-white/10 rounded-full mb-4">
              <Search className="w-8 h-8 text-slate-500 animate-pulse" />
            </div>
            <h4 className="text-base font-semibold text-slate-200">Không tìm thấy sản phẩm nào</h4>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Thử tìm kiếm với từ khóa khác hoặc xóa bớt bộ lọc đang chọn.
            </p>
            <Button
              onClick={handleReset}
              className="mt-5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2"
            >
              Xóa bộ lọc và tìm lại
            </Button>
          </div>
        )
      )}
    </div>
  );
}
