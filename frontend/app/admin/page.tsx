'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalUsers: number
  activeSubscriptions: number
  totalPrizeAwarded: number
  totalCharityDonated: number
}

interface User {
  user_id: string
  status: string
  plan_type: string
  created_at: string
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [pendingWinners, setPendingWinners] = useState<any[]>([])
  const [result, setResult] = useState<any>(null)
  const [prizePool, setPrizePool] = useState(1000)

  useEffect(() => {
    fetchStats()
    fetchUsers()
    fetchPendingWinners()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/overview`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/users`)
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error(error)
    }
  }

  const fetchPendingWinners = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/winners/unverified`)
      const data = await response.json()
      setPendingWinners(data || [])
    } catch (error) {
      console.error(error)
    }
  }

  const handleRunDraw = async () => {
    setLoading(true)
    setResult(null)
    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      if (!user) return alert("Admin login required")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/draws/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prizePool, userId: user.id }),
      })
      const data = await response.json()
      if (data.error) alert(data.error)
      else {
        setResult(data)
        fetchStats()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveWin = async (winnerId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/winners/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId }),
      })
      if (response.ok) {
        alert('Winner approved!')
        fetchPendingWinners()
        fetchStats()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleSeedCharities = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/charities/seed`, { method: 'POST' })
      alert('Charities seeded!')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Admin Control Center</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 uppercase font-bold">Total Users</p>
            <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 uppercase font-bold">Active Subs</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.activeSubscriptions || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 uppercase font-bold">Prizes</p>
            <p className="text-3xl font-bold text-green-600">₹{stats?.totalPrizeAwarded.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 uppercase font-bold">Charity</p>
            <p className="text-3xl font-bold text-purple-600">₹{stats?.totalCharityDonated.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6">Run Monthly Draw</h2>
              <div className="mb-4">
                <label className="block text-sm mb-1">Prize Pool (₹)</label>
                <input type="number" value={prizePool} onChange={(e) => setPrizePool(parseInt(e.target.value))} className="w-full border p-2 rounded" />
              </div>
              <button onClick={handleRunDraw} disabled={loading} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold mb-4">{loading ? '...' : 'Run Draw'}</button>
              <button onClick={handleSeedCharities} className="w-full bg-gray-100 py-2 rounded-lg text-sm">Seed Charities</button>
              {result && (
                <div className="mt-4 p-4 bg-green-50 rounded text-xs">
                  <p>Winning: {result.winningNumbers?.join(', ')}</p>
                  <p>Winners: {result.winnersCount}</p>
                  <p>Rollover: ₹{result.jackpotRollover?.toFixed(2)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tables */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-yellow-50 border-b border-yellow-100 font-bold">Pending Verifications</div>
              <div className="p-4">
                {pendingWinners.length === 0 ? <p className="text-sm text-gray-500 italic">No pending items.</p> : (
                  <div className="space-y-4">
                    {pendingWinners.map(w => (
                      <div key={w.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border">
                        <div>
                          <p className="text-sm font-bold">Prize: ₹{parseFloat(w.prize_amount).toFixed(2)}</p>
                          <a href={w.verification_url} target="_blank" className="text-xs text-blue-600 hover:underline">View Scorecard ↗</a>
                        </div>
                        <button onClick={() => handleApproveWin(w.id)} className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold">Approve</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-sm">
              <div className="p-4 border-b font-bold">System Users</div>
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr><th className="p-4">User</th><th className="p-4">Status</th><th className="p-4">Plan</th></tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.user_id}><td className="p-4 font-mono">{u.user_id.substring(0,8)}...</td><td className="p-4 capitalize">{u.status}</td><td className="p-4 capitalize">{u.plan_type}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}