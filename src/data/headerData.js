// src/data/headerData.js

export const socialLinks = [
  {
    id: 'facebook',
    icon: 'FaFacebook',
    url: 'https://facebook.com/dawahpublication1'
  },
  {
    id: 'youtube',
    icon: 'FaYoutube',
    url: 'https://youtube.com/@DawahPublication'
  },
  {
    id: 'tiktok',
    icon: 'FaTiktok',
    url: 'https://tiktok.com/@dawah.publication'
  },
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
  phone: '01810-728222',
  email: 'dawahpublicationbd@gmail.com',
  address: '২৮ নং দোকান, ১১ ইসলামি টাওয়ার, বাংলাবাজার, ঢাকা',
};