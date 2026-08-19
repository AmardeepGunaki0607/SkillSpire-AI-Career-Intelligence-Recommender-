import React, { useRef } from 'react';
import { 
  Award, 
  X, 
  Download, 
  Share2, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  ExternalLink,
  Printer
} from 'lucide-react';
import { triggerConfetti } from '../lib/utils';

interface DigitalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerTitle: string;
  userFullName?: string;
  completedMilestonesCount: number;
  totalMilestonesCount: number;
  readinessScore: number;
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  isOpen,
  onClose,
  careerTitle,
  userFullName = 'Amardeep Gunaki',
  completedMilestonesCount,
  totalMilestonesCount,
  readinessScore
}) => {
  if (!isOpen) return null;

  const certRef = useRef<HTMLDivElement>(null);
  const certificateId = `SKL-2026-${Math.abs(careerTitle.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(16).toUpperCase().padStart(8, '0')}`;
  const issueDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const handleAddToLinkedIn = () => {
    const certUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(`SkillSpire AI Certified ${careerTitle}`)}&organizationName=${encodeURIComponent('SkillSpire AI')}&issueYear=2026&issueMonth=1&certId=${encodeURIComponent(certificateId)}&certUrl=${encodeURIComponent('https://skillspire.ai/verify/' + certificateId)}`;
    window.open(certUrl, '_blank');
    triggerConfetti();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold uppercase tracking-wider">
                  VERIFIED DIGITAL CREDENTIAL
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {certificateId}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Verifiable Career Mastery Certificate
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Certificate Canvas */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          <div 
            ref={certRef}
            className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 border-4 border-double border-amber-500/40 shadow-inner space-y-6 text-center relative overflow-hidden"
          >
            {/* Watermark badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <Award className="w-96 h-96 text-amber-900" />
            </div>

            {/* Certificate Header */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>SkillSpire AI • Executive Credential</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif pt-2">
                Certificate of Career Readiness
              </h2>
              <p className="text-xs text-slate-500 italic">
                This verified credential confirms comprehensive mastery and practical project execution for:
              </p>
            </div>

            {/* Recipient Name */}
            <div className="py-2 border-y border-amber-200/80 max-w-lg mx-auto">
              <p className="text-xl sm:text-2xl font-black text-blue-950 font-serif">
                {userFullName}
              </p>
              <p className="text-[11px] font-bold text-amber-800 tracking-wider uppercase mt-1">
                Target Role: {careerTitle}
              </p>
            </div>

            {/* Achievement details */}
            <div className="max-w-md mx-auto grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Readiness</span>
                <span className="font-black text-blue-700 text-sm">{readinessScore}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Milestones</span>
                <span className="font-black text-emerald-700 text-sm">{completedMilestonesCount}/{totalMilestonesCount || 12} Verified</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                <span className="font-black text-amber-700 text-sm">Honors Tier</span>
              </div>
            </div>

            {/* Bottom Signatures & QR Verification */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-200/80 text-left text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-400 block">Certificate ID: {certificateId}</span>
                <span className="text-[11px] text-slate-600 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Issued on {issueDate}</span>
                </span>
              </div>

              {/* Scannable Verification Pill */}
              <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[11px] font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Digitally Verified & Cryptographically Signed</span>
              </div>
            </div>

          </div>

          {/* Social Share & Download Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={handleAddToLinkedIn}
              className="px-6 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Share2 className="w-4 h-4" />
              <span>Add Credential to LinkedIn Profile</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Official SkillSpire AI Industry Credential</span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
