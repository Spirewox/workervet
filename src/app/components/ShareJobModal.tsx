import React from 'react';
import { JobPosting } from '../types';
import { Button } from './ui/button';
import { 
  X,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  Copy
} from 'lucide-react';

export const ShareJobModal: React.FC<{ job: JobPosting; onClose: () => void }> = ({ job, onClose }) => {
  const url = `${window.location.origin}${window.location.pathname}?jobId=${job.id}`;
  const encodedUrl = encodeURIComponent(url);
  const text = `Check out this ${job.title} role at Workervet!`;
  const encodedText = encodeURIComponent(text);
  const encodedSubject = encodeURIComponent(`Job Opportunity: ${job.title}`);
  const encodedBody = encodeURIComponent(`${text}\n\n${url}`);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-md overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="text-lg font-bold text-slate-900">Share this position</h3>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-200 p-1 transition-colors">
             <X className="w-5 h-5"/>
           </button>
        </div>
        <div className="p-6 space-y-5">
           <p className="text-sm text-slate-500 text-center">
             Share <span className="font-semibold text-slate-900">{job.title}</span> with your network.
           </p>
           
           <div className="grid grid-cols-2 gap-3">
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all group shadow-sm hover:shadow-md"
              >
                <Linkedin className="w-5 h-5 text-[#0077b5] group-hover:text-white" />
                <span className="font-medium text-sm">LinkedIn</span>
              </a>
              
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-[#1da1f2] hover:text-white hover:border-[#1da1f2] transition-all group shadow-sm hover:shadow-md"
              >
                <Twitter className="w-5 h-5 text-[#1da1f2] group-hover:text-white" />
                <span className="font-medium text-sm">Twitter</span>
              </a>

              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-[#1877f2] hover:text-white hover:border-[#1877f2] transition-all group shadow-sm hover:shadow-md"
              >
                <Facebook className="w-5 h-5 text-[#1877f2] group-hover:text-white" />
                <span className="font-medium text-sm">Facebook</span>
              </a>

              <a 
                href={`mailto:?subject=${encodedSubject}&body=${encodedBody}`}
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all group shadow-sm hover:shadow-md"
              >
                <Mail className="w-5 h-5 text-slate-600 group-hover:text-white" />
                <span className="font-medium text-sm">Email</span>
              </a>
           </div>

           <div className="relative pt-2">
             <div className="absolute inset-0 flex items-center">
               <span className="w-full border-t border-slate-200" />
             </div>
             <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
               <span className="bg-white px-2 text-slate-400">Or copy link</span>
             </div>
           </div>

           <div className="flex gap-2">
             <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-500 truncate font-mono select-all">
               {url}
             </div>
             <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0">
               <Copy className="w-4 h-4" />
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
};