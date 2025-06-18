import React, { useState, useEffect } from "react";
import { HeaderTemp } from "../Components";
import { 
  Box, 
  Grid, 
  Paper, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  TablePagination,
  InputAdornment
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://government-services.runasp.net/api/Services/All');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedServices = filteredServices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

   const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
  

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleAddService = () => {
    // Add new service functionality here
    console.log('Add new service clicked');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HeaderTemp />
     
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TextField
            placeholder="بحث عن الخدمات"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              width: '300px',
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
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleAddService}
            sx={{
              borderRadius: '20px',
              backgroundColor: '#1e88e5',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            إضافة خدمة جديدة
          </Button>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={tableVariants}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ width: '100%', overflow: 'hidden', p: 3, direction: 'rtl' }}>
                <TableContainer sx={{ maxHeight: 'none' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>اسم الخدمة</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>الوصف</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>الفئة</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>الرسوم</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>وقت المعالجة</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>معلومات الاتصال</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedServices.map((service, index) => (
                        <motion.tr
                          key={service.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ backgroundColor: '#f5f5f5' }}
                          style={{ cursor: 'pointer' }}
                        >
                          <TableCell>{service.serviceName}</TableCell>
                          <TableCell>{service.serviceDescription}</TableCell>
                          <TableCell>{service.category}</TableCell>
                          <TableCell>${service.fee}</TableCell>
                          <TableCell>{service.processingTime}</TableCell>
                          <TableCell>{service.contactInfo}</TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[7, 25, 100]}
                  component="div"
                  count={filteredServices.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="عدد الصفوف في الصفحة"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
                  sx={{
                    direction: 'rtl',
                    '.MuiTablePagination-select': {
                      marginRight: '8px',
                      marginLeft: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }}
                />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
      <Grid/>
    </Box>
  );
}
export default AdminServices