'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  HelpCircle, 
  Flame, 
  CheckCircle, 
  XCircle, 
  Award,
  RefreshCw,
  Trophy,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizTrainerProps {
  products: Product[];
}

interface Question {
  product: Product;
  options: string[];
  correctAnswer: string;
}

export function QuizTrainer({ products }: QuizTrainerProps) {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [wrongProducts, setWrongProducts] = useState<Product[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Generate a new question from a target list
  const generateQuestion = (listToPickFrom: Product[], reviewModeActive: boolean) => {
    if (listToPickFrom.length === 0) {
      setIsReviewMode(false);
      // Fallback to normal products if list is empty
      if (products.length > 0) {
        generateQuestion(products, false);
      }
      return;
    }

    // Pick a random product
    const randomIndex = Math.floor(Math.random() * listToPickFrom.length);
    const correctProduct = listToPickFrom[randomIndex];
    const correctAnswer = correctProduct.promotion;

    // Collect incorrect options from all products to ensure variety
    const otherPromotions = Array.from(
      new Set(
        products
          .filter((p) => p.promotion !== correctAnswer)
          .map((p) => p.promotion)
      )
    );

    // Pick 3 random promotions from others
    const incorrectOptions: string[] = [];
    const tempOthers = [...otherPromotions];
    while (incorrectOptions.length < 3 && tempOthers.length > 0) {
      const idx = Math.floor(Math.random() * tempOthers.length);
      incorrectOptions.push(tempOthers[idx]);
      tempOthers.splice(idx, 1);
    }

    // Combine and shuffle options
    const options = [correctAnswer, ...incorrectOptions].sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      product: correctProduct,
      options,
      correctAnswer,
    });
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  // Generate first question on mount
  useEffect(() => {
    generateQuestion(products, false);
  }, [products]);

  // Handle answer selection
  const handleAnswer = (option: string) => {
    if (isAnswered || !currentQuestion) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    setTotalQuestions((prev) => prev + 1);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const nextStreak = prev + 1;
        if (nextStreak > bestStreak) setBestStreak(nextStreak);
        
        // Confetti milestones
        if (nextStreak % 5 === 0) {
          triggerBigConfetti();
        } else {
          triggerMiniConfetti();
        }
        return nextStreak;
      });

      // If in review mode and answer is correct, remove this product from wrongProducts!
      if (isReviewMode) {
        setWrongProducts((prev) => prev.filter((p) => p.name !== currentQuestion.product.name));
      }
    } else {
      setStreak(0);
      
      // If in normal mode, add it to wrongProducts list
      if (!isReviewMode) {
        setWrongProducts((prev) => {
          if (prev.some((p) => p.name === currentQuestion.product.name)) return prev;
          return [...prev, currentQuestion.product];
        });
      }
    }
  };

  // Mini confetti on correct answer
  const triggerMiniConfetti = () => {
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#10b981', '#f59e0b']
    });
  };

  // Big burst on streak milestones
  const triggerBigConfetti = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Load next question
  const handleNextQuestion = () => {
    if (isReviewMode) {
      // Find what the new list of wrong products will be
      const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
      let nextWrongProducts = wrongProducts;
      
      if (isCorrect && currentQuestion) {
        nextWrongProducts = wrongProducts.filter((p) => p.name !== currentQuestion.product.name);
      }

      if (nextWrongProducts.length === 0) {
        // Finished all wrong questions!
        setIsReviewMode(false);
        triggerBigConfetti();
        alert("Chúc mừng! Bạn đã hoàn thành ôn tập tất cả các câu sai 🎉");
        generateQuestion(products, false);
      } else {
        generateQuestion(nextWrongProducts, true);
      }
    } else {
      generateQuestion(products, false);
    }
  };

  // Start Reviewing Wrong Questions
  const handleStartReview = () => {
    if (wrongProducts.length === 0) return;
    setIsReviewMode(true);
    generateQuestion(wrongProducts, true);
  };

  // Exit Review Mode back to normal quiz
  const handleExitReview = () => {
    setIsReviewMode(false);
    generateQuestion(products, false);
  };

  const handleResetQuiz = () => {
    setScore(0);
    setStreak(0);
    setTotalQuestions(0);
    setWrongProducts([]);
    setIsReviewMode(false);
    generateQuestion(products, false);
  };

  if (!currentQuestion) return null;

  const { product, options, correctAnswer } = currentQuestion;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz scoreboard dashboard */}
      <div className="grid grid-cols-3 gap-4">
        {/* Correct Answers box */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Đúng / Tổng số</span>
          <div className="flex items-center justify-center gap-1 mt-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-base font-bold text-slate-200">
              {score} <span className="text-slate-500 font-normal">/</span> {totalQuestions}
            </span>
          </div>
        </div>

        {/* Current streak box */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md relative overflow-hidden">
          {streak >= 3 && (
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-orange-500 animate-ping m-2" />
          )}
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chuỗi đúng</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Flame className={`w-4 h-4 ${streak >= 3 ? 'text-orange-500 animate-bounce' : 'text-slate-400'}`} />
            <span className={`text-base font-bold ${streak >= 3 ? 'text-orange-400' : 'text-slate-200'}`}>
              {streak}
            </span>
          </div>
        </div>

        {/* Best streak box */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Kỷ lục chuỗi</span>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="text-base font-bold text-indigo-300">
              {bestStreak}
            </span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <Card className="border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Section Indicator */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5">
                {product.section}
              </Badge>
              {isReviewMode && (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold border-none shadow-sm">
                  Đang ôn câu sai
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" /> Câu hỏi trắc nghiệm
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Product image */}
            <div className="w-40 h-40 shrink-0 bg-white rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-3 relative group">
              <img 
                src={`/anh/${product.image}`} 
                alt={product.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Question Text */}
            <div className="space-y-2 text-center md:text-left flex-1">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Món hàng này có chương trình khuyến mãi nào?</h2>
              <p className="text-xl font-bold text-slate-100 leading-snug">
                {product.name}
              </p>
              {product.item_code && (
                <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400">
                  Mã hàng: {product.item_code}
                </span>
              )}
            </div>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOpt = option === correctAnswer;
              
              let btnClass = 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-white/20';
              let statusIcon = null;

              if (isAnswered) {
                if (isCorrectOpt) {
                  btnClass = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
                  statusIcon = <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
                } else if (isSelected) {
                  btnClass = 'border-rose-500 bg-rose-500/20 text-rose-300';
                  statusIcon = <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
                } else {
                  btnClass = 'border-white/5 bg-white/2 text-slate-500 cursor-not-allowed opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(option)}
                  className={`w-full px-5 py-4 rounded-2xl border text-left text-sm font-medium transition-all duration-200 flex items-center justify-between gap-4 outline-none ${btnClass}`}
                >
                  <span className="leading-relaxed">{option}</span>
                  {statusIcon}
                </button>
              );
            })}
          </div>

          {/* Feedback & Action button */}
          {isAnswered && (
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t border-white/5 animate-fadeIn">
              <div className="text-center sm:text-left">
                {selectedAnswer === correctAnswer ? (
                  <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-center sm:justify-start">
                    <Sparkles className="w-4 h-4 animate-bounce" /> Chính xác!
                    {isReviewMode && <span className="text-xs font-normal text-emerald-300/80 ml-1">(Đã loại khỏi danh sách câu sai)</span>}
                  </p>
                ) : (
                  <p className="text-sm font-semibold text-rose-400 flex items-center gap-1.5 justify-center sm:justify-start">
                    Chưa chính xác! Bạn đã chọn sai.
                  </p>
                )}
              </div>
              <Button
                onClick={handleNextQuestion}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-5 shadow-lg flex items-center gap-2 group shrink-0 border-none font-semibold"
              >
                Câu tiếp theo <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Section (Wrong answers list with Practice Button) */}
      {wrongProducts.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Món cần ôn lại ({wrongProducts.length})
            </h3>
            
            {!isReviewMode ? (
              <Button
                onClick={handleStartReview}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 h-auto rounded-xl shadow-md border-none flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 animate-spin-slow" />
                Ôn tập câu sai ngay ({wrongProducts.length})
              </Button>
            ) : (
              <Button
                onClick={handleExitReview}
                className="bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold px-4 py-2 h-auto rounded-xl border border-white/10 flex items-center gap-1.5"
              >
                Thoát chế độ ôn tập
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
            {wrongProducts.map((p, idx) => (
              <Badge 
                key={idx} 
                variant="outline" 
                className="bg-slate-950/40 hover:bg-slate-900 border-white/5 text-slate-300 py-1.5 px-3 rounded-lg text-[11px] font-medium flex items-center gap-1.5 shrink-0"
              >
                <img src={`/anh/${p.image}`} alt={p.name} className="w-4 h-4 object-contain" />
                <span className="truncate max-w-[150px]">{p.name}</span>
              </Badge>
            ))}
          </div>
          
          <div className="text-[10px] text-slate-500 font-medium italic leading-relaxed">
            Mẹo: Bấm nút <strong>&ldquo;Ôn tập câu sai ngay&rdquo;</strong> để luyện riêng các món bạn đã trả lời sai. Khi trả lời đúng một món, món đó sẽ tự động được xóa khỏi danh sách cần ôn này.
          </div>
        </div>
      )}

      {/* Reset Quiz button */}
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          onClick={handleResetQuiz}
          className="text-slate-400 hover:text-white hover:bg-white/5 text-xs font-semibold rounded-xl px-4 py-2"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" /> Làm mới lại điểm số
        </Button>
      </div>
    </div>
  );
}
