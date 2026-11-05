import React from 'react';
import { Building, Shield, ArrowLeftRight } from 'lucide-react';

export default function Navbar({ activeMode, setActiveMode }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-100">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                COLLEGE B NODE
              </span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Port 8082
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              DEPA Federated Academic Participant — Dual Consumer &amp; Provider
            </p>
          </div>
        </div>

        {/* Dual Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveMode('consumer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeMode === 'consumer'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Consumer Mode</span>
          </button>

          <button
            onClick={() => setActiveMode('provider')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeMode === 'provider'
                ? 'bg-white text-orange-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Provider Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}

