import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../../Context/AuthContext";
import { useForm } from "react-hook-form";
import Logo from "../../Components/Logo";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();
    const { createUser, signInWithGoogle, updateUserProfile } =
        useContext(AuthContext);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch("password", "");

    const onSubmit = (data) => {
        setLoading(true);

        createUser(data.email, data.password)
            .then((result) => {
                const user = result.user;

                return updateUserProfile(data.name, data.photoURL || "").then(
                    async () => {
                        // 🔽 Save to DB
                        const userInfo = {
                            name: data.name,
                            email: data.email,
                            image: data.photoURL || "https://i.ibb.co.com/RpkLjKn7/user.png",
                            role: "user",
                            registrationDate: new Date().toISOString(),
                        };

                        await axios.post(
                            "https://life-policy-pulse-server.vercel.app/users",
                            userInfo
                        );

                        Swal.fire({
                            icon: "success",
                            title: "Account Created!",
                            text: "Your LifePolicyPulse account has been successfully created",
                            showConfirmButton: false,
                            timer: 2000,
                        });

                        navigate("/");
                    }
                );
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: error.message,
                });
            })
            .finally(() => setLoading(false));
    };
    const handleGoogleSignIn = () => {
        setLoading(true);

        signInWithGoogle()
            .then(async (result) => {
                const user = result.user;

                // 🔽 Save to DB
                const userInfo = {
                    name: user.displayName || "N/A",
                    email: user.email,
                    image: user.photoURL || "https://i.ibb.co/placeholder.png",
                    role: "customer",
                };

                await axios.post(
                    "https://life-policy-pulse-server.vercel.app/users",
                    userInfo
                );

                Swal.fire({
                    icon: "success",
                    title: "Google Registration Successful!",
                    showConfirmButton: false,
                    timer: 1500,
                });

                navigate("/");
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Google Registration Failed",
                    text: error.message,
                });
            })
            .finally(() => setLoading(false));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className=" bg-base-100 rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
                        <div className="flex justify-center mb-4">
                            <div className=" bg-base-100 rounded-full p-1.5">
                                <Logo></Logo>
                            </div>
                        </div>
                        <motion.h2 className="text-3xl font-bold  text-base-content">
                            Create Account
                        </motion.h2>
                        <motion.p className="text-indigo-100 mt-2">
                            Join LifePolicyPulse today
                        </motion.p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {/* Full Name Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium  text-base-content">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 2,
                                            message: "Name must be at least 2 characters",
                                        },
                                    })}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium  text-base-content">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Photo URL Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium  text-base-content">
                                    Profile Photo URL{" "}
                                    <span className=" text-base-content">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    {...register("photoURL")}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium  text-base-content">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Minimum 6 characters required",
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z]).+$/,
                                                message: "Must include uppercase and lowercase letters",
                                            },
                                        })}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2  text-base-content hover:text-indigo-600">
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                                <div className="mt-1 text-xs  text-base-content">
                                    <p>Password must include:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li
                                            className={password.length >= 6 ? "text-green-500" : ""}>
                                            At least 6 characters
                                        </li>
                                        <li
                                            className={
                                                /[A-Z]/.test(password) ? "text-green-500" : ""
                                            }>
                                            One uppercase letter
                                        </li>
                                        <li
                                            className={
                                                /[a-z]/.test(password) ? "text-green-500" : ""
                                            }>
                                            One lowercase letter
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium  text-base-content">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: (value) =>
                                                value === password || "Passwords do not match",
                                        })}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute top-1/2 right-3 transform -translate-y-1/2  text-base-content hover:text-indigo-600">
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Terms & Conditions */}
                            <div className="flex items-start mt-4">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        {...register("terms", {
                                            required: "You must accept the terms and conditions",
                                        })}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="terms"
                                        className="font-medium  text-base-content">
                                        I agree to the{" "}
                                        <a
                                            href="#"
                                            className="text-indigo-600 hover:text-indigo-500">
                                            Terms and Conditions
                                        </a>
                                    </label>
                                    {errors.terms && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {errors.terms.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700  text-base-content font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center"
                                disabled={loading}>
                                {loading ? (
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5  text-base-content"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                {loading ? "Creating Account..." : "Create Account"}
                            </motion.button>
                        </form>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2  bg-base-100  text-base-content">
                                    OR SIGN UP WITH
                                </span>
                            </div>
                        </div>

                        {/* Google Registration */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoogleSignIn}
                            className="w-full py-3 px-4  bg-base-100 border border-gray-300 rounded-lg shadow-sm  text-base-content font-medium hover: bg-base-50 transition-colors flex justify-center items-center"
                            disabled={loading}>
                            <FaGoogle className="text-red-500 mr-3" size={18} />
                            Sign up with Google
                        </motion.button>

                        <p className="mt-6 text-center text-sm  text-base-content">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    className="mt-6 text-center  text-base-content text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}>
                    © {new Date().getFullYear()} LifePolicyPulse. Protecting your future.
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Register;