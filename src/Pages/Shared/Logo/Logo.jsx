
// src/components/Layout/Logo/Logo.jsx
import React from 'react';
import { Link } from 'react-router';
import useAdminAuth from '../../../Admin/useAdminAuth';

const Logo = () => {
  const { user, isAuthenticated } = useAdminAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Redirect admins to /admin/dashboard, and everyone else to /
  const homeDestination = isAdmin ? '/admin/dashboard' : '/';

  return (
    <Link to={homeDestination} className="flex items-center gap-2">
      <img
        src="/logo.jpeg"
        alt="dhawaPublication"
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
};

export default Logo;