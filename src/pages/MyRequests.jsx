// import React, { useState, useEffect } from "react";
// import { Footer, HeaderTemp } from "../Components";
// import { requestsService } from "../services/api";
// import { useAuth } from "../Components/AuthContext";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// // MUI Components
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Slide from '@mui/material/Slide';
// import CircularProgress from '@mui/material/CircularProgress';
// import Alert from '@mui/material/Alert';
// import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import { motion } from "framer-motion";

// const Transition = React.forwardRef(function Transition(props, ref) {
//     return <Slide direction="up" ref={ref} {...props} />;
// });

// const MyRequests = () => {
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [open, setOpen] = useState(false);
//     const [selectedRequest, setSelectedRequest] = useState(null);
//     const [requests, setRequests] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
    
//     const { isAuthenticated } = useAuth();
//     const navigate = useNavigate();

//     // Fetch user requests
//     useEffect(() => {
//         // if (!isAuthenticated) {
//         //     navigate("/login");
//         //     return;
//         // }

//         const fetchRequests = async () => {
//             try {
//                 setLoading(true);
//                 const data = await requestsService.getUserRequests();
//                 setRequests(data);
//                 setError(null);
//             } catch (err) {
//                 console.error("Error fetching requests:", err);
//                 setError(err.message || "حدث خطأ في جلب البيانات");
//                 toast.error(err.message || "حدث خطأ في جلب البيانات");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRequests();
//     }, [isAuthenticated, navigate]);

//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };

//     const handleClickOpen = (request) => {
//         setSelectedRequest(request);
//         setOpen(true);
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     // Status chip color based on status
//     const getStatusColor = (status) => {
//         switch (status.toLowerCase()) {
//             case 'pending':
//             case 'قيد المراجعة':
//                 return 'warning';
//             case 'approved':
//             case 'تمت الموافقة':
//                 return 'success';
//             case 'rejected':
//             case 'مرفوض':
//                 return 'error';
//             default:
//                 return 'default';
//         }
//     };

//     const columns = [
//         { id: 'requestId', label: 'رقم الطلب', minWidth: 100, align: 'right' },
//         { id: 'serviceName', label: 'اسم الخدمة', minWidth: 170, align: 'right' },
//         { id: 'submissionDate', label: 'تاريخ التقديم', minWidth: 170, align: 'right' },
//         { 
//             id: 'status', 
//             label: 'حالة الطلب', 
//             minWidth: 120, 
//             align: 'right',
//             format: (value) => (
//                 <Chip 
//                     label={value} 
//                     color={getStatusColor(value)} 
//                     size="small" 
//                     sx={{ fontWeight: 'bold' }}
//                 />
//             )
//         },
//         { 
//             id: 'actions', 
//             label: 'الإجراءات', 
//             minWidth: 120, 
//             align: 'center',
//             format: (_, row) => (
//                 <Button 
//                     variant="outlined" 
//                     size="small" 
//                     onClick={() => handleClickOpen(row)}
//                     sx={{ 
//                         transition: 'all 0.3s ease',
//                         '&:hover': { transform: 'scale(1.05)' }
//                     }}
//                 >
//                     عرض التفاصيل
//                 </Button>
//             )
//         },
//     ];

//     return (
//         <>
//             <HeaderTemp />
            
//             <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="container my-5"
//             >
//                 <h1 className="text-center mb-4">الطلبات المقدمه</h1>
                
