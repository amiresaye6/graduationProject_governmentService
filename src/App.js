import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-rtl/dist/css/bootstrap-rtl.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import{ BrowserRouter , Routes , Route } from "react-router-dom";
import  {Home , Login ,About , Services ,Contact ,Request , AdminServices }  from './pages';
import  DynamicForm  from "./Components/form";
import { Toaster } from "react-hot-toast";
import MyRequests from "./pages/MyRequests";
import AdminDashboard from "./pages/AdminDashboard";
import ThemeToggle from "./Components/ThemeToggle";


function App() {

  return(
    <>
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
        </Routes>
        <ThemeToggle />
        <Toaster/>
      </BrowserRouter>
    </>
  )
}
export default App
