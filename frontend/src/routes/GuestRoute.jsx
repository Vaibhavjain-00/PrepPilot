import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function GuestRoute() {

    const authStatus = useSelector(
        (state) => state.auth.status
    );

    console.log("Guest Route Status:", authStatus);

    return authStatus ? (
        <Navigate to="/dashboard" replace />
    ) : (
        <Outlet />
    );
}

export default GuestRoute;