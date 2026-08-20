'use client';

import React, { useState, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Sparkles,
  Volume2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/constants';

const COMMON_EMERGENCY_PHRASES = [
  'Where is the nearest police station?',
  'I need an ambulance immediately.',
  'Please help me, I am in danger.',
  'Where is the nearest hospital?',
  'I lost my passport and wallet.',
  'Can you help me contact my embassy?',
  'Is this area safe to walk at night?',
  'Call the police now.',
  'I have been robbed.',
  'I need a doctor urgently.',
  'Take me to the hospital.',
  'I am lost, please help me.',
];

// ---- Full Tamil phrase dictionary for offline fallback ----
const TAMIL_PHRASES: Record<string, string> = {
  'where is the nearest police station?': 'அருகிலுள்ள காவல் நிலையம் எங்கே உள்ளது?',
  'i need an ambulance immediately.': 'எனக்கு உடனடியாக ஆம்புலன்ஸ் தேவை.',
  'please help me, i am in danger.': 'தயவுசெய்து உதவுங்கள், நான் ஆபத்தில் இருக்கிறேன்.',
  'where is the nearest hospital?': 'அருகிலுள்ள மருத்துவமனை எங்கே உள்ளது?',
  'i lost my passport and wallet.': 'என் பாஸ்போர்ட் மற்றும் பணப்பை தொலைந்துவிட்டது.',
  'can you help me contact my embassy?': 'என் தூதரகத்தை தொடர்பு கொள்ள உதவ முடியுமா?',
  'is this area safe to walk at night?': 'இந்த பகுதியில் இரவில் நடப்பது பாதுகாப்பானதா?',
  'call the police now.': 'இப்போதே காவல்துறையை அழையுங்கள்.',
  'i have been robbed.': 'என்னை கொள்ளையடித்தார்கள்.',
  'i need a doctor urgently.': 'எனக்கு அவசரமாக ஒரு மருத்துவர் தேவை.',
  'take me to the hospital.': 'என்னை மருத்துவமனைக்கு அழைத்துச் செல்லுங்கள்.',
  'i am lost, please help me.': 'நான் தொலைந்துவிட்டேன், தயவுசெய்து உதவுங்கள்.',
  'help': 'உதவி',
  'emergency': 'அவசரநிலை',
  'hospital': 'மருத்துவமனை',
  'police': 'காவல்துறை',
  'ambulance': 'ஆம்புலன்ஸ்',
  'doctor': 'மருத்துவர்',
  'fire': 'தீ',
  'danger': 'ஆபத்து',
  'safe': 'பாதுகாப்பான',
  'thank you': 'நன்றி',
  'please': 'தயவுசெய்து',
  'water': 'தண்ணீர்',
  'food': 'உணவு',
  'lost': 'தொலைந்துவிட்டேன்',
  'passport': 'பாஸ்போர்ட்',
};

const HINDI_PHRASES: Record<string, string> = {
  'where is the nearest police station?': 'निकटतम पुलिस स्टेशन कहाँ है?',
  'i need an ambulance immediately.': 'मुझे तुरंत एम्बुलेंस चाहिए।',
  'please help me, i am in danger.': 'कृपया मेरी मदद करें, मैं खतरे में हूँ।',
  'where is the nearest hospital?': 'निकटतम अस्पताल कहाँ है?',
  'i lost my passport and wallet.': 'मेरा पासपोर्ट और बटुआ खो गया।',
  'can you help me contact my embassy?': 'क्या आप मेरे दूतावास से संपर्क करने में मदद कर सकते हैं?',
  'is this area safe to walk at night?': 'क्या यह क्षेत्र रात में चलने के लिए सुरक्षित है?',
  'call the police now.': 'अभी पुलिस को बुलाओ।',
  'i have been robbed.': 'मेरे साथ डकैती हुई है।',
  'i need a doctor urgently.': 'मुझे तुरंत एक डॉक्टर चाहिए।',
  'take me to the hospital.': 'मुझे अस्पताल ले चलो।',
  'i am lost, please help me.': 'मैं खो गया हूँ, कृपया मेरी मदद करें।',
};

const TELUGU_PHRASES: Record<string, string> = {
  'where is the nearest police station?': 'సమీప పోలీస్ స్టేషన్ ఎక్కడ ఉంది?',
  'i need an ambulance immediately.': 'నాకు వెంటనే అంబులెన్స్ అవసరం.',
  'please help me, i am in danger.': 'దయచేసి నాకు సహాయం చేయండి, నేను ప్రమాదంలో ఉన్నాను.',
  'where is the nearest hospital?': 'సమీప ఆసుపత్రి ఎక్కడ ఉంది?',
  'i lost my passport and wallet.': 'నా పాస్‌పోర్ట్ మరియు వాలెట్ పోయాయి.',
  'call the police now.': 'ఇప్పుడే పోలీసులకు పిలవండి.',
  'i have been robbed.': 'నన్ను దోచుకున్నారు.',
  'i need a doctor urgently.': 'నాకు అత్యవసరంగా డాక్టర్ అవసరం.',
  'take me to the hospital.': 'నన్ను ఆసుపత్రికి తీసుకెళ్ళండి.',
  'i am lost, please help me.': 'నేను దారి తప్పాను, దయచేసి సహాయం చేయండి.',
};

const KANNADA_PHRASES: Record<string, string> = {
  'where is the nearest police station?': 'ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ?',
  'i need an ambulance immediately.': 'ನನಗೆ ತಕ್ಷಣ ಆಂಬ್ಯುಲೆನ್ಸ್ ಬೇಕು.',
  'please help me, i am in danger.': 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ, ನಾನು ಅಪಾಯದಲ್ಲಿದ್ದೇನೆ.',
  'where is the nearest hospital?': 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?',
  'call the police now.': 'ಈಗಲೇ ಪೊಲೀಸರಿಗೆ ಕರೆ ಮಾಡಿ.',
  'i have been robbed.': 'ನನ್ನನ್ನು ದರೋಡೆ ಮಾಡಲಾಗಿದೆ.',
  'i need a doctor urgently.': 'ನನಗೆ ತುರ್ತಾಗಿ ವೈದ್ಯರ ಅಗತ್ಯವಿದೆ.',
  'take me to the hospital.': 'ನನ್ನನ್ನು ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ.',
};

const PHRASE_DICT: Record<string, Record<string, string>> = {
  ta: TAMIL_PHRASES,
  hi: HINDI_PHRASES,
  te: TELUGU_PHRASES,
  kn: KANNADA_PHRASES,
};

/**
 * Real translation using Google Translate unofficial API.
 * Works without any API key via the free public endpoint.
 */
async function translateViaGoogle(text: string, sourceLang: string, targetLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Translation request failed');
  const data = await response.json();
  // Response structure: [[["translated","original",...],...],...]
  const translated = (data[0] as Array<Array<string>>)
    .map((chunk) => chunk[0])
    .filter(Boolean)
    .join('');
  return translated;
}

export default function TranslatePage() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ta');
  const [inputText, setInputText] = useState('Where is the nearest police station?');
  const [translatedText, setTranslatedText] = useState('அருகிலுள்ள காவல் நிலையம் எங்கே உள்ளது?');
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = useCallback(async (textToTranslate = inputText, tgtLang = targetLang, srcLang = sourceLang) => {
    if (!textToTranslate.trim()) return;
    setIsTranslating(true);
    setError(null);

    // 1. Try offline phrase dictionary first (instant)
    const dictKey = textToTranslate.trim().toLowerCase();
    const dict = PHRASE_DICT[tgtLang];
    if (dict && dict[dictKey]) {
      setTranslatedText(dict[dictKey]);
      setIsTranslating(false);
      return;
    }

    // 2. Try real Google Translate
    try {
      const result = await translateViaGoogle(textToTranslate, srcLang, tgtLang);
      if (result && result.trim()) {
        setTranslatedText(result);
      } else {
        throw new Error('Empty translation result');
      }
    } catch (err) {
      // 3. Last fallback — show dict if partial match
      if (dict) {
        for (const [key, val] of Object.entries(dict)) {
          if (dictKey.includes(key) || key.includes(dictKey)) {
            setTranslatedText(val);
            setIsTranslating(false);
            return;
          }
        }
      }
      setError('Translation service unavailable. Showing closest match or check your internet connection.');
      setTranslatedText(textToTranslate); // show original
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, targetLang, sourceLang]);

  const handleSwap = () => {
    const prevSource = sourceLang;
    const prevTarget = targetLang;
    const prevTranslated = translatedText;
    setSourceLang(prevTarget);
    setTargetLang(prevSource);
    setInputText(prevTranslated);
    setTranslatedText(inputText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string, lang: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : lang === 'te' ? 'te-IN' : lang === 'kn' ? 'kn-IN' : 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
  const sourceLangName = SUPPORTED_LANGUAGES.find(l => l.code === sourceLang)?.name || sourceLang;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar type="tourist" />

        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto space-y-8 w-full">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" /> Emergency Communication
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
              Safety & Emergency Phrase Translator
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Break language barriers during medical emergencies, navigation questions, and police interactions. Uses real-time Google Translate.
            </p>
          </div>

          {/* Translator Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            {/* Language Selection Header */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">From</label>
                <select
                  value={sourceLang}
                  onChange={(e) => {
                    setSourceLang(e.target.value);
                    handleTranslate(inputText, targetLang, e.target.value);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-cyan-500"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSwap}
                className="mt-5 p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-950 hover:border-cyan-500/50 border border-slate-700 text-cyan-400 transition-all"
                title="Swap languages"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider">To</label>
                <select
                  value={targetLang}
                  onChange={(e) => {
                    setTargetLang(e.target.value);
                    handleTranslate(inputText, e.target.value, sourceLang);
                  }}
                  className="w-full bg-slate-950 border border-cyan-800/60 rounded-xl px-3 py-2 text-xs font-bold text-cyan-400 focus:border-cyan-500"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {/* Input & Output */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-400">{sourceLangName}</label>
                  <button
                    onClick={() => handleSpeak(inputText, sourceLang)}
                    className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
                    title="Speak original"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="Type anything you need translated..."
                />
              </div>

              {/* Target */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-cyan-400">{targetLangName}</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(translatedText, targetLang)}
                      className="text-slate-500 hover:text-cyan-400 p-1 rounded-lg"
                      title="Speak translated text"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="w-full min-h-[120px] bg-slate-950/60 border border-cyan-900/40 rounded-2xl p-4 text-sm font-medium">
                  {isTranslating ? (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      Translating to {targetLangName}...
                    </div>
                  ) : (
                    <span className="text-white leading-relaxed">{translatedText}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleTranslate()}
              disabled={isTranslating}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-black rounded-xl text-sm transition-colors shadow-md shadow-cyan-950/40 flex items-center justify-center gap-2"
            >
              {isTranslating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Translating...</>
              ) : (
                <><Languages className="w-4 h-4" /> Translate to {targetLangName}</>
              )}
            </button>
          </div>

          {/* Quick Emergency Phrase Presets */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Instant Emergency Phrases — 1-Click Translate to {targetLangName}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {COMMON_EMERGENCY_PHRASES.map((phrase) => (
                <button
                  key={phrase}
                  onClick={() => {
                    setInputText(phrase);
                    handleTranslate(phrase, targetLang, sourceLang);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left text-xs text-slate-300 hover:text-white transition-all group"
                >
                  <span className="text-cyan-500 group-hover:text-cyan-400 font-bold text-[10px] uppercase block mb-1">Click to translate →</span>
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
