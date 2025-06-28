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
import DeleteIcon from "@mui/icons-material/Delete";
import { HeaderTemp } from "../Components";
import { motion } from "framer-motion";
import axiosInstance from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const generateFakeServices = () => [
  {
    id: 1,
    name: "طلب ترخيص تجاري",
    category: "التراخيص",
    status: "نشط",
    lastUpdated: "15 ديسمبر، 2024",
  },
  {
    id: 2,
    name: "طلب شهادة صحية",
    category: "الصحة",
    status: "نشط",
    lastUpdated: "12 ديسمبر، 2024",
  },
  {
    id: 3,
    name: "تسجيل في المدرسة",
    category: "التعليم",
    status: "غير نشط",
    lastUpdated: "10 ديسمبر، 2024",
  },
  {
    id: 4,
    name: "تصريح وقوف السيارات",
    category: "النقل",
    status: "نشط",
    lastUpdated: "8 ديسمبر، 2024",
  },
  {
    id: 5,
    name: "طلب توصيل المياه",
    category: "المرافق",
    status: "نشط",
    lastUpdated: "5 ديسمبر، 2024",
  },
  {
    id: 6,
    name: "طلب رخصة بناء",
    category: "التراخيص",
    status: "نشط",
    lastUpdated: "3 ديسمبر، 2024",
  },
  {
    id: 7,
    name: "استئناف تقييم الضرائب",
    category: "المالية",
    status: "قيد الانتظار",
    lastUpdated: "1 ديسمبر، 2024",
  },
];

const categoryStyles = {
  "السجل المدني": "primary.main",
  "الصحة": "success.main",
  "خدمات السفر": "secondary.main",
  "المالية": "warning.main",
  "التجارة": "error.main",
  "خدمات مدنية": "text.primary",
};

const statusColors = {
  نشط: "success.main",
  "غير نشط": "error.main",
  "قيد الانتظار": "warning.main",
};

const AdminServices = () => {
  // const [services, setServices] = useState([]);
  // const [filteredServices, setFilteredServices] = useState([]);
  // const [search, setSearch] = useState('');
  // const [category, setCategory] = useState('جميع الفئات');
  // const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState(1);
  // const itemsPerPage = 5;

  // useEffect(() => {
  //   setTimeout(() => {
  //     const fake = generateFakeServices();
  //     setServices(fake);
  //     setFilteredServices(fake);
  //     setLoading(false);
  //   }, 1000);
  // }, []);

  // useEffect(() => {
  //   let filtered = services;
  //   if (search) {
  //     filtered = filtered.filter(s => s.name.includes(search));
  //   }
  //   if (category !== 'جميع الفئات') {
  //     filtered = filtered.filter(s => s.category === category);
  //   }
  //   setFilteredServices(filtered);
  //   setPage(1);
  // }, [search, category, services]);

  // const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  // const visible = filteredServices.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  // const categories = ['جميع الفئات', ...new Set(services.map(s => s.category))];

  // const handleDelete = (id) => {
  //   setServices(prev => prev.filter(s => s.id !== id));
  // };

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("جميع الفئات");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // إذا كان هناك بحث، استخدمه في الاستعلام
        // إذا لم يكن هناك بحث، جلب جميع الخدمات
        const response = search
          ? await axiosInstance.get(
              `/Services/Available?ServiceName=${encodeURIComponent(search)}`
            )
          : await axiosInstance.get("/Services/All");
        setServices(response.data);
        setFilteredServices(response.data);
      } catch (error) {
        console.error("فشل في جلب الخدمات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [search]);

  useEffect(() => {
    let filtered = services;
    if (category !== "جميع الفئات") {
      filtered = filtered.filter((s) => s.category === category);
    }
    setFilteredServices(filtered);
    setPage(1);
  }, [category, services]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const visible = filteredServices.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const categories = [
    "جميع الفئات",
    ...new Set(services.map((s) => s.category)),
  ];

  const handleDelete = (id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
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
                            <TableCell align="right">الحالة</TableCell>
                            <TableCell align="right">آخر تحديث</TableCell>
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
                              <TableCell align="right">
                                <Typography
                                  color={
                                    statusColors[service.fee] || "text.primary"
                                  }
                                >
                                  {service.fee}$
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                {service.processingTime}
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
                                  color="error"
                                  onClick={() => handleDelete(service.id)}
                                >
                                  <DeleteIcon size={16} />
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
                          عرض{" "}
                          {Math.min(
                            (page - 1) * itemsPerPage + 1,
                            filteredServices.length
                          )}{" "}
                          -
                          {Math.min(
                            page * itemsPerPage,
                            filteredServices.length
                          )}{" "}
                          من {filteredServices.length}
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
    </>
  );
};

export default AdminServices;
