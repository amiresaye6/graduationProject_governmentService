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
    Tab
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { motion } from "framer-motion";

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

// Column definitions for the requests table
const columns = [
    { id: 'requestId', label: 'رقم الطلب', minWidth: 100 },
    { id: 'userName', label: 'المستخدم', minWidth: 170 },
    { id: 'serviceName', label: 'الخدمة', minWidth: 170 },
    { id: 'submissionDate', label: 'تاريخ التقديم', minWidth: 170 },
    { id: 'status', label: 'الحالة', minWidth: 130 },
];

const AdminDashboard = () => {
    const [tabValue, setTabValue] = useState(0);
    
    // State for dashboard data
    const [dashboardStats] = useState({
        totalRequests: 150,
        newRequests: 45,
        inProgressRequests: 65,
        completedRequests: 40
    });

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

    return (
        <Box sx={{ flexGrow: 1 }}>
            <HeaderTemp />
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Stats Cards */}
                    <Grid item xs={12} md={3}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card sx={{ height: '100%', boxShadow: 3 }}>
                                <CardHeader 
                                    title="إجمالي الطلبات" 
                                    titleTypographyProps={{ align: 'center' }}
                                />
                                <CardContent>
                                    <Typography variant="h3" component="div" align="center">
                                        {dashboardStats.totalRequests}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Card sx={{ height: '100%', boxShadow: 3 }}>
                                <CardHeader 
                                    title="طلبات جديدة" 
                                    titleTypographyProps={{ align: 'center' }}
                                />
                                <CardContent>
                                    <Typography variant="h3" component="div" align="center">
                                        {dashboardStats.newRequests}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <Card sx={{ height: '100%', boxShadow: 3 }}>
                                <CardHeader 
                                    title="قيد التنفيذ" 
                                    titleTypographyProps={{ align: 'center' }}
                                />
                                <CardContent>
                                    <Typography variant="h3" component="div" align="center">
                                        {dashboardStats.inProgressRequests}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Card sx={{ height: '100%', boxShadow: 3 }}>
                                <CardHeader 
                                    title="مكتملة" 
                                    titleTypographyProps={{ align: 'center' }}
                                />
                                <CardContent>
                                    <Typography variant="h3" component="div" align="center">
                                        {dashboardStats.completedRequests}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>

                    {/* Tabs */}
                    <Grid item xs={12}>
                        <Paper sx={{ width: '100%', boxShadow: 3 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs 
                                    value={tabValue} 
                                    onChange={handleTabChange} 
                                    centered
                                >
                                    <Tab 
                                        icon={<DashboardIcon />} 
                                        label="لوحة التحكم" 
                                    />
                                    <Tab 
                                        icon={<AssignmentIcon />} 
                                        label="الطلبات" 
                                    />
                                </Tabs>
                            </Box>

                            {/* Dashboard Tab */}
                            <TabPanel value={tabValue} index={0}>
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        مرحباً بك في لوحة التحكم
                                    </Typography>
                                    <Typography paragraph>
                                        يمكنك متابعة وإدارة الطلبات من هنا
                                    </Typography>
                                </Box>
                            </TabPanel>

                            {/* Requests Tab */}
                            <TabPanel value={tabValue} index={1}>
                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            style={{ minWidth: column.minWidth }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {requests
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((row) => (
                                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                            {columns.map((column) => {
                                                                const value = row[column.id];
                                                                if (column.id === 'status') {
                                                                    return (
                                                                        <TableCell key={column.id}>
                                                                            <Chip 
                                                                                label={value}
                                                                                color={getStatusColor(value)}
                                                                                size="small"
                                                                            />
                                                                        </TableCell>
                                                                    );
                                                                }
                                                                return (
                                                                    <TableCell key={column.id}>
                                                                        {value}
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={requests.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </Paper>
                            </TabPanel>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default AdminDashboard;
