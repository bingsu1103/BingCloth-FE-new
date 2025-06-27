import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchAccountAPI } from "../../services/api.user";
import { getOrderAPI } from "../../services/api.order";

const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [cartUpdated, setCartUpdated] = useState(false);
    const [theme, setTheme] = useState(() => {
        return localStorage?.getItem("theme") ?? "dark";
    });

    useEffect(() => {
        const fetchAccount = async () => {
            const res = await fetchAccountAPI();
            if (res.data) {
                setUser(res.data.user);
                setIsAuthenticated(true);
            }
        };
        fetchAccount();
    }, []);

    // ✅ Stable refetchCart with useCallback
    const refetchCart = useCallback(async () => {
        if (user?._id) {
            try {
                const res = await getOrderAPI(user._id);
                if (res?.EC === 0 && Array.isArray(res.data) && res.data[0]?.items) {
                    setCartItems(res.data[0].items);
                    setCartUpdated(prev => !prev);
                } else {
                    setCartItems([]);
                }
            } catch (err) {
                console.error("Failed to fetch cart:", err);
            }
        }
    }, [user?._id]);

    useEffect(() => {
        if (user?._id) {
            refetchCart();
        }
    }, [user?._id, refetchCart]);

    return (
        <AppContext.Provider
            value={{
                theme,
                setTheme,
                isAuthenticated,
                setIsAuthenticated,
                user,
                setUser,
                cartItems,
                setCartItems,
                refetchCart,
                cartUpdated
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const UseCurrentApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("UseCurrentApp must be used within AppContextProvider");
    }
    return context;
};
