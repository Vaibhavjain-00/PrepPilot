import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import authService from "../services/auth.service";
import { logout } from "../store/authSlice";
import PrepPilotLogo from "../assets/PrepPilot.png";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();

      dispatch(logout());

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          <img src={PrepPilotLogo} alt="PrepPilot" />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">

          {/* <Link
            to="/"
            className="hover:text-blue-600"
          >
            Home
          </Link> */}

          {authStatus ? (
            <>
              <Link
                to="/dashboard"
                className="hover:text-blue-600"
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="hover:text-blue-600"
              >
                Profile
              </Link>

              <Link
                to="/resume"
                className="hover:text-blue-600"
              >
                Resume
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Signup
              </Link>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}

export default Header;