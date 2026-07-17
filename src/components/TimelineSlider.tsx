import React from 'react';
import { Calendar, Compass } from 'lucide-react';

interface TimelineSliderProps {
  value: number; // slider index, e.g. -30 to 90
  onChange: (val: number) => void;
}

export default function TimelineSlider({ value, onChange }: TimelineSliderProps) {
  const getTimelineLabel = (val: number) => {
    if (val === 0) return 'T-0 PRESENT DAY';
    if (val < 0) return `H-${Math.abs(val)} DAYS HISTORICAL`;
    return `P+${val} DAYS FORECAST`;
  };

  const getTimelineColor = (val: number) => {
    if (val === 0) return 'text-brand-success font-bold';
    if (val < 0) return 'text-brand-muted font-medium';
    return 'text-brand-accent font-bold';
  };

  return (
    <div className="w-full bg-brand-surface border border-brand-border rounded-lg p-4 font-mono select-none" id="timeline_slider_container">
      {/* Title & Metadata */}
      <div className="flex items-center justify-between mb-3.5">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-brand-accent" /> Geospatial Timeline Control
        </h4>
        <span className={`text-xs ${getTimelineColor(value)}`}>
          {getTimelineLabel(value)}
        </span>
      </div>

      {/* Actual HTML range slider */}
      <div className="relative flex items-center">
        <input
          type="range"
          min="-30"
          max="90"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 bg-brand-bg rounded-lg appearance-none cursor-pointer accent-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
          id="timeline_slider_input"
        />
      </div>

      {/* Axis markers */}
      <div className="flex justify-between text-[10px] text-brand-muted mt-2">
        <span>-30 DAYS (HISTORICAL OUTLOOK)</span>
        <span className={value === 0 ? "text-brand-success font-bold" : ""}>PRESENT POSTURE</span>
        <span>+30D</span>
        <span>+60D</span>
        <span>+90 DAYS (PREDICTIVE SIMULATION)</span>
      </div>

      {/* Intelligence prompt based on slider status */}
      <div className="mt-3.5 pt-2 border-t border-brand-border text-[11px] text-brand-muted flex items-start gap-1.5 font-sans">
        <Compass className="w-3.5 h-3.5 text-brand-accent mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          {value < 0 ? (
            "Historical Replay Mode: Reconstructing network parameters, AIS paths, and spot-freight pricing metrics for previous quarters."
          ) : value === 0 ? (
            "Live Mode: System synced to real-time GDELT geopolitical risk indexes, current ACLED conflicts, and live Brent ticking rates."
          ) : (
            `Predictive Machine Forecast: Projecting vessel routes and risk spreads out to +${value} days. Confidence level decays to ${Math.max(60, 95 - Math.round(value * 0.35))}% due to potential secondary events.`
          )}
        </p>
      </div>
    </div>
  );
}
