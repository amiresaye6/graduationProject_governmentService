import React, { useState, useEffect } from "react";
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
  Grid,
  Container,
} from "@mui/material";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

const AddServiceForm = ({
  initialData = null,
  isEdit = false,
  serviceId = null,
  onSuccess,
}) => {
  const parseProcessingTime = (timeStr = "7 أيام") => {
    const mapWordsToNumbers = {
      واحد: "1",
      واحدة: "1",
      اثنين: "2",
      اثنتين: "2",
      ثلاثة: "3",
      أسبوع: "7",
      "أسبوع واحد": "7",
      أسبوعان: "14",
    };

    // نظف النص
    const cleanTime = timeStr.trim();

    // لو فيه رقم في البداية
    const parts = cleanTime.split(" ");
    const hasNumber = !isNaN(parts[0]);

    if (hasNumber) {
      return {
        time: parts[0],
        unit: parts[1] || "أيام",
      };
    }

    // جرب تطابق مع الكلمات
    if (mapWordsToNumbers[cleanTime]) {
      return {
        time: mapWordsToNumbers[cleanTime],
        unit: "أيام", // افتراضياً نحول "أسبوعان" إلى "14 أيام"
      };
    }

    return {
      time: "7",
      unit: "أيام",
    };
  };

  const { time, unit } = parseProcessingTime(initialData?.processingTime);
  const [serviceImage, setServiceImage] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState(
    initialData?.files?.map((f, i) => ({
      id: Date.now() + i,
      fileName: f.fileName || "",
      fileType: f.fileType || "",
    })) || []
  );
  const [formFields, setFormFields] = useState(
    initialData?.serviceFields?.map((field, i) => ({
      id: Date.now() + i,
      type: field.htmlType || "text",
      label: field.fieldName || "",
      description: field.description || "",
      required: false,
    })) || []
  );
  const [formData, setFormData] = useState({
    serviceName: initialData?.serviceName || "",
    serviceDescription: initialData?.serviceDescription || "",
    department: initialData?.category || "",
    processingTime: time,
    processingUnit: unit,
    fees: initialData?.fee || "",
    contact: initialData?.contactInfo || "",
  });

  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "https://government-services.runasp.net/api/Services/Category",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setDepartments(data);
        }
      } catch (err) {
        console.error("فشل في تحميل الأقسام:", err);
      }
    };

    fetchDepartments();
  }, []);

  const fieldTypes = ["text", "number", "date"];
  const units = ["أيام", "ساعات", "أسابيع"];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setServiceImage(file);
  };

  const addFormField = () => {
    setFormFields([
      ...formFields,
      {
        id: Date.now(),
        type: "text",
        label: "",
        description: "",
        required: false,
      },
    ]);
  };

  const updateFormField = (id, changes) => {
    setFormFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, ...changes } : field))
    );
  };
  const handleAddFileField = () => {
    setAttachedFiles([
      ...attachedFiles,
      { id: Date.now(), fileName: "", fileType: "" },
    ]);
  };
  const handleFileChange = (id, key, value) => {
    setAttachedFiles((prev) =>
      prev.map((file) => (file.id === id ? { ...file, [key]: value } : file))
    );
  };
  const handleRemoveFile = (id) => {
    setAttachedFiles(attachedFiles.filter((file) => file.id !== id));
  };
  const removeFormField = (id) => {
    setFormFields(formFields.filter((field) => field.id !== id));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const token = localStorage.getItem("token");

    if (isEdit && serviceId) {
      try {
        // ✅ 1. تحديث بيانات الخدمة الأساسية
        await fetch(
          `https://government-services.runasp.net/api/Services/${serviceId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              serviceName: formData.serviceName,
              serviceDescription: formData.serviceDescription,
              category: formData.department,
              fee: parseFloat(formData.fees || 0),
              processingTime: `${formData.processingTime} ${formData.processingUnit}`,
              contactInfo: formData.contact,
            }),
          }
        );

        // ✅ 2. تحديث الحقول المطلوبة
        await fetch(
          `https://government-services.runasp.net/api/Fields/Required/Service/${serviceId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              serviceFields: formFields.map((field) => ({
                fieldName: field.label,
                description: field.description,
                htmlType: field.type,
              })),
            }),
          }
        );

        // ✅ 3. تحديث الملفات فقط لو فيها ملفات جديدة فعلًا
        const hasRealFiles = attachedFiles.some((f) => f.file);
        if (!hasRealFiles) {
          toast.custom((t) => (
            <div
              style={{
                background: "#fff3cd",
                color: "#856404",
                padding: "16px 20px",
                borderRadius: "8px",
                border: "1px solid #ffeeba",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
                fontWeight: 500,
                direction: "rtl",
                maxWidth: "400px",
                margin: "auto",
              }}
            >
              ⚠️ لم يتم إرفاق ملفات جديدة. الملفات القديمة ستظل كما هي.
            </div>
          ));
        } else {
          const fileData = new FormData();
          attachedFiles.forEach((fileObj) => {
            if (fileObj.file) {
              fileData.append("newFiles", fileObj.file);
            }
          });

          await fetch(
            `https://government-services.runasp.net/api/Files/Required/Service/${serviceId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: fileData,
            }
          );
        }

        toast.success("تم تحديث الخدمة بنجاح ✅");
        onSuccess?.();
      } catch (err) {
        console.error("Update Error:", err);
        toast.error("فشل تعديل الخدمة ❌");
      } finally {
        setIsSubmitting(false);
      }

      return; // علشان ما يكملش كود POST
    }

    // ===========================
    // ✅ حالة الإضافة الجديدة (POST)
    const data = new FormData();

    // ✅ 1–6: البيانات الأساسية أولاً
    data.append("ServiceName", formData.serviceName);
    data.append("ServiceDescription", formData.serviceDescription);
    data.append("Fee", formData.fees || "0");
    data.append(
      "ProcessingTime",
      `${formData.processingTime} ${formData.processingUnit}`
    );
    data.append("category", formData.department);
    data.append("ContactInfo", formData.contact || "");

    // ✅ 7: الملفات المرفقة (لو موجودة)
    if (attachedFiles.length === 0) {
      toast.error("يجب إرفاق ملف واحد على الأقل.");
      setIsSubmitting(false);
      return;
    }
    attachedFiles.forEach((fileObj, index) => {
      data.append(`Files[${index}].FileName`, fileObj.fileName.trim());
      data.append(`Files[${index}].FileType`, fileObj.fileType.trim());
    });

    // ✅ 8: الحقول المطلوبة
    if (formFields.length === 0) {
      toast.error("يجب إضافة حقل واحد على الأقل في نموذج المواطن.");
      setIsSubmitting(false);
      return;
    }
    formFields.forEach((field, index) => {
      data.append(`ServiceFields[${index}].FieldName`, field.label.trim());
      data.append(
        `ServiceFields[${index}].Description`,
        field.description.trim()
      );
      data.append(`ServiceFields[${index}].HtmlType`, field.type.trim());
    });

    // ✅ 9: صورة الخدمة في النهاية
    if (serviceImage) {
      data.append("ServiceImage", serviceImage);
    }

    try {
      const response = await fetch(
        "https://government-services.runasp.net/api/Services",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("تمت إضافة الخدمة:", result);
        toast.success("تم حفظ الخدمة بنجاح ✅");
        onSuccess?.();
      } else {
        const text = await response.text();
        console.error("خطأ:", text);
        toast.error("فشل حفظ الخدمة ❌");
      }
    } catch (error) {
      console.error("Exception:", error);
      toast.error("حدث خطأ أثناء الإرسال ❗");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchRequiredData = async () => {
      if (!serviceId) return;

      const token = localStorage.getItem("token");

      try {
        // جلب الحقول المطلوبة
        const fieldsRes = await fetch(
          `https://government-services.runasp.net/api/Fields/Required/Service/${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fieldsData = await fieldsRes.json();

        if (Array.isArray(fieldsData)) {
          setFormFields(
            fieldsData.map((field, index) => ({
              id: Date.now() + index,
              type: field.htmlType || "text",
              label: field.filedName || "",
              description: field.description || "",
              required: false,
            }))
          );
        }

        // جلب الملفات المطلوبة
        const filesRes = await fetch(
          `https://government-services.runasp.net/api/Files/Required/Service/${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const filesData = await filesRes.json();

        if (Array.isArray(filesData)) {
          setAttachedFiles(
            filesData.map((file, index) => ({
              id: Date.now() + index,
              name:
                file.fileName +
                (file.fileExtension ? `.${file.fileExtension}` : ""),
              size: "غير متاح", // لو ما فيش حجم في الريسبونس
              file: null, // مش هنقدر نرفعها كملف حقيقي
            }))
          );
        }
      } catch (err) {
        console.error("حدث خطأ أثناء جلب الحقول أو الملفات:", err);
      }
    };

    fetchRequiredData();
  }, [serviceId]);

  return (
    <Box dir="rtl" sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Container maxWidth={false} sx={{ py: 3 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton
            sx={{ mr: 2, color: "#666" }}
            onClick={() => window.history.back()}
          >
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
                {/* القسم والحقول الإضافية */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  {/* حقل القسم */}
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
                        <MenuItem value="" disabled>
                          اختر القسم
                        </MenuItem>
                        {departments.map((dept, i) => (
                          <MenuItem value={dept.category.trim()} key={i}>
                            {dept.category.trim()}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* حقل الرسوم */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="رسوم الخدمة (جنيه مصري)"
                      placeholder="أدخل قيمة الرسوم"
                      value={formData.fees || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, fees: e.target.value })
                      }
                    />
                  </Grid>

                  {/* حقل معلومات التواصل */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="معلومات التواصل"
                      placeholder="رقم الهاتف أو البريد الإلكتروني"
                      value={formData.contact || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, contact: e.target.value })
                      }
                    />
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

                {/* <FormControl fullWidth>
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
                </FormControl> */}
              </CardContent>

              {/* Attached Files Section */}
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, fontSize: 18 }}
                  >
                    الملفات المرفقة
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleAddFileField}
                    sx={{
                      fontSize: 14,
                      textTransform: "none",
                      borderRadius: 1,
                    }}
                  >
                    إضافة ملف
                  </Button>
                </Box>

                {attachedFiles.length === 0 && (
                  <Typography color="text.secondary" mb={2}>
                    لم يتم إضافة ملفات بعد
                  </Typography>
                )}

                {attachedFiles.map((file, index) => (
                  <Grid
                    container
                    spacing={2}
                    key={file.id}
                    sx={{ mb: 2 }}
                    alignItems="center"
                  >
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        label={`اسم الملف ${index + 1}`}
                        value={file.fileName}
                        onChange={(e) =>
                          handleFileChange(file.id, "fileName", e.target.value)
                        }
                        size="medium"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth size="medium">
                        <InputLabel>نوع الملف</InputLabel>
                        <Select
                          value={file.fileType}
                          label="نوع الملف"
                          onChange={(e) =>
                            handleFileChange(
                              file.id,
                              "fileType",
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value="pdf">pdf</MenuItem>
                          <MenuItem value="Image">Image</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleRemoveFile(file.id)}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Grid>
                  </Grid>
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
                    onClick={() => window.history.back()}
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ px: 3 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "جارٍ الحفظ..." : "حفظ الخدمة"}
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

                    <TextField
                      fullWidth
                      label="وصف الحقل"
                      placeholder="أدخل الوصف "
                      value={field.description}
                      onChange={(e) =>
                        updateFormField(field.id, {
                          description: e.target.value,
                        })
                      }
                      size="small"
                      sx={{ mb: 3 }}
                    />

                    {/* <FormControlLabel
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
                    /> */}
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
