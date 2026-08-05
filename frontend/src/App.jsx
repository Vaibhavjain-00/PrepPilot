import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Singup.jsx";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import MainLayout from "./components/layout/MainLayout.jsx";
import Home from "./pages/Home.jsx";

import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
import GuestRoute from "./routes/GuestRoute.jsx";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import authService from "./services/auth.service";
import { login, logout } from "./store/authSlice";


function App() {
   const dispatch = useDispatch();


  useEffect(() => {

    const checkUser = async () => {

      try {

        const user = await authService.getCurrentUser();

        if(user){
          dispatch(login({
            userData:user
          }));
        }
        else{
          dispatch(logout());
        }

      } catch(error){

        dispatch(logout());

      }

    };


    checkUser();

  }, []);
  
  return (
    <Routes>

      <Route element={<MainLayout />}>

        {/* Public Route */}
        <Route path="/" element={<Home />} />


        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />

        </Route>


        {/* Guest Routes */}
        <Route element={<GuestRoute />}>

          <Route 
            path="/login" 
            element={<Login />} 
          />

          <Route 
            path="/signup" 
            element={<Signup />} 
          />

          <Route 
            path="/verify-email" 
            element={<VerifyEmail />} 
          />

          <Route 
            path="/email-verification/:token" 
            element={<EmailVerification />} 
          />

          <Route 
            path="/forgot-password" 
            element={<ForgotPassword />} 
          />

          <Route 
            path="/reset-password/:token" 
            element={<ResetPassword />} 
          />

        </Route>

      </Route>

    </Routes>
  );
}

export default App;