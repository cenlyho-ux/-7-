
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Role, Hero } from './types';
import { HEROES, ROLE_OPTIONS } from './constants';

const ARTHUR_ICON = "https://game.gtimg.cn/images/yxzj/img201605/hero/face/166.jpg";

interface HistoryEntry {
  hero: Hero;
  role: Role;
  timestamp: number;
}

type LotteryPhase = 'idle' | 'spinning' | 'revealed';

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
        return () => clearTimeout(finishTimer);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setOffset(0);
      setIsDone(false);
    }
  }, [isSpinning, delay, onFinish]);

  return (
    <div className="flex-1 h-full relative overflow-hidden bg-transparent z-10">
      <div 
        className={`reel-strip flex flex-col items-center reel-transition ${!isDone && isSpinning ? 'blur-motion' : ''}`}
        style={{ transform: `translateY(-${offset}px)` }}
      >
        {displayList.map((hero, i) => (
          <div 
            key={`${hero.name}-${i}`} 
            className="w-full flex items-center justify-center shrink-0"
            style={{ height: `${ITEM_HEIGHT}px` }}
          >
            <div className={`w-24 h-24 rounded-3xl overflow-hidden border-2 bg-slate-800 transition-all duration-1000 ${isDone ? 'border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.6)] scale-110' : 'border-white/[0.15] opacity-100 brightness-100'}`}>
              <img src={hero.imageUrl} className="w-full h-full object-cover" key={hero.imageUrl} onError={(e) => {
                (e.target as HTMLImageElement).src = "https://game.gtimg.cn/images/yxzj/img201605/hero/face/166.jpg";
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lottery' | 'blacklist' | 'history'>('lottery');
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [blacklistRole, setBlacklistRole] = useState<Role | 'ALL'>('ALL');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [isBanQuestionOpen, setIsBanQuestionOpen] = useState(false);
  const [phase, setPhase] = useState<LotteryPhase>('idle');
  const [showFlash, setShowFlash] = useState(false);
  
  const [lotteryResult, setLotteryResult] = useState<Hero | null>(null);
  const [lotteryRole, setLotteryRole] = useState<Role | null>(null);

  const reelsFinished = useRef(0);

  useEffect(() => {
    const savedHistory = localStorage.getItem('lottery_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
  }, []);

  const eligibleHeroes = useMemo(() => HEROES.filter(h => !blacklist.includes(h.name)), [blacklist]);

  const executeLottery = useCallback(async (roles: Role[]) => {
    setIsPrepModalOpen(false);
    setIsBanQuestionOpen(false);
    setActiveTab('lottery');
    
    const pool = eligibleHeroes.filter(h => h.roles.some(r => roles.includes(r)));
    if (pool.length === 0) {
      alert("候选池为空，请调整分路或减少禁用英雄！");
      return;
    }

    const result = pool[Math.floor(Math.random() * pool.length)];
    const finalRole = result.roles.filter(r => roles.includes(r))[0];

    reelsFinished.current = 0;
    setLotteryResult(result);
    setLotteryRole(finalRole);
    setPhase('spinning');

    const newEntry: HistoryEntry = { hero: result, role: finalRole, timestamp: Date.now() };
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('lottery_history', JSON.stringify(updatedHistory));
  }, [eligibleHeroes, history]);

  const onReelFinish = useCallback(() => {
    reelsFinished.current += 1;
    if (reelsFinished.current === 3) {
      setTimeout(() => {
        setShowFlash(true);
        setPhase('revealed');
        setTimeout(() => setShowFlash(false), 400);
      }, 300);
    }
  }, []);

  const toggleBlacklist = (name: string) => {
    setBlacklist(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#02040a] text-slate-100 overflow-hidden relative">
      <div className={`flash-overlay ${showFlash ? 'animate-flash' : ''}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(251,191,36,0.08)_0%,transparent_60%)] pointer-events-none"></div>

      <header className="px-8 pt-16 pb-4 shrink-0 flex justify-between items-center z-30 relative">
        <div className="w-10"></div>
        <div className="text-center">
          <h1 className="text-3xl font-black italic tracking-tighter text-amber-400 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)] uppercase">Lucky Select</h1>
          <p className="text-[10px] font-bold tracking-[0.5em] text-amber-500/30 uppercase mt-1">Slot Machine No.7</p>
        </div>
        <button 
          onClick={() => setActiveTab(activeTab === 'history' ? 'lottery' : 'history')}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all bg-white/10 border border-white/20 ${activeTab === 'history' ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.4)]' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </header>

      <main className="flex-grow flex flex-col px-6 relative z-10 overflow-hidden">
        {activeTab === 'lottery' && (
          <div className="h-full flex flex-col items-center">
            <div className={`flex-grow flex flex-col items-center justify-center -mt-12 w-full transition-all duration-[600ms] ${phase === 'revealed' ? 'scale-90 opacity-20 grayscale-[0.3]' : ''}`}>
              <div className="w-full max-w-md h-[440px] slot-machine-container flex relative animate-in zoom-in duration-500">
                <div className="selection-frame"></div>
                {phase === 'idle' ? (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="flex flex-col items-center text-center">
                        <div className="w-44 h-44 rounded-full border border-amber-500/40 flex items-center justify-center shadow-[0_0_100px_rgba(251,191,36,0.15)] relative overflow-hidden group bg-slate-900">
                           <img src={ARTHUR_ICON} className="w-full h-full object-cover scale-110 brightness-[0.7]" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-8xl font-black text-amber-500 italic drop-shadow-[0_0_25px_rgba(251,191,36,1)]">?</span>
                           </div>
                        </div>
                        <p className="mt-12 text-[12px] font-black tracking-[1.2em] text-amber-400/40 uppercase animate-pulse">Touch To Start</p>
                     </div>
                  </div>
                ) : (
                  <>
                    <SlotReel targetHero={lotteryResult} isSpinning={phase === 'spinning'} delay={0} onFinish={onReelFinish} />
                    <SlotReel targetHero={lotteryResult} isSpinning={phase === 'spinning'} delay={300} onFinish={onReelFinish} />
                    <SlotReel targetHero={lotteryResult} isSpinning={phase === 'spinning'} delay={600} onFinish={onReelFinish} />
                  </>
                )}
              </div>
            </div>

            {phase === 'revealed' && lotteryResult && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-sm bg-black/50 border border-white/[0.15] rounded-[5rem] p-10 shadow-[0_50px_150px_rgba(0,0,0,0.9)] backdrop-blur-3xl animate-result-popup flex flex-col items-center text-center overflow-hidden">
                  <div className="text-amber-500/50 font-black tracking-[1em] mb-12 text-[9px] uppercase">Fate Decided</div>
                  <div className="relative mb-12">
                    <div className="w-56 h-56 rounded-full p-2.5 bg-gradient-to-br from-amber-400/50 to-orange-900/50 shadow-[0_0_90px_rgba(251,191,36,0.2)] border border-amber-500/30 overflow-hidden bg-slate-800">
                        <img src={lotteryResult.imageUrl} className="w-full h-full rounded-full object-cover scale-105" onError={(e) => {
                          (e.target as HTMLImageElement).src = ARTHUR_ICON;
                        }} />
                    </div>
                  </div>
                  <h3 className="text-7xl font-black italic tracking-tighter text-white mb-10 drop-shadow-[0_0_40px_rgba(0,0,0,1)]">{lotteryResult.name}</h3>
                  <div className="px-12 py-3.5 bg-white/10 rounded-full font-black text-[12px] tracking-[0.8em] text-amber-500 mb-16 border border-white/[0.05] uppercase">
                    分路: {lotteryRole}
                  </div>
                  <div className="grid grid-cols-2 gap-5 w-full">
                    <button onClick={() => setPhase('idle')} className="py-6 bg-white/[0.05] border border-white/[0.1] rounded-[2rem] font-black text-slate-300 active:scale-95 transition-all text-[11px] uppercase tracking-widest">Back</button>
                    <button onClick={() => setIsPrepModalOpen(true)} className="py-6 bg-amber-500 hover:bg-amber-400 rounded-[2rem] font-black text-black shadow-2xl tracking-[0.2em] active:scale-95 transition-all uppercase text-[11px]">Retry</button>
                  </div>
                </div>
              </div>
            )}

            {phase === 'idle' && (
              <div className="mt-auto mb-28 w-full px-4 animate-in slide-in-from-bottom-12 duration-1000">
                <button 
                  onClick={() => setIsPrepModalOpen(true)} 
                  className="w-full py-8 rounded-[4.5rem] bg-gradient-to-br from-amber-400 via-amber-600 to-orange-900 text-white text-2xl font-black tracking-[1.5em] shadow-[0_25px_80px_rgba(245,158,11,0.2)] active:scale-95 transition-all hover:scale-[1.01] uppercase"
                >
                  开启挑战
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blacklist' && (
          <div className="h-full flex flex-col animate-in slide-in-from-right duration-500 pb-40">
            <div className="bg-[#111622]/98 backdrop-blur-2xl p-6 rounded-[3rem] border border-white/10 mb-8 shadow-2xl">
              <div className="bg-slate-950/80 border border-white/10 rounded-2xl px-6 py-4 flex items-center mb-6 focus-within:border-amber-500/50 transition-colors">
                <input 
                  type="text" 
                  placeholder="查找英雄..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent outline-none text-amber-400 font-black text-base py-1" 
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto no-scrollbar">
                {['ALL', ...Object.values(Role)].map(r => (
                  <button key={r} onClick={() => setBlacklistRole(r as any)} 
                    className={`shrink-0 px-6 py-3 rounded-2xl text-[12px] font-black transition-all ${blacklistRole === r ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-400'}`}>
                    {r === 'ALL' ? '全部' : r}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-1 no-scrollbar pb-10">
               <div className="grid grid-cols-4 gap-x-5 gap-y-12 content-start">
                {HEROES.filter(h => (blacklistRole === 'ALL' || h.roles.includes(blacklistRole as Role)) && h.name.includes(searchTerm)).map(hero => {
                  const isBlocked = blacklist.includes(hero.name);
                  return (
                    <button 
                      key={hero.name} 
                      onClick={() => toggleBlacklist(hero.name)} 
                      className="flex flex-col items-center transition-transform active:scale-95"
                    >
                      <div className={`relative w-full aspect-square rounded-[1.5rem] overflow-hidden border-2 bg-slate-800 transition-all ${isBlocked ? 'border-red-500 ring-4 ring-red-500/10' : 'border-white/10'}`}>
                        <img src={hero.imageUrl} className={`w-full h-full object-cover ${isBlocked ? 'grayscale opacity-30' : 'opacity-100'}`} loading="lazy" onError={(e) => {
                          (e.target as HTMLImageElement).src = ARTHUR_ICON;
                        }} />
                        {isBlocked && (
                          <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                            <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className={`text-[11px] font-black mt-3 tracking-tighter truncate w-full text-center ${isBlocked ? 'text-red-500' : 'text-slate-200'}`}>
                        {hero.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="fixed bottom-12 inset-x-10 z-30">
               <button 
                onClick={() => executeLottery(selectedRoles.length > 0 ? selectedRoles : Object.values(Role))} 
                className="w-full py-8 bg-gradient-to-r from-amber-500 to-orange-700 rounded-[2.5rem] font-black text-white shadow-[0_20px_60px_rgba(245,158,11,0.4)] tracking-[1.2em] uppercase text-xs active:scale-95 transition-all"
               >
                 确认 设置
               </button>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="h-full flex flex-col animate-in slide-in-from-bottom-10 duration-500 pb-20">
            <div className="flex-grow overflow-y-auto pr-2 space-y-5 no-scrollbar pb-10">
              {history.length > 0 ? (
                history.map((entry, idx) => (
                  <div key={idx} className="bg-white/10 border border-white/10 rounded-[3rem] p-5 flex items-center space-x-6 shadow-xl">
                    <img src={entry.hero.imageUrl} className="w-18 h-18 rounded-[1.5rem] object-cover border border-white/20 shadow-md bg-slate-800" style={{width: '72px', height: '72px'}} onError={(e) => {
                      (e.target as HTMLImageElement).src = ARTHUR_ICON;
                    }} />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="font-black text-white text-lg italic tracking-tight">{entry.hero.name}</h4>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {new Date(entry.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="flex mt-2">
                        <span className="px-4 py-1.5 bg-amber-500/15 text-amber-500 text-[11px] font-black rounded-full border border-amber-500/30">
                          {entry.role}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <div className="text-9xl font-black italic mb-4">?</div>
                  <div className="font-black tracking-[0.5em] text-sm uppercase">Empty Records</div>
                </div>
              )}
            </div>
            <div className="fixed bottom-12 inset-x-12 z-30">
               <button onClick={() => setActiveTab('lottery')} className="w-full py-7 bg-slate-900 border border-white/15 rounded-[2.5rem] font-black text-slate-300 tracking-[1em] uppercase text-xs active:scale-95 transition-all shadow-2xl">返回首页</button>
            </div>
          </div>
        )}

        {isPrepModalOpen && (
          <div className="fixed inset-0 z-[60] bg-black/98 flex items-end justify-center animate-in fade-in duration-300">
            <div className="bg-[#0f1422] w-full rounded-t-[5rem] p-10 border-t border-white/15 shadow-2xl animate-in slide-in-from-bottom-24 duration-500 pb-28">
              <h3 className="text-3xl font-black italic mb-3 text-amber-400 tracking-tight text-center">你要玩哪路？</h3>
              <p className="text-[11px] font-bold text-slate-500 tracking-[0.2em] mb-12 uppercase text-center">Preferred Lanes Selection</p>
              <div className="grid grid-cols-3 gap-4 mb-14">
                {ROLE_OPTIONS.map(role => (
                  <button 
                    key={role.value} 
                    onClick={() => setSelectedRoles(prev => prev.includes(role.value) ? prev.filter(r => r !== role.value) : [...prev, role.value])}
                    className={`py-8 rounded-[2.5rem] border-2 transition-all font-black text-sm ${selectedRoles.includes(role.value) ? 'border-amber-500 bg-amber-500/15 text-amber-400 shadow-[0_15px_40px_rgba(245,158,11,0.25)]' : 'border-white/10 bg-white/5 text-slate-700'}`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => { setIsPrepModalOpen(false); setIsBanQuestionOpen(true); }} 
                className="w-full py-8 bg-amber-600 rounded-[3rem] font-black text-white text-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] active:scale-95 transition-all tracking-[0.8em] uppercase"
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {isBanQuestionOpen && (
          <div className="fixed inset-0 z-[70] bg-black/99 flex items-center justify-center p-8 animate-in zoom-in duration-300">
            <div className="bg-[#0f172a] w-full max-w-sm rounded-[4.5rem] p-12 border border-white/15 shadow-2xl text-center">
              <div className="w-32 h-32 mx-auto rounded-full p-1 bg-amber-500/15 shadow-2xl mb-10 flex items-center justify-center">
                 <div className="w-full h-full rounded-full border-4 border-amber-500/40 flex items-center justify-center overflow-hidden bg-slate-800">
                    <img src={ARTHUR_ICON} className="w-full h-full object-cover scale-125" />
                 </div>
              </div>
              <h3 className="text-3xl font-black mb-12 text-white tracking-tight leading-tight">有不想玩的英雄吗？</h3>
              <div className="flex flex-col space-y-5">
                <button onClick={() => { setIsBanQuestionOpen(false); setActiveTab('blacklist'); }} className="w-full py-7 bg-white/10 border border-white/15 rounded-3xl font-black text-amber-400/90 active:scale-95 transition-all uppercase tracking-[0.4em] text-[13px]">去英雄池禁用</button>
                <button onClick={() => { setIsBanQuestionOpen(false); executeLottery(selectedRoles.length > 0 ? selectedRoles : Object.values(Role)); }} className="w-full py-8 bg-amber-500 rounded-[2.5rem] font-black text-black text-xl shadow-2xl active:scale-95 transition-all uppercase tracking-[0.3em]">直接开摇</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
