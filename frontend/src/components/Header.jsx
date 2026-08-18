import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import authService from "../services/auth.service";
import { logout } from "../store/authSlice";
import PrepPilotLogo from "../assets/PrepPilot.png";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();

      dispatch(logout());

      setMenuOpen(false);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center"
        >
          <img
            src={PrepPilotLogo}
            alt="PrepPilot"
            className="h-9 w-auto object-contain sm:h-8"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">

          {authStatus ? (
            <>
              <Link
                to="/dashboard"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Profile
              </Link>

              <Link
                to="/resume"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Resume
              </Link>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium text-gray-700 transition hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Signup
              </Link>
            </>
          )}

        </nav>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">

          <nav className="flex flex-col gap-2">

            {authStatus ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  Profile
                </Link>

                <Link
                  to="/resume"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  Resume
                </Link>

                <button
                  onClick={handleLogout}
                  className="mt-2 w-full rounded-lg bg-red-500 px-3 py-3 text-left font-medium text-white transition hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="rounded-lg bg-blue-600 px-3 py-3 font-medium text-white transition hover:bg-blue-700"
                >
                  Signup
                </Link>
              </>
            )}

          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;