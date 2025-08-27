import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext"; // ✅ استدعاء الكونتكست

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();  // ✅ نجيب logout و user من الكونتكست
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");  // ✅ يرجع المستخدم لصفحة تسجيل الدخول
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-blue-600 text-white transform transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 text-xl font-bold border-b border-blue-500">
          CodeOcean SMS
        </div>
        <nav className="flex-1 flex flex-col overflow-y-auto">
          <Link to="/dashboard" className="p-3 hover:bg-blue-700">
            Dashboard
          </Link>
          <Link to="/messages" className="p-3 hover:bg-blue-700">
            Messages
          </Link>
          <Link to="/sender-ids" className="p-3 hover:bg-blue-700">
            Sender IDs
          </Link>
        </nav>
        {/* ✅ زرار Logout في آخر الـ sidebar */}
        <div className="p-4 border-t border-blue-500">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-0">
        {/* Header for Mobile */}
        <header className="flex items-center justify-between bg-white shadow-md px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-800 focus:outline-none"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <span className="text-lg font-semibold">CodeOcean SMS</span>
          {/* ✅ Logout في الموبايل هيدر */}
          {user && (
            <button
              onClick={handleLogout}
              className="text-red-600 font-medium ml-2"
            >
              Logout
            </button>
          )}
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
