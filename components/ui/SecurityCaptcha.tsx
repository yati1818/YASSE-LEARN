'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';

interface SecurityCaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export const SecurityCaptcha: React.FC<SecurityCaptchaProps> = ({ onVerify }) => {
  const [num1, setNum1] = useState(5);
  const [num2, setNum2] = useState(3);
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setNum1(a);
    setNum2(b);
    setUserAnswer('');
    setIsVerified(false);
    setError('');
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleCheckCaptcha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUserAnswer(val);

    if (parseInt(val, 10) === num1 + num2) {
      setIsVerified(true);
      setError('');
      onVerify(true);
    } else {
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-slate-300 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-cyan-400" />
          <span>Institutional Bot Prevention CAPTCHA</span>
        </span>
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Refresh CAPTCHA"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Visual Challenge Box */}
        <div className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono text-base font-black tracking-widest shrink-0 select-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:8px_8px]">
          {num1} + {num2} = ?
        </div>

        <input
          type="number"
          value={userAnswer}
          onChange={handleCheckCaptcha}
          placeholder="Solve"
          className={`w-full px-3 py-2 rounded-xl bg-slate-900 border text-slate-100 font-mono text-sm focus:outline-none transition-colors ${
            isVerified
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-slate-800 focus:border-cyan-500'
          }`}
        />
      </div>

      {isVerified && (
        <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
          ✓ Security CAPTCHA Verified
        </div>
      )}
    </div>
  );
};
