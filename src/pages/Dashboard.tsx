import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMessages } from "../context/MessageContext";

const Dashboard: React.FC = () => {
  const { user, getMyBalance: fetchBalance } = useAuth();
  const { messages, fetchMessages, loading } = useMessages();
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const totalMessages = messages.length;
  const activeSenderIds = user?.sender_ids.filter((s) => s.is_active).length || 0;

  // ✅ إجمالي الرصيد (من كل SenderID)
  const balance =
    user?.sender_ids.reduce((acc, s) => acc + parseFloat(s.balance), 0) || 0;

  // ✅ عدد الدول (من خلال country_prices)
  const totalCountries =
    user?.sender_ids.reduce((acc, s) => acc + (s.country_prices?.length || 0), 0) || 0;

  const handleRefreshBalance = async () => {
    setBalanceLoading(true);
    await fetchBalance();
    setBalanceLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "🔄 Refresh Messages"}
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card title="📩 Messages Sent" value={loading ? "..." : totalMessages} />
        <Card
          title="💰 Balance"
          value={balance.toFixed(2)}
          footer={
            <button
              onClick={handleRefreshBalance}
              disabled={balanceLoading}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition disabled:opacity-50"
            >
              {balanceLoading ? "Refreshing..." : "🔄 Refresh Balance"}
            </button>
          }
        />
        <Card title="📡 Active Sender IDs" value={activeSenderIds} />
        <Card title="🌍 Total Countries" value={totalCountries} />
      </div>

      {/* Sender IDs & Countries */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Sender IDs & Countries</h2>

        {user?.sender_ids?.length ? (
          <ul className="divide-y divide-gray-200">
            {user.sender_ids.map((sender) => (
              <li key={sender.id} className="py-4">
                <div className="mb-2 font-medium text-gray-800">{sender.name}</div>
                <div className="flex flex-wrap gap-2">
                  {sender.country_prices?.length ? (
                    sender.country_prices.map((cp) => (
                      <span
                        key={cp.id}
                        className="px-3 py-1 text-sm rounded-full border border-gray-300 bg-gray-100 text-gray-700"
                      >
                        {cp.country.name} — 💲{cp.price_per_sms}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No countries available</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No sender IDs found.</p>
        )}
      </div>

      {/* Recent Messages */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>

        {loading ? (
          <p>Loading...</p>
        ) : messages.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {messages.slice(0, 5).map((msg) => (
              <li key={msg.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">To: {msg.recipients}</p>
                  <p className="text-gray-600 text-sm">{msg.message}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    msg.status === "success" || msg.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : msg.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {msg.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
    </div>
  );
};

// ✅ مكوّن Card لإعادة الاستخدام
const Card = ({
  title,
  value,
  footer,
}: {
  title: string;
  value: string | number;
  footer?: React.ReactNode;
}) => (
  <div className="p-6 bg-white rounded-2xl shadow flex flex-col justify-between">
    <div>
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
    {footer}
  </div>
);

export default Dashboard;
