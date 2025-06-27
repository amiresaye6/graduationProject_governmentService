
import { HeaderTemp, ThemeToggle  } from "../Components";
import Scroll, {  scroll } from "../Components/scroll";
import '../../src/App.css'; // Adjust the path as necessary
import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import axiosInstance from "./axiosConfig";
import CloseIcon from '@mui/icons-material/Close'; 
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Avatar, Box, Button, CardContent, DialogActions, Grid, IconButton, Modal, TextField, Typography } from "@mui/material";
import { Card, Col, Container, Row } from "react-bootstrap";
import { ThemeProvider } from "../theme/ThemeContext";
import { Close, Edit } from "@mui/icons-material";

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


const [editData, setEditData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: ''
});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axiosInstance.get('https://government-services.runasp.net/Account/User-Info');
        setUserData(res.data);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
  }, []);


  const handleSave = async () => {
    try {
      await axiosInstance.put(
        'https://government-services.runasp.net/Account/Update-Info',
        { firstName, lastName }
      );
      alert('تم التحديث بنجاح');
      setUserData((prev) => ({ ...prev, firstName, lastName }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating info:', err);
    }
  };
  const handleInputChange = (field, value) => {
  if (field === 'firstName') setFirstName(value);
  else if (field === 'lastName') setLastName(value);
};
// const handleInputChange = (field, value) => {
//   setEditData((prev) => ({
//     ...prev,
//     [field]: value
//   }));
// };


    const handleCancel = () => {
    // Reset editData to original userData
    setEditData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      email: userData.email,
      role: userData.role
    });
    setIsEditing(false);
  };

return (
  <ThemeProvider>
    <>
      <HeaderTemp />

      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          transition: 'all 0.3s ease'
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

        <Container className="py-4">
          <Row className="gy-4" style={{marginTop: '20px'}}>
            <Col md={4}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid var(--border-color)',
                  borderRadius: 2,
                  backgroundColor: 'white',
                  textAlign: 'center',
                  
                }}
              >
                <Avatar
                  src={userData.avatar}
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
                  backgroundColor: 'var(--bg-card)'
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
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      الاسم الأول:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {userData.firstName}
                    </Typography>
                  </Col>

                  <Col md={6}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      الاسم الأخير:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {userData.lastName}
                    </Typography>
                  </Col>

                  <Col md={6}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      البريد الإلكتروني:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {userData.email}
                    </Typography>
                  </Col>

                  <Col md={6}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      رقم الهاتف:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      01001234565
                    </Typography>
                  </Col>
                </Row>
              </Box>
            </Col>
          </Row>
        </Container>
        
            <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">تعديل الملف الشخصي</Typography>
        <IconButton onClick={() => setIsEditing(false)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{backgroundColor: 'var(--background-paper)'}}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={editData.avatar}
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

          <label className="form-label fw-bold">
          <span className="text-danger">*</span>
            الاسم الأول  
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
               style={{
                width: '100%',
                height: '52px',
                fontSize: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--background-default)',
                direction: 'rtl',
                textAlign: 'right',
                outline: 'none',
                boxSizing: 'border-box',
              }}
          />
         
          <label className="form-label fw-bold">
          <span className="text-danger">*</span>
          الاسم الاخير   
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
               style={{
                width: '100%',
                height: '52px',
                fontSize: '16px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--background-default)',
                direction: 'rtl',
                textAlign: 'right',
                outline: 'none',
                boxSizing: 'border-box',
              }}
          />

          {/* <TextField
            label="البريد الإلكتروني"
            value={userData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
            type="email"
            fullWidth
          />

          <TextField
            label="رقم الهاتف"
            value={userData.phone}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
            type="tel"
            fullWidth
          />

          <TextField
            label="الدور"
            value={userData.role}
           onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
            select
            fullWidth
          >
            <MenuItem value="team-manager">Team Manager</MenuItem>
            <MenuItem value="developer">Developer</MenuItem>
            <MenuItem value="designer">Designer</MenuItem>
            <MenuItem value="analyst">Analyst</MenuItem>
          </TextField> */}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }} dir="rtl">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          // disabled={loading}
        >
          {/* {loading ? '...جاري الإرسال' : 'إرسال'} */}
          حفظ
        </Button>
        <Button variant="outlined" onClick={() => setIsEditing(false)} style={{marginRight:10}}>إلغاء</Button>
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
  </ThemeProvider>
);
}

export default ProfilePage;


     