import React from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  Server,
  CheckCircle2,
  Cpu,
  KeyRound,
  FileCheck2
} from 'lucide-react';

export default function ProviderPanel() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-900 via-amber-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-black tracking-tight">College B Provider Policy &amp; Security Node</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Reciprocal Data Provider
            </span>
          </div>
          <p className="text-xs text-amber-200/80 max-w-2xl">
            Demonstrating bilateral peer-to-peer reciprocity: College B operates as a trusted Data Provider when external academic institutions request authorized student records.
          </p>
        </div>
      </div>

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">1. RS256 Token Signature Validation</h3>
          <p className="text-slate-500 leading-relaxed">
            Provider endpoint cryptographically verifies incoming Access Tokens using Consent Manager's 2048-bit RSA public key.
          </p>
          <div className="flex items-center space-x-1.5 text-emerald-600 font-bold text-[11px] pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Cryptographically Enforced</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">2. Real-Time Revocation Verification</h3>
          <p className="text-slate-500 leading-relaxed">
            Checks Consent Manager live API before every data release. If the student has revoked consent, release is denied immediately.
          </p>
          <div className="flex items-center space-x-1.5 text-emerald-600 font-bold text-[11px] pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Sub-Second Revocation Check</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">3. Ephemeral Diffie-Hellman + AES-GCM</h3>
          <p className="text-slate-500 leading-relaxed">
            Derives a one-time 128-bit shared secret using ephemeral key pairs. The Consent Manager never sees student payloads in transit.
          </p>
          <div className="flex items-center space-x-1.5 text-emerald-600 font-bold text-[11px] pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>End-to-End P2P Confidentiality</span>
          </div>
        </div>
      </div>

      {/* Node Status Summary */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
        <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wider flex items-center space-x-2">
          <Server className="w-4 h-4 text-amber-400" />
          <span>College B DEPA Node Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Provider Endpoint:</span>
            <span className="font-mono font-bold text-emerald-400">POST /api/data/access/:grantId</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Consent Manager Sync:</span>
            <span className="font-bold text-white">Online (Port 8095)</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Cipher Suite:</span>
            <span className="font-mono font-bold text-amber-300">DH-AES-128-GCM</span>
          </div>
          <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
            <span className="text-slate-400 block text-[11px]">Audit Reporting:</span>
            <span className="font-bold text-emerald-400">Real-Time Traceability</span>
          </div>
        </div>
      </div>
    </div>
  );
}
