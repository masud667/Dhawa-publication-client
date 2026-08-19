// src/components/Layout/Logo/Logo.jsx
import React from 'react';
import { Link } from 'react-router';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <img 
        src="/src/assets/logo.jpeg"  // ← আপনার লোগো ইমেজের পাথ দিন
        alt="dhawaPublication" 
        className="h-10 w-auto object-contain"  // ছবির উচ্চতা ঠিক করুন
      />
      {/* চাইলে টেক্সটও রাখতে পারেন */}
      {/* <span className="text-xl font-bold text-white">ধব প্রকাশনী</span> */}
    </Link>
  );
};

export default Logo;