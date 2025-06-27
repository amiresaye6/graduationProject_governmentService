import React, { useState, useEffect } from "react";
import HeaderTemp from "./HeaderTemp";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const DynamicForm = () => {
  // استخدام useLocation للحصول على البيانات المرسلة من صفحة الخدمات
  const location = useLocation();
  const service = location.state?.service;
  const serviceId = service?.id;

  const [formSchema, setFormSchema] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [serviceDetails, setServiceDetails] = useState(null);

  useEffect(() => {
    // إذا لم يتم تمرير بيانات الخدمة، عرض رسالة خطأ
    if (!serviceId) {
      toast.error("لم يتم تحديد الخدمة المطلوبة");
      setIsDataLoading(false);
      return;
    }

    setServiceDetails(service);

    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        const token = localStorage.getItem('token');

        // تحضير الهيدرز مع التوكن
        const headers = {
          "Content-Type": "application/json",
        };
        // جلب الحقول المطلوبة للخدمة
        const fieldsResponse = await fetch(
          `https://government-services.runasp.net/api/Fields/Required/Service/${serviceId}`,
          {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!fieldsResponse.ok) {
          throw new Error(
            `API error when fetching fields: ${fieldsResponse.status}`
          );
        }

        const fieldsData = await fieldsResponse.json();
        console.log("Fields Data:", fieldsData);
        setFormSchema(fieldsData);
        // جلب المستندات المطلوبة للخدمة

           
          const docsResponse = await fetch(
          `https://government-services.runasp.net/api/Files/Required/Service/${serviceId}`,
          {
            method: "GET",
             headers: {
                'Authorization': `Bearer ${token}`
              },
          }
        );

        if (!docsResponse.ok) {
          throw new Error(
            `API error when fetching documents: ${docsResponse.status}`
          );
        }

        const docsData = await docsResponse.json();
        console.log("Documents Data:", docsData);
        setDocuments(docsData);
      } catch (err) {
        console.error("Error fetching form data:", err);
        toast.error(
          "حدث خطأ في جلب بيانات النموذج من الخادم. يرجى المحاولة مرة أخرى لاحقاً."
        );
      } finally {
        setIsDataLoading(false);
      }
    };

    if (serviceId) fetchData();
  }, [service, serviceId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value; // القيمة الافتراضية

    // تحديد النوع بناءً على htmlType من formSchema
    const field = formSchema.find((f) => f.filedName === name);
    if (field) {
      switch (field.htmlType) {
        case "number":
          processedValue = value ? parseInt(value) : null; // تحويل لـ int
          break;
        case "date":
          processedValue = value ? new Date(value) : null; // تحويل لـ Date
          break;
        default:
          processedValue = value; // يبقى string
      }
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e, documentId) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        // Max 10MB
        setUploadedFiles((prev) => ({ ...prev, [documentId]: file }));

        // مسح رسالة الخطأ عند تحميل ملف
        if (errors[`document_${documentId}`]) {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`document_${documentId}`];
            return newErrors;
          });
        }
      } else {
        toast.error("حجم الملف يجب أن يكون أقل من 10 ميجابايت");
      }
    }
  };

  const validateForm = () => {
    const validationErrors = {};

    // التحقق من الحقول المطلوبة
    formSchema.forEach((field) => {
      if (field.required && !formData[field.filedName]) {
        validationErrors[field.filedName] = "هذا الحقل مطلوب";
      }
    });

    // التحقق من المستندات المطلوبة
    documents.forEach((doc) => {
      if (doc.required && !uploadedFiles[doc.id]) {
        validationErrors[`document_${doc.id}`] = "هذا المستند مطلوب";
      }
    });

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من صحة البيانات
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("يرجى إكمال جميع الحقول المطلوبة");
      return;
    }

    try {
      setLoading(true);

      // إعداد البيانات وفقًا لتوثيق API المحدد
      const formDataToSend = new FormData();

      // إضافة معرف الخدمة
      formDataToSend.append("ServiceId", serviceId);

      // إضافة بيانات الحقول بتنسيق صحيح
      // بناءً على التوثيق: ServiceData[0].FieldId و ServiceData[0].FieldValueString
      let index = 0;

      formSchema.forEach((field) => {
        if (formData[field.filedName]) {
          const value = formData[field.filedName];
          formDataToSend.append(`ServiceData[${index}].FieldId`, field.id);
          if (field.htmlType === "date" && value instanceof Date) {
            formDataToSend.append(
              `ServiceData[${index}].FieldValueDate`,
              value.toISOString()
            );
          } else if (field.htmlType === "number" && typeof value === "number") {
            formDataToSend.append(`ServiceData[${index}].FieldValueInt`, value);
          } else {
            formDataToSend.append(
              `ServiceData[${index}].FieldValueString`,
              value.toString()
            );
          }
          index++;
        }
      });

      // إضافة الملفات (بناءً على التوثيق، يستخدم اسم "files" فقط)
      Object.entries(uploadedFiles).forEach(([docId, file]) => {
        formDataToSend.append("files", file);
      });

      console.log("بيانات الطلب المرسلة:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      // إرسال الطلب إلى API
      const response = await fetch(
        "https://government-services.runasp.net/api/Requests/Submit",
        {
          method: "POST",
          body: formDataToSend,
          // بدون Authorization حسب طلبك
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("تم إرسال الطلب بنجاح:", result);
        toast.success("تم إرسال الطلب بنجاح");

        // عرض رقم الطلب للمستخدم إذا كان متاحًا
        if (result.requestId) {
          toast.success(`رقم الطلب: ${result.requestId}`);
        }

        // الانتقال إلى صفحة طلباتي بعد 2 ثانية
        setTimeout(() => {
          window.location.href = "/my-requests";
        }, 2000);
      } else {
        // معالجة الاستجابة غير الناجحة
        let errorMessage = "فشل في إرسال الطلب";

        try {
          const errorData = await response.json();

          console.error("خطأ في إرسال الطلب:", response.status, errorData);

          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            // استخراج رسائل الخطأ من object
            const errors = [];
            for (const field in errorData.errors) {
              if (Array.isArray(errorData.errors[field])) {
                errors.push(...errorData.errors[field]);
              }
            }

            if (errors.length > 0) {
              errorMessage = errors.join("\n");
            }
          }
        } catch (jsonError) {
          console.error("خطأ في تحليل استجابة الخطأ:", jsonError);
        }

        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("خطأ أثناء إرسال النموذج:", err);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderTemp />
      <div className="container my-5">
        {/* عرض تفاصيل الخدمة إذا كانت متاحة */}
        {serviceDetails && (
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">{serviceDetails.serviceName}</h3>
            </div>
            <div className="card-body">
              <p className="card-text">{serviceDetails.serviceDescription}</p>
            </div>
          </div>
        )}
        {/* بطاقة النموذج الرئيسية */}
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <h4 className="mb-0">نموذج تقديم الخدمة</h4>
          </div>
          <div className="card-body">
            {/* عرض مؤشر التحميل أثناء جلب البيانات */}
            {isDataLoading ? (
              <div className="alert alert-info text-center">
                <div className="spinner-border text-primary me-2" role="status">
                  <span className="visually-hidden">جاري التحميل...</span>
                </div>
                <span>جاري تحميل بيانات النموذج...</span>
              </div>
            ) : formSchema.length === 0 && documents.length === 0 ? (
              // عرض رسالة إذا لم تكن هناك بيانات
              <div className="alert alert-warning">
                لا توجد بيانات لعرضها. يرجى التحقق من تفاصيل الخدمة.
              </div>
            ) : (
              // عرض النموذج إذا كانت البيانات متاحة
              <form onSubmit={handleSubmit}>
                {/* قسم البيانات الشخصية */}
                {formSchema.length > 0 && (
                  <>
                    <h5 className="border-bottom pb-2 mb-4">
                      البيانات الشخصية
                    </h5>

                    {/* حقول البيانات */}
                    <div className="row">
                      {formSchema.map((field) => (
                        <div key={field.id} className="col-md-6 mb-3">
                          <label className="form-label fw-bold">
                            {field.filedName}
                            {field.required && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                          <input
                            type={field.htmlType || "text"}
                            name={field.filedName}
                            className={`form-control ${
                              errors[field.filedName] ? "is-invalid" : ""
                            }`}
                            value={formData[field.filedName] || ""}
                            onChange={handleInputChange}
                            required={field.required}
                          />
                          {errors[field.filedName] && (
                            <div className="invalid-feedback">
                              {errors[field.filedName]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {/* قسم المستندات المطلوبة */}
                {documents.length > 0 && (
                  <>
                    <h5 className="border-bottom pb-2 mb-4 mt-5">
                      المستندات المطلوبة
                    </h5>

                    {/* رفع الملفات */}
                    <div className="row">
                      {documents.map((doc) => (
                        <div key={doc.id} className="col-md-6 mb-3">
                          <label className="form-label fw-bold">
                            {doc.fileName}
                            {doc.required && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                          <input
                            type="file"
                            name={`document_${doc.id}`}
                            className={`form-control ${
                              errors[`document_${doc.id}`] ? "is-invalid" : ""
                            }`}
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, doc.id)}
                            required={doc.required}
                          />
                          {errors[`document_${doc.id}`] && (
                            <div className="invalid-feedback">
                              {errors[`document_${doc.id}`]}
                            </div>
                          )}
                          <small className="text-muted d-block mt-1">
                            الصيغ المقبولة: PDF, JPG, JPEG, PNG (الحد الأقصى: 10
                            ميجابايت)
                          </small>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {/* زر إرسال النموذج */}
                <div className="mt-4 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary px-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        جاري الإرسال...
                      </>
                    ) : (
                      "إرسال الطلب"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DynamicForm;