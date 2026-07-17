import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { GlobalMarketStats } from '../types';

interface PriceTickerProps {
  stats: GlobalMarketStats;
  crisisMode: string;
}

export default function PriceTicker({ stats, crisisMode }: PriceTickerProps) {
  const [currentStats, setCurrentStats] = useState<GlobalMarketStats>(stats);
  const [tick, setTick] = useState(0);

  // Simulate realistic ticks every 4 seconds based on current crisis posture
  useEffect(() => {
    setCurrentStats(stats);
  }, [stats]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStats(prev => {
        // Higher volatility in crises
        const volatility = crisisMode === 'normal' ? 0.08 : 0.35;
        const change = (Math.random() - 0.48) * volatility;
        const newBrent = Math.max(20, prev.brent + change);
        const newWti = Math.max(18, prev.wti + change * 0.95);
        const newDiesel = Math.max(1.0, prev.diesel + change * 0.03);
        const newGas = Math.max(1.0, prev.gas + (Math.random() - 0.5) * 0.02);
        
        return {
          brent: Number(newBrent.toFixed(2)),
          wti: Number(newWti.toFixed(2)),
          gas: Number(newGas.toFixed(2)),
          diesel: Number(newDiesel.toFixed(2)),
          spread: Number(Math.abs(newBrent - newWti).toFixed(2)),
          changeBrent: Number((prev.changeBrent + change / 10).toFixed(3))
        };
      });
      setTick(t => t + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [crisisMode]);

  const getPriceColor = (val: number) => {
    if (crisisMode !== 'normal' && val > stats.brent) return 'text-brand-alert font-semibold';
    return 'text-brand-success';
  };

  return (
    <div className="w-full bg-brand-surface border-b border-brand-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 select-none" id="price_ticker_container">
      {/* Brand Label */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-accent" />
        <span className="font-mono text-[10px] tracking-widest text-brand-muted uppercase font-bold">
          STRATOS Live Feed
        </span>
      </div>

      {/* Commodity Prices */}
      <div className="flex flex-wrap items-center gap-6 text-xs">
        {/* Brent */}
        <div className="flex items-center gap-2" id="ticker_brent">
          <span className="text-brand-muted font-mono text-[10px]">BRENT:</span>
          <span className={`font-mono font-bold ${getPriceColor(currentStats.brent)}`}>
            ${currentStats.brent.toFixed(2)}
          </span>
          <span className="text-xs flex items-center font-mono">
            {currentStats.changeBrent >= 0 ? (
              <span className="text-brand-success flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> +{(currentStats.changeBrent * 100).toFixed(1)}%</span>
            ) : (
              <span className="text-brand-danger flex items-center"><TrendingDown className="w-3 h-3 mr-0.5" /> {(currentStats.changeBrent * 100).toFixed(1)}%</span>
            )}
          </span>
        </div>

        {/* WTI */}
        <div className="flex items-center gap-2" id="ticker_wti">
          <span className="text-brand-muted font-mono text-[10px]">WTI:</span>
          <span className="font-mono font-bold text-slate-100">
            ${currentStats.wti.toFixed(2)}
          </span>
        </div>

        {/* Spread */}
        <div className="flex items-center gap-2" id="ticker_spread">
          <span className="text-brand-muted font-mono text-[10px]">WTI-BRENT SPREAD:</span>
          <span className="font-mono text-slate-300">
            ${currentStats.spread.toFixed(2)}
          </span>
        </div>

        {/* Diesel */}
        <div className="flex items-center gap-2" id="ticker_diesel">
          <span className="text-brand-muted font-mono text-[10px]">DIESEL FUTS:</span>
          <span className="font-mono text-slate-100">
            ${currentStats.diesel.toFixed(2)}
          </span>
        </div>

        {/* Natural Gas */}
        <div className="flex items-center gap-2" id="ticker_gas">
          <span className="text-brand-muted font-mono text-[10px]">NAT GAS:</span>
          <span className="font-mono text-slate-100">
            ${currentStats.gas.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Sync Status */}
      <div className="flex items-center gap-2 text-brand-muted text-[10px] font-mono">
        <RefreshCw className="w-3 h-3 text-brand-accent/70" />
        <span>TICK_{tick} SEC_SYNCED</span>
      </div>
    </div>
  );
}
