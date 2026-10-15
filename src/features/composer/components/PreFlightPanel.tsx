'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import type { ValidationResult } from '../utils/validation';

interface PreFlightPanelProps {
  validation: ValidationResult;
}

export function PreFlightPanel({ validation }: PreFlightPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isReady = validation.isValid;
  const issueCount = validation.blockers.length;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isReady
          ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
          : 'bg-rose-950/25 border-rose-900/50 text-rose-300'
      }`}
    >
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2.5">
          {isReady ? (
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            </div>
          ) : (
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            </div>
          )}

          <div>
            <h4 className="text-xs font-bold tracking-wide uppercase">
              {isReady
                ? 'Pre-Flight: Ready to Publish'
                : `Pre-Flight: Blocked by ${issueCount} ${issueCount === 1 ? 'issue' : 'issues'}`}
            </h4>
            <p className="text-[11px] opacity-80">
              {isReady
                ? 'Zero formatting errors. Safe across all selected platform algorithms.'
                : 'Fix the items below to prevent silent publishing rejection.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs opacity-70">
          <span>{isExpanded ? 'Collapse' : 'Details'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Issue Checklist */}
      {isExpanded && !isReady && (
        <div className="px-3 pb-3 pt-1 border-t border-rose-900/30 space-y-2">
          {validation.blockers.map((issue, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs bg-rose-950/40 p-2 rounded-lg border border-rose-900/40"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-medium text-rose-200">{issue.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
