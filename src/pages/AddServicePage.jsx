// src/pages/AddServicePage.jsx
import React from "react";
import { Box } from "@mui/material";
import { HeaderTemp } from "../Components";
import AddServiceForm from "../Components/AddServiceForm"; // تأكد أن هذا هو المسار الصحيح

const AddServicePage = () => {
  return (
    <>
      <HeaderTemp />
      <Box dir="rtl" sx={{ minHeight: "100vh", p: 4, backgroundColor: "#f3f6fd" }}>
        <Box maxWidth="md" mx="auto">
          <AddServiceForm />
        </Box>
      </Box>
    </>
  );
};

export default AddServicePage;
