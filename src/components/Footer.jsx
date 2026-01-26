import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiMail,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer className={`mt-20 border-t backdrop-blur ${
      theme === "light"
        ? "border-gray-200 bg-white/80"
        : "border-white/10 bg-card/80"
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-primary">
            Celebration<span className={theme === "light" ? "text-black" : "text-white"}>Point</span>
          </h2>
          <p className={`mt-3 text-sm ${
            theme === "light" ? "text-gray-600" : "text-white/60"
          }`}>
            Premium celebration products to make every
            moment unforgettable.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className={`font-semibold mb-3 ${
            theme === "light" ? "text-black" : "text-white"
          }`}>Quick Links</h3>
          <ul className={`space-y-2 text-sm ${
            theme === "light" ? "text-gray-600" : "text-white/60"
          }`}>
            <li>
              <Link to="/" className={theme === "light" ? "hover:text-black" : "hover:text-white"}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className={theme === "light" ? "hover:text-black" : "hover:text-white"}>
                Products
              </Link>
            </li>
            <li>
              <Link to="/orders" className={theme === "light" ? "hover:text-black" : "hover:text-white"}>
                Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className={`font-semibold mb-3 ${
            theme === "light" ? "text-black" : "text-white"
          }`}>Support</h3>
          <ul className={`space-y-2 text-sm ${
            theme === "light" ? "text-gray-600" : "text-white/60"
          }`}>
            <li>Help Center</li>
            <li>Returns & Refunds</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className={`font-semibold mb-3 ${
            theme === "light" ? "text-black" : "text-white"
          }`}>Connect</h3>
          <div className={`flex gap-4 text-xl ${
            theme === "light" ? "text-gray-600" : "text-white/70"
          }`}>
            <FiInstagram className="hover:text-primary cursor-pointer" />
            <FiTwitter className="hover:text-primary cursor-pointer" />
            <FiFacebook className="hover:text-primary cursor-pointer" />
            <FiMail className="hover:text-primary cursor-pointer" />
          </div>
        </div>
      </div>

      <div className={`border-t py-4 text-center text-sm ${
        theme === "light"
          ? "border-gray-200 text-gray-500"
          : "border-white/10 text-white/40"
      }`}>
        © {new Date().getFullYear()} Celebration Point. All rights reserved.
      </div>
    </footer>
  );
}
