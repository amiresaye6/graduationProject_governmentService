import React, { useState, useEffect } from "react";
import { Footer, HeaderTemp } from "../Components";
import { requestsService } from "../services/api";
import { useAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// MUI Components
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { motion } from "framer-motion";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const MyRequests = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [open, setOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Fetch user requests
    useEffect(() => {
        // if (!isAuthenticated) {
        //     navigate("/login");
        //     return;
        // }

        const fetchRequests = async () => {
            try {
                setLoading(true);
                const data = await requestsService.getUserRequests();
                setRequests(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching requests:", err);
                setError(err.message || "حدث خطأ في جلب البيانات");
                toast.error(err.message || "حدث خطأ في جلب البيانات");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, [isAuthenticated, navigate]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClickOpen = (request) => {
        setSelectedRequest(request);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Status chip color based on status
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'قيد المراجعة':
                return 'warning';
            case 'approved':
            case 'تمت الموافقة':
                return 'success';
            case 'rejected':
            case 'مرفوض':
                return 'error';
            default:
                return 'default';
        }
    };

    const columns = [
        { id: 'requestId', label: 'رقم الطلب', minWidth: 100, align: 'right' },
        { id: 'serviceName', label: 'اسم الخدمة', minWidth: 170, align: 'right' },
        { id: 'submissionDate', label: 'تاريخ التقديم', minWidth: 170, align: 'right' },
        { 
            id: 'status', 
            label: 'حالة الطلب', 
            minWidth: 120, 
            align: 'right',
            format: (value) => (
                <Chip 
                    label={value} 
                    color={getStatusColor(value)} 
                    size="small" 
                    sx={{ fontWeight: 'bold' }}
                />
            )
        },
        { 
            id: 'actions', 
            label: 'الإجراءات', 
            minWidth: 120, 
            align: 'center',
            format: (_, row) => (
                <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleClickOpen(row)}
                    sx={{ 
                        transition: 'all 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' }
                    }}
                >
                    عرض التفاصيل
                </Button>
            )
        },
    ];

    return (
        <>
            <HeaderTemp />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container my-5"
            >
                <h1 className="text-center mb-4">الطلبات المقدمه</h1>
                
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
                ) : requests.length === 0 ? (
                    <Alert severity="info" sx={{ my: 2 }}>لا توجد طلبات مقدمة حتى الآن</Alert>
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3 }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ 
                                                    minWidth: column.minWidth,
                                                    fontWeight: 'bold',
                                                    backgroundColor: 'var(--primaryColor)',
                                                    color: 'white'
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow 
                                                    hover 
                                                    role="button" 
                                                    tabIndex={-1} 
                                                    key={row.requestId || index}
                                                    sx={{ 
                                                        cursor: 'pointer',
                                                        '&:nth-of-type(odd)': {
                                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                        },
                                                    }}
                                                >
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && (column.id === 'actions' 
                                                                    ? column.format(value, row) 
                                                                    : column.format(value))
                                                                    || value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            );
                                        })}
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
                            labelRowsPerPage="عدد الصفوف في الصفحة:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
                        />
                    </Paper>
                )}

                {/* Request Details Dialog */}
                {selectedRequest && (
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="request-details-dialog"
                        maxWidth="md"
                    >
                        <DialogTitle>{"تفاصيل الطلب"}</DialogTitle>
                        <DialogContent dividers>
                            <DialogContentText id="request-details-dialog" component="div">
                                <Box sx={{ mb: 2 }}>
                                    <strong>رقم الطلب:</strong> {selectedRequest.requestId}
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <strong>اسم الخدمة:</strong> {selectedRequest.serviceName}
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <strong>تاريخ التقديم:</strong> {selectedRequest.submissionDate}
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <strong>حالة الطلب:</strong>{' '}
                                    <Chip 
                                        label={selectedRequest.status} 
                                        color={getStatusColor(selectedRequest.status)} 
                                        size="small" 
                                    />
                                </Box>
                                {selectedRequest.notes && (
                                    <Box sx={{ mb: 2 }}>
                                        <strong>ملاحظات:</strong> {selectedRequest.notes}
                                    </Box>
                                )}
                                {selectedRequest.feedback && (
                                    <Box sx={{ mb: 2 }}>
                                        <strong>تعليق الإدارة:</strong> {selectedRequest.feedback}
                                    </Box>
                                )}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">إغلاق</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </motion.div>
            
            <Footer />
        </>
    );
};

export default MyRequests;