//                 {loading ? (
//                     <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
//                         <CircularProgress />
//                     </Box>
//                 ) : error ? (
//                     <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
//                 ) : requests.length === 0 ? (
//                     <Alert severity="info" sx={{ my: 2 }}>لا توجد طلبات مقدمة حتى الآن</Alert>
//                 ) : (
//                     <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3 }}>
//                         <TableContainer sx={{ maxHeight: 440 }}>
//                             <Table stickyHeader aria-label="sticky table">
//                                 <TableHead>
//                                     <TableRow>
//                                         {columns.map((column) => (
//                                             <TableCell
//                                                 key={column.id}
//                                                 align={column.align}
//                                                 style={{ 
//                                                     minWidth: column.minWidth,
//                                                     fontWeight: 'bold',
//                                                     backgroundColor: 'var(--primaryColor)',
//                                                     color: 'white'
//                                                 }}
//                                             >
//                                                 {column.label}
//                                             </TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {requests
//                                         .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                                         .map((row, index) => {
//                                             return (
//                                                 <TableRow 
//                                                     hover 
//                                                     role="button" 
//                                                     tabIndex={-1} 
//                                                     key={row.requestId || index}
//                                                     sx={{ 
//                                                         cursor: 'pointer',
//                                                         '&:nth-of-type(odd)': {
//                                                             backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                                                         },
//                                                     }}
//                                                 >
//                                                     {columns.map((column) => {
//                                                         const value = row[column.id];
//                                                         return (
//                                                             <TableCell key={column.id} align={column.align}>
//                                                                 {column.format && (column.id === 'actions' 
//                                                                     ? column.format(value, row) 
//                                                                     : column.format(value))
//                                                                     || value}
//                                                             </TableCell>
//                                                         );
//                                                     })}
//                                                 </TableRow>
//                                             );
//                                         })}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                         <TablePagination
//                             rowsPerPageOptions={[10, 25, 100]}
//                             component="div"
//                             count={requests.length}
//                             rowsPerPage={rowsPerPage}
//                             page={page}
//                             onPageChange={handleChangePage}
//                             onRowsPerPageChange={handleChangeRowsPerPage}
//                             labelRowsPerPage="عدد الصفوف في الصفحة:"
//                             labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
//                         />
//                     </Paper>
//                 )}

//                 {/* Request Details Dialog */}
//                 {selectedRequest && (
//                     <Dialog
//                         open={open}
//                         TransitionComponent={Transition}
//                         keepMounted
//                         onClose={handleClose}
//                         aria-describedby="request-details-dialog"
//                         maxWidth="md"
//                     >
//                         <DialogTitle>{"تفاصيل الطلب"}</DialogTitle>
//                         <DialogContent dividers>
//                             <DialogContentText id="request-details-dialog" component="div">
//                                 <Box sx={{ mb: 2 }}>
//                                     <strong>رقم الطلب:</strong> {selectedRequest.requestId}
//                                 </Box>
//                                 <Box sx={{ mb: 2 }}>
//                                     <strong>اسم الخدمة:</strong> {selectedRequest.serviceName}
//                                 </Box>
//                                 <Box sx={{ mb: 2 }}>
//                                     <strong>تاريخ التقديم:</strong> {selectedRequest.submissionDate}
//                                 </Box>
//                                 <Box sx={{ mb: 2 }}>
//                                     <strong>حالة الطلب:</strong>{' '}
//                                     <Chip 
//                                         label={selectedRequest.status} 
//                                         color={getStatusColor(selectedRequest.status)} 
//                                         size="small" 
//                                     />
//                                 </Box>
//                                 {selectedRequest.notes && (
//                                     <Box sx={{ mb: 2 }}>
//                                         <strong>ملاحظات:</strong> {selectedRequest.notes}
//                                     </Box>
//                                 )}
//                                 {selectedRequest.feedback && (
//                                     <Box sx={{ mb: 2 }}>
//                                         <strong>تعليق الإدارة:</strong> {selectedRequest.feedback}
//                                     </Box>
//                                 )}
//                             </DialogContentText>
//                         </DialogContent>
//                         <DialogActions>
//                             <Button onClick={handleClose} color="primary">إغلاق</Button>
//                         </DialogActions>
//                     </Dialog>
//                 )}
//             </motion.div>
            
//             <Footer />
//         </>
//     );
// };

// export default MyRequests;

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  Pagination,
} from '@mui/material';
import axiosInstance from './axiosConfig'; // Adjust the import path as necessary
import DownloadIcon from '@mui/icons-material/Download';
import { motion } from 'framer-motion';
import { HeaderTemp } from '../Components';

