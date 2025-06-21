import React, { useState, useEffect } from "react";
import { HeaderTemp } from "../Components";
import { useAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// MUI Components
import { 
    Box, 
    Paper, 
    Grid, 
    Typography, 
    Card, 
    CardContent, 
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    Tabs,
    Tab,
    Avatar
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CancelIcon from '@mui/icons-material/Cancel';
import PaidIcon from '@mui/icons-material/Paid';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { motion } from "framer-motion";
import axiosInstance from "./axiosConfig";

// Function to generate fake chart data
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const generateFakeRequestData = () => {
  return [
    { month: 'Jan', requests: 65 },
    { month: 'Feb', requests: 77 },
    { month: 'Mar', requests: 89 },
    { month: 'Apr', requests: 81 },
    { month: 'May', requests: 95 },
    { month: 'Jun', requests: 88 },
    { month: 'Jul', requests: 102 },
    { month: 'Aug', requests: 86 },
    { month: 'Sep', requests: 93 },
    { month: 'Oct', requests: 109 },
    { month: 'Nov', requests: 97 },
    { month: 'Dec', requests: 89 }
  ];
};

// Tab Panel Component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function AdminDashboard() {
    // State for dashboard data
    const [tabValue, setTabValue] = useState(0);
    const [DashboardStats, setDashboardStats] = useState({
        totalRequests: 0,
        newRequests: 0,
        inProgressRequests:0,
        completedRequests: 0,
        totalPayments:0
    });

    useEffect(() => { 
        const DashboardStats = async () => {
            try {
                const response = await axiosInstance.get('/Dashboard/overview');
                setDashboardStats({
                    totalRequests: response.data.totalUsers,
                    newRequests: response.data.totalServices,
                    inProgressRequests: response.data.approvedRequests,
                    completedRequests: response.data.rejectedRequests,
                    totalPayments : response.data.totalPayments
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            }
        };
        DashboardStats();
    }, []);

    // Column definitions for the requests table
    const columns = [
        { id: 'requestId', label: 'رقم الطلب', minWidth: 100 },
        { id: 'userName', label: 'المستخدم', minWidth: 170 },
        { id: 'serviceName', label: 'الخدمة', minWidth: 170 },
        { id: 'submissionDate', label: 'تاريخ التقديم', minWidth: 170 },
        { id: 'status', label: 'الحالة', minWidth: 130 },
    ];

    // Dummy requests data
    const [requests] = useState([
        { id: 1, requestId: 'REQ001', userName: 'أحمد محمد', serviceName: 'تجديد رخصة', status: 'قيد المراجعة', submissionDate: '2025-05-10' },
        { id: 2, requestId: 'REQ002', userName: 'سارة أحمد', serviceName: 'استخراج بطاقة', status: 'تمت الموافقة', submissionDate: '2025-05-09' },
        { id: 3, requestId: 'REQ003', userName: 'محمد علي', serviceName: 'تصريح عمل', status: 'مرفوض', submissionDate: '2025-05-08' }
    ]);

    // UI State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Get status color for chip
    const getStatusColor = (status) => {
        switch (status) {
            case 'تمت الموافقة':
                return 'success';
            case 'مرفوض':
                return 'error';
            case 'قيد المراجعة':
                return 'warning';
            default:
                return 'default';
        }
    };

    // Check authentication
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

     const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      const fakeData = generateFakeRequestData();
      setData(fakeData);
      setLoading(false);
    }, 1000);
  }, []);

    const [services, setServices] = useState([]);
    useEffect(() => {
    axiosInstance.get('/Dashboard/MostRequestedServices')
      .then(res => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setLoading(false);
      });
  }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <HeaderTemp />
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3} >
                    {/* Stats Cards */}
                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card elevation={2}  sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 3  }}>
                                <Avatar sx={{mr:'2' , bgcolor:'#f3e5f5' , color:'#000'}}>
                                     <PeopleIcon />
                                </Avatar>
                                <CardHeader 
                                    title="إجمالي الطلبات" 
                                    titleTypographyProps={{ align: 'center' }}
                                   variant="body2" color="textSecondary"
                                />
                                <CardContent>
                                    <Typography  variant="h5" fontWeight="bold" >
                                        {DashboardStats.totalRequests}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card elevation={2}  sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 3  }}>
                                <Avatar sx={{  color: '#7b61ff', bgcolor: '#f3edff', p: 1 }} >
                                     <DesignServicesIcon />
                                </Avatar>
                                <CardHeader 
                                    title="الخدمات المتاحه " 
                                    titleTypographyProps={{ align: 'center' }}
                                    variant="body2" color="textSecondary"
                                />
                                <CardContent>
                                    <Typography variant="h5" fontWeight="bold">
                                        {DashboardStats.newRequests}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                           <Card elevation={2}  sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 3  }}>
                                <Avatar sx={{mr:'2' , bgcolor:'#e8f5e9' , color:'green'}}>
                                      <CheckCircleIcon />
                                </Avatar>
                                <CardHeader 
                                    title="تمت الموافقه" 
                                    titleTypographyProps={{ align: 'center' }}
                                    variant="body2" color="textSecondary"
                                />
                                <CardContent>
                                    <Typography variant="h5" fontWeight="bold">
                                        {DashboardStats.inProgressRequests}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Card elevation={2}  sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 3  }}>
                                <Avatar sx={{  color: '#e74c3c', bgcolor: '#fdecea', p: 1}}>
                                     <CancelIcon />
                                </Avatar>
                                <CardHeader 
                                    title="تم الرفض" 
                                    titleTypographyProps={{ align: 'center' }}
                                    variant="body2" color="textSecondary"
                                />
                                <CardContent>
                                    <Typography variant="h5" fontWeight="bold">
                                        {DashboardStats.completedRequests}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                     <Grid item xs={12} sm={6} md={4} lg={4}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Card elevation={2}  sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 3  }}>
                                <Avatar sx={{  color: '#2ecc71', bgcolor: '#eafaf1', p: 1 }}>
                                    <PaidIcon  />
                                </Avatar>
                                <CardHeader 
                                    title="اجمالي المدفوعات" 
                                    titleTypographyProps={{ align: 'center' }}
                                    variant="body2" color="textSecondary"
                                />
                                <CardContent>
                                    <Typography variant="h5" fontWeight="bold">
                                        {DashboardStats.totalPayments}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                </Grid>

                <Card   elevation={3} sx={{ borderRadius: 3, mt: 4, p: 3 }}>
                     <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                            نظرة عامة على الطلبات المقدمه شهريًا
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                            يعرض هذا الرسم البياني عدد الطلبات المقدمة شهريًا.
                            </Typography>

                            {loading ? (
                            <Box display="flex" justifyContent="center" py={5}>
                                <CircularProgress />
                            </Box>
                            ) : (
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="0" stroke="#e0e0e0" vertical={false}/>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }}/>
                                <Legend />
                                <Bar dataKey="requests" fill="#64b5f6" radius={[4, 4, 4, 4]} activeBar={{ fill: '#1e88e5' }} />
                                </BarChart>
                            </ResponsiveContainer>
                            )}
                        </CardContent>
                    </motion.div>
                </Card>

                <Box p={3}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        أكثر الخدمات طلبًا
                    </Typography>
                    <Grid container spacing={2}>
                        {services.map(service => (
                        <Grid item xs={12} sm={6} md={4} key={service.id}>
                            <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
                                <CardContent>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                    {service.serviceName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    {service.serviceDescription}
                                    </Typography>
                                    <Typography mt={1}><strong>الفئة:</strong> {service.category}</Typography>
                                    <Typography><strong>الرسوم:</strong> {service.fee} جنيه</Typography>
                                    <Typography><strong>المدة:</strong> {service.processingTime}</Typography>
                                    <Box mt={1}>
                                    <Typography variant="body2" fontWeight="bold">الملفات المطلوبة:</Typography>
                                    {service.requiredFiles.map((file, index) => (
                                        <Chip key={index} label={file} size="small" sx={{ m: 0.5 }} />
                                    ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        ))}
                    </Grid>
                </Box>

            </Box>
        </Box>
    );
}

export default AdminDashboard;
                        
