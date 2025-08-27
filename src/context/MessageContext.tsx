import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { useAuth, User } from "./AuthContext";

// ----------- Interfaces -----------

interface ApiMessageData {
  id: number;
  uuid: string;
  sender_id: string;
  recipients: string;
  message: string;
  message_length: number;
  schedule_time: string | null;
  status: string;
  api_response: {
    status: string;
    message: string;
    data: {
      uid: string;
      to: string;
      from: string;
      message: string;
      status: string;
      cost: string;
      sms_count: number;
    };
  };
  sent_at: string | null;
  created_at: string;
  user: number;
}

interface ApiResponse {
  status: string;
  message: string;
  data?: ApiMessageData;
  parts?: number;
  total_cost?: number;
  remaining_balance?: number;
}

interface MessageContextType {
  messages: ApiMessageData[];
  loading: boolean;
  fetchMessages: () => Promise<void>;
  sendMessage: (
    senderId: string,
    recipients: string,
    message: string,
      countryCode: string   // ✅ براميتر جديد

  ) => Promise<ApiResponse>;
}

// ----------- Context -----------

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token , user, setUser} = useAuth();
  const [messages, setMessages] = useState<ApiMessageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

const updateSenderBalance = (
  user: User | null,
  setUser: (u: User | null) => void,
  senderId: number,
  newBalance: string
) => {
  if (!user) return;

  const updatedSenderIds = user.sender_ids.map((sid) =>
    sid.id === senderId ? { ...sid, balance: newBalance } : sid
  );

  const updatedUser = { ...user, sender_ids: updatedSenderIds };

  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
};
  const fetchMessages = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get<ApiMessageData[]>(
        "https://tools-three-opal.vercel.app/api/messages/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setMessages(res.data);


    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

const sendMessage = async (
  senderId: string,
  recipients: string,
  message: string,
  countryCode: string   // ✅ براميتر جديد
) => {
  if (!token) throw new Error("No token found");

  const formData = new FormData();
  formData.append("sender_id", senderId);
  formData.append("recipients", recipients);
  formData.append("message", message);
  formData.append("country_code", countryCode); // ✅ جديد

  try {
    const res = await axios.post<ApiResponse>(
      "https://tools-three-opal.vercel.app/api/messages/",
      formData,
      {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data?.data) {
      setMessages((prev) => [res.data.data!, ...prev]);
    }

    const remaining = res.data?.remaining_balance;
    const sid = parseInt(senderId);

    if (remaining !== undefined && !isNaN(sid)) {
      updateSenderBalance(user, setUser, sid, String(remaining));
    }

    return res.data;
  } catch (err) {
    console.error("Send message failed", err);
    throw err;
  }
};

  return (
    <MessageContext.Provider
      value={{ messages, loading, fetchMessages, sendMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context)
    throw new Error("useMessages must be used within MessageProvider");
  return context;
};
