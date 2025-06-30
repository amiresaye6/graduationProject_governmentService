import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-rtl/dist/css/bootstrap-rtl.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/App.css";

import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Routes, Route , useNavigate, useLocation} from "react-router-dom";
import { Home, Login, About, Services, Contact, Request, AdminServices, UserProfile, RequestDetails } from './pages';
import DynamicForm from "./Components/form";
import { Toaster } from "react-hot-toast";
import MyRequests from "./pages/MyRequests";
import AdminDashboard from "./pages/AdminDashboard";
import AddServicePage from "./pages/AddServicePage";
import ThemeToggle from "./Components/ThemeToggle";
import { ThemeProvider } from "./Components/ThemeContext";
import { CssBaseline, ThemeProvider as MuiThemeProvider, StyledEngineProvider } from "@mui/material";

function AuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token"); // التأكد من وجود التوكن
    if (token && location.pathname === "/") {
      navigate("/admin"); // لو فيه توكن، يروح لصفحة الأدمن
    } else if (!token && location.pathname === "/") {
      navigate("/login"); // لو مفيش توكن، يروح لصفحة اللوجن
    }
  }, [navigate, location.pathname]);

  return null; // الكومبوننت ده مش بيظهر حاجة في الواجهة
}

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  return token ? children : null;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthRedirect />
        <Routes>
          {/* <Route path='/' element={<Home/>}/> */}
          <Route path='/login' element={<Login/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path="/Services" element={<Services/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/admin/request" element={<Request/>} />
          <Route path="/request-details/:requestId" element={<RequestDetails/>} />
          <Route path="/Form" element={<DynamicForm/>}/>
          <Route path="/MyRequests" element={<MyRequests/>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute><AdminServices/></ProtectedRoute>} />
          <Route path="/admin/services/:id" element={<ProtectedRoute><AddServicePage /></ProtectedRoute>} />
          <Route path="/admin/services/add" element={<ProtectedRoute><AddServicePage /></ProtectedRoute>} />
          <Route path="/ProfilePage" element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
        <ThemeToggle />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
