import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

console.log("ProtectedRoute rendered");
function ProtectedRoute(){

    const authStatus = useSelector(
        (state)=>state.auth.status
    );

    return authStatus ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;