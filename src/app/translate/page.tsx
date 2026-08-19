'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Languages, ArrowRightLeft, Copy, Check, Sparkles, Volume2 } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/constants';

const COMMON_EMERGENCY_PHRASES = [
  'Where is the nearest police station?',
  'I need an ambulance immediately.',
  'Please help me, I am in danger.',
  'Where is the nearest hospital?',
  'I lost my passport and wallet.',
  'Can you help me contact my embassy?',
  'Is this area safe to walk at night?',
];

export default function TranslatePage() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ta'); // Tamil default for Chennai
  const [inputText, setInputText] = useState('Where is the nearest police station?');
  const [translatedText, setTranslatedText] = useState('அருகிலுள்ள காவல் நிலையம் எங்கே உள்ளது?');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulated translation mappings for core emergency phrases
  const mockTranslations: Record<string, Record<string, string>> = {
    'Where is the nearest police station?': {
      ta: 'அருகிலுள்ள காவல் நிலையம் எங்கே உள்ளது?',
      hi: 'निकटतम पुलिस स्टेशन कहाँ है?',
      te: 'సమీప పోలీస్ స్టేషన్ ఎక్కడ ఉంది?',
      kn: 'ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ?',
      fr: 'Où se trouve le commissariat le plus proche ?',
      es: '¿Dónde está la comisaría más cercana?',
    },
    'I need an ambulance immediately.': {
      ta: 'எனக்கு உடனடியாக ஆம்புலன்ஸ் தேவை.',
      hi: 'मुझे तुरंत एम्बुलेंस चाहिए।',
      te: 'నాకు వెంటనే అంబులెన్స్ అవసరం.',
      kn: 'ನನಗೆ ತಕ್ಷಣ ಆಂಬ್ಯುಲೆನ್ಸ್ ಬೇಕು.',
      fr: "J'ai besoin d'une ambulance immédiatement.",
      es: 'Necesito una ambulancia inmediatamente.',
    },
  };

  const handleTranslate = (textToTranslate = inputText) => {
    setIsTranslating(true);
    setTimeout(() => {
      const match = mockTranslations[textToTranslate]?.[targetLang] ||
        `[Translated to ${SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name}]: ${textToTranslate}`;
      setTranslatedText(match);
      setIsTranslating(false);
    }, 300);
  };

  const handleSwap = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Emergency Communication
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Safety & Emergency Phrase Translator
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Break language barriers during medical emergencies, navigation questions, and police interactions.
            </p>
          </div>

          {/* Translator Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            {/* Language Selection Header */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <select
                value={sourceLang}
                onChange={(e) => {
                  setSourceLang(e.target.value);
                  handleTranslate();
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white focus:border-cyan-500"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>

              <button
                onClick={handleSwap}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              <select
                value={targetLang}
                onChange={(e) => {
                  setTargetLang(e.target.value);
                  handleTranslate();
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-cyan-400 focus:border-cyan-500"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            {/* Input & Output Textareas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Original Phrase</label>
                <textarea
                  rows={4}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Type anything you need translated..."
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-cyan-400">Translation</label>
                  <button
                    onClick={handleCopy}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div className="w-full h-[104px] bg-slate-950/60 border border-slate-800 rounded-2xl p-4 text-sm text-white font-medium flex items-center">
                  {isTranslating ? (
                    <div className="text-xs text-slate-500 animate-pulse">Translating phrase...</div>
                  ) : (
                    translatedText
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleTranslate()}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-cyan-950/40"
            >
              Translate Phrase
            </button>
          </div>

          {/* Quick Emergency Phrase Presets */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Instant Emergency Phrases (1-Click)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {COMMON_EMERGENCY_PHRASES.map((phrase) => (
                <button
                  key={phrase}
                  onClick={() => {
                    setInputText(phrase);
                    handleTranslate(phrase);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-left text-xs text-slate-300 hover:text-white transition-all"
                >
                  &quot;{phrase}&quot;
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
