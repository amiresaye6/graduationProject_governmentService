import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Pagination,
  CircularProgress,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { HeaderTemp } from "../Components";
import { motion } from "framer-motion";
import axiosInstance from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Scroll from "../Components/scroll";

const categoryStyles = {
  "السجل المدني": "primary.main",
  الصحة: "success.main",
  السفر: "secondary.main",
  المالية: "warning.main",
  التجارة: "error.main",
  "خدمات مدنية": "text.primary",
  "خدمات المرور": "info.main",
  النقل: "secondary.main",
  التراخيص: "info.main",
  التعليم: "warning.main",
  المرافق: "success.main",
};

const statusColors = {
  متوفر: "success.main",
  "غير متوفر": "error.main",
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState(["جميع الفئات"]);
  const [category, setCategory] = useState("جميع الفئات");
  const [availability, setAvailability] = useState("جميع الطلبات");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [actualTotalItems, setActualTotalItems] = useState(0);
  const [isTotalItemsSet, setIsTotalItemsSet] = useState(false);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const params = {
          PageNumber: page,
          PageSize: itemsPerPage,
          ServiceName: search || undefined,
          serviceCategory: category !== "جميع الفئات" ? category : undefined,
          IsAvailable:
            availability === "متوفرة"
              ? true
              : availability === "غير متوفرة"
              ? false
              : undefined,
        };
        // إذا كان هناك بحث، استخدمه في الاستعلام
        // إذا لم يكن هناك بحث، جلب جميع الخدمات
        const response = await axiosInstance.get("/Services/All", { params });
        const servicesData = Array.isArray(response.data.items)
          ? response.data.items
          : [];
        setServices(servicesData);
        setTotalPages(response.data.totalPages || 0);
        if (!isTotalItemsSet && response.data.totalPages > 0) {
          const lastPageParams = {
            ...params,
            PageNumber: response.data.totalPages,
          };
          const lastPageResponse = await axiosInstance.get("/Services/All", {
            params: lastPageParams,
          });
          const lastPageServices = Array.isArray(lastPageResponse.data.items)
            ? lastPageResponse.data.items
            : [];
          setActualTotalItems(
            (response.data.totalPages - 1) * itemsPerPage +
              lastPageServices.length
          );
          setIsTotalItemsSet(true);
        }
      } catch (error) {
        console.error("فشل في جلب الخدمات:", error);
        toast.error("فشل في جلب الخدمات");
        setServices([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [search, page, category, availability, isTotalItemsSet]);

  // إعادة تعيين الصفحة إلى 1 عند تغيير الفلاتر
  useEffect(() => {
    setPage(1);
  }, [search, category, availability]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/Services/Category");
        console.log("Categories Response:", response.data);
        const categoryData = Array.isArray(response.data)
          ? [
              "جميع الفئات",
              ...response.data.map((item) => item.category.trim()),
            ]
          : ["جميع الفئات"];
        setCategories(categoryData);
      } catch (error) {
        console.error("فشل في جلب الفئات:", error);
        toast.error("فشل في جلب الفئات");
        setCategories(["جميع الفئات"]);
      }
    };

    fetchCategories();
  }, []);

  const visible = Array.isArray(services) ? services : [];
  const handleToggle = async (id, currentAvailability) => {
    try {
      await axiosInstance.put(`/Services/${id}/Toggle`);
      setServices((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, isAvailable: !currentAvailability } : s
        )
      );
      toast.success("تم تبديل حالة الخدمة بنجاح");
    } catch (error) {
      console.error("فشل في تبديل حالة الخدمة:", error);
      toast.error("فشل في تبديل حالة الخدمة");
    }
  };

  return (
    <>
      <HeaderTemp />
      <Box dir="rtl" sx={{ minHeight: "100vh", p: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box maxWidth="lg" mx="auto" px={2}>
            <Card elevation={6} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  الخدمات الحكومية
                </Typography>
                <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                  <TextField
                    variant="outlined"
                    sx={{
                      width: 280,
                      height: 50,
                      fontWeight: "bold",
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                      "& .MuiOutlinedInput-input": {
                        fontWeight: "bold",
                        fontSize: "16px",
                        padding: "10px",
                      },

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                      },
                    }}
                    placeholder="البحث عن الخدمات..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ borderRadius: 3 }}>
                          <SearchIcon size={18} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    displayEmpty
                    sx={{
                      width: 200,
                      height: 46,
                      fontWeight: "bold",
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                      "& .MuiOutlinedInput-input": {
                        fontWeight: "bold",
                        fontSize: "16px",
                        padding: "8px",
                      },

                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                      },
                    }} // جعل الحواف دائرية
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    displayEmpty
                    sx={{
                      width: 200,
                      height: 46,
                      fontWeight: "bold",
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                      "& .MuiOutlinedInput-input": {
                        fontWeight: "bold",
                        fontSize: "16px",
                        padding: "8px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                      },
                    }}
                  >
                    <MenuItem value="جميع الطلبات">جميع الطلبات</MenuItem>
                    <MenuItem value="متوفرة">متوفرة</MenuItem>
                    <MenuItem value="غير متوفرة">غير متوفرة</MenuItem>
                  </Select>
                  <Box
                    justifyContent="flex-end"
                    display="flex"
                    flexGrow={1}
                    ml={3}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon size={24} sx={{ ml: 1 }} />}
                      onClick={() => navigate("/admin/services/add")}
                      sx={{
                        width: 180,
                        height: 48,
                        fontWeight: "bold",
                        borderRadius: "12px",

                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "12px",
                        },
                        "& .MuiOutlinedInput-input": {
                          fontWeight: "bold",
                          fontSize: "20px",
                          padding: "10px",
                        },
                      }}
                    >
                      إضافة خدمة
                    </Button>
                  </Box>
                </Box>
                {loading ? (
                  <Box display="flex" justifyContent="center" my={5}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Fade in timeout={500}>
                    <Box>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell align="right">اسم الخدمة</TableCell>
                            <TableCell align="right">الفئة</TableCell>
                            <TableCell align="right">الرسوم</TableCell>
                            <TableCell align="right">مدة التنفيذ</TableCell>
                            <TableCell align="right">التوفر</TableCell>
                            <TableCell align="right">الإجراءات</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {visible.map((service) => (
                            <TableRow key={service.id} hover>
                              <TableCell align="right">
                                {service.serviceName}
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  color={
                                    categoryStyles[service.category] ||
                                    "text.primary"
                                  }
                                >
                                  {service.category}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">{service.fee}</TableCell>
                              <TableCell align="right">
                                {service.processingTime}
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  color={
                                    statusColors[
                                      service.isAvailable
                                        ? "متوفر"
                                        : "غير متوفر"
                                    ] || "text.primary"
                                  }
                                >
                                  {service.isAvailable ? "متوفر" : "غير متوفر"}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    navigate(`/admin/services/${service.id}`)
                                  }
                                >
                                  <EditIcon size={16} />
                                </IconButton>
                                <IconButton
                                  color={
                                    service.isAvailable ? "warning" : "success"
                                  }
                                  onClick={() =>
                                    handleToggle(
                                      service.id,
                                      service.isAvailable
                                    )
                                  }
                                >
                                  {service.isAvailable ? (
                                    <ToggleOffIcon size={18} />
                                  ) : (
                                    <ToggleOnIcon size={18} />
                                  )}
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                      >
                        <Typography variant="body2">
                          عرض {(page - 1) * itemsPerPage + 1} -{" "}
                          {Math.min(page * itemsPerPage, actualTotalItems)} من{" "}
                          {actualTotalItems}
                        </Typography>
                        <Pagination
                          count={totalPages}
                          page={page}
                          onChange={(e, v) => setPage(v)}
                          color="primary"
                        />
                      </Box>
                    </Box>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Box>
        </motion.div>
      </Box>
      <Scroll />
    </>
  );
};

export default AdminServices;
