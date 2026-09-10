import React, { useState } from 'react';
import { BANGLA_STEP_BY_STEP_GUIDE, GuideSection } from '../data/guideContent';
import { 
  BookOpen, 
  CheckCircle, 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Database, 
  Cpu, 
  Globe, 
  Smartphone, 
  CreditCard, 
  Server,
  Sparkles,
  ChevronRight,
  Code2
} from 'lucide-react';

interface GuideViewProps {
  language: 'bn' | 'en';
}

export const GuideView: React.FC<GuideViewProps> = ({ language }) => {
  const isBn = language === 'bn';
  const [selectedStepId, setSelectedStepId] = useState<string>(BANGLA_STEP_BY_STEP_GUIDE[0].id);
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);

  const currentSection = BANGLA_STEP_BY_STEP_GUIDE.find(s => s.id === selectedStepId) || BANGLA_STEP_BY_STEP_GUIDE[0];

  const handleCopyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0: return <Layers className="w-4 h-4" />;
      case 1: return <Database className="w-4 h-4" />;
      case 2: return <Code2 className="w-4 h-4" />;
      case 3: return <Cpu className="w-4 h-4" />;
      case 4: return <Globe className="w-4 h-4" />;
      case 5: return <Smartphone className="w-4 h-4" />;
      case 6: return <CreditCard className="w-4 h-4" />;
      case 7: return <Server className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Guide Header Banner */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#396D32] relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#23471E] border border-[#396D32] text-[#FAEDCD] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>{isBn ? 'সম্পূর্ণ ফুল-স্ট্যাক প্রজেক্ট ডেভেলপমেন্ট গাইডলাইন' : 'Full-Stack Rental Architecture Guide'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {isBn 
              ? 'React + Django + PostgreSQL দিয়ে বাড়িভাড়া প্ল্যাটফর্ম তৈরির নির্দেশিকা' 
              : 'Step-by-Step Guide: Building a Rental System in BD with React & Django'}
          </h1>

          <p className="text-[#E9EDC9] text-xs sm:text-sm leading-relaxed">
            {isBn 
              ? 'নিচে ৩টি ইউজার রোল (ভাড়াটিয়া, বাড়িওয়ালা, অ্যাডমিন), রিয়েলটাইম নোটিফিকেশন, ডেটাবেজ মডেলিং, সিকিউর API এবং মোবাইল/পিসি অ্যাপ সম্প্রসারণের পূর্ণাঙ্গ ধাপ দেওয়া হলো।'
              : 'Complete technical breakdown for Multi-Role Rental System, Django Models, WebSockets, REST APIs, and Mobile/PC expansion.'}
          </p>
        </div>
      </div>

      {/* Main Grid: Left Steps Navigation + Right Detailed Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Step Selector Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E0D8] p-4 shadow-2xs space-y-2 sticky top-24">
          <div className="px-3 py-2 text-xs font-bold text-[#5A6D56] uppercase tracking-wider">
            {isBn ? 'প্রজেক্ট তৈরির ধাপসমূহ' : 'Development Roadmap'}
          </div>

          {BANGLA_STEP_BY_STEP_GUIDE.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setSelectedStepId(step.id)}
              className={`w-full text-left p-3 rounded-2xl text-xs font-medium transition-all flex items-center justify-between gap-3 ${
                selectedStepId === step.id
                  ? 'bg-[#E9EDC9] text-[#2D5A27] border border-[#CCD5AE] shadow-2xs font-bold'
                  : 'text-[#5A6D56] hover:bg-[#FDFBF7] hover:text-[#354231] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl shrink-0 ${
                  selectedStepId === step.id ? 'bg-[#2D5A27] text-white' : 'bg-[#F5F2EC] text-[#5A6D56]'
                }`}>
                  {getStepIcon(idx)}
                </div>
                <div>
                  <div className="line-clamp-1 font-bold">{isBn ? step.titleBn : step.titleEn}</div>
                  <div className="text-[10px] text-[#8F9E8B] font-normal">{step.badge}</div>
                </div>
              </div>

              <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${
                selectedStepId === step.id ? 'text-[#2D5A27] translate-x-0.5' : 'text-[#CCD5AE]'
              }`} />
            </button>
          ))}
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 shadow-2xs space-y-6">
          
          {/* Step Header */}
          <div className="border-b border-[#E5E0D8] pb-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-[#E9EDC9] text-[#2D5A27] border border-[#CCD5AE] px-3 py-1 rounded-full">
                {currentSection.badge}
              </span>
              <span className="text-xs text-[#8F9E8B] font-medium">
                {isBn ? `ধাপ ${currentSection.stepNumber} / ৮` : `Step ${currentSection.stepNumber} of 8`}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#354231]">
              {isBn ? currentSection.titleBn : currentSection.titleEn}
            </h2>

            <p className="text-xs sm:text-sm text-[#5A6D56] font-medium">
              {currentSection.summaryBn}
            </p>
          </div>

          {/* Description */}
          <div className="bg-[#FDFBF7] border border-[#E5E0D8] rounded-2xl p-5 text-xs sm:text-sm text-[#354231] leading-relaxed whitespace-pre-line">
            {currentSection.content.descriptionBn}
          </div>

          {/* Key Bullet Points */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#354231] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#2D5A27]" />
              <span>{isBn ? 'মূল টেকনিক্যাল কনসেপ্ট ও রিকোয়ারমেন্ট' : 'Key Technical Considerations'}</span>
            </h3>

            <div className="space-y-2">
              {currentSection.content.keyPointsBn.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#354231] bg-[#FDFBF7] p-3 rounded-xl border border-[#E5E0D8] shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-[#E9EDC9] text-[#2D5A27] border border-[#CCD5AE] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Snippets */}
          {currentSection.content.codeSnippets && currentSection.content.codeSnippets.length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-[#354231] uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#2D5A27]" />
                <span>{isBn ? 'প্রোডাকশন-রেডি কোড উদাহরণ' : 'Production-Ready Code Reference'}</span>
              </h3>

              {currentSection.content.codeSnippets.map((snippet, idx) => {
                const copyKey = `${currentSection.id}-${idx}`;
                const isCopied = copiedCodeKey === copyKey;

                return (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-[#2E3B2B] bg-[#1E251C] text-[#FAEDCD] font-mono text-xs shadow-md">
                    {/* Snippet Header */}
                    <div className="bg-[#151B14] px-4 py-2.5 border-b border-[#2E3B2B] flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#E9EDC9]">
                        <span className="text-[11px] font-semibold text-[#D4A373]">{snippet.fileName}</span>
                        <span className="text-[10px] bg-[#233520] text-[#CCD5AE] px-2 py-0.5 rounded border border-[#344830]">
                          {snippet.language}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyCode(snippet.code, copyKey)}
                        className="px-2.5 py-1 rounded-lg bg-[#233520] hover:bg-[#2E3B2B] text-[#FAEDCD] text-[11px] flex items-center gap-1.5 transition-colors border border-[#344830]"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#CCD5AE]" />
                            <span className="text-[#CCD5AE]">{isBn ? 'কপি হয়েছে' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#D4A373]" />
                            <span>{isBn ? 'কোড কপি করুন' : 'Copy Code'}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Snippet Body */}
                    <div className="p-4 overflow-x-auto">
                      <pre className="text-[11px] leading-relaxed text-[#FAEDCD]">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
