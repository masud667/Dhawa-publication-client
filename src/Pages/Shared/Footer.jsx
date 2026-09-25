import React from 'react';
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaBookOpen
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-emerald-900 to-emerald-950 text-emerald-100 py-6 border-t-2 border-amber-500/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main 2-Column Layout with Compact Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-emerald-800/60">

          {/* ─── বাম দিক: লোগো, মিশন ও সোশ্যাল মিডিয়া ───────────────── */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-emerald-950 text-base font-bold shadow-md">
                <FaBookOpen />
              </div>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                দাওয়া পাবলিকেশন
              </h2>
            </div>

            <p className="text-emerald-200/90 text-xs leading-relaxed max-w-xl">
              “আমরা বিশ্বাস করি, মানুষের অন্তর ও জীবন পরিবর্তনের সবচেয়ে নিখুঁত মাধ্যম হলো একটি উত্তম বই। বিশুদ্ধ দ্বীনী ইলম ও আখেরাতমুখী চেতনার আলো ছড়িয়ে দিয়ে উম্মাহর পাশে থাকাই আমাদের অঙ্গীকার—সুন্দর আগামীর জন্য।”
            </p>

            {/* সোশ্যাল মিডিয়া লিঙ্কস */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://facebook.com/dawahpublication1"
                target="_blank"
                rel="noreferrer"
                title="Facebook: @dawahpublication1"
                className="w-7 h-7 rounded-full bg-emerald-800 hover:bg-amber-500 hover:text-emerald-950 transition flex items-center justify-center text-white text-xs"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://youtube.com/@DawahPublication"
                target="_blank"
                rel="noreferrer"
                title="YouTube: @DawahPublication"
                className="w-7 h-7 rounded-full bg-emerald-800 hover:bg-amber-500 hover:text-emerald-950 transition flex items-center justify-center text-white text-xs"
              >
                <FaYoutube />
              </a>
              <a
                href="https://tiktok.com/@dawah.publication"
                target="_blank"
                rel="noreferrer"
                title="TikTok: @dawah.publication"
                className="w-7 h-7 rounded-full bg-emerald-800 hover:bg-amber-500 hover:text-emerald-950 transition flex items-center justify-center text-white text-xs"
              >
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* ─── ডান দিক: বই প্রাপ্তিস্থান ও তথ্য ───────────────────── */}
          <div className="bg-emerald-800/30 border border-emerald-700/40 rounded-xl p-3.5 text-xs space-y-1.5 self-center">
            <h3 className="font-semibold text-amber-400 text-xs tracking-wider uppercase">
              আমাদের বইগুলো প্রাপ্তিস্থান
            </h3>

            <div className="font-bold text-white text-sm">
              আস সুফফা প্রকাশন
            </div>

            <div className="flex items-start gap-2 text-emerald-200/90">
              <FaMapMarkerAlt className="text-amber-400 mt-0.5 flex-shrink-0" size={12} />
              <span>২৮ নং দোকান, ১১ ইসলামি টাওয়ার, বাংলাবাজার, ঢাকা।</span>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5 border-t border-emerald-700/30">
              <div className="flex items-center gap-1.5 text-emerald-200/90">
                <FaPhoneAlt className="text-amber-400" size={11} />
                <a href="tel:01810728222" className="hover:text-amber-400 transition-colors">
                  ০১৮১০-৭২৮২২২
                </a>
              </div>

              <div className="flex items-center gap-1.5 text-emerald-200/90">
                <FaEnvelope className="text-amber-400" size={11} />
                <a href="mailto:dawahpublicationbd@gmail.com" className="hover:text-amber-400 transition-colors">
                  dawahpublicationbd@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ─── নিচে: কপিরাইট ───────────────────────── */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-emerald-300/60 gap-1">
          <p>© {new Date().getFullYear()} দাওয়া পাবলিকেশন। সর্বস্বত্ব সংরক্ষিত।</p>
          <p>Dawah Publication</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;