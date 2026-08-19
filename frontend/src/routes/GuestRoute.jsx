import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function GuestRoute() {

    const authStatus = useSelector(
        (state) => state.auth.status
    );

    return authStatus ? (
        <Navigate to="/dashboard" replace />
    ) : (
        <Outlet />
    );
}

export default GuestRoute;