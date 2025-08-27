import React from "react";
import { useAuth } from "../context/AuthContext";

const SenderIds: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">📡 Sender IDs</h1>

      {user?.sender_ids && user.sender_ids.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-2xl">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Country Prices
                </th>
              </tr>
            </thead>
            <tbody>
              {user.sender_ids.map((sender) => (
                <tr key={sender.id} className="border-b">
                  <td className="px-6 py-4 font-medium">{sender.name}</td>
                  <td className="px-6 py-4">{sender.balance}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        sender.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sender.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {sender.country_prices.length > 0 ? (
                      <ul className="space-y-1">
                        {sender.country_prices.map((cp) => (
                          <li
                            key={cp.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {cp.country.name} ({cp.country.dial_code})
                            </span>
                            <span className="font-medium text-gray-700">
                              💲{cp.price_per_sms}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No prices available
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No sender IDs available.</p>
      )}
    </div>
  );
};

export default SenderIds;
