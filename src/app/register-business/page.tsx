"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { createBusiness, getActiveBusiness, getCurrentUser } from '@/lib/auth-wrapper'
import { Building, MapPin, Phone, Mail, FileText, AlertCircle } from 'lucide-react'

export default function RegisterBusiness() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    location: '',
    phone: '',
    email: '',
    registration_number: '',
    tax_id: ''
  })

  const businessTypes = [
    'Retail Shop',
    'Kiosk', 
    'Street Vendor',
    'Service Provider',
    'Transport/Boda',
    'Restaurant/Food',
    'Manufacturing',
    'Agriculture',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      const business = {
        user_id: user.id,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        location: formData.location,
        phone: formData.phone,
        email: formData.email,
        registration_number: formData.registration_number,
        tax_id: formData.tax_id
      }

      await createBusiness(business)
      router.push('/dashboard')
    } catch (error: any) {
      setError(error.message || 'Failed to register business')
    } finally {
      setLoading(false)
    }
  }

  const step = 1

  return (
    <main className="min-h-screen bg-[#060807] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#062d1a_0%,transparent_70%)] opacity-20 pointer-events-none" />

      {/* Progress Bars */}
      <div className="absolute top-10 w-full max-w-[280px] md:max-w-xs flex gap-2">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex-1">
            <div className={`h-[3px] rounded-full transition-all duration-700 ${num <= step ? 'bg-green-400 shadow-[0_0_12px_#a3e635]' : 'bg-white/5'}`} />
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative z-10"
      >
        <header className="mb-12">
          <h1 className="text-3xl font-black italic text-left">The <br />Identity.</h1>
          <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] mt-4">Section 01: Business Profile</p>
        </header>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Business Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input 
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full pl-10 pr-4 py-5 bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-green-400 focus:bg-white/[0.08] transition-all"
                placeholder="Enter your business name"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Business Type</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-green-400 focus:bg-white/[0.08] transition-all"
            >
              <option value="">Select business type</option>
              {businessTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Description</label>
            <textarea 
              required
              value={formData.description}
              rows={4}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-green-400 focus:bg-white/[0.08] transition-all resize-none"
              placeholder="Give a brief description of your business..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input 
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-10 pr-4 py-5 bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-green-400 focus:bg-white/[0.08] transition-all"
                  placeholder="Business location"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-5 bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-green-400 focus:bg-white/[0.08] transition-all"
                  placeholder="Business phone"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-5 bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-green-400 focus:bg-white/[0.08] transition-all"
                  placeholder="Business email"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Registration Number</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input 
                  type="text"
                  value={formData.registration_number}
                  onChange={(e) => setFormData({...formData, registration_number: e.target.value})}
                  className="w-full pl-10 pr-4 py-5 bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-green-400 focus:bg-white/[0.08] transition-all"
                  placeholder="Business registration number"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-1">Tax ID (Optional)</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <input 
                type="text"
                value={formData.tax_id}
                onChange={(e) => setFormData({...formData, tax_id: e.target.value})}
                className="w-full pl-10 pr-4 py-5 bg-white/[0.05] border border-white/5 rounded-2xl p-5 text-white font-medium outline-none focus:border-green-400 focus:bg-white/[0.08] transition-all"
                placeholder="Tax identification number"
              />
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-green-400 text-black py-6 rounded-full font-[950] text-sm uppercase tracking-widest italic shadow-[0_20px_40px_rgba(163,230,53,0.15)] mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering Business...' : 'Confirm Business'}
          </motion.button>
        </form>
      </motion.div>
    </main>
  )
}
