import React, { useState } from 'react';
import axios from 'axios';
import {
  Send,
  Download,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  Database
} from 'lucide-react';

export default function ConsumerPanel() {
  // Step 1: Request Consent Form
  const [studentId, setStudentId] = useState('S1001');
  const [providerOrg, setProviderOrg] = useState('COLLEGE_A');
  const [purpose, setPurpose] = useState('Transfer Credit & Degree Eligibility Verification');
  const [fields, setFields] = useState(['STUDENT_ID', 'NAME', 'EMAIL', 'MARKS', 'GPA', 'STATUS']);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestResult, setRequestResult] = useState(null);
  const [requestError, setRequestError] = useState(null);

  // Step 2: Direct Data Access Form
  const [grantId, setGrantId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [dataResult, setDataResult] = useState(null);
  const [dataError, setDataError] = useState(null);

  const toggleField = (fieldName) => {
    if (fields.includes(fieldName)) {
      setFields(fields.filter((f) => f !== fieldName));
    } else {
      setFields([...fields, fieldName]);
    }
  };

  // Submit Consent Request to Consent Manager
  const handleInitiateRequest = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestError(null);
    setRequestResult(null);

    try {
      // 1. Authenticate as College B with CM to get auth token
      const authRes = await axios.post('http://localhost:8095/api/auth/login', {
        email: 'admin@collegeb.edu',
        password: 'OrgAdmin@123'
      });
      const cmToken = authRes.data.token;

      // 2. Submit Data Request
      const dreqRes = await axios.post(
        'http://localhost:8095/api/data-requests',
        {
          dataPrincipalId: studentId.trim(),
          providerOrganizationId: providerOrg.trim(),
          purpose: purpose.trim(),
          requestedFields: fields
        },
        {
          headers: {
            Authorization: `Bearer ${cmToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setRequestResult(dreqRes.data);
    } catch (err) {
      console.error(err);
      setRequestError(
        err.response?.data?.message || err.message || 'Failed to submit data request to Consent Manager'
      );
    } finally {
      setRequestLoading(false);
    }
  };

  // Execute Direct P2P Fetch
  const handleFetchData = async (e) => {
    e.preventDefault();
    setFetchLoading(true);
    setDataError(null);
    setDataResult(null);

    try {
      const res = await axios.post(
        'http://localhost:8082/api/consumer/fetch-direct-data',
        {
          grantId: grantId.trim(),
          accessToken: accessToken.trim()
        },
        {
          headers: {
            'X-API-KEY': 'B-INTERNAL-SECRET-KEY',
            'Content-Type': 'application/json'
          }
        }
      );

      setDataResult(res.data);
    } catch (err) {
      console.error(err);
      setDataError(
        err.response?.data?.message || err.message || 'Direct P2P Data Fetch Failed'
      );
    } finally {
      setFetchLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 mb-1">
          College B acting as Data Consumer
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
          Follow the strict DEPA flow: <strong>1)</strong> Request student consent via Consent Manager. 
          The student (data principal) receives this request strictly in their Consent Manager dashboard (Port 5173). 
          <strong> 2)</strong> Once the student approves, paste the issued Access Grant ID and Token below to fetch encrypted academic records directly from Provider College A.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step 1: Initiate Consent Request */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Initiate Consent Request</h3>
              <p className="text-xs text-slate-500">Request permission from Data Principal via Consent Manager</p>
            </div>
          </div>

          {requestError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{requestError}</span>
            </div>
          )}

          {requestResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Consent Request Successfully Dispatched to CM!</span>
              </div>
              <p className="text-slate-600">
                Request ID: <strong className="font-mono text-emerald-800">{requestResult.requestId || requestResult.id}</strong>
              </p>
              <div className="p-2.5 bg-white/80 rounded-lg border border-emerald-200 text-slate-700">
                <strong>Important DEPA Routing:</strong> This request has been queued in Consent Manager for student <strong>{studentId}</strong>. 
                Please open the <strong>Consent Manager Portal (http://localhost:5173)</strong>, log in as <code>student1001@example.com</code>, and click <strong>Approve</strong>.
              </div>
            </div>
          )}

          <form onSubmit={handleInitiateRequest} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Data Principal ID (Student ID)
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. S1001"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Provider Organization
                </label>
                <input
                  type="text"
                  readOnly
                  value="COLLEGE_A"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono text-slate-600 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Requester Code (Consumer)
                </label>
                <input
                  type="text"
                  readOnly
                  value="COLLEGE_B"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Purpose of Data Access
              </label>
              <input
                type="text"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Requested Academic Attributes
              </label>
              <div className="flex flex-wrap gap-2">
                {['STUDENT_ID', 'NAME', 'EMAIL', 'MARKS', 'GPA', 'STATUS'].map((attr) => (
                  <button
                    type="button"
                    key={attr}
                    onClick={() => toggleField(attr)}
                    className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold cursor-pointer transition-all ${
                      fields.includes(attr)
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {fields.includes(attr) ? `✓ ${attr}` : `+ ${attr}`}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={requestLoading || fields.length === 0}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {requestLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Request to Consent Manager</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Step 2: Direct P2P Data Fetch */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Direct P2P Data Access</h3>
              <p className="text-xs text-slate-500">Consume encrypted data from Provider College A using Access Grant</p>
            </div>
          </div>

          {dataError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
              <span>{dataError}</span>
            </div>
          )}

          <form onSubmit={handleFetchData} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Access Grant ID
              </label>
              <input
                type="text"
                required
                value={grantId}
                onChange={(e) => setGrantId(e.target.value)}
                placeholder="e.g. AG_XXXXXXXX or paste from Consent Manager"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Provider Endpoint
              </label>
              <input
                type="text"
                readOnly
                value="http://localhost:8081 (Provider College A)"
                className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono text-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                CM-Signed Access Token (RS256 JWT)
              </label>
              <textarea
                required
                rows={3}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Paste the JWT access token issued by Consent Manager..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              disabled={fetchLoading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {fetchLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Execute Direct Data Fetch (DH + AES-128-GCM)</span>
                </>
              )}
            </button>
          </form>

          {/* Decrypted Payload Result */}
          {dataResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Decrypted Student Attributes</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Diffie-Hellman Decrypted</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg overflow-x-auto text-[11px] font-mono text-emerald-300">
                <pre>{JSON.stringify(dataResult, null, 2)}</pre>
              </div>

              <p className="text-[10px] text-slate-400">
                ✓ P2P Direct Transfer: College B received encrypted payload directly from College A, performed ephemeral Diffie-Hellman decryption, and notified Consent Manager audit trail.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

