import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Layers,
  RefreshCw,
  Send,
  Lock,
  CheckCircle2,
  Clock,
  Server,
  ShieldCheck
} from 'lucide-react';

export default function ProviderPanel() {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCmToken = async () => {
    try {
      const res = await axios.post('http://localhost:8095/api/auth/login', {
        email: 'admin@collegeb.edu',
        password: 'OrgAdmin@123'
      });
      return res.data?.token;
    } catch (e) {
      return null;
    }
  };

  const loadDispatches = async () => {
    setLoading(true);
    try {
      const token = await getCmToken();
      if (token) {
        const auditRes = await axios.get('http://localhost:8095/api/audit/organization/ORG_COLLEGE_B', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }));

        const p2pEvents = (auditRes.data || []).filter(
          (log) => log.eventType === 'DATA_PREPARED_AND_SHARED' || log.eventType === 'CONSENT_VALIDATED_BY_PROVIDER'
        );
        setDispatches(p2pEvents);
      }
    } catch (err) {
      console.error('Error loading provider dispatches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDispatches();
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-900 via-amber-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-black tracking-tight">College B Bilateral Provider Node</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-400/30">
              Reciprocal Data Provider
            </span>
          </div>
          <p className="text-xs text-amber-200/80 max-w-2xl">
            Demonstrating bilateral peer-to-peer reciprocity: College B operates as a trusted Data Provider when external academic institutions request authorized student records.
          </p>
        </div>

        <button
          onClick={loadDispatches}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold transition-all cursor-pointer backdrop-blur-md self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Dispatches</span>
        </button>
      </div>

      {/* Bilateral Provider Workflow & Architecture */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Dual-Role Bilateral Reciprocity Engine
            </h2>
            <p className="text-xs text-slate-500">
              College B can fulfill external verification requests dispatched by College A or partner evaluators.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-800 text-xs block">Provider Dispatch Workflow</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>External consumer presents CM-signed Access Token at <code className="font-mono bg-white px-1 py-0.5 rounded">POST /api/data/access/:grantId</code>.</li>
              <li>College B validates RSA-2048 signature using CM public key.</li>
              <li>Queries Consent Manager <code className="font-mono bg-white px-1 py-0.5 rounded">/validate</code> to confirm real-time revocation status.</li>
              <li>Performs Diffie-Hellman key exchange and transfers AES-128-GCM encrypted payload.</li>
            </ol>
          </div>

          <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-2">
            <span className="font-bold text-orange-950 text-xs block">Bilateral Privacy Guarantees</span>
            <ul className="space-y-1.5 text-orange-900 text-[11px]">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span>Zero unencrypted records leave College B without a verified token.</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span>Consent Manager never observes plain student transcripts.</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span>Sub-second revocation block enforced before every payload dispatch.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Outgoing P2P Dispatches Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              College B Outgoing Dispatches &amp; Disclosures
            </h2>
            <p className="text-xs text-slate-500">
              Audit log of student credentials transferred as a provider.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading transfer dispatches...</div>
        ) : dispatches.length === 0 ? (
          <div className="py-8 text-center text-slate-400 space-y-1">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-1" />
            <p className="text-xs font-semibold text-slate-600">No Outgoing Transfers Dispatched Yet</p>
            <p className="text-[11px] text-slate-400">
              When external academic evaluators consume data from College B, the cryptographic transfer will be logged here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Student (Principal)</th>
                  <th className="py-3 px-4">Access Grant ID</th>
                  <th className="py-3 px-4">Transfer Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dispatches.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(d.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-50 text-orange-700 border border-orange-200">
                        {d.eventType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      {d.dataPrincipalId || '-'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {d.resourceId || '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm">
                      {d.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Node Status Summary */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-sm text-amber-300 uppercase tracking-wider">
              College B Provider Node Active Status
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Port 8082</span>
        </div>

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
