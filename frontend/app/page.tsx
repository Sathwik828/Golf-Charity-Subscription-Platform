'use client'

import Link from 'next/link'
import { ArrowRight, Trophy, Heart, ShieldCheck, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-emerald-100">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <Globe className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">Golf<span className="text-emerald-600">Give</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">Features</Link>
            <Link href="/charities" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition">Charities</Link>
            <Link href="/login" className="text-sm font-bold text-gray-900 px-6 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition">Log In</Link>
            <Link href="/signup" className="btn-primary py-2 px-8 text-sm">Join the Club</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mb-8 animate-bounce">
            <Trophy className="w-4 h-4" /> Over ₹50,000 in monthly prizes!
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tight">
            Play Golf. <br />
            <span className="text-gradient">Win Big.</span> <br />
            Give Back.
          </h1>
          <p className="max-w-2xl text-xl text-gray-600 mb-12 leading-relaxed">
            The world's first charity-linked golf subscription. Enter your scores, win monthly jackpots, and support your favorite causes automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="btn-primary text-lg flex items-center gap-2">
              Start Your Subscription <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/charities" className="btn-secondary text-lg">
              Explore Charities
            </Link>
          </div>
          
          {/* Abstract Hero Image Placeholder */}
          <div className="mt-20 relative w-full max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-bg-main to-transparent z-10" />
            <div className="bg-gradient-to-br from-emerald-50 to-indigo-50 rounded-3xl p-8 border border-white shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
               <div className="text-center animate-float">
                 <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl mb-6">
                    <Trophy className="w-16 h-16 text-emerald-500" />
                 </div>
                 <div className="space-y-2">
                    <div className="h-4 w-48 bg-emerald-200 rounded-full mx-auto" />
                    <div className="h-4 w-32 bg-emerald-100 rounded-full mx-auto" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black text-gray-900 mb-4">How it Works</h2>
            <div className="w-20 h-1.5 bg-emerald-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />, 
                title: "1. Weekly Scores", 
                desc: "Enter your 5 best golf scores each week. Every score is a chance to win."
              },
              { 
                icon: <Trophy className="w-8 h-8 text-indigo-600" />, 
                title: "2. Monthly Draw", 
                desc: "Matching 3 or more numbers wins a prize. Matching 5 wins the Jackpot!"
              },
              { 
                icon: <Heart className="w-8 h-8 text-rose-600" />, 
                title: "3. Charity Impact", 
                desc: "10% of every winning is donated to your chosen charity. Play for good."
              }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-500 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="text-emerald-400 w-8 h-8" />
              <span className="text-2xl font-black">GolfGive</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              The premium platform for golf enthusiasts who want to make a difference.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-4">
              <span className="font-bold uppercase text-gray-500">Platform</span>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
              <Link href="/charities" className="text-gray-400 hover:text-white transition">Charity Partners</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-bold uppercase text-gray-500">Business</span>
              <Link href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
