import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Paper,
  Button,
  Chip,
  CircularProgress,
  Box,
  Typography,
  TextField,
  Grid,
  Container,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Alert,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import toast from "react-hot-toast";
import { HeaderTemp } from "../Components";
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
  const [adminComment, setAdminComment] = useState("");
  const [acceptanceComment, setAcceptanceComment] = useState("");
  // State for dialogs
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // جلب بيانات الحقول المرفقة بالطلب  Get Attached Fields
  const fetchRequestFields = async (fieldId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://government-services.runasp.net/api/Fields/Attached/Request/${fieldId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://government-services.runasp.net/api/Files/Attached/Request/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://government-services.runasp.net/api/Files/Attached/Download/${fileId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`فشل تنزيل الملف: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://government-services.runasp.net/api/Requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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
    if (!requestStatus) return "قيد الانتظار";

    switch (requestStatus) {
      case "Pending":
        return "قيد الانتظار";
      case "Approved":
      case "Completed":
        return "مقبول";
      case "Rejected":
        return "مرفوض";
      default:
        return requestStatus;
    }
  };

  // تحديد لون الحالة
  const getStatusColor = (requestStatus) => {
    if (!requestStatus) return "warning";

    switch (requestStatus) {
      case "مقبول":
        return "success";
      case "مرفوض":
        return "error";
      default:
        return "warning";
    }
  };

  // Dialog handlers
  const handleAcceptDialogOpen = () => setAcceptDialogOpen(true);
  const handleAcceptDialogClose = () => {
    setAcceptDialogOpen(false);
    setAcceptanceComment("");
  };

  const handleRejectDialogClose = () => {
    setRejectDialogOpen(false);
    setRejectionReason("");
  };

  // تحديث حالة الطلب مع التعليق    Add Admin Response
  const updateRequestStatus = async (requestId, requestStatus, comment) => {
    try {
      if (!requestId) {
        toast.error("رقم الطلب غير صالح");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");
      const action = requestStatus === "مقبول" ? "Approve" : "Reject";
      const responseText =
        comment || (action === "Approve" ? "تم اكمال طلبك بنجاح" : "");

      const response = await fetch(
        "https://government-services.runasp.net/Admin/Response-To-Request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            requestId,
            responseText,
            action,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      setSelectedRequest((prevRequest) => ({
        ...prevRequest,
        requestStatus,
        adminComment: responseText,
      }));
      setAdminComment(responseText);

      toast.success(
        `تم ${requestStatus === "مقبول" ? "قبول" : "رفض"} الطلب بنجاح`
      );

      if (requestStatus === "مرفوض") {
        handleRejectDialogClose();
      } else {
        handleAcceptDialogClose();
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
    if (!field) return "";

    try {
      switch (field.valueType?.toLowerCase()) {
        case "date":
          return field.fieldValueDate
            ? new Date(field.fieldValueDate).toLocaleDateString("ar-EG")
            : "";
        case "int":
          return field.fieldValueInt?.toLocaleString("ar-EG") || "";
        case "float":
          return field.fieldValueFloat?.toLocaleString("ar-EG") || "";
        case "string":
          return field.fieldValueString || "";
        default:
          // اختيار القيمة غير الفارغة
          return (
            field.fieldValueString ||
            field.fieldValueInt?.toString() ||
            field.fieldValueFloat?.toString() ||
            (field.fieldValueDate
              ? new Date(field.fieldValueDate).toLocaleDateString("ar-EG")
              : "") ||
            ""
          );
      }
    } catch (error) {
      console.error(`Error processing field value: ${field.filedName}`, error);
      return "";
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
            serviceName: details.serviceName || "خدمة غير معروفة",
            requestDate: details.requestDate
              ? new Date(details.requestDate).toLocaleDateString("ar-EG")
              : "تاريخ غير معروف",
            requestStatus: mapStatusToArabic(
              details.requestStatus || "Pending"
            ),
            adminComment: details.adminComment || "",
            fullName: `${details.firstName || ""} ${
              details.lastName || ""
            }`.trim(),
            fieldValueString: details.fieldValueString || "",
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

  // Action handlers
  const handleAcceptRequest = async () => {
    if (!acceptanceComment.trim()) {
      toast.error("الرجاء إدخال ملاحظات القبول");
      return;
    }
    if (!selectedRequest?.requestId) {
      toast.error("لا يوجد طلب محدد");
      return;
    }
    await updateRequestStatus(
      selectedRequest.requestId,
      "مقبول",
      acceptanceComment
    );
    setAcceptDialogOpen(false);
    setAcceptanceComment("");
  };

  const handleRejectRequest = async () => {
    if (!rejectionReason.trim()) {
      toast.error("الرجاء إدخال سبب الرفض");
      return;
    }
    if (!selectedRequest?.requestId) {
      toast.error("لا يوجد طلب محدد");
      return;
    }
    await updateRequestStatus(
      selectedRequest.requestId,
      "مرفوض",
      rejectionReason
    );
    setAdminComment(rejectionReason);
    setRejectDialogOpen(false);
    setRejectionReason("");
  };

  // Helper function to get file icon
  const getFileIcon = (fileName) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📘";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📎";
    }
  };

  if (loading) {
    return (
      <>
        <HeaderTemp />
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#f8fafc",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderTemp />
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", py: 4 }}>
          <Container maxWidth="md">
            <Card>
              <CardContent>
                <Typography variant="h6" color="error" align="center">
                  {error}
                </Typography>
                <Box sx={{ textAlign: "center", mt: 2 }}>
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
        </Box>
      </>
    );
  }

  return (
    <>
      <HeaderTemp />
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        {/* Header Section */}
        <Box
          sx={{ backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}
        >
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                لوحة التحكم › الطلبات › طلب #{requestId}
              </Typography>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ color: "#64748b" }}
              >
                العودة إلى الطلبات
              </Button>
            </Box>

            <Typography variant="h4" fontWeight="bold" color="text.primary">
              تفاصيل الطلب
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {selectedRequest && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Request Header Card */}
              <Card sx={{ mb: 3, border: "1px solid #e2e8f0" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                        {selectedRequest.serviceName}
                      </Typography>
                      <Box
                        sx={{ display: "flex", gap: 4, alignItems: "center" }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          📅 تم التقديم في {selectedRequest.requestDate}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          # رقم الطلب: {selectedRequest.requestId}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={selectedRequest.requestStatus}
                      color={getStatusColor(selectedRequest.requestStatus)}
                      size="medium"
                      sx={{
                        fontWeight: "bold",
                        "&::before": {
                          content: '""',
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor:
                            selectedRequest.requestStatus === "قيد الانتظار"
                              ? "#f59e0b"
                              : "inherit",
                          marginRight: 1,
                          display: "inline-block",
                        },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {/* Submitted Information */}
                  <Card sx={{ mb: 3, border: "1px solid #e2e8f0" }}>
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #e2e8f0",
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PersonIcon /> المعلومات المقدمة
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      {requestFields.length > 0 ? (
                        <Grid container spacing={3}>
                          {requestFields.map((field) => (
                            <Grid item xs={12} sm={6} key={field.fieldId}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  fontWeight={500}
                                >
                                  {field.filedName}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  fontWeight={500}
                                >
                                  نوع البيانات
                                </Typography>
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mb: 0.5,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  color="text.primary"
                                  fontWeight="500"
                                >
                                  {processFieldValue(field)}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  color="text.primary"
                                  fontWeight="500"
                                >
                                  {field.htmlType || field.valueType || "نص"}
                                </Typography>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                        >
                          لا توجد بيانات مرفقة لهذا الطلب
                        </Typography>
                      )}
                    </CardContent>
                  </Card>

                  {/* Attached Files */}
                  <Card sx={{ mb: 3, border: "1px solid #e2e8f0" }}>
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #e2e8f0",
                        backgroundColor: "#f8fafc",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <AttachFileIcon /> الملفات المرفقة
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      {requestFiles.length > 0 ? (
                        <Box>
                          {requestFiles.map((file) => (
                            <Box
                              key={file.id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2,
                                border: "1px solid #e2e8f0",
                                borderRadius: 2,
                                mb: 2,
                                "&:hover": {
                                  backgroundColor: "#f8fafc",
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Typography sx={{ fontSize: "1.5rem" }}>
                                  {getFileIcon(file.fileName)}
                                </Typography>
                                <Box>
                                  <Typography variant="body1" fontWeight="500">
                                    {file.fileName}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {file.contentType}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  size="small"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => downloadFile(file.id)}
                                  sx={{ color: "#64748b" }}
                                ></Button>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                        >
                          لا توجد ملفات مرفقة لهذا الطلب
                        </Typography>
                      )}
                    </CardContent>
                  </Card>

                  {/* Admin Notes */}
                  {(selectedRequest.requestStatus === "مقبول" ||
                    selectedRequest.requestStatus === "مرفوض") &&
                    adminComment && (
                      <Card sx={{ mb: 3, border: "1px solid #e2e8f0" }}>
                        <Box
                          sx={{
                            p: 2,
                            borderBottom: "1px solid #e2e8f0",
                            backgroundColor: "#fef2f2",
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="error"
                          >
                            ملاحظات الإدارة
                          </Typography>
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={adminComment}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </CardContent>
                      </Card>
                    )}

                  {/* Actions */}
                  {selectedRequest.requestStatus === "قيد الانتظار" && (
                    <Card sx={{ border: "1px solid #e2e8f0" }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row-reverse",
                            gap: 10,
                          }}
                        >
                          <Button
                            variant="contained"
                            color="error"
                            size="large"
                            onClick={() => setRejectDialogOpen(true)}
                            disabled={loading}
                            sx={{ py: 1.5, flex: 1 }}
                          >
                            {loading ? (
                              <CircularProgress size={20} />
                            ) : (
                              "✕ رفض الطلب"
                            )}
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={handleAcceptDialogOpen}
                            disabled={loading}
                            sx={{ py: 1.5, flex: 1 }}
                          >
                            {loading ? (
                              <CircularProgress size={20} />
                            ) : (
                              "✓ قبول الطلب"
                            )}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </motion.div>
          )}
        </Container>
      </Box>
      {/* Accept Dialog */}
      <Dialog
        open={acceptDialogOpen}
        onClose={handleAcceptDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            fontFamily: "Arial, sans-serif",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "right", direction: "rtl", pb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "success.light",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckIcon sx={{ color: "success.main", fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: "bold", fontFamily: "Arial, sans-serif" }}
              >
                قبول الطلب
              </Typography>
            </Box>
            <IconButton
              onClick={handleAcceptDialogClose}
              sx={{ color: "grey.400" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ direction: "rtl" }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontFamily: "Arial, sans-serif" }}
          >
            الرجاء تقديم ملاحظات لقبول هذا الطلب. سيتم إرسال هذه الملاحظات
            للمواطن.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontFamily: "Arial, sans-serif",
              }}
            >
              ملاحظات القبول
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={acceptanceComment}
              onChange={(e) => setAcceptanceComment(e.target.value)}
              placeholder="الرجاء شرح ملاحظات قبول هذا الطلب..."
              variant="outlined"
              InputProps={{
                style: {
                  direction: "rtl",
                  fontFamily: "Arial, sans-serif",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "success.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "success.main",
                  },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "grey.600",
                mt: 1,
                display: "block",
                fontFamily: "Arial, sans-serif",
              }}
            >
              سيتم إرسال هذه الرسالة للمتقدم
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mb: 3, direction: "rtl" }}>
            <Typography sx={{ fontFamily: "Arial, sans-serif" }}>
              سيتم إرسال إشعار للمواطن بقبول الطلب
            </Typography>
          </Alert>

          <Paper elevation={1} sx={{ p: 2, bgcolor: "grey.50" }}>
            <Typography
              variant="body2"
              sx={{ color: "grey.600", mb: 1, fontFamily: "Arial, sans-serif" }}
            >
              تفاصيل الطلب:
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                mb: 1,
                fontFamily: "Arial, sans-serif",
              }}
            >
              {selectedRequest?.serviceName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "grey.600", fontFamily: "Arial, sans-serif" }}
            >
              رقم الطلب: #{selectedRequest?.id}
            </Typography>
          </Paper>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2, direction: "rtl" }}>
          <Button
            onClick={handleAcceptDialogClose}
            variant="outlined"
            disabled={loading}
            sx={{
              flex: 1,
              fontFamily: "Arial, sans-serif",
            }}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleAcceptRequest}
            variant="contained"
            color="success"
            disabled={loading || !acceptanceComment.trim()}
            sx={{
              flex: 1,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                جاري المعالجة...
              </Box>
            ) : (
              "تأكيد القبول"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleRejectDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            fontFamily: "Arial, sans-serif",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "right", direction: "rtl", pb: 1 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "error.light",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ClearIcon sx={{ color: "error.main", fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: "bold", fontFamily: "Arial, sans-serif" }}
              >
                رفض الطلب
              </Typography>
            </Box>
            <IconButton
              onClick={handleRejectDialogClose}
              sx={{ color: "grey.400" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ direction: "rtl" }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontFamily: "Arial, sans-serif" }}
          >
            الرجاء تقديم سبب لرفض هذا الطلب. سيتم إرسال هذا السبب للمواطن.
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                mb: 2,
                fontFamily: "Arial, sans-serif",
              }}
            >
              سبب الرفض
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="الرجاء شرح سبب رفض هذا الطلب..."
              variant="outlined"
              InputProps={{
                style: {
                  direction: "rtl",
                  fontFamily: "Arial, sans-serif",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "error.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "error.main",
                  },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "grey.600",
                mt: 1,
                display: "block",
                fontFamily: "Arial, sans-serif",
              }}
            >
              سيتم إرسال هذه الرسالة للمتقدم
            </Typography>
          </Box>

          <Alert severity="warning" sx={{ direction: "rtl" }}>
            <Typography sx={{ fontFamily: "Arial, sans-serif" }}>
              تأكد من كتابة سبب واضح ومفهوم للرفض
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2, direction: "rtl" }}>
          <Button
            onClick={handleRejectDialogClose}
            variant="outlined"
            disabled={loading}
            sx={{
              flex: 1,
              fontFamily: "Arial, sans-serif",
            }}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleRejectRequest}
            variant="contained"
            color="error"
            disabled={loading || !rejectionReason.trim()}
            sx={{
              flex: 1,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {loading ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={20} color="inherit" />
                جاري المعالجة...
              </Box>
            ) : (
              "تأكيد الرفض"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
