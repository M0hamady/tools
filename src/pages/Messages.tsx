import React, { useState, useEffect } from "react";
import { useMessages } from "../context/MessageContext";
import { Eye } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Messages: React.FC = () => {
  const { messages, loading, fetchMessages, sendMessage } = useMessages();
  const { token, user } = useAuth();
// state جديد عشان الـ sender id + country
const [selectedSender, setSelectedSender] = useState<string>("");
const [selectedCountry, setSelectedCountry] = useState<string>("");

  const [recipients, setRecipients] = useState<string>("");
  const [recipientList, setRecipientList] = useState<string[]>([]);
  const [sendProgress, setSendProgress] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  // Prevent navigating away while sending
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (sending) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sending]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const numbers = recipients
      .split(/[\n,]+/)
      .map((num) => num.trim())
      .filter((num) => num.length > 0);

    if (!content || numbers.length === 0) return;

    setRecipientList(numbers);
    setSendProgress(Array(numbers.length).fill("pending"));
    setSending(true);
for (let i = 0; i < numbers.length; i++) {
  setCurrentIndex(i);
  const updatedProgress = [...sendProgress];
  updatedProgress[i] = "sending";
  setSendProgress(updatedProgress);

  try {
    await sendMessage(selectedSender, numbers[i], content, selectedCountry); // ✅ country_code هنا
    updatedProgress[i] = "sent";
  } catch (err) {
    console.error(`Failed to send to ${numbers[i]}`, err);
    updatedProgress[i] = "failed";
  }

  setSendProgress([...updatedProgress]);
  setCurrentIndex(null);
}


    setSending(false);
    setRecipients("");
    setContent("");
    fetchMessages();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">📨 Messages</h1>

      {/* Send Form */}

<form onSubmit={handleSend} className="bg-white p-6 rounded-xl shadow mb-8">
  <h2 className="text-lg font-semibold mb-4">Send a New Message</h2>

  {/* Sender ID Dropdown */}
  <div className="mb-4">
    <label className="block text-sm font-medium">Sender ID</label>
    <select
      value={selectedSender}
      onChange={(e) => {
        setSelectedSender(e.target.value);
        setSelectedCountry(""); // reset country when sender changes
      }}
      className="mt-1 w-full border rounded px-3 py-2"
      required
    >
      <option value="">-- Select Sender ID --</option>
      {user?.sender_ids?.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name} (Balance: {s.balance})
        </option>
      ))}
    </select>
  </div>

  {/* Country Dropdown */}
  {selectedSender && (
    <div className="mb-4">
      <label className="block text-sm font-medium">Country</label>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className="mt-1 w-full border rounded px-3 py-2"
        required
      >
        <option value="">-- Select Country --</option>
        {user?.sender_ids
          ?.find((s) => s.id.toString() === selectedSender)
          ?.country_prices?.map((c) => (
            <option key={c.country.code} value={c.country.code}>
              {c.country.name}
            </option>
          ))}
      </select>
    </div>
  )}

  {/* Recipients */}
  <div className="mb-4">
    <label className="block text-sm font-medium">
      Recipients (comma or newline separated)
    </label>
    <textarea
      value={recipients}
      onChange={(e) => setRecipients(e.target.value)}
      className="mt-1 w-full border rounded px-3 py-2"
      rows={3}
      placeholder="e.g. 01012345678, 01098765432"
      required
    />
  </div>

  {/* Message */}
  <div className="mb-4">
    <label className="block text-sm font-medium">Message</label>
    <textarea
      value={content}
      onChange={(e) => setContent(e.target.value)}
      className="mt-1 w-full border rounded px-3 py-2"
      rows={4}
      placeholder="Type your message"
      required
    />
  </div>

  <button
    type="submit"
    disabled={sending}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
  >
    {sending ? "Sending..." : "Send Message"}
  </button>
</form>

      {/* Sending Progress */}
      {sending && (
        <div className="mb-8 bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold mb-4">Sending Progress</h3>
          <ul className="space-y-2 max-h-60 overflow-auto text-sm">
            {recipientList.map((num, idx) => {
              const status = sendProgress[idx];
              let color = "text-gray-500";
              if (status === "sent") color = "text-green-600";
              else if (idx === currentIndex) color = "text-yellow-500";
              else if (idx === currentIndex! + 1) color = "text-yellow-700";
              else if (status === "failed") color = "text-red-600";

              return (
                <li key={idx} className={`flex items-center gap-2 ${color}`}>
                  <span>📱 {num}</span>
                  <span className="ml-auto">
                    {status === "sent" && "✅ Sent"}
                    {status === "sending" && "⏳ Sending..."}
                    {status === "failed" && "❌ Failed"}
                    {status === "pending" && "• Pending"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Messages Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : (
          <table className="min-w-full bg-white shadow rounded-2xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Sender ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Created At
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{msg.sender_id}</td>
                  <td className="px-6 py-4">{msg.recipients}</td>
                  <td className="px-6 py-4 truncate max-w-xs">
                    {msg.message}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        msg.status.toLowerCase() === "delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(msg.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Preview Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">Message Preview</h2>
            <div className="space-y-2">
              <p>
                <strong>Sender ID:</strong> {selectedMessage.sender_id}
              </p>
              <p>
                <strong>Recipients:</strong> {selectedMessage.recipients}
              </p>
              <p>
                <strong>Message:</strong> {selectedMessage.message}
              </p>
              <p>
                <strong>Status:</strong> {selectedMessage.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedMessage.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Sent At:</strong>{" "}
                {selectedMessage.sent_at
                  ? new Date(selectedMessage.sent_at).toLocaleString()
                  : "Not Sent"}
              </p>

              {/* API response if available */}
              {selectedMessage.api_response && (
                <div className="mt-4 border-t pt-4">
                  <h3 className="font-semibold mb-2">API Response</h3>
                  <pre className="bg-gray-100 rounded-lg p-3 text-sm overflow-auto max-h-60">
                    {JSON.stringify(selectedMessage.api_response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
