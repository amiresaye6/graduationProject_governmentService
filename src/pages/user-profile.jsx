import React, { useState, useEffect } from 'react';
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { Avatar, Box, Button, DialogActions, IconButton, TextField, Typography, Skeleton, Dialog, DialogTitle, DialogContent, MenuItem } from "@mui/material";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Edit } from "@mui/icons-material";
import { ThemeToggle } from "../Components";
import Scroll from "../Components/scroll";
import '../css/App.css';

const PRIMARY_COLOR = "#129990";
const PRIMARY_COLOR_DARK = "#0f7a6e";
const PRIMARY_COLOR_LIGHT = "#e8f7f5";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://government-services.runasp.net/Account/User-Info', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setUserData(res.data);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setEmail(res.data.email || '');
        setRole(res.data.role || '');
        setPhone(res.data.phone || '');
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching user info:', err);
      }
    };
    fetchUserInfo();
  }, [token]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(
        'https://government-services.runasp.net/Account/Update-Info',
        { firstName, lastName },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      alert('تم التحديث بنجاح');
      setUserData((prev) => ({ ...prev, firstName, lastName }));
      setIsEditing(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.response) {
        alert(`حدث خطأ: ${err.response.data.message || JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        alert('لم يتم استلام استجابة من الخادم');
      } else {
        alert(`حدث خطأ: ${err.message}`);
      }
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'firstName') setFirstName(value);
    else if (field === 'lastName') setLastName(value);
    else if (field === 'email') setEmail(value);
    else if (field === 'phone') setPhone(value);
    else if (field === 'role') setRole(value);
    else if (field === 'avatar') setAvatarPreview(value);
  };

  const handleCancel = () => {
    setFirstName(userData.firstName || '');
    setLastName(userData.lastName || '');
    setIsEditing(false);
    setAvatarPreview(null);
  };

  // Card Styles
  const cardStyles = {
    p: { xs: 2, md: 3 },
    border: `1.5px solid ${PRIMARY_COLOR_LIGHT}`,
    borderRadius: 3,
    backgroundColor: '#fff',
    boxShadow: '0 6px 24px 0 rgba(18,153,144,0.09)'
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          background: "#fcfefd",
          color: '#2d393a',
          transition: 'all 0.3s ease',
          pb: 10,
        }}
      >
        {/* Banner */}
        <Box
          sx={{
            width: '100%',
            py: { xs: 3, md: 5 },
            background: `linear-gradient(90deg, ${PRIMARY_COLOR} 30%, #13c2b3 100%)`,
            color: '#fff',
            textAlign: 'center',
            borderBottomLeftRadius: { xs: 30, md: 60 },
            borderBottomRightRadius: { xs: 30, md: 60 },
            boxShadow: `0 6px 40px 0 rgba(18,153,144,0.18)`,
            mb: 6,
            position: 'relative'
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1
            }}
          >
            <Box
              sx={{
                transition: "transform 0.25s cubic-bezier(.4,2,.5,.4)",
                transform: isAvatarHovered ? "scale(1.07) rotate(-4deg)" : "scale(1)",
                boxShadow: isAvatarHovered ? `0 8px 36px 0 rgba(18,153,144,0.19)` : "0 4px 16px 0 rgba(18,153,144,0.10)",
                border: `4px solid #fff`,
                borderRadius: "50%",
                mb: 1,
                backgroundColor: PRIMARY_COLOR_LIGHT,
                width: { xs: 108, md: 132 },
                height: { xs: 108, md: 132 },
                overflow: "hidden",
                position: "relative",
                cursor: "pointer"
              }}
              onMouseEnter={() => setIsAvatarHovered(true)}
              onMouseLeave={() => setIsAvatarHovered(false)}
            >
              <Avatar
                src={avatarPreview || userData.avatar || "avatar.png"}
                alt={userData.firstName}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  fontSize: 54,
                  transition: "all 0.2s"
                }}
              />
            </Box>
            <Typography variant="h4" fontWeight={900} letterSpacing={1} sx={{ mb: 0.5 }}>
              {loading ? <Skeleton width={120} /> : `${userData.firstName || ''} ${userData.lastName || ''}`}
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.85 }}>
              {loading ? <Skeleton width={60} /> : (userData.role || "الدور")}
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              background: "radial-gradient(circle at 60% 20%, rgba(255,255,255,0.12) 0%, transparent 80%)"
            }}
          />
        </Box>

        {/* Profile Card */}
        <Container style={{
          maxWidth: 900,
          marginTop: '-64px',
          marginBottom: '32px',
          zIndex: 2,
          position: "relative"
        }}>
          <Card style={{
            ...cardStyles,
            padding: "32px 20px 28px 20px",
            borderRadius: 24,
            border: `1.5px solid ${PRIMARY_COLOR_LIGHT}`,
            boxShadow: '0 8px 32px 0 rgba(18,153,144,0.12)'
          }}>
            <Row className="gy-4" style={{ marginTop: 0 }}>
              <Col md={12}>
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    معلومات شخصية
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      background: PRIMARY_COLOR,
                      fontSize: '15px',
                      px: 2.5,
                      py: 1,
                      borderRadius: '8px',
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: `0 1px 4px rgba(18,153,144,0.10)`,
                      "&:hover": { background: PRIMARY_COLOR_DARK }
                    }}
                    startIcon={<Edit sx={{ color: "#fff" }} />}
                    onClick={() => setIsEditing(true)}
                  >
                    تعديل
                  </Button>
                </Box>
                <Row className="gy-4" >
                  <Col md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      الاسم الأول:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {loading ? <Skeleton width={60} /> : userData.firstName}
                    </Typography>
                  </Col>
                  <Col md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      الاسم الأخير:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {loading ? <Skeleton width={60} /> : userData.lastName}
                    </Typography>
                  </Col>
                  <Col md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      البريد الإلكتروني:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {loading ? <Skeleton width={120} /> : userData.email}
                    </Typography>
                  </Col>
                  <Col md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      رقم الهاتف:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {loading ? <Skeleton width={90} /> : userData.phone || "غير متوفر"}
                    </Typography>
                  </Col>
                  <Col md={6}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      الدور:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {loading ? <Skeleton width={70} /> : (userData.role || "غير متوفر")}
                    </Typography>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Container>

        {/* Edit Dialog */}
        <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth maxWidth="sm">
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fefd'
            }}
          >
            <Typography variant="h6">تعديل الملف الشخصي</Typography>
            <IconButton onClick={() => setIsEditing(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ backgroundColor: '#f8fefd' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={avatarPreview || userData.avatar || "avatar.png"}
                  sx={{
                    width: 100, height: 100,
                    mx: 'auto',
                    border: `3px solid ${PRIMARY_COLOR}`
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: PRIMARY_COLOR,
                    color: '#fff',
                    '&:hover': { bgcolor: PRIMARY_COLOR_DARK }
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
                        reader.onload = (ev) => handleInputChange('avatar', ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box component="form" sx={{ display: 'grid', gap: 2 }}>
              <TextField
                label="الاسم الأول"
                value={firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                variant="outlined"
                fullWidth
                inputProps={{ style: { direction: 'rtl' } }}
              />
              <TextField
                label="الاسم الأخير"
                value={lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                variant="outlined"
                fullWidth
                inputProps={{ style: { direction: 'rtl' } }}
              />
              <TextField
                label="البريد الإلكتروني"
                value={email}
                onChange={() => { }}
                disabled
                variant="outlined"
                fullWidth
                inputProps={{ style: { direction: 'rtl' } }}
              />
              <TextField
                label="رقم الهاتف"
                value={phone}
                onChange={() => { }}
                disabled
                variant="outlined"
                fullWidth
                inputProps={{ style: { direction: 'rtl' } }}
              />
              <TextField
                label="الدور"
                value={role}
                select
                onChange={(e) => handleInputChange('role', e.target.value)}
                fullWidth
                inputProps={{ style: { direction: 'rtl' } }}
              >
                <MenuItem value="team-manager">Team Manager</MenuItem>
                <MenuItem value="developer">Developer</MenuItem>
                <MenuItem value="designer">Designer</MenuItem>
                <MenuItem value="analyst">Analyst</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{
            px: 3, pb: 3,
            backgroundColor: '#f8fefd',
            boxShadow: '0px 2px 8px #b2dfd6'
          }} dir="rtl">
            <Button
              variant="contained"
              sx={{
                background: PRIMARY_COLOR,
                fontWeight: 600,
                px: 4,
                borderRadius: 2,
                "&:hover": { background: PRIMARY_COLOR_DARK }
              }}
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? '...جاري الإرسال' : 'حفظ'}
            </Button>
            <Button
              variant="outlined"
              sx={{
                color: PRIMARY_COLOR,
                borderColor: PRIMARY_COLOR,
                fontWeight: 600,
                px: 4,
                borderRadius: 2,
                "&:hover": {
                  background: PRIMARY_COLOR_LIGHT,
                  borderColor: PRIMARY_COLOR_DARK
                }
              }}
              onClick={handleCancel}
              style={{ marginRight: 10 }}
              disabled={loading}
            >
              إلغاء
            </Button>
          </DialogActions>
        </Dialog>

        <ThemeToggle />
        <Scroll />
      </Box>
    </>
  );
}

export default ProfilePage;