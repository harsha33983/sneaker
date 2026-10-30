'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Loader2, ArrowLeft, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.message || 'Authentication failed. Please verify credentials.');
        toast.error(data.message || 'Login failed');
      } else {
        toast.success('Admin authorization verified');
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setErrorMsg('Network error. Unable to contact authentication server.');
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('admin@sneakerdrop.com');
    setPassword('Admin123!Secure');
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#F5F3EE] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D7FF45]/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#888884] hover:text-[#D7FF45] transition-colors uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO STOREFRONT</span>
        </Link>

        <div className="bg-[#181818] border border-[#2d2d2d] rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#222222] border border-[#333333] flex items-center justify-center mx-auto text-[#D7FF45] mb-3">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="font-[family-name:var(--font-space)] text-2xl font-black uppercase tracking-tight text-[#F5F3EE]">
              ADMIN CONSOLE
            </h1>
            <p className="text-xs text-[#888884]">
              Authorized administrative personnel only. Real-time PostgreSQL operations.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] uppercase font-bold tracking-wider text-[#A4A19B] mb-2"
              >
                ADMINISTRATOR EMAIL
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sneakerdrop.com"
                  className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] focus:ring-1 focus:ring-[#D7FF45] rounded-xl pl-11 pr-4 py-3 text-sm text-[#F5F3EE] placeholder-[#666666] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] uppercase font-bold tracking-wider text-[#A4A19B] mb-2"
              >
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666666] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] focus:ring-1 focus:ring-[#D7FF45] rounded-xl pl-11 pr-4 py-3 text-sm text-[#F5F3EE] placeholder-[#666666] outline-none transition-all"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D7FF45] text-[#111111] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#c4ec30] disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <span>SIGN IN TO CONSOLE</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials for Evaluation */}
          <div className="pt-4 border-t border-[#262626] text-center">
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-xs text-[#888884] hover:text-[#D7FF45] underline transition-colors"
            >
              Fill Demo Credentials (admin@sneakerdrop.com)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

