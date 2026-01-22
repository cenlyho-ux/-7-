import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Role, Hero } from './types';
import { HEROES, ROLE_OPTIONS } from './constants';

// 👑 核心修改：亚瑟头像作为全能备选项（当没有选中英雄或图片加载失败时使用）
const ARTHUR_ICON = "https://game.gtimg.cn/images/yxzj/img201605/hero/face/166.jpg";

interface HistoryEntry {
  hero: Hero;
  role: Role;
  timestamp: number;
}

type LotteryPhase = 'idle' | 'spinning' | 'revealed';

// --- 子组件：滚动卷轴 ---
const SlotReel: React.FC<{
  targetHero: Hero | null;
  isSpinning: boolean;
  delay: number;
  onFinish: () => void;
}> = ({ targetHero, isSpinning, delay, onFinish }) => {
  const [offset, setOffset] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const ITEM_HEIGHT = 120; 
  const VISIBLE_COUNT = 90; 
  const CENTER_OFFSET = 160; 
  
  const displayList = useMemo(() => {
    const randomPool = [...HEROES].sort(() => Math.random() - 0.5);
    const finalItems = [];
    for (let i = 0; i < VISIBLE_COUNT; i++) {
      finalItems.push(randomPool[i % randomPool.length]);
    }
    if (targetHero) {
      finalItems[VISIBLE_COUNT - 2] = targetHero;
    }
    return finalItems;
  }, [targetHero]);

  useEffect(() => {
    if (isSpinning) {
      setIsDone(false);
      setOffset(0);
      const targetOffset = (VISIBLE_COUNT - 2) * ITEM_HEIGHT - CENTER_OFFSET;
      
      const timer = setTimeout(() => {
        setOffset(targetOffset);
        const finishTimer = setTimeout(() => {
          setIsDone(true);
          onFinish();
        }, 4500);
        return () => clearTimeout(finish
