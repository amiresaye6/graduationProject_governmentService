import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-rtl/dist/css/bootstrap-rtl.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./css/App.css";

import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Login, About, Services, Contact, Request, AdminServices, UserProfile, RequestDetails } from './pages';
import DynamicForm from "./Components/form";
import { Toaster } from "react-hot-toast";
import MyRequests from "./pages/MyRequests";
import AdminDashboard from "./pages/AdminDashboard";
import ThemeToggle from "./Components/ThemeToggle";
import { ThemeProvider } from "./Components/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path="/Services" element={<Services/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/admin/request" element={<Request/>} />
          <Route path="/request-details/:requestId" element={<RequestDetails/>} />
          <Route path="/Form" element={<DynamicForm/>}/>
          <Route path="/MyRequests" element={<MyRequests/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/services" element={<AdminServices/>} />
          <Route path="/ProfilePage" element={<UserProfile/>} />
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
        <ThemeToggle />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
