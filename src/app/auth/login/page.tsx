"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getUserBusinesses, getCurrentUser } from '@/lib/auth-wrapper'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await signIn(email, password)
      
      const user = await getCurrentUser()
      if (user) {
        const businesses = await getUserBusinesses(user.id)
        
        if (businesses && businesses.length > 0) {
          router.push('/dashboard')
        } else {
          router.push('/register-business')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060807] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          {/* Logo/Brand */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#a3e635] mb-2">
              HUSTLER-LEDGER
            </h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
              Financial Identity Engine
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-xs font-bold text-red-400 uppercase leading-tight">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.05] border border-white/5 rounded-2xl focus:outline-none focus:border-[#a3e635]/50 text-white transition-all"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-white/[0.05] border border-white/5 rounded-2xl focus:outline-none focus:border-[#a3e635]/50 text-white transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a3e635] text-[#062d1a] py-5 rounded-full font-[950] text-sm uppercase italic tracking-widest shadow-xl shadow-[#a3e635]/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-4">
            {/* Removed the 'size' prop to fix the TypeScript error */}
            <a 
              href="/auth/forgot-password" 
              className="block text-[10px] font-black uppercase tracking-widest text-[#a3e635]/50 hover:text-[#a3e635] transition-all"
            >
              Forgot Password?
            </a>
            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">
              New Hustler?{' '}
              <a href="/auth/signup" className="text-[#a3e635] hover:underline">
                Create Account
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}