import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, CircularProgress, Box, Typography, List, ListItem, ListItemText,
  TextField, InputAdornment, Pagination, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Close as CloseIcon } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import toast from 'react-hot-toast';
import { HeaderTemp } from '../Components';
import { motion } from "framer-motion";

export default function Request() {
  // بيانات وهمية للطلبات (محتفظ بها كتعليق للرجوع إليها عند الحاجة)
  /*
  const dummyRows = [
    { id: 1, serviceName: 'استخراج بطاقة هوية وطنية', requestDate: '2023-06-15', status: 'قيد الانتظار' },
    { id: 2, serviceName: 'تجديد جواز السفر', requestDate: '2023-06-16', status: 'مقبول' },
    { id: 3, serviceName: 'استخراج رخصة قيادة', requestDate: '2023-06-17', status: 'مرفوض' },
    { id: 4, serviceName: 'تسجيل مركبة جديدة', requestDate: '2023-06-18', status: 'قيد الانتظار' },
    { id: 5, serviceName: 'استخراج شهادة ميلاد', requestDate: '2023-06-19', status: 'قيد الانتظار' },
  ];
  */
 // State hooks
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [open, setOpen] = useState(false);
  const [refuseDialogOpen, setRefuseDialogOpen] = useState(false);
  const [refuseReason, setRefuseReason] = useState('');
  const [scroll, setScroll] = useState('paper');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestFields, setRequestFields] = useState([]);
  const [requestFiles, setRequestFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(20);

  const descriptionElementRef = useRef(null);

  // جلب بيانات الحقول المرفقة بالطلب  Get Attached Fields
  const fetchRequestFields = async (fieldId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://government-services.runasp.net/api/Fields/Attached/Request/${fieldId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      console.log("Fields data:", data);
      setRequestFields(data || []);
    } catch (error) {
      console.error("Error fetching fields:", error);
      toast.error("حدث خطأ في جلب بيانات الحقول");
    }
  };

  // جلب الملفات المرفقة بالطلب  Get Attached Files
  const fetchRequestFiles = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://government-services.runasp.net/api/Files/Attached/Request/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      console.log("Files data:", data);
      setRequestFiles(data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("حدث خطأ في جلب الملفات");
    } finally {
      setLoading(false);
    }
  };

  // تحميل الملف   Download Attached File
  const downloadFile = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://government-services.runasp.net/api/Files/Attached/Download/${fileId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`فشل تنزيل الملف: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `file-${fileId}`; // يمكن تغيير اسم الملف حسب الحاجة
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("تم تنزيل الملف بنجاح");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error(error.message || "حدث خطأ أثناء تنزيل الملف");
    }
  };

  // مذكرة لوظيفة جلب الطلبات لتجنب إعادة الإنشاء      Get All Member Requests
  const memoizedFetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const token = localStorage.getItem('token');
      localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMTk1NDQzOS04MDExLTdjY2EtOWE3Ny1jNWM1Njk5MGJlMzYiLCJlbWFpbCI6IkFkbWluQEdvdmVybm1lbnRTZXJ2aWNlcy5jb20iLCJnaXZlbl9uYW1lIjoiR292ZXJubWVudF9TZXJ2aWNlcyIsImZhbWlseV9uYW1lIjoiQWRtaW4iLCJqdGkiOiJlYTVmMzY4Zi00M2VkLTRjZDgtYmNiOC02ZWU1N2Q1YzZkNzYiLCJyb2xlcyI6WyJBZG1pbiJdLCJwZXJtaXNzaW9ucyI6WyJBY2NvdW50X01hbmdtZW50IiwiYWRtaW4uY3JlYXRlX3Jlc3BvbnNlIiwiYXV0aC5hZG1pbi5sb2dpbiIsImF1dGguYWRtaW4ucmVnaXNzaW9ucyIsImF1dGguYWRtaW4ucmVzZW5kZF9jb25maXJtX2VtYWlsIiwicmVzdWx0czpyZWFkIiwicm9sZXM6YWRkIiwicm9sZXM6cmVhZCIsInJvbGVzOnVwZGF0ZSIsInNlcnZpY2VzLmNyZWF0ZSIsInNlcnZpY2VzLnRvZ2dsZV9hdmFpbGFiaWxpdHkiLCJzZXJ2aWNlcy51cGRhdGUiLCJzZXJ2aWNlcy52aWV3X2FsbCIsInVzZXJzOmFkZCIsInVzZXJzOnJlYWQiLCJ1c2Vyczp1cGRhdGUiXSwiZXhwIjoxNzQ2MjQwNzg5LCJpc3MiOiJDZW50cmFsVXNlck1hbmFnZW1lbnRTZXJ2aWNlIiwiYXVkIjoiQ2VudHJhbFVzZXJNYW5hZ2VtZW50U2VydmljZSJ9.k4DpCZWTPIxM1N071KG9IFeov8EI57XH0XBcjbnADMs');

      const response = await fetch('https://government-services.runasp.net/api/Requests/All', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      console.log("Raw API Response:", data);

      const formattedData = Array.isArray(data) ? data : (data.items || []);
      console.log("Formatted Data:", formattedData);

      const sortedData = formattedData
        .filter(request => request !== null)
        .map(request => ({
          id: request.requestId ,
          serviceName: request.serviceName || 'خدمة غير معروفة',
          requestDate: request.requestDate ? new Date(request.requestDate).toLocaleDateString('ar-EG') : 'تاريخ غير معروف',
          requestStatus: mapStatusToArabic(request.requestStatus || 'Pending'),
          adminComment: request.adminComment || '',
          // fields: request.firstName || [],
          // files: request.lastName || [],
          fullName : `${request.firstName || ''} ${request.lastName || ''}`.trim(),
          fieldValueString: request.fieldValueString || ''
        }))
        .sort((a, b) => a.id - b.id); // ترتيب حسب الرقم التسلسلي

      console.log("Final Sorted Data:", sortedData);
      setRows(sortedData);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setFetchError("حدث خطأ في جلب البيانات من الخادم");
      // toast.error("حدث خطأ في جلب البيانات من الخادم");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefuseDialogOpen = () => {
    setRefuseDialogOpen(true);
  };

  const handleRefuseDialogClose = () => {
    setRefuseDialogOpen(false);
    setRefuseReason('');
  };

  const handleClose = () => {
    setOpen(false);
  };

  // استدعاء وظيفة جلب الطلبات عند تحميل المكون
  useEffect(() => {
    console.log("Component mounted, fetching requests...");
    memoizedFetchRequests();
  }, [memoizedFetchRequests]);

  // التركيز على وصف نافذة الحوار عند فتحها
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  // تحديث حالة الطلب مع التعليق    Add Admin Response
  const updateRequestStatus = async (requestId, requestStatus) => {
    try {
      if (!requestId) {
        toast.error("رقم الطلب غير صالح");
        return;
      }

      const token = localStorage.getItem('token');
      const action = requestStatus === 'مقبول' ? 'Approve' : 'Reject';
      const responseText = action === 'Approve' ? 'تم اكمال طلبك بنجاح' : refuseReason;

      const response = await fetch('https://government-services.runasp.net/Admin/Response-To-Request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          requestId,
          responseText,
          action
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // تحديث الحالة في واجهة المستخدم
      setRows(prevRows =>
        prevRows.map(row =>
          row.id === requestId
            ? {
                ...row,
                requestStatus,
                adminComment: responseText
              }
            : row
        )
      );

      toast.success(`تم ${requestStatus === 'مقبول' ? 'قبول' : 'رفض'} الطلب بنجاح`);
      handleClose();
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error(error.message || "حدث خطأ أثناء تحديث حالة الطلب");
    }
  };

  // جلب تفاصيل طلب محدد   Get  Member Request By Id
  const fetchRequestDetails = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://government-services.runasp.net/api/Requests/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      console.log("Request details:", data);
      return data;
    } catch (error) {
      console.error("Error fetching request details:", error);
      return null;
    }
  };

  const handleClickOpen = async (request) => {
    // التحقق من وجود طلب صالح قبل فتح النافذة
    if (!request) {
      console.error("Invalid request object", request);
      toast.error("لا يمكن عرض تفاصيل الطلب. الرجاء المحاولة مرة أخرى.");
      return;
    }

    // إعادة تعيين الحالة قبل فتح النافذة
    setSelectedRequest(request);
    setError(null);
    setAdminComment('');
    setOpen(true);
    setScroll('paper');

    // جلب تفاصيل الطلب
    const details = await fetchRequestDetails(request.id);
    if (details) {
      console.log("Updated request details:", details);
      setSelectedRequest(prev => ({ ...prev, ...details }));
    }

    // جلب البيانات والملفات
    fetchRequestFields(request.id);
    fetchRequestFiles(request.id);
  };

  // تحويل حالة الطلب من الإنجليزية إلى العربية
  const mapStatusToArabic = (requestStatus) => {
    if (!requestStatus) return 'قيد الانتظار';

    switch (requestStatus) {
      case 'Pending':
        return 'قيد الانتظار';
      case 'Approved':
      case 'Completed':
        return 'مقبول';
      case 'Rejected':
        return 'مرفوض';
      default:
        return requestStatus;
    }
  };

  // تحديد لون الحالة
  const getStatusColor = (requestStatus) => {
    if (!requestStatus) return 'warning';

    switch (requestStatus) {
      case 'مقبول':
        return 'success';
      case 'مرفوض':
        return 'error';
      default:
        return 'warning';
    }
  };

  // معالجة قيمة الحقل حسب نوعه
  const processFieldValue = (field) => {
    if (!field) return '';

    try {
      switch (field.valueType?.toLowerCase()) {
        case 'date':
          return field.fieldValueDate ? new Date(field.fieldValueDate).toLocaleDateString('ar-EG') : '';
        case 'int':
          return field.fieldValueInt?.toLocaleString('ar-EG') || '';
        case 'float':
          return field.fieldValueFloat?.toLocaleString('ar-EG') || '';
        case 'string':
          return field.fieldValueString || '';
        default:
          // اختيار القيمة غير الفارغة
          return field.fieldValueString ||
                 field.fieldValueInt?.toString() ||
                 field.fieldValueFloat?.toString() ||
                 (field.fieldValueDate ? new Date(field.fieldValueDate).toLocaleDateString('ar-EG') : '') ||
                 '';
      }
    } catch (error) {
      console.error(`Error processing field value: ${field.filedName}`, error);
      return '';
    }
  };

  return (
    <>
      
    <HeaderTemp/>
      <div className="container my-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container text-center mb-4"
        >
          <h2 className=" text-primary mb-4 text-center">الطلبات المقدمه</h2>

          <Box sx={{ display:'flex',  p: 2, direction: 'rtl' }}>
              
            <TextField
              placeholder="اسم المستخدم..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dir='rtl'
              sx={{
                width: '250px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                dir: 'rtl'
              }}
            />
          </Box>
      </motion.div>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {fetchError && (
          <Box sx={{ textAlign: 'center', color: 'error.main', my: 2 }}>
            {fetchError}
          </Box>
        )}

        {!isLoading && !fetchError && rows.length === 0 && (
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Typography>لا توجد طلبات لعرضها</Typography>
          </Box>
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container text-center mb-4"
        > 
        {!isLoading && !fetchError && rows.length > 0 && (
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="الطلبات">
              <TableHead>
                <TableRow>
                  <TableCell align="right">رقم الطلب</TableCell>
                  <TableCell align="right">اسم الخدمة</TableCell>
                  <TableCell align="right">اسم المستخدم</TableCell>
                  <TableCell align="right">تاريخ الطلب</TableCell>
                  <TableCell align="right">حالة الطلب</TableCell>
                  <TableCell align="right">إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                  >
                    <TableCell align="right">{row.requestId || `#${index + 1}`}</TableCell>
                    <TableCell align="right">{row.serviceName}</TableCell>
                    <TableCell align="right">{row.fullName}</TableCell>
                    <TableCell align="right">{row.requestDate}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={row.requestStatus}
                        color={getStatusColor(row.requestStatus)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={() => handleClickOpen(row)}
                        style={{ marginLeft: 5 }}
                        disabled={row.requestStatus !== 'قيد الانتظار' && row.requestStatus !== 'مرفوض'}
                      >
                        عرض التفاصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </TableContainer>
            <Stack spacing={2} alignItems="center" sx={{ mt: 3, mb: 3 }}>
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Pagination
                count={Math.ceil(rows.length / rowsPerPage)}
                page={page}
                onChange={(event, newPage) => setPage(newPage)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    },
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              />
              </motion.div>
            </Stack>
          </div>
        )}
        </motion.div> 
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="md"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle id="scroll-dialog-title">
              تفاصيل الطلب: {selectedRequest.serviceName}
              <CloseIcon
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  left: 30,
                  top: 19,
                  cursor: 'pointer'
                }}
              />
            </DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        معلومات الطلب
                      </Typography>
                      <Typography variant="body1">
                        <strong>رقم الطلب:</strong> {selectedRequest.requestId}
                      </Typography>
                      <Typography variant="body1">
                        <strong>اسم الخدمة:</strong> {selectedRequest.serviceName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>تاريخ الطلب:</strong> {selectedRequest.requestDate}
                      </Typography>
                      <Typography variant="body1">
                        <strong>حالة الطلب:</strong>
                        <Chip
                          label={selectedRequest.requestStatus}
                          color={getStatusColor(selectedRequest.requestStatus)}
                          variant="outlined"
                          size="small"
                          sx={{ mx: 1 }}
                        />
                      </Typography>
                    </Box>

                    {/* حقل إدخال ملاحظات الأدمن */}
                    {(selectedRequest.requestStatus === 'مرفوض') && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          ملاحظات الإدارة
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          variant="outlined"
                          value={adminComment}
                          onChange={(e) => setAdminComment(e.target.value)}
                          placeholder="أدخل ملاحظاتك هنا..."
                          sx={{ mb: 2 }}
                        />
                      </Box>
                    )}

                    {/* عرض البيانات المرفقة */}
                    {requestFields.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          البيانات المرفقة
                        </Typography>
                        <TableContainer component={Paper}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell align="right">اسم الحقل</TableCell>
                                <TableCell align="right">القيمة</TableCell>
                                <TableCell align="right">نوع البيانات</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {requestFields.map((field) => (
                                <TableRow key={field.fieldId}>
                                  <TableCell align="right">{field.filedName}</TableCell>
                                  <TableCell align="right">{processFieldValue(field)}</TableCell>
                                  <TableCell align="right" sx={{ color: 'text.secondary' }}>
                                    {field.htmlType || field.valueType || 'نص'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}

                    {/* عرض الملفات المرفقة */}
                    {requestFiles.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          الملفات المرفقة
                        </Typography>
                        <List>
                          {requestFiles.map((file) => (
                            <ListItem key={file.id}>
                              <ListItemText
                                primary={file.fileName}
                                secondary={`النوع: ${file.contentType} | الامتداد: ${file.fileExtension}`}
                              />
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => downloadFile(file.id)}
                                startIcon={<DownloadIcon />}
                              >
                                تحميل
                              </Button>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* رسالة في حالة عدم وجود بيانات أو ملفات */}
                    {requestFields.length === 0 && requestFiles.length === 0 && (
                      <Typography variant="body1" color="text.secondary" align="center" sx={{ my: 3 }}>
                        لا توجد بيانات أو ملفات مرفقة لهذا الطلب
                      </Typography>
                    )}

                    {error && (
                      <Typography variant="body1" color="error" align="center" sx={{ my: 2 }}>
                        {error}
                      </Typography>
                    )}
                  </>
                )}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {selectedRequest && selectedRequest.requestStatus === 'قيد الانتظار' && (
                <>
                  <Button
                    size="small"
                    color="success"
                    variant="contained"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'مقبول')}
                    disabled={loading}
                    style={{ marginLeft: 5 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'قبول'}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={handleRefuseDialogOpen}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'رفض'}
                  </Button>
                </>
              )}
              <Button onClick={handleClose} color="primary">
                إغلاق
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Refuse Dialog */}
      <Dialog
        open={refuseDialogOpen}
        onClose={handleRefuseDialogClose}
        maxWidth="md"
        
        TransitionProps={{
          timeout: 500,
          style: {
            transition: 'all 0.5s ease-in-out'
          }
        }}
        PaperProps={{
          style: {
            transform: refuseDialogOpen ? 'scale(1)' : 'scale(0.8)',
            opacity: refuseDialogOpen ? 1 : 0,
            transition: 'all 0.5s ease-in-out'
          }
        }}
      >
        <DialogTitle>هل انت متأكد من رفض الطلب!</DialogTitle>
        <DialogContent style={{ minWidth: '500px' }} dir="rtl">
          <DialogContentText dir="rtl">
            الرجاء إدخال سبب رفض الطلب
          </DialogContentText >
          <TextField
            autoFocus
            margin="dense"
            label="سبب الرفض"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={refuseReason}
            onChange={(e) => setRefuseReason(e.target.value)}
            variant="outlined"
            dir="rtl"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRefuseDialogClose} color="primary">
            إلغاء
          </Button>
          <Button 
            onClick={() => {
              updateRequestStatus(selectedRequest.id, 'مرفوض');
              handleRefuseDialogClose();
            }} 
            color="error"
            variant="contained"
            disabled={!refuseReason.trim()}
          >
            تأكيد الرفض
          </Button>
        </DialogActions>
      </Dialog>

     

    </>
  );
}