'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, Newspaper } from 'lucide-react';
import TurnstileWidget from '@/components/public/TurnstileWidget';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          turnstileToken,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit contact message.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-neutral-500 font-sans">
        <Link href="/" className="hover:text-brand-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-neutral-900 dark:text-white">Contact & Editorial Desk</span>
      </div>

      {/* Page Header */}
      <div className="border-b-2 border-brand-600 pb-4">
        <div className="flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest">
          <Newspaper className="w-4 h-4" />
          <span>Newsroom Direct Line</span>
        </div>
        <h1 className="font-headline text-3xl md:text-5xl font-black text-neutral-900 dark:text-white mt-1">
          Get in Touch With Our Editors
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-serif mt-2 max-w-2xl">
          Have a breaking news tip, story correction, press release, or editorial inquiry? Send us a message directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Information Cards (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-6 shadow-xs space-y-5">
            <h3 className="font-headline text-base font-bold uppercase tracking-wider text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-2">
              Editorial Office
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 block">Headquarters:</span>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    Chronicle Plaza, 42nd Floor, Motijheel C/A, Dhaka - 1000
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 block">Editorial Email:</span>
                  <p className="text-neutral-500 dark:text-neutral-400">editorial@chronicle.news</p>
                  <p className="text-neutral-500 dark:text-neutral-400">tips@chronicle.news (Confidential Tips)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 block">Newsroom Phone:</span>
                  <p className="text-neutral-500 dark:text-neutral-400">+880 (02) 987-6543</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 text-white rounded-xs p-6 space-y-2">
            <div className="flex items-center gap-2 text-brand-500 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Whistleblower Security</span>
            </div>
            <h4 className="font-headline text-sm font-bold">Encrypted Confidential Tips</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              We protect the identity of our confidential sources under strict journalistic shield conventions.
            </p>
          </div>
        </div>

        {/* Contact Form with Cloudflare Turnstile (7 Cols) */}
        <div className="md:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xs p-6 md:p-8 shadow-xs">
          {status === 'success' ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-headline text-xl font-bold text-neutral-900 dark:text-white">
                Message Successfully Received!
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto font-serif">
                Thank you for reaching out to The Daily Chronicle. Our news desk will review your inquiry promptly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 px-5 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              {status === 'error' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xs text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="News Tip / Editorial Query / Press Release"
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide full details of your news tip or inquiry..."
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              {/* Cloudflare Turnstile Bot Protection Widget */}
              <div>
                <TurnstileWidget
                  onVerify={(token) => setTurnstileToken(token)}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition shadow-sm"
              >
                {status === 'submitting' ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <span>Send Message to Editors</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
