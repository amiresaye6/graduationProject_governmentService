
import { HeaderTemp, ThemeToggle  } from "../Components";
import Scroll from "../Components/scroll";
import '../css/App.css';
import React, { useState, useEffect } from 'react';

import axiosInstance from "./axiosConfig";
import CloseIcon from '@mui/icons-material/Close'; 
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Avatar, Box, Button, DialogActions, IconButton, TextField, Typography } from "@mui/material";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useThemeContext } from "../Components/ThemeContext";
import { Close, Edit } from "@mui/icons-material";
import axios from "axios";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
} from '@mui/material';


const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] =useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
 

const [editData, setEditData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: ''
});

 const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('https://government-services.runasp.net/Account/User-Info',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
        );
        setUserData(res.data);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        // setEmail(res.data.email);
        // setRole(res.data.role)
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
  }, []);


  const handleSave = async () => {
    try {
      setLoading(true);
      
        console.log("Sending data:", { firstName, lastName });
      const response = await axios.put(
        'https://government-services.runasp.net/Account/Update-Info',
         { firstName, lastName  },
        {
          headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       }}
       
      );
      console.log("API Response:", response.data);
      alert('تم التحديث بنجاح');
      setUserData((prev) => ({ ...prev, firstName, lastName  }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating info:', err);

       // طباعة تفاصيل الخطأ
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error data:', err.response.data);
      console.error('Error headers:', err.response.headers);
      console.log('Validation errors:', err.response.data.errors);
       // عرض رسالة الخطأ للمستخدم
      alert(`حدث خطأ: ${err.response.data.message || JSON.stringify(err.response.data)}`);
    } else if (err.request) {
      // الطلب تم إرساله لكن لم يتم استلام استجابة
      console.error('Error request:', err.request);
      alert('لم يتم استلام استجابة من الخادم');
   } else {
      // حدث خطأ أثناء إعداد الطلب
      console.error('Error message:', err.message);
      alert(`حدث خطأ: ${err.message}`);
    }
    } finally {
    setLoading(false); // انتهاء التحميل
  }
  };
  const handleInputChange = (field, value) => {
  if (field === 'firstName') setFirstName(value);
  else if (field === 'lastName') setLastName(value);
  else if (field === 'email') setEmail(value);
  else if (field === 'phone') setPhone(value);
  else if (field === 'role') setRole(value);
};
// const handleInputChange = (field, value) => {
//   setEditData((prev) => ({
//     ...prev,
//     [field]: value
//   }));
// };

const handleCancel = () => {
  // إعادة تعيين البيانات إلى القيم الأصلية
  setFirstName(userData.firstName);
  setLastName(userData.lastName);
  // setEmail(userData.email);
  // setRole(userData.role);
  setIsEditing(false);
};
  //   const handleCancel = () => {
  //   // Reset editData to original userData
  //   setEditData({
  //     firstName: userData.firstName,
  //     lastName: userData.lastName,
  //     phone: userData.phone,
  //     email: userData.email,
  //     role: userData.role
  //   });
  //   setIsEditing(false);
  // };

