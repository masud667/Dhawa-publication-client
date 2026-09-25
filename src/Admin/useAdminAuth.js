import { useState } from "react";

const useAdminAuth = () => {
    // TEMPORARY
    // Authentication will be added later.

    const [admin, setAdmin] = useState({
        name: "Development Admin",
        email: "dawahpublicationbd@gmail.com",
        role: "admin",
    });

    const loading = false;
    const isAdmin = true;

    const loginAdmin = () => {
        setAdmin({
            name: "Development Admin",
            email: "dawahpublicationbd@gmail.com",
            role: "admin",
        });
    };

    const logoutAdmin = () => {
        setAdmin(null);
    };

    return {
        admin,
        isAdmin,
        loading,
        loginAdmin,
        logoutAdmin,
    };
};

export default useAdminAuth;