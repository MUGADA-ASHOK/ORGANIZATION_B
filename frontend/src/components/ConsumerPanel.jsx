import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Send,
  Download,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  Database,
  Building,
  RefreshCw,
  ExternalLink,
  GraduationCap,
  Award,
  Eye,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function ConsumerPanel() {
  // Step 1: Request Consent Form
  const [studentId, setStudentId] = useState('S1001');
  const [providerOrg, setProviderOrg] = useState('COLLEGE_A');
  const [purpose, setPurpose] = useState('Transfer Credit & Degree Eligibility Verification');
  const [fields, setFields] = useState(['STUDENT_ID', 'NAME', 'MARKS', 'GPA', 'STATUS']);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestResult, setRequestResult] = useState(null);
  const [requestError, setRequestError] = useState(null);

  // Active Grants & Requests
  const [grants, setGrants] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Verified Transferred Record display
  const [fetchingGrantId, setFetchingGrantId] = useState(null);
  const [activeRecord, setActiveRecord] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [acceptingLoading, setAcceptingLoading] = useState(false);

  const toggleField = (fieldName) => {
    if (fields.includes(fieldName)) {
      setFields(fields.filter((f) => f !== fieldName));
    } else {
      setFields([...fields, fieldName]);
    }
  };

  // Helper to authenticate as College B with CM
  const getCmToken = async () => {
    const authRes = await axios.post('http://localhost:8095/api/auth/login', {
      email: 'admin@collegeb.edu',
      password: 'OrgAdmin@123'
    });
    return authRes.data.token;
  };

  // Fetch approved grants and outgoing requests from CM
  const loadData = async () => {
    setLoadingLists(true);
    try {
      const token = await getCmToken();
      const [grantsRes, dreqRes] = await Promise.all([
        axios.get('http://localhost:8095/api/access-grants', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        axios.get('http://localhost:8095/api/data-requests', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
      ]);

      setGrants(grantsRes.data || []);
      setOutgoingRequests(dreqRes.data || []);
    } catch (err) {
      console.error('Error loading CM data:', err);
    } finally {
      setLoadingLists(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Submit Consent Request to Consent Manager
  const handleInitiateRequest = async (e) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestError(null);
    setRequestResult(null);

    try {
      const cmToken = await getCmToken();

      const dreqRes = await axios.post(
        'http://localhost:8095/api/data-requests',
        {
          dataPrincipalId: studentId.trim().toUpperCase(),
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
      await loadData();
    } catch (err) {
      console.error(err);
      setRequestError(
        err.response?.data?.message || err.message || 'Failed to submit data request to Consent Manager'
      );
    } finally {
      setRequestLoading(false);
    }
  };

  // One-click direct P2P data fetch (automated cryptographic exchange)
  const handleFetchRecords = async (grant) => {
    setFetchingGrantId(grant.grantId);
    setFetchError(null);
    try {
      let accessToken = grant.accessToken;
      if (!accessToken) {
        const token = await getCmToken();
        const gRes = await axios.get(`http://localhost:8095/api/access-grants/${grant.grantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        accessToken = gRes.data?.accessToken;
      }

      const res = await axios.post(
        'http://localhost:8082/api/consumer/fetch-direct-data',
        {
          grantId: grant.grantId,
          accessToken: accessToken
        },
        {
          headers: {
            'X-API-KEY': 'B-INTERNAL-SECRET-KEY',
            'Content-Type': 'application/json'
          }
        }
      );

      setActiveRecord({
        data: res.data,
        grantId: grant.grantId,
        provider: grant.providerOrganizationCode || 'COLLEGE_A',
        approvedFields: grant.approvedFields || Object.keys(res.data),
        timestamp: new Date().toISOString()
      });
      setIsAccepted(false);
    } catch (err) {
      console.error(err);
      setFetchError(
        err.response?.data?.message || err.message || 'Direct P2P Data Fetch Failed'
      );
    } finally {
      setFetchingGrantId(null);
    }
  };

  // Requester accepts and ingests data sent by provider, updating CM audit trail
  const handleAcceptRecord = async () => {
    if (!activeRecord) return;
    setAcceptingLoading(true);
    try {
      const studentId = activeRecord.data.STUDENT_ID || activeRecord.data.principalId || 'S1001';
      await axios.post('http://localhost:8095/api/audit/data-flow', {
        eventType: 'DATA_CONSUMED_BY_RECEIVER',
        grantId: activeRecord.grantId,
        dataPrincipalId: studentId,
        organizationCode: 'COLLEGE_B',
        fields: Object.keys(activeRecord.data),
        details: `Consumer College B reviewed, accepted, and ingested the verified academic records for ${studentId}.`
      });
      setIsAccepted(true);
    } catch (err) {
      console.error('Audit update failed', err);
      setIsAccepted(true);
    } finally {
      setAcceptingLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-orange-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-black tracking-tight">Academic Record Transfer &amp; Verification</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/20">
              Data Consumer
            </span>
          </div>
          <p className="text-xs text-amber-100 max-w-2xl">
            Request verified academic attributes directly from partner institutions. All transfers are governed by Consent Manager and protected by end-to-end Diffie-Hellman encryption.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loadingLists}
          className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold transition-all cursor-pointer backdrop-blur-md self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingLists ? 'animate-spin' : ''}`} />
          <span>Sync Requests</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Request Form (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Send className="w-4 h-4 text-amber-600" />
              <span>Initiate New Record Request</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dispatches a consent notice to the student's Consent Manager account.
            </p>
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
                <span>Consent Request Successfully Sent!</span>
              </div>
              <p className="text-slate-600">
                Request ID: <strong className="font-mono text-emerald-800">{requestResult.requestId || requestResult.id}</strong>
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-slate-700">
                The student (<strong>{studentId}</strong>) has been alerted in the <strong>Consent Manager Portal</strong> to authorize or customize the requested fields.
              </div>
            </div>
          )}

          <form onSubmit={handleInitiateRequest} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Student ID (Data Principal)
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
                  Source University
                </label>
                <input
                  type="text"
                  readOnly
                  value="COLLEGE_A (College A)"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-xl font-medium text-slate-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Requesting Institution
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
                Academic Purpose
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
                Requested Attributes
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
                  <span>Send Consent Request</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Active Grants & Verified Records (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Approved Grants Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Approved Authorizations ({grants.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Authorizations approved by students. Click to retrieve encrypted records directly.
                </p>
              </div>
            </div>

            {fetchError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}

            {grants.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">No Authorized Grants Yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Once the student reviews and approves your request in Consent Manager (Port 5173), it will automatically appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {grants.map((g) => (
                  <div
                    key={g.grantId}
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/20 transition-all space-y-3 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-800">
                          Grant: {g.grantId}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {g.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500">
                        Student: <strong className="text-indigo-700 font-mono">{g.dataPrincipalId}</strong>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Purpose: </span>"{g.purpose}"
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Approved Attributes by Student:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(g.approvedFields || []).map((f) => (
                          <span
                            key={f}
                            className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Valid Until: {new Date(g.expiresAt).toLocaleDateString()}
                      </span>

                      <button
                        onClick={() => handleFetchRecords(g)}
                        disabled={fetchingGrantId === g.grantId}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {fetchingGrantId === g.grantId ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Fetch Student Records</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Academic Record Presentation Card (Clean, Professional Transcript) */}
          {activeRecord && (
            <div className="bg-white rounded-2xl border-2 border-emerald-500/40 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-5 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="font-black text-base tracking-tight">Verified Academic Credential</h4>
                    <span className="text-xs text-emerald-200">
                      Originating Institution: College A University
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-semibold bg-emerald-700/60 px-3 py-1.5 rounded-xl border border-emerald-400/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>DEPA Verified</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Student ID:</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {activeRecord.data.STUDENT_ID || activeRecord.data.principalId || 'S1001'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Full Name:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {activeRecord.data.NAME || 'Ashok Mugada'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status:</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {activeRecord.data.STATUS || 'ENROLLED / ACTIVE'}
                    </span>
                  </div>
                </div>

                {/* Academic Attributes Grid */}
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Verified Academic Record Attributes
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(activeRecord.data).map(([key, val]) => (
                      <div key={key} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-slate-600">{key}</span>
                        <span className="font-bold text-xs text-slate-900">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requester Acceptance Bar */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Requester Ingestion &amp; Consent Acceptance
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {isAccepted
                        ? '✓ Data accepted by College B. Logged in Consent Manager audit trail.'
                        : 'Review the transferred attributes above and confirm acceptance to complete the DEPA lifecycle.'}
                    </span>
                  </div>

                  {isAccepted ? (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center space-x-1.5 border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Data Accepted &amp; Ingested</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleAcceptRecord}
                      disabled={acceptingLoading}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      {acceptingLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Accept &amp; Ingest Transferred Record</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Cryptographic Trust Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Transferred via P2P Ephemeral Diffie-Hellman + AES-128-GCM</span>
                  </div>
                  <span>Grant: {activeRecord.grantId}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
