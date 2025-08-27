import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// ================== Types ==================
export interface Country {
  id: number;
  name: string;
  code: string;
  dial_code: string;
  is_available: boolean;
}

export interface CountryPrice {
  id: number;
  country: Country;
  price_per_sms: string;
}

export interface SenderID {
  id: number;
  name: string;
  balance: string;
  is_active: boolean;
  country_prices: CountryPrice[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string | null;
  sender_ids: SenderID[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  getMyBalance: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ restore from localStorage on first mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUserState(JSON.parse(storedUser));
        setTokenState(storedToken);
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false); // ✅ finished restoring
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
  };

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const login = async (username: string, password: string) => {
    const res = await axios.post("https://tools-three-opal.vercel.app/api/accounts/auth/login/", {
      username,
      password,
    });

    if (res.data.status === "success") {
      setUser(res.data.user);
      setToken(res.data.token);
    }
  };

  const getMyBalance = async () => {
    if (!token || !user) return;
    try {
      const res = await axios.get("https://tools-three-opal.vercel.app/api/accounts/sender-ids/", {
        headers: { Authorization: `Token ${token}` },
      });

      if (Array.isArray(res.data)) {
        const updatedUser = { ...user, sender_ids: res.data };
        setUser(updatedUser);
      }
    } catch (err) {
      console.error("Failed to fetch balance", err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser, getMyBalance }}>
      {/* ✅ don’t render children until auth is restored */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
