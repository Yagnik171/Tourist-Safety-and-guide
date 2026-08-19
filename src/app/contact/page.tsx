'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 py-16 px-4 md:px-8 max-w-5xl mx-auto space-y-12 w-full">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Support & Inquiries</span>
          <h1 className="text-3xl md:text-5xl font-black text-white">Contact SafeWander Team</h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Have questions regarding integration, authority verification, or emergency partnership? Reach out to us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white">Get in Touch</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-400">Email Contact</div>
                  <div className="text-white font-semibold">support@safewander.demo</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-400">National Helpline</div>
                  <div className="text-white font-semibold">1800-111-363 (Tourist Helpline)</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-slate-400">HQ Location</div>
                  <div className="text-white font-semibold">Chennai, Tamil Nadu, India</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Message Dispatched</h4>
                <p className="text-xs text-slate-400">Our safety operations team will respond promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist your travel safety?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
