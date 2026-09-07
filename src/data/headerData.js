// src/data/headerData.js

export const socialLinks = [
  { id: 'facebook', icon: 'FaFacebook', url: 'https://facebook.com' },
  { id: 'instagram', icon: 'FaInstagram', url: 'https://instagram.com' },
  { id: 'youtube', icon: 'FaYoutube', url: 'https://youtube.com' },
  { id: 'twitter', icon: 'FaTwitter', url: 'https://twitter.com' },
];

export const menuItems = [
  { id: 'home', label: 'হোম', path: '/' },
  { id: 'books', label: 'বই', path: '/books' },
  { id: 'about', label: 'আমাদের সম্পর্কে', path: '/about' },
];

// Admin Navigation (Home points to /admin/dashboard)
export const adminMenuItems = [
  { id: 'dashboard', label: 'ড্যাশবোর্ড', path: '/admin/dashboard' },
  { id: 'manage-books', label: 'বই ব্যবস্থাপনা', path: '/admin/books' },
  { id: 'orders', label: 'অর্ডারসমূহ', path: '/admin/orders' },
  { id: 'users', label: 'ইউজারসমূহ', path: '/admin/users' },
];


export const contactInfo = {
  phone: '+880 1234 567890',
  email: 'info@dhawapublication.com',
  address: 'ঢাকা, বাংলাদেশ',
};