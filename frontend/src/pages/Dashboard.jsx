import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import { logout } from "../store/authSlice";

function Dashboard() {
console.log("Dashboard Rendered");
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

export default Dashboard;