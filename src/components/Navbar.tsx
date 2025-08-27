import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">MyAPI</h1>
      <div className="space-x-4">
        <Link
          to="/documentation"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          📖 Documentation
        </Link>
        <Link
          to="/login"
          className="text-gray-700 hover:text-blue-600 transition"
        >
          🔑 Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
