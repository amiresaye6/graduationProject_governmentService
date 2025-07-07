// src/pages/AddServicePage.jsx
import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { HeaderTemp } from "../Components";
import AddServiceForm from "../Components/AddServiceForm"; // تأكد أن هذا هو المسار الصحيح
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../pages/axiosConfig";

const AddServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    if (id && id !== "add") {
      setLoading(true);
      axiosInstance
        .get(`/Services/${id}/Details`)
        .then((res) => {
          setServiceData(res.data);
        })
        .catch((err) => {
          alert("حدث خطأ أثناء جلب بيانات الخدمة");
          navigate("/admin/services");
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  return (
    <>
      {/* <HeaderTemp /> */}
      <Box
        dir="rtl"
        sx={{ minHeight: "100vh", p: 4, backgroundColor: "#f3f6fd" }}
      >
        <Box maxWidth="md" mx="auto">
          {loading ? (
            <div>جارٍ التحميل...</div>
          ) : (
            <AddServiceForm
              initialData={serviceData}
              isEdit={id && id !== "add"}
              serviceId={id && id !== "add" ? id : null}
              onSuccess={() => navigate("/admin/services")}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default AddServicePage;
