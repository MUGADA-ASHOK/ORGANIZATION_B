import React, { useState } from 'react';
import axios from 'axios';
import {
  ShieldCheck,
  Lock,
  Database,
  ArrowRight,
  Server,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ProviderPanel() {
  const [grantId, setGrantId] = useState('');
  const [token, setToken] = useState('');
  const [consumerPubKey, setConsumerPubKey] = useState('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTestProviderAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await axios.post(
        `http://localhost:8082/api/data/access/${grantId.trim()}`,
        {
          consumerPublicKey: consumerPubKey.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || err.message || 'Provider Access Verification Failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 mb-1">
          College B acting as Data Provider
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Demonstrating bilateral peer-to-peer reciprocity: College B can also serve as a Data Provider. 
          When other organizations present approved Access Tokens, College B cryptographically validates token claims against Consent Manager, generates ephemeral Diffie-Hellman keys, and returns encrypted canonical records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Architecture details */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <Lock className="w-5 h-5" />
            <span>Dual Provider Endpoint: POST /api/data/access/:grantId</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="font-bold text-white block mb-0.5">1. CM RS256 Token Validation</span>
              <p className="text-[11px] text-slate-400">
                Verifies cryptographic signature using Consent Manager's RSA-2048 public key. Checks expiry and scope.
              </p>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="font-bold text-white block mb-0.5">2. Real-Time Revocation Check</span>
              <p className="text-[11px] text-slate-400">
                Queries Consent Manager (<code className="text-amber-300">GET /api/access-grants/:id/validate</code>). If student revoked, access is rejected.
              </p>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl border border-slate-700">
              <span className="font-bold text-white block mb-0.5">3. Diffie-Hellman Key Agreement</span>
              <p className="text-[11px] text-slate-400">
                Combines Provider's private DH key with Consumer's public DH key to compute a 128-bit shared secret, encrypting the payload with AES-GCM.
              </p>
            </div>
          </div>
        </div>

        {/* Live Simulator Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Provider Endpoint Verification Simulator
          </h3>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleTestProviderAccess} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Grant ID
              </label>
              <input
                type="text"
                required
                value={grantId}
                onChange={(e) => setGrantId(e.target.value)}
                placeholder="e.g. AG_XXXXXXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Bearer Access Token (JWT)
              </label>
              <textarea
                required
                rows={2}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste CM-signed Access JWT..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Grant &amp; Encrypt Payload</span>
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Encrypted Response Generated by Org B</span>
              </div>
              <div className="font-mono text-[10px] text-slate-300 bg-slate-950 p-2.5 rounded-lg overflow-x-auto">
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

