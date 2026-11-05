import React, { useState } from 'react';
import axios from 'axios';
import {
  UserPlus,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Database,
  Key,
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function StudentOnboardingPanel() {
  const [students, setStudents] = useState([
    {
      studentId: 'S2001',
      name: 'Sneha Rao',
      email: 'sneha.rao@collegeb.edu',
      department: 'Computer Science',
      cgpa: '9.2',
      onboarded: false
    },
    {
      studentId: 'S2002',
      name: 'Aditya Varma',
      email: 'aditya.varma@collegeb.edu',
      department: 'Data Engineering',
      cgpa: '8.8',
      onboarded: false
    },
    {
      studentId: 'S1006',
      name: 'Rohan Mehta',
      email: 'rohan.mehta@collegeb.edu',
      department: 'Information Technology',
      cgpa: '9.0',
      onboarded: false
    }
  ]);

  // Form state
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Computer Science');
  const [newCgpa, setNewCgpa] = useState('8.5');

  // Loading & Alert state
  const [onboardingLoadingId, setOnboardingLoadingId] = useState(null);
  const [alert, setAlert] = useState(null);

  // Add new student locally
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newId || !newName || !newEmail) return;

    const formattedId = newId.trim().toUpperCase();
    if (students.some((s) => s.studentId === formattedId)) {
      setAlert({ type: 'error', text: `Student with ID ${formattedId} already exists.` });
      return;
    }

    const newStudent = {
      studentId: formattedId,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      department: newDept,
      cgpa: newCgpa,
      onboarded: false
    };

    setStudents([newStudent, ...students]);
    setNewId('');
    setNewName('');
    setNewEmail('');
    setAlert({ type: 'success', text: `Student ${newStudent.name} (${newStudent.studentId}) added locally. Click "Onboard to Consent Manager" to provision their CM account.` });
  };

  // Onboard student to Consent Manager DB with default password: UserId
  const handleOnboard = async (student) => {
    setOnboardingLoadingId(student.studentId);
    setAlert(null);

    try {
      const res = await axios.post('http://localhost:8095/api/onboarding/student', {
        organizationCode: 'COLLEGE_B',
        studentId: student.studentId,
        email: student.email,
        name: student.name
      });

      // Update student onboarded state
      setStudents((prev) =>
        prev.map((s) =>
          s.studentId === student.studentId ? { ...s, onboarded: true } : s
        )
      );

      setAlert({
        type: 'success',
        text: `Student ${student.name} (${student.studentId}) successfully onboarded to Consent Manager DB! Default login password: "${student.studentId}". The student can now log in at http://localhost:5173.`
      });
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'error',
        text: err.response?.data?.error || err.response?.data?.message || err.message || 'Onboarding failed.'
      });
    } finally {
      setOnboardingLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-800 via-amber-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-black tracking-tight">Student Enrollment &amp; CM Onboarding</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/20">
              College B Registrar
            </span>
          </div>
          <p className="text-xs text-amber-100 max-w-2xl">
            Enroll College B students and provision their sovereign accounts directly in the <strong>Consent Manager Database</strong>. 
            Default initial password is set to their <strong>UserId</strong> (Student ID).
          </p>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            alert.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <span>{alert.text}</span>
          </div>
          <button onClick={() => setAlert(null)} className="font-bold text-slate-400 hover:text-slate-600 ml-4 cursor-pointer">
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Enroll Form (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-amber-600" />
              <span>Enroll New Student</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add a new student profile to College B repository.
            </p>
          </div>

          <form onSubmit={handleAddStudent} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Student ID (UserId)
              </label>
              <input
                type="text"
                required
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="e.g. S2003"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                This will be their default login password in Consent Manager.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Divya Nair"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Trusted Email
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. divya.nair@collegeb.edu"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  CGPA / Grade
                </label>
                <input
                  type="text"
                  value={newCgpa}
                  onChange={(e) => setNewCgpa(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-600/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add to Roster</span>
            </button>
          </form>
        </div>

        {/* Student Roster & Onboard Actions (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>College B Student Directory ({students.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Click "Onboard" to sync the student into Consent Manager with default password: <code>UserId</code>.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Department / CGPA</th>
                  <th className="py-3 px-4">Consent Manager Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.studentId} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {s.studentId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {s.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {s.email}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {s.department} <span className="text-slate-400 font-mono">({s.cgpa})</span>
                    </td>
                    <td className="py-3 px-4">
                      {s.onboarded ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Onboarded (Pass: {s.studentId})</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          Not Onboarded
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOnboard(s)}
                        disabled={onboardingLoadingId === s.studentId || s.onboarded}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          s.onboarded
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        {onboardingLoadingId === s.studentId ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                        ) : s.onboarded ? (
                          'Active in CM'
                        ) : (
                          'Onboard to CM'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

