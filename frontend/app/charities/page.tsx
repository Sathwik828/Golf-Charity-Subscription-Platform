'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Charity {
  id: string
  name: string
  description: string
  website: string
}

export default function CharitiesPage() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [selectedCharity, setSelectedCharity] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchCharities()
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const fetchCharities = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/charities`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setCharities(data)
      } else {
        console.error('Backend error or missing table:', data.error)
        setCharities([])
      }
    } catch (error) {
      console.error('Error fetching charities:', error)
    }
  }

  const handleSelectCharity = async (charityId: string) => {
    if (!user) {
      alert('Please log in to select a charity.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/charities/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, charityId }),
      })

      if (response.ok) {
        setSelectedCharity(charityId)
        alert('Charity selected successfully!')
      } else {
        alert('Failed to update charity selection.')
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Support a Charity</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {charities.map((charity) => (
            <div key={charity.id} className="bg-white overflow-hidden shadow rounded-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{charity.name}</h3>
                <p className="mt-2 text-gray-600">{charity.description}</p>
                <a href={charity.website} target="_blank" className="mt-2 text-blue-600 hover:underline block text-sm">
                  Visit Website
                </a>
              </div>
              <button
                onClick={() => handleSelectCharity(charity.id)}
                disabled={loading || selectedCharity === charity.id}
                className={`mt-6 w-full py-2 px-4 rounded-md font-medium text-white transition ${
                  selectedCharity === charity.id ? 'bg-green-500 cursor-default' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {selectedCharity === charity.id ? 'Selected ✓' : 'Support this Charity'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
