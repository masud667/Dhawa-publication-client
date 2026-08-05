import React from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      {/* ─── Icon ────────────────────────────────────────────── */}
      <motion.div
        className="relative flex h-12 w-12 items-center justify-center"
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {/* ─── Outer Ring (Gold Islamic Geometry) ────────────── */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer octagon - white/gold */}
          <path
            d="M50 5 L90 20 L95 60 L70 90 L30 95 L5 70 L5 30 L30 5"
            stroke="#D4A559"
            strokeWidth="1.8"
            className="opacity-80"
          />
          
          {/* Inner star - white */}
          <path
            d="M50 15 L65 40 L92 45 L72 65 L78 92 L50 80 L22 92 L28 65 L8 45 L35 40 Z"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            className="opacity-60"
          />
          
          {/* Inner diamond - gold fill with transparency */}
          <path
            d="M50 25 L70 50 L50 75 L30 50 Z"
            stroke="#D4A559"
            strokeWidth="1.5"
            fill="#D4A559"
            fillOpacity="0.25"
          />
          
          {/* Central dot / book symbol - white */}
          <circle cx="50" cy="50" r="6" fill="#FFFFFF" className="opacity-80" />
          <circle cx="50" cy="50" r="3" fill="#D4A559" />
          
          {/* Decorative dots - gold */}
          <circle cx="50" cy="8" r="2.5" fill="#D4A559" className="opacity-60" />
          <circle cx="92" cy="50" r="2.5" fill="#D4A559" className="opacity-60" />
          <circle cx="50" cy="92" r="2.5" fill="#D4A559" className="opacity-60" />
          <circle cx="8" cy="50" r="2.5" fill="#D4A559" className="opacity-60" />
          
          {/* Corner ornaments - gold */}
          <path
            d="M15 15 L25 15 L15 25 Z"
            stroke="#D4A559"
            strokeWidth="1.2"
            className="opacity-50"
          />
          <path
            d="M85 15 L75 15 L85 25 Z"
            stroke="#D4A559"
            strokeWidth="1.2"
            className="opacity-50"
          />
          <path
            d="M15 85 L25 85 L15 75 Z"
            stroke="#D4A559"
            strokeWidth="1.2"
            className="opacity-50"
          />
          <path
            d="M85 85 L75 85 L85 75 Z"
            stroke="#D4A559"
            strokeWidth="1.2"
            className="opacity-50"
          />
        </svg>

        {/* ─── Book Icon Overlay (white) ────────────────────── */}
        <motion.div
          className="relative z-10 text-white"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M12 8v8" />
            <path d="M9 11h6" />
          </svg>
        </motion.div>
      </motion.div>

      {/* ─── Text ────────────────────────────────────────────── */}
      <div className="flex flex-col leading-tight">
        <motion.h3
          className="font-serif text-2xl font-bold tracking-tight text-white"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
        >
          ধাওয়া পাবলিকেশন
        </motion.h3>

        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-gradient-to-r from-[#D4A559] to-transparent" />
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#D4A559]">
            Dhawa Publication
          </p>
          <span className="h-px w-6 bg-gradient-to-l from-[#D4A559] to-transparent" />
        </div>
      </div>
    </Link>
  );
};

export default Logo;