import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-rtl/dist/css/bootstrap-rtl.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";

import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Login, About, Services, Contact, Request, AdminServices, UserProfile } from './pages';
import DynamicForm from "./Components/form";
import { Toaster } from "react-hot-toast";
import MyRequests from "./pages/MyRequests";
import AdminDashboard from "./pages/AdminDashboard";
import ThemeToggle from "./Components/ThemeToggle";
import { ThemeProvider } from "./theme/ThemeContext";
import { CssBaseline, ThemeProvider as MuiThemeProvider, StyledEngineProvider } from "@mui/material";
import AddServicePage from "./pages/AddServicePage";

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <MuiThemeProvider theme={(theme) => theme}>
          <CssBaseline />
          <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path="/Services" element={<Services/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/admin/request" element={<Request/>} />
          <Route path="/Form" element={<DynamicForm/>}/>
          <Route path="/MyRequests" element={<MyRequests/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/admin/services" element={<AdminServices/>} />
          <Route path="/admin/services/:id" element={<AddServicePage />} />
          <Route path="/admin/services/add" element={<AddServicePage />} />
          <Route path="/ProfilePage" element={<UserProfile/>} />
        </Routes>
        <Toaster position="top-center" reverseOrder={false} />
        <ThemeToggle />
      </BrowserRouter>
      </MuiThemeProvider>
    </ThemeProvider>
  </StyledEngineProvider>
  );
}

export default App;