const statusColors = {
  Pending: 'warning',
  Rejected: 'error',
  Completed: 'success',
  'No Response': 'default',
};

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [fields, setFields] = useState([]);
  const [files, setFiles] = useState([]);
  const [statusFilter, setStatusFilter] = useState('الكل');
    // Pagination state
  const [pageNumber, setPageNumber] = useState(1);     // الصفحة الحالية
  const itemsPerPage = 8;                               // عدد الصفحات الكلي (مثال)

  
  

  const fetchRequests = async () => {
    try {
      const res = await axiosInstance.get('/Requests/Member');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const fetchRequestDetails = async (id) => {
    try {
      const [fieldsRes, filesRes] = await Promise.all([
        axiosInstance.get(`/Fields/Attached/Request/${id}`),
        axiosInstance.get(`/Files/Attached/Request/${id}`)
      ]);
      setFields(fieldsRes.data);
      setFiles(filesRes.data);
    } catch (err) {
      console.error('Error loading request details:', err);
    }
  };

  const handleOpenDetails = (req) => {
    setSelectedRequest(req);
    fetchRequestDetails(req.requestId);
  };

  const handleFieldChange = (fieldId, value) => {
    setFields((prev) =>
      prev.map((f) => (f.fieldId === fieldId ? { ...f, newValue: value } : f))
    );
  };

  const handleSave = async () => {
    try {
      const serviceData = fields
        .filter((f) => f.newValue !== undefined)
        .map((f) => ({ fieldId: f.fieldId, fieldValueString: f.newValue }));

      await axiosInstance.put(
        `/Fields/Attached/Request/${selectedRequest.requestId}`,
        { serviceData }
      );

      alert('تم الحفظ بنجاح');
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests =
    statusFilter === 'الكل'
      ? requests
      : requests.filter((r) => r.requestStatus === statusFilter);
  
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (pageNumber - 1) * itemsPerPage,
    pageNumber * itemsPerPage
  );
   const handlePageChange = (event, value) => {
    setPageNumber(value);
  };


  return (
    <>
    <HeaderTemp/>
    <Box p={3} dir="rtl">
      <Typography className='title' variant="h5" mb={2} fontWeight="bold">
        طلباتي
      </Typography>

      <TextField
        select
        label="تصفية حسب الحالة"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        sx={{
    width: 220,
    height: 48,
    fontWeight: 'bold',
    borderRadius: '12px',
    backgroundColor: '#fff',
    mb: 2,
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
    },
    '& .MuiOutlinedInput-input': {
      fontWeight: 'bold',
      fontSize: '16px',
      padding: '10px',
    },
  
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ccc',
    }
  }}
      >
        {['الكل', 'Pending', 'Completed', 'Rejected'].map((status) => (
          <MenuItem key={status} value={status}>
            {status === 'الكل' ? 'الكل' : status === 'Pending' ? 'قيد الانتظار' : status === 'Completed' ? 'مقبول' : 'مرفوض'}
          </MenuItem>
        ))}
      </TextField>

      <TableContainer component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} component ={Paper}>
        <Table>
          <TableHead>
            
            <TableRow>
              <TableCell align="center">اسم الخدمة</TableCell>
              <TableCell align="center">تاريخ الطلب</TableCell>
              <TableCell align="center">الحالة</TableCell>
              <TableCell align="center">إجراء</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {paginatedRequests.map((req) => (
              <TableRow key={req.requestId}>
                <TableCell align="center">{req.serviceName}</TableCell>
                <TableCell align="center">{new Date(req.requestDate).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={req.requestStatus === 'Pending' ? 'قيد الانتظار' : req.requestStatus === 'Completed' ? 'مقبول' : 'مرفوض'}
                    color={statusColors[req.requestStatus] || 'default'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="center">
                  <Button size="small" color="primary" variant="contained" onClick={() => handleOpenDetails(req)}>
                    عرض التفاصيل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
         <Box display="flex" justifyContent="center" mt={4} mb={2}>
      <Pagination
        count={totalPages}               // عدد الصفحات الكلي
        page={pageNumber}                // الصفحة الحالية
        onChange={handlePageChange}      // تغيير الصفحة
        color="primary"
        shape="rounded"
        size="large"
        showFirstButton
        showLastButton
      />
    </Box>
      </TableContainer>

      <Dialog open={Boolean(selectedRequest)} onClose={() => setSelectedRequest(null)} fullWidth maxWidth="md">
        <DialogTitle>تفاصيل الطلب</DialogTitle>
        <DialogContent>
          {fields.map((f) => (
            <TextField
              key={f.fieldId}
              label={f.filedName}
              fullWidth
              margin="normal"
              defaultValue={f.fieldValueString || ''}
              onChange={(e) => handleFieldChange(f.fieldId, e.target.value)}
            />
          ))}

          <List>
            {files.map((file) => (
              <ListItem key={file.id}>
                <ListItemText primary={file.fileName} secondary={file.contentType} />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => window.open(`https://government-services.runasp.net/api/Files/Attached/Download/${file.id}`, '_blank')}
                >
                  تحميل
                </Button>
              </ListItem>
            ))}
          </List>

          <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
            حفظ التعديلات
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
    </>
  );
};

export default MyRequests;
