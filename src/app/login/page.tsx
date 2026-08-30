'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { EnterpriseBrand } from '@/components/EnterpriseBrand';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  MapPin,
  Phone
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('demo@shreeqasolutions.com');
  const [password, setPassword] = useState('Demo@2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Failed to authenticate');
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('demo@shreeqasolutions.com');
    setPassword('Demo@2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
        <EnterpriseBrand size="lg" href={undefined} editableLogo={true} />

        <p className="text-xs text-slate-700 font-semibold mt-3">
          Mahesh Bhaskara • Certified Lead Appraiser
        </p>
        <p className="text-[11px] text-slate-400">
          503, Sharada Nilayam, Jaya Nagar, Road No: 4, Kukatpally, Hyd - 72
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-saas-lg rounded-2xl sm:px-10 border border-slate-200 relative overflow-hidden">
          
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Lead Appraiser Portal Login
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Access appraisal pipelines, client registries, and risk diagnostics
            </p>
          </div>

          {/* Quick Demo Fill Alert Banner */}
          <div className="mb-6 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Evaluation User:</span>
              </span>
              <button
                type="button"
                onClick={fillDemo}
                className="text-[11px] font-bold text-amber-900 underline hover:text-amber-700"
              >
                Auto-Fill
              </button>
            </div>
            <div className="mt-1.5 font-mono text-[11px] text-slate-700 bg-white/80 p-2 rounded-lg border border-amber-200/60">
              <div>Email: <strong>demo@shreeqasolutions.com</strong></div>
              <div>Password: <strong>Demo@2026</strong></div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="mt-1 relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="demo@shreeqasolutions.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-2.5 px-4 rounded-lg shadow-saas-xs text-xs font-bold text-white bg-[#0F172A] hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 transition-all"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Appraisal Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Protected Appraisal Environment • Mahesh Bhaskara</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
