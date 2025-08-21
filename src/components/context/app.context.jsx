import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { fetchAccountAPI } from "../../services/api.user";
import { getCurrentOrderAPI } from "../../services/api.order";

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

  const refetchCart = useCallback(async () => {
    if (user?._id) {
      try {
        const res = await getCurrentOrderAPI(user._id);
        if (res?.EC === 0) {
          const cartOrder = res.data;
          setCartItems(cartOrder?.items || []);
          setCartUpdated((prev) => !prev);
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
        cartUpdated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useCurrentApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useCurrentApp must be used within AppContextProvider");
  }
  return context;
};
