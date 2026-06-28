'use client';

import React from 'react';
import productsData from '@/data/ctkm.json';
import { Product } from '@/types/product';
import { ProductGrid } from '@/components/product-grid';
import { FlashcardTrainer } from '@/components/flashcard-trainer';
import { QuizTrainer } from '@/components/quiz-trainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Search, Award, Store } from 'lucide-react';

export default function HomePage() {
  const products = productsData as Product[];

  return (
    <main className="min-h-screen bg-[#070913] bg-radial-at-t from-slate-900 via-[#070913] to-black text-slate-100 pb-20">
      {/* Decorative background lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* Header section */}
      <header className="max-w-6xl mx-auto px-4 pt-10 pb-8 text-center space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider animate-fadeIn">
          <Store className="w-4 h-4" /> Cửa hàng FM - Học & Tra cứu
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-indigo-200 to-indigo-400">
            Học Chương Trình Khuyến Mãi
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
            Hệ thống hỗ trợ tra cứu nhanh chóng và luyện trí nhớ thông qua hình ảnh trực quan, thẻ ghi nhớ flashcards 3D và các bài trắc nghiệm nhanh.
          </p>
        </div>
      </header>

      {/* Main Tabs Container */}
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <Tabs defaultValue="search" className="space-y-8">
          
          {/* Tabs navigation list */}
          <div className="flex justify-center">
            <TabsList className="bg-slate-900/60 border border-white/10 rounded-2xl p-1.5 h-auto flex flex-wrap md:flex-nowrap gap-1 backdrop-blur-md">
              <TabsTrigger 
                value="search" 
                className="rounded-xl px-5 py-3 text-xs md:text-sm font-bold flex items-center gap-2 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-200 border-none"
              >
                <Search className="w-4 h-4" />
                Tra cứu nhanh
              </TabsTrigger>
              
              <TabsTrigger 
                value="flashcard" 
                className="rounded-xl px-5 py-3 text-xs md:text-sm font-bold flex items-center gap-2 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-200 border-none"
              >
                <BookOpen className="w-4 h-4" />
                Thẻ học Flashcard
              </TabsTrigger>
              
              <TabsTrigger 
                value="quiz" 
                className="rounded-xl px-5 py-3 text-xs md:text-sm font-bold flex items-center gap-2 text-slate-400 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-200 border-none"
              >
                <Award className="w-4 h-4" />
                Luyện Trắc nghiệm
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab contents */}
          <TabsContent value="search" className="space-y-4 focus-visible:outline-none outline-none">
            <ProductGrid products={products} />
          </TabsContent>

          <TabsContent value="flashcard" className="focus-visible:outline-none outline-none">
            <FlashcardTrainer products={products} />
          </TabsContent>

          <TabsContent value="quiz" className="focus-visible:outline-none outline-none">
            <QuizTrainer products={products} />
          </TabsContent>

        </Tabs>
      </div>

      {/* Footer copyright */}
      <footer className="text-center text-xs text-slate-600 font-medium py-16">
        &copy; {new Date().getFullYear()} Cửa Hàng FM. Phát triển bởi Antigravity.
      </footer>
    </main>
  );
}
