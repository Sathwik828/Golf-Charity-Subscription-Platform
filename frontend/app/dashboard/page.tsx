'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Heart, CreditCard, LogOut, ChevronRight, CheckCircle2, Clock } from 'lucide-react'

export default function DashboardPage() {
  const [score, setScore] = useState<number | ''>('')
  const [scores, setScores] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [verificationUrl, setVerificationUrl] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setUser(session.user)
        fetchScores(session.user.id)
        fetchProfile(session.user.id)
      }
    }
    checkUser()
  }, [])

  const fetchProfile = async (userId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/profile/${userId}`)
    setProfile(await res.json())
  }

  const fetchScores = async (userId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/scores/${userId}`)
    const data = await res.json()
    setScores(Array.isArray(data) ? data : [])
  }

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, score }),
    })
    if (res.ok) {
      setScore('')
      fetchScores(user.id)
    } else {
      alert((await res.json()).error)
    }
    setLoading(false)
  }

  const handleVerifyWin = async (winnerId: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/winners/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId, verificationUrl }),
    })
    if (res.ok) {
      setVerifyingId(null); setVerificationUrl(''); fetchProfile(user.id)
    }
  }

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold">Loading...</div>

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Side Nav Placeholder for Premium Look */}
      <div className="flex">
        <div className="w-20 md:w-64 min-h-screen bg-white border-r border-gray-100 p-6 flex flex-col justify-between hidden md:flex sticky top-0">
          <div>
             <div className="flex items-center gap-2 mb-12">
               <div className="w-8 h-8 bg-emerald-500 rounded-lg" />
               <span className="font-black text-xl">GolfGive</span>
             </div>
             <nav className="space-y-4">
               <Link href="/dashboard" className="flex items-center gap-3 text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl transition">
                 <Trophy className="w-5 h-5" /> Dashboard
               </Link>
               <Link href="/charities" className="flex items-center gap-3 text-gray-500 font-medium hover:text-emerald-600 p-3 rounded-xl transition">
                 <Heart className="w-5 h-5" /> Charities
               </Link>
             </nav>
          </div>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="flex items-center gap-3 text-gray-400 p-3">
             <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        <main className="flex-1 p-8 lg:p-12">
          <header className="flex justify-between items-end mb-12">
             <div>
               <h1 className="text-3xl font-black text-gray-900">Player Dashboard</h1>
               <p className="text-gray-500">Welcome back, {user.email?.split('@')[0]}</p>
             </div>
             <div className="flex gap-4">
                <div className="bg-white p-2 rounded-full border border-gray-100 flex items-center gap-2 pr-4 shadow-sm">
                   <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                      <CreditCard className="w-4 h-4" />
                   </div>
                   <span className="text-xs font-bold text-gray-600">Active Pro</span>
                </div>
             </div>
          </header>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
             <div className="glass-card p-8 group hover:bg-emerald-600 transition-colors duration-500">
                <p className="text-xs font-bold text-gray-400 group-hover:text-emerald-100 uppercase tracking-widest">Subscription</p>
                <div className="flex items-center justify-between mt-2">
                   <h2 className="text-2xl font-black text-gray-900 group-hover:text-white capitalize">{profile?.subscription?.status || 'Active'}</h2>
                   <CheckCircle2 className="text-emerald-500 group-hover:text-white w-6 h-6" />
                </div>
             </div>
             <div className="glass-card p-8 group hover:bg-indigo-600 transition-colors duration-500">
                <p className="text-xs font-bold text-gray-400 group-hover:text-indigo-100 uppercase tracking-widest">Selected Charity</p>
                <div className="flex items-center justify-between mt-2">
                   <h2 className="text-xl font-black text-gray-900 group-hover:text-white truncate pr-4">{profile?.charity?.name || 'Loading...'}</h2>
                   <Heart className="text-rose-500 group-hover:text-white w-6 h-6" />
                </div>
             </div>
             <div className="glass-card p-8 group hover:bg-amber-500 transition-colors duration-500">
                <p className="text-xs font-bold text-gray-400 group-hover:text-amber-100 uppercase tracking-widest">Total Winnings</p>
                <div className="flex items-center justify-between mt-2">
                   <h2 className="text-2xl font-black text-gray-900 group-hover:text-white">₹{profile?.winnings?.reduce((a:any, c:any)=>a+c.prize_amount,0).toFixed(2) || '0.00'}</h2>
                   <Trophy className="text-amber-500 group-hover:text-white w-6 h-6" />
                </div>
             </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
             <div className="lg:col-span-3 space-y-12">
                {/* Score Input */}
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                   <h3 className="text-xl font-black mb-8">Submit Recent Score</h3>
                   <form onSubmit={handleAddScore} className="flex gap-4">
                      <div className="flex-1 relative">
                         <input 
                           type="number" 
                           placeholder="Score (1-45)" 
                           className="w-full bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-lg font-bold"
                           value={score}
                           onChange={e=>setScore(e.target.value===''? '': parseInt(e.target.value))}
                         />
                      </div>
                      <button className="bg-emerald-600 text-white px-10 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition transform hover:-translate-y-1">
                        Submit
                      </button>
                   </form>
                </div>

                {/* Score History */}
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                   <h3 className="text-xl font-black mb-8">Scoring History</h3>
                   <div className="space-y-4">
                      {scores.map(s => (
                        <div key={s.id} className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-md transition">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-lg font-black text-emerald-600">
                                {s.score}
                              </div>
                              <span className="font-bold text-gray-700">Official Handicap Entry</span>
                           </div>
                           <span className="text-xs font-bold text-gray-400">{new Date(s.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Winner Feed */}
             <div className="lg:col-span-2">
                <h3 className="text-xl font-black mb-8">Prizes & Verification</h3>
                <div className="space-y-6">
                   {profile?.winnings?.map((win:any, idx:number) => (
                      <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <p className="text-2xl font-black text-gray-900">₹{win.prize_amount.toFixed(2)}</p>
                               <p className="text-xs text-gray-400 font-bold mt-1">{win.matches_count} NUMBER MATCH</p>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${win.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                               {win.is_verified ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                               {win.is_verified ? 'Verified' : 'Pending'}
                            </div>
                         </div>
                         {!win.is_verified && (
                            <div className="mt-4">
                               {verifyingId === idx.toString() ? (
                                  <div className="flex gap-2">
                                     <input className="flex-1 bg-gray-50 p-2 rounded-lg text-xs" placeholder="Scorecard Link" value={verificationUrl} onChange={e=>setVerificationUrl(e.target.value)} />
                                     <button onClick={()=>handleVerifyWin(win.id)} className="bg-emerald-600 text-white px-4 rounded-lg text-xs font-bold">Apply</button>
                                  </div>
                               ) : (
                                  <button onClick={()=>setVerifyingId(idx.toString())} className="w-full bg-gray-900 text-white text-xs py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                     Submit Verification Proof <ChevronRight className="w-4 h-4" />
                                  </button>
                               )}
                            </div>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </main>
      </div>
    </div>
  )
}
