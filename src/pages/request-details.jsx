import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper, Button, Chip, CircularProgress, Box, Typography, List, ListItem, ListItemText,
  TextField, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Container, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import toast from 'react-hot-toast';
import { HeaderTemp } from '../Components';
import { motion } from "framer-motion";

export default function RequestDetails() {
  const { requestId } = useParams();
  const navigate = useNavigate();

  // State hooks
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestFields, setRequestFields] = useState([]);
  const [requestFiles, setRequestFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [refuseDialogOpen, setRefuseDialogOpen] = useState(false);
  const [refuseReason, setRefuseReason] = useState('');

  // جلب بيانات الحقول المرفقة بالطلب  Get Attached Fields
  const fetchRequestFields = async (fieldId) => {
    try {
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

  // Dialog handlers
  const handleRefuseDialogOpen = () => {
    setRefuseDialogOpen(true);
  };

  const handleRefuseDialogClose = () => {
    setRefuseDialogOpen(false);
    setRefuseReason('');
  };

  // تحديث حالة الطلب مع التعليق    Add Admin Response
  const updateRequestStatus = async (requestId, requestStatus) => {
    try {
      if (!requestId) {
        toast.error("رقم الطلب غير صالح");
        return;
      }

      setLoading(true);
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
      setSelectedRequest(prevRequest => ({
        ...prevRequest,
        requestStatus,
        adminComment: responseText
      }));

      toast.success(`تم ${requestStatus === 'مقبول' ? 'قبول' : 'رفض'} الطلب بنجاح`);

      if (requestStatus === 'مرفوض') {
        handleRefuseDialogClose();
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error(error.message || "حدث خطأ أثناء تحديث حالة الطلب");
    } finally {
      setLoading(false);
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

  // Load request details on component mount
  useEffect(() => {
    const loadRequestDetails = async () => {
      if (!requestId) {
        setError("رقم الطلب غير صالح");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // جلب تفاصيل الطلب
        const details = await fetchRequestDetails(requestId);
        if (details) {
          // تحويل البيانات لتتطابق مع التنسيق المطلوب
          const formattedRequest = {
            id: details.requestId,
            requestId: details.requestId,
            serviceName: details.serviceName || 'خدمة غير معروفة',
            requestDate: details.requestDate
              ? new Date(details.requestDate).toLocaleDateString('ar-EG')
              : 'تاريخ غير معروف',
            requestStatus: mapStatusToArabic(details.requestStatus || 'Pending'),
            adminComment: details.adminComment || '',
            fullName: `${details.firstName || ''} ${details.lastName || ''}`.trim(),
            fieldValueString: details.fieldValueString || ''
          };

          setSelectedRequest(formattedRequest);
          setAdminComment(formattedRequest.adminComment);

          // جلب البيانات والملفات
          await fetchRequestFields(requestId);
          await fetchRequestFiles(requestId);
        } else {
          setError("لم يتم العثور على تفاصيل الطلب");
        }
      } catch (error) {
        console.error("Error loading request details:", error);
        setError("حدث خطأ في تحميل تفاصيل الطلب");
      } finally {
        setLoading(false);
      }
    };

    loadRequestDetails();
  }, [requestId]);

  if (loading) {
    return (
      <>
        <HeaderTemp />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderTemp />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error" align="center">
                {error}
              </Typography>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                >
                  العودة
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <HeaderTemp />
      <Container maxWidth="md"  style={{backgroundColor:'var(--background-default)', minHeight: '100vh' , maxWidth: '100vw', width: '100%', overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',    alignItems: 'center',
    padding: '2rem 0'}}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
             style={{ 
          width: '80%', 
          margin: '0 auto'
        }}
        >
          <Card >
            <CardContent>
              {/* Header with back button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  تفاصيل الطلب #{requestId}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon sx={{gap: '8px'}} />}
                  onClick={() => navigate(-1)}
                >
                  العودة
                </Button>
              </Box>

              {selectedRequest && (
                <Box>
                  {/* Service Info */}
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom color='black'>
                    معلومات الطلب
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        اسم الخدمة :
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color='black'>
                        {selectedRequest.serviceName}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} textAlign="right" mr={6}>
                      <Typography variant="body2" color="text.secondary">
                        رقم الطلب :
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color='black'>
                        {selectedRequest.requestId}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        تاريخ الطلب :
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color='black'>
                        {selectedRequest.requestDate}
                      </Typography>
                    </Grid>
                    <Grid item xs={3} textAlign="right" mr={6}>
                      <Typography variant="body2" color="text.secondary">
                        الحالة :
                      </Typography>
                      <Chip
                        label={selectedRequest.requestStatus}
                        color={getStatusColor(selectedRequest.requestStatus)}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Grid>
                  </Grid>

                  {/* Admin Notes */}
                  {selectedRequest.requestStatus === 'مرفوض' && selectedRequest.adminComment && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        ملاحظات الإدارة
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={adminComment}
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Box>
                  )}

                  {/* Request Fields */}
                  {requestFields.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        البيانات المرفقة
                      </Typography>
                      <TableContainer component={Paper} variant="outlined">
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

                  {/* Attached Files */}
                  {requestFiles.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        الملفات المرفقة
                      </Typography>
                      <List>
                        {requestFiles.map((file) => (
                          <ListItem key={file.id} secondaryAction={
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => downloadFile(file.id)}
                              startIcon={<DownloadIcon />}
                            >
                              تحميل
                            </Button>
                          }>
                            <ListItemText
                              primary={file.fileName}
                              secondary={`النوع: ${file.contentType} | الامتداد: ${file.fileExtension}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {(requestFields.length === 0 && requestFiles.length === 0) && (
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 3 }}>
                      لا توجد بيانات أو ملفات مرفقة لهذا الطلب
                    </Typography>
                  )}

                  {error && (
                    <Typography variant="body2" color="error" align="center" sx={{ my: 2 }}>
                      {error}
                    </Typography>
                  )}

                  {/* Action Buttons - Only show if request is pending */}
                  {selectedRequest && selectedRequest.requestStatus === 'قيد الانتظار' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                      <Button
                        size="medium"
                        color="error"
                        variant="contained"
                        onClick={handleRefuseDialogOpen}
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                      >
                        {loading ? <CircularProgress size={20} /> : 'رفض الطلب'}
                      </Button>
                      <Button
                        size="medium"
                        color="success"
                        variant="contained"
                        onClick={() => updateRequestStatus(selectedRequest.id, 'مقبول')}
                        disabled={loading}
                        sx={{ minWidth: 120 }}
                      >
                        {loading ? <CircularProgress size={20} /> : 'قبول الطلب'}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

            </CardContent>
          </Card>
        </motion.div>
      </Container>

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
          </DialogContentText>
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
              updateRequestStatus(selectedRequest?.id, 'مرفوض');
            }}
            color="error"
            variant="contained"
            disabled={!refuseReason.trim() || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'تأكيد الرفض'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}