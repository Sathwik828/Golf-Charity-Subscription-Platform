'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '@/lib/supabase'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function SubscriptionsPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    setLoading(planType)
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      alert('Please log in to subscribe!')
      window.location.href = '/login'
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/subscriptions/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          userId: session.user.id,
          email: session.user.email,
        }),
      })

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Payment failed to initiate.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Subscription Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Support your favorite charity and join the monthly golf draw!
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {/* Monthly Plan */}
          <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Monthly Plan</h3>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">₹10</span>
                <span className="text-base font-medium text-gray-500">/mo</span>
              </p>
              <button
                onClick={() => handleSubscribe('monthly')}
                disabled={!!loading}
                className="mt-8 block w-full bg-blue-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-blue-700 disabled:opacity-50"
              >
                {loading === 'monthly' ? 'Processing...' : 'Subscribe Monthly'}
              </button>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
            <div className="p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Yearly Plan</h3>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">₹100</span>
                <span className="text-base font-medium text-gray-500">/year</span>
              </p>
              <button
                onClick={() => handleSubscribe('yearly')}
                disabled={!!loading}
                className="mt-8 block w-full bg-green-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-green-700 disabled:opacity-50"
              >
                {loading === 'yearly' ? 'Processing...' : 'Subscribe Yearly'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