return (
    <>
      <HeaderTemp />

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'var(--background-default)',
          color: 'var(--text-primary)',
          transition: 'all 0.3s ease',
          margin:'0px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />
            <Typography>{userData.firstName}</Typography>
          </Box>
        </Box> */}

        <Container className="mt-8" style={{backgroundColor:'var(--background-paper)', 
          position: 'absolute',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          maxWidth: '95%',
         
          padding: '24px', // مسافة داخلية
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginTop:'2%'
        }} >
          <label  style={{color:'var(--text-primary)', fontSize:'2rem', fontWeight: '600'}}> الملف الشخصي</label>
          <Row className="gy-4" style={{marginTop: '15px'}}>
            <Col md={4}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid var(--border-color)',
                  borderRadius: 2,
                  backgroundColor: 'var(--background-paper)',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <Avatar
                  src={userData.avatar || require("../assets/2.jpg")}
                  alt={userData.firstName}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h5">{`${userData.firstName} ${userData.lastName}`}</Typography>
                <Typography variant="body2" color="text.secondary">{userData.role}</Typography>
              </Box>
            </Col>

            <Col md={8}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid var(--border-color)',
                  borderRadius: 2,
                  backgroundColor: 'var(--background-paper)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
               <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  معلومات شخصية
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<Edit size={18} style={{ marginLeft: 8 }} />} // كبرنا الأيقونة شوية كمان
                  onClick={() => setIsEditing(true)}
                  sx={{
                    fontSize: '14px',
                    padding: '8px 15px',
                    borderRadius: '8px',
                    textTransform: 'none'
                  }}
                >
                  تعديل
                </Button>
              </Box>

                {/* <Row className="gy-4">
                  <Col md={6}><Typography><b>الاسم الأول:</b> {userData.firstName}</Typography></Col>
                  <Col md={6}><Typography><b>الاسم الأخير:</b> {userData.lastName}</Typography></Col>
                  <Col md={6}><Typography><b>البريد الإلكتروني:</b> {userData.email}</Typography></Col>
                  <Col md={6}><Typography><b>رقم الهاتف:</b> {userData.phone}</Typography></Col>
                </Row> */}
                <Row className="gy-4" >
                  <Col md={6}>
                    <Typography variant="subtitle2" className="text-secondary" gutterBottom>
                      الاسم الأول:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {userData.firstName}
                    </Typography>
                  </Col>

                  <Col md={6}>
                    <Typography variant="subtitle2" className="text-secondary" gutterBottom>
                      الاسم الأخير:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {userData.lastName}
                    </Typography>
                  </Col>

                  <Col md={6}>
                    <Typography variant="subtitle2" className="text-secondary" gutterBottom>
                      البريد الإلكتروني:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {userData.email}
                    </Typography>
                  </Col>

                  <Col md={6}>
                    <Typography variant="subtitle2" className="text-secondary" gutterBottom>
                      رقم الهاتف:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      01001234565
                    </Typography>
                  </Col>

                  <Col md={6}>
                    <Typography variant="subtitle2" className="text-secondary" gutterBottom>
                      الدور:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {/* {userData.email} */}
                      Team manager
                    </Typography>
                  </Col>
                </Row>
              </Box>
            </Col>
          </Row>
        </Container>
        
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth maxWidth="sm" >
      <DialogTitle  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor:'var(--background-default)' }}>
        <Typography variant="h6">تعديل الملف الشخصي</Typography>
        <IconButton onClick={() => setIsEditing(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{backgroundColor: 'var(--background-default)'}}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={editData.avatar || require("../assets/2.jpg")}
              sx={{ width: 100, height: 100, mx: 'auto', border: '3px solid #1976d2' }}
            />
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'primary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
              component="label"
            >
              <CameraAltIcon fontSize="small" />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => handleInputChange('avatar', e.target.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </IconButton>
          </Box>
        </Box>

        <Box component="form" sx={{ display: 'grid', gap: 2 }}>

          <label className="form-label fw-bold" style={{color:'var(--text-primary)'}}>
          <span className="text-danger">*</span>
            الاسم الأول  
          </label>
          <input
           className="form-onchange"
            type="text"
            value={firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
              
          />
         
          <label className="form-label fw-bold" style={{color:'var(--text-primary)'}}>
          <span className="text-danger">*</span>
          الاسم الاخير   
          </label>
          <input
          className="form-onchange"
            type="text"
            value={lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
           
          />
          <label className="form-label fw-bold" style={{color:'var(--text-primary)'}}>
          <span className="text-danger">*</span>
          البريد الإلكتروني  
          </label>
          <input
          className="form-onchange"
            type="text"
            // value={email}
            // onChange={(e) => handleInputChange('email', e.target.value)}
            value={userData.email || ''}
            disabled
          />
          <label className="form-label fw-bold" style={{color:'var(--text-primary)'}}>
          <span className="text-danger">*</span>
          رقم الهاتف 
          </label>
          <input
          className="form-onchange"
            type="int"
            // value={phone}
            // onChange={(e) => handleInputChange('phone', e.target.value)}
             value={"01001234565"}
             disabled
          />

          <label className="form-label fw-bold" style={{color:'var(--text-primary)'}}>
          <span className="text-danger">*</span>
          الدور
          </label>
          <select
          className="form-onchange"
            type="select"
            value={role}
            onChange={(e) => handleInputChange('role', e.target.value)}
          >    
            <option value="team-manager" style={{color:'var(--text-primary)'}}>Team Manager</option>
            <option value="developer" style={{color:'var(--text-primary)'}}>Developer</option>
            <option value="designer"style={{color:'var(--text-primary)'}}>Designer</option>
            <option value="analyst"style={{color:'var(--text-primary)'}}>Analyst</option>
          </select>
        
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 , backgroundColor:'var(--background-default)',boxShadow: '0px 2px 8px var(--shadow-light)' }} dir="rtl">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
        >
          {/* {loading ? '...جاري الإرسال' : 'إرسال'} */}
          حفظ
        </Button>
        <Button variant="outlined" onClick={handleCancel}  style={{marginRight:10}}>إلغاء</Button>
      </DialogActions>
    </Dialog>

        {/* <Modal open={isEditing} onClose={() => setIsEditing(false)}>
          <Box
            sx={{
              backgroundColor: 'var(--bg-card)',
              p: 4,
              borderRadius: 2,
              mx: 'auto',
              my: '5vh',
              maxWidth: 500
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6">تعديل الملف الشخصي</Typography>
              <IconButton onClick={() => setIsEditing(false)}><Close size={20} /></IconButton>
            </Box>

            <TextField
              label="الاسم الأول"
              fullWidth
              value={editData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="الاسم الأخير"
              fullWidth
              value={editData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="البريد الإلكتروني"
              fullWidth
              value={editData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="رقم الهاتف"
              fullWidth
              value={editData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="الدور"
              fullWidth
              value={editData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              sx={{ mb: 2 }}
            />

            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="contained" onClick={handleSave}>حفظ</Button>
              <Button variant="outlined" onClick={() => setIsEditing(false)}>إلغاء</Button>
            </Box>
          </Box>
        </Modal> */}
      </Box>

      <ThemeToggle />
      <Scroll />
    </>
);
}

export default ProfilePage;


     