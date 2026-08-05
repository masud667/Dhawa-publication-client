// src/components/Layout/TopBar.jsx
import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaPhone, FaEnvelope } from 'react-icons/fa';
import { contactInfo, socialLinks } from '../data/headerData';


const TopBar = () => {
  return (
    <div className="hidden md:flex bg-emerald-900 text-white text-xs py-1.5 px-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* ─── Social Icons ────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-[10px] uppercase tracking-wider">Follow Us</span>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-amber-400 transition-colors duration-200"
                aria-label={social.id}
              >
                {social.id === 'facebook' && <FaFacebook size={13} />}
                {social.id === 'instagram' && <FaInstagram size={13} />}
                {social.id === 'youtube' && <FaYoutube size={13} />}
                {social.id === 'twitter' && <FaTwitter size={13} />}
              </a>
            ))}
          </div>
        </div>

        {/* ─── Contact Info ────────────────────────────────── */}
        <div className="flex items-center gap-4 text-white/70">
          <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <FaPhone size={11} />
            <span>{contactInfo.phone}</span>
          </a>
          <span className="text-white/20">|</span>
          <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <FaEnvelope size={11} />
            <span>{contactInfo.email}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;