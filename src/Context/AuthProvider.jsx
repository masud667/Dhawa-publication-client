import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import AuthSecureAxios from "../Hook/AuthSecureAxios";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false); // Admin status state
    const [loading, setLoading] = useState(true);
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const updateUserProfile = (name, photoURL) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photoURL,
        });
    };

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    const signInWithFacebook = () => {
        setLoading(true);
        return signInWithPopup(auth, facebookProvider);
    };

    const logIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser?.email) {
                setIsAdminLoading(true);
                try {
                    const res = await AuthSecureAxios.get(`/users/admin/${currentUser.email}`);
                    setIsAdmin(res.data?.admin || false);
                } catch (err) {
                    console.error("Admin status fetch failed:", err);
                    setIsAdmin(false);
                } finally {
                    setIsAdminLoading(false);
                }
            } else {
                setIsAdmin(false);
                setIsAdminLoading(false);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    const userInfo = {
        createUser,
        signInWithGoogle,
        signInWithFacebook,
        user,
        setUser,
        isAdmin,         // Expose admin state
        loading,
        setLoading,
        updateUserProfile,
        logOut,
        logIn,
    };

    return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;