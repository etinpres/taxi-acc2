'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { useSwipe } from '@/hooks/use-swipe';

interface SwipeableViewProps {
  children: ReactNode;
  viewKey: string;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export function SwipeableView({ children, viewKey, onPrev, onNext, className }: SwipeableViewProps) {
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipeLeft = useCallback(() => {
    setDirection('left');
    onNext();
  }, [onNext]);

  const handleSwipeRight = useCallback(() => {
    setDirection('right');
    onPrev();
  }, [onPrev]);

  const swipeRef = useSwipe<HTMLDivElement>({ onSwipeLeft: handleSwipeLeft, onSwipeRight: handleSwipeRight });

  const animClass = direction === 'left' ? 'animate-slide-from-right' : direction === 'right' ? 'animate-slide-from-left' : '';

  return (
    <div ref={swipeRef} style={{ overflow: 'hidden' }}>
      <div key={viewKey} className={`${className ?? ''} ${animClass}`} onAnimationEnd={() => setDirection(null)}>
        {children}
      </div>
    </div>
  );
}
