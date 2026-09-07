import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { FaEnvelope, FaLock, FaFacebook, FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../Context/AuthContext';
import AuthSecureAxios from '../../Hook/AuthSecureAxios';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logIn, createUser, signInWithGoogle, signInWithFacebook, updateUserProfile } = useContext(AuthContext);

  // Target destination route (e.g., /admin/dashboard), defaulting to home '/'
  const from = location.state?.from?.pathname || '/';

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper function: Generates JWT token from Express server & saves to localStorage
  const saveJwtToken = async (email) => {
    try {
      const jwtRes = await AuthSecureAxios.post('/jwt', { email });
      if (jwtRes.data?.token) {
        localStorage.setItem('access-token', jwtRes.data.token);
      } else {
        console.warn("JWT token was not returned from server.");
      }
    } catch (err) {
      console.error("Failed to generate JWT token:", err.message);
    }
  };

  // Helper function: Checks if logged in user is Admin and redirects accordingly
  const handleRedirectAfterLogin = async (userEmail) => {
    try {
      if (userEmail) {
        // Call backend admin verification route
        const res = await AuthSecureAxios.get(`/users/admin/${userEmail}`);

        // Check if server confirmed admin status
        if (res.data && res.data.admin === true) {
          navigate('/admin/dashboard', { replace: true });
          return;
        }
      }
    } catch (err) {
      console.warn("Admin check error:", err.message);
    }

    // Fallback redirect for regular customer users
    navigate(from, { replace: true });
  };

  // Handle Email / Password Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = formData.email.trim();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('পাসওয়ার্ড দুটি মিলছে না');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        // 1. Firebase Email/Password Auth
        const result = await logIn(cleanEmail, formData.password);
        const email = result.user?.email || cleanEmail;

        // 2. Fetch and store JWT token in localStorage
        await saveJwtToken(email);

        toast.success('সফলভাবে লগইন করা হয়েছে!');

        // 3. Admin Check & Redirect
        await handleRedirectAfterLogin(email);
      } else {
        // 1. Create New Firebase User
        const result = await createUser(cleanEmail, formData.password);
        await updateUserProfile(formData.fullName, '');
        const email = result.user?.email || cleanEmail;

        // 2. Save user record to MongoDB database
        await AuthSecureAxios.post('/users', {
          name: formData.fullName,
          email: email,
        });

        // 3. Fetch and store JWT token in localStorage
        await saveJwtToken(email);

        toast.success('অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে!');

        // 4. Admin Check & Redirect
        await handleRedirectAfterLogin(email);
      }
    } catch (err) {
      console.error("Auth Error:", err.code, err.message);
      if (err.code === 'auth/invalid-credential') {
        toast.error('ইমেইল অথবা পাসওয়ার্ড ভুল হয়েছে।');
      } else if (err.code === 'auth/email-already-in-use') {
        toast.error('এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে।');
      } else if (err.code === 'auth/weak-password') {
        toast.error('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
      } else {
        toast.error('লগইন করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Social Authentication (Google / Facebook)
  const handleSocialLogin = async (socialSignInMethod) => {
    try {
      // 1. Social Provider Sign In
      const result = await socialSignInMethod();
      const user = result.user;

      if (!user?.email) {
        console.error("Social authentication failed: No email returned.");
        return;
      }

      // 2. Sync user data to MongoDB database
      const userData = {
        name: user.displayName || "",
        email: user.email,
        photo: user.photoURL || "",
      };
      await AuthSecureAxios.post('/users', userData);

      // 3. Fetch and store JWT token in localStorage
      await saveJwtToken(user.email);

      // 4. Admin Check & Redirect
      await handleRedirectAfterLogin(user.email);

    } catch (error) {
      console.error("❌ Social Login failed:", error.response?.data || error.message);
      toast.error('সামাজিক যোগাযোগ মাধ্যমে লগইন করতে ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100/50"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-6 py-8 text-center">
          <h1 className="text-2xl font-serif font-bold text-white">
            {isLogin ? 'স্বাগতম' : 'অ্যাকাউন্ট তৈরি করুন'}
          </h1>
          <p className="text-emerald-100/80 text-sm mt-1">
            {isLogin ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'নতুন অ্যাকাউন্ট তৈরি করুন'}
          </p>
        </div>

        {/* Social Logins */}
        <div className="px-6 pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin(signInWithFacebook)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white py-2.5 rounded-lg hover:bg-[#0d6bd4] transition text-sm font-medium"
            >
              <FaFacebook size={16} /> ফেসবুক
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin(signInWithGoogle)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#DB4437] text-white py-2.5 rounded-lg hover:bg-[#c33528] transition text-sm font-medium"
            >
              <FaGoogle size={16} /> গুগল
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400">অথবা</span>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পূর্ণ নাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                placeholder="আপনার পূর্ণ নাম"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ইমেইল ঠিকানা <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              পাসওয়ার্ড <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                পাসওয়ার্ড নিশ্চিত করুন <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                মনে রাখুন
              </label>
              <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline">
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-700 to-emerald-800 text-white font-semibold hover:from-emerald-800 hover:to-emerald-900 transition shadow-lg shadow-emerald-700/30 hover:shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? 'প্রসেসিং হচ্ছে...' : isLogin ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>

          <div className="text-center text-sm text-gray-500">
            {isLogin ? (
              <>
                নতুন ব্যবহারকারী?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-emerald-600 hover:underline font-medium"
                >
                  রেজিস্টার করুন
                </button>
              </>
            ) : (
              <>
                ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-emerald-600 hover:underline font-medium"
                >
                  লগইন করুন
                </button>
              </>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;