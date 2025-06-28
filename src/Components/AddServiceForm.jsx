import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Checkbox,
  FormControlLabel,
  Grid,
  Container,
} from "@mui/material";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Plus,
  FileText,
  Paperclip,
} from "lucide-react";

const AddServiceForm = () => {
  const [serviceImage, setServiceImage] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceDescription: "",
    department: "",
    processingTime: "7",
    processingUnit: "أيام",
    priority: "عادي",
  });

  const departments = [
    "اختر القسم",
    "وزارة الصحة",
    "مكتب التراخيص",
    "وزارة التعليم",
    "هيئة النقل",
    "خدمات المرافق",
  ];

  const fieldTypes = ["text", "number", "date"];
  const priorities = ["عالي", "عادي"];
  const units = ["أيام", "ساعات", "أسابيع"];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setServiceImage(file);
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
    }));
    setAttachedFiles([...attachedFiles, ...newFiles]);
  };

  const removeFile = (id) => {
    setAttachedFiles(attachedFiles.filter((file) => file.id !== id));
  };

  const addFormField = () => {
    setFormFields([
      ...formFields,
      { id: Date.now(), type: "text", label: "", required: false },
    ]);
  };

  const updateFormField = (id, changes) => {
    setFormFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, ...changes } : field))
    );
  };

  const removeFormField = (id) => {
    setFormFields(formFields.filter((field) => field.id !== id));
  };

  return (
    <Box dir="rtl" sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Container maxWidth={false} sx={{ py: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton sx={{ mr: 2, color: "#666" }}>
            <ArrowLeft />
          </IconButton>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "#1a1a1a",
                fontSize: "24px",
                mb: 0.5,
              }}
            >
              خدمة حكومية جديدة
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", fontSize: "14px" }}
            >
              إنشاء خدمة جديدة للمواطنين لطلبها
            </Typography>
          </Box>
        </Box>

        {/* Main Grid Layout */}
        <Grid container spacing={4}>
          {/* Left Column - Main Form */}
          <Grid item xs={12} lg={8}>
            <Card
              sx={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e1e5e9",
                borderRadius: 2,
              }}
            >
              {/* Service Image Section */}
              <CardContent sx={{ borderBottom: "1px solid #e1e5e9" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 3, fontSize: "18px" }}
                >
                  صورة الخدمة
                </Typography>

                {/* عرض صورة الخدمة أو واجهة الرفع */}
                {serviceImage ? (
                  <Box
                    sx={{ position: "relative", textAlign: "center", py: 2 }}
                  >
                    <img
                      src={URL.createObjectURL(serviceImage)}
                      alt="Service"
                      style={{
                        maxWidth: "100%",
                        borderRadius: "12px",
                        maxHeight: "250px",
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => setServiceImage(null)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        backgroundColor: "#fff",
                        boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                        "&:hover": {
                          backgroundColor: "#fef2f2",
                        },
                      }}
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    onClick={() =>
                      document.getElementById("uploadImage").click()
                    }
                    sx={{
                      border: "2px dashed #d1d5db",
                      borderRadius: 2,
                      py: 5,
                      px: 3,
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: "#fafbfc",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "#3b82f6",
                        backgroundColor: "#f8faff",
                      },
                    }}
                  >
                    <input
                      type="file"
                      id="uploadImage"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: "#e5e7eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <Upload size={20} color="#9ca3af" />
                    </Box>
                    <Typography sx={{ fontWeight: 500, mb: 1 }}>
                      اضغط للرفع أو اسحب الملف هنا
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#6b7280" }}>
                      PNG, JPG, WEBP حتى 10 ميجا
                    </Typography>
                  </Box>
                )}
              </CardContent>

              {/* Basic Information Section */}
              <CardContent sx={{ borderBottom: "1px solid #e1e5e9" }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 4, fontSize: "18px" }}
                >
                  المعلومات الأساسية
                </Typography>

                <TextField
                  fullWidth
                  label="اسم الخدمة"
                  placeholder="أدخل اسم الخدمة"
                  value={formData.serviceName}
                  onChange={(e) =>
                    setFormData({ ...formData, serviceName: e.target.value })
                  }
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="وصف الخدمة"
                  placeholder="وصف الخدمة والمتطلبات"
                  value={formData.serviceDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceDescription: e.target.value,
                    })
                  }
                  sx={{ mb: 4 }}
                />

                {/* القسم في صف خاص به */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>القسم</InputLabel>
                      <Select
                        value={formData.department}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department: e.target.value,
                          })
                        }
                        label="القسم"
                      >
                        {departments.map((dept, i) => (
                          <MenuItem value={dept} key={i} disabled={i === 0}>
                            {dept}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {/* مدة التنفيذ في صف منفصل */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      sx={{ color: "#374151", mb: 1, fontWeight: 500 }}
                    >
                      مدة التنفيذ
                    </Typography>
                    <Box display="flex" gap={1}>
                      <TextField
                        type="number"
                        value={formData.processingTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            processingTime: e.target.value,
                          })
                        }
                        sx={{ flex: 1 }}
                        size="medium"
                      />
                      <FormControl sx={{ minWidth: 120 }}>
                        <Select
                          value={formData.processingUnit}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              processingUnit: e.target.value,
                            })
                          }
                          size="medium"
                        >
                          {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                </Grid>

                <FormControl fullWidth>
                  <InputLabel>الأولوية</InputLabel>
                  <Select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    label="الأولوية"
                  >
                    {priorities.map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>

              {/* Attached Files Section */}
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 3, fontSize: "18px" }}
                >
                  الملفات المرفقة
                </Typography>

                <Box
                  onClick={() => document.getElementById("uploadFiles").click()}
                  sx={{
                    border: "2px dashed #d1d5db",
                    borderRadius: 2,
                    py: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: "#fafbfc",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <input
                    type="file"
                    id="uploadFiles"
                    hidden
                    multiple
                    onChange={handleFileAttach}
                  />
                  <Paperclip size={16} color="#6b7280" />
                  <Typography sx={{ color: "#6b7280", fontSize: "14px" }}>
                    إرفاق ملفات
                  </Typography>
                </Box>

                {attachedFiles.map((file) => (
                  <Box
                    key={file.id}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      mb: 2,
                      border: "1px solid #e5e7eb",
                      borderRadius: 1,
                      p: 2,
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <FileText size={16} color="#dc2626" />
                      <Box>
                        <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                          {file.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#6b7280", fontSize: "12px" }}
                        >
                          {file.size}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => removeFile(file.id)}
                      sx={{ color: "#dc2626" }}
                    >
                      <Trash2 size={14} />
                    </IconButton>
                  </Box>
                ))}

                {/* Action Buttons */}
                <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                  <Button
                    variant="outlined"
                    sx={{
                      color: "#6b7280",
                      borderColor: "#d1d5db",
                      px: 3,
                    }}
                  >
                    إلغاء
                  </Button>
                  <Button variant="outlined" sx={{ px: 3 }}>
                    حفظ كمسودة
                  </Button>
                  <Button variant="contained" sx={{ px: 3 }}>
                    حفظ الخدمة
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Citizen Form Fields */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                border: "1px solid #e1e5e9",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, fontSize: "18px" }}
                  >
                    حقول النموذج للمواطن
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<Plus size={14} />}
                    onClick={addFormField}
                    sx={{
                      fontSize: "12px",
                      textTransform: "none",
                      borderRadius: 1,
                    }}
                  >
                    إضافة حقل
                  </Button>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#6b7280",
                    mb: 4,
                    fontSize: "13px",
                  }}
                >
                  ستظهر هذه الحقول في نموذج طلب المواطن.
                </Typography>

                {formFields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 2,
                      p: 3,
                      mb: 3,
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={3}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor: "#e5e7eb",
                            borderRadius: 0.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              backgroundColor: "#9ca3af",
                              borderRadius: 0.25,
                            }}
                          />
                        </Box>
                        <Typography
                          sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                          }}
                        >
                          الحقل {index + 1}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => removeFormField(field.id)}
                        sx={{ color: "#dc2626" }}
                      >
                        <Trash2 size={14} />
                      </IconButton>
                    </Box>

                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel sx={{ fontSize: "14px" }}>
                        نوع الحقل
                      </InputLabel>
                      <Select
                        value={field.type}
                        onChange={(e) =>
                          updateFormField(field.id, { type: e.target.value })
                        }
                        label="نوع الحقل"
                        size="small"
                      >
                        {fieldTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="عنوان الحقل"
                      placeholder="أدخل العنوان"
                      value={field.label}
                      onChange={(e) =>
                        updateFormField(field.id, { label: e.target.value })
                      }
                      size="small"
                      sx={{ mb: 3 }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.required}
                          onChange={(e) =>
                            updateFormField(field.id, {
                              required: e.target.checked,
                            })
                          }
                          size="small"
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: "14px" }}>
                          حقل مطلوب
                        </Typography>
                      }
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AddServiceForm;
