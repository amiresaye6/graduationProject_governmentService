// Import necessary dependencies
// import React, { useState, useEffect } from "react";
// import { HeaderTemp } from "../Components";
// import { 
//   Box, 
//   Paper, 
//   TableBody, 
//   TableCell, 
//   TableRow,
//   TextField,
//   Button,
//   TablePagination,
//   Typography,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Chip,
//   TableContainer
// } from "@mui/material";
// import { motion } from "framer-motion";
// import axios from "axios";
// import SearchIcon from '@mui/icons-material/Search';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import DeleteIcon from '@mui/icons-material/Delete';

// // Main component for managing government services
// const AdminServices = () => {
//   // State variables
//   const [services, setServices] = useState([]); // List of all services
//   const [searchQuery, setSearchQuery] = useState(''); // Search input
//   const [page, setPage] = useState(0); // Current page
//   const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
//   const [selectedService, setSelectedService] = useState(null); // Currently selected service
//   const [fields, setFields] = useState([]); // Fields for selected service
//   const [files, setFiles] = useState([]); // Files for selected service
//   const [openFieldsDialog, setOpenFieldsDialog] = useState(false); // Fields dialog visibility
//   const [openFilesDialog, setOpenFilesDialog] = useState(false); // Files dialog visibility
//   const [newField, setNewField] = useState({
//     fieldName: '',
//     description: '',
//     htmlType: 'text'
//   }); // New field form state
//   const [newFile, setNewFile] = useState({
//     fileName: '',
//     contentType: 'application/pdf'
//   }); // New file form state

//   // Fetch all services when component mounts
//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await axios.get('https://government-services.runasp.net/api/Services/All');
//         setServices(response.data);
//       } catch (error) {
//         console.error('Error fetching services:', error);
//       }
//     };
//     fetchServices();
//   }, []);

//   // Fetch fields and files for a specific service
//   const fetchServiceDetails = async (serviceId) => {
//     try {
//       const [fieldsResponse, filesResponse] = await Promise.all([
//         axios.get(`https://government-services.runasp.net/api/Fields/Required/Service/${serviceId}`),
//         axios.get(`https://government-services.runasp.net/api/Files/Required/Service/${serviceId}`)
//       ]);
//       setFields(fieldsResponse.data);
//       setFiles(filesResponse.data);
//     } catch (error) {
//       console.error('Error fetching service details:', error);
//     }
//   };

//   // Handle service selection
//   const handleServiceClick = async (service) => {
//     setSelectedService(service);
//     await fetchServiceDetails(service.id);
//   };

//   // Handle adding a new field
//   const handleAddField = async () => {
//     try {
//       await axios.post('https://government-services.runasp.net/api/Fields', {
//         ...newField,
//         serviceId: selectedService.id
//       });
//       await fetchServiceDetails(selectedService.id);
//       setNewField({ fieldName: '', description: '', htmlType: 'text' });
//     } catch (error) {
//       console.error('Error adding field:', error);
//     }
//   };

//   // Handle adding a new file
//   const handleAddFile = async () => {
//     try {
//       await axios.post('https://government-services.runasp.net/api/Files', {
//         ...newFile,
//         serviceId: selectedService.id
//       });
//       await fetchServiceDetails(selectedService.id);
//       setNewFile({ fileName: '', contentType: 'application/pdf' });
//     } catch (error) {
//       console.error('Error adding file:', error);
//     }
//   };

//   // Handle deleting a field
//   const handleDeleteField = async (fieldId) => {
//     try {
//       await axios.delete(`https://government-services.runasp.net/api/Fields/${fieldId}`);
//       await fetchServiceDetails(selectedService.id);
//     } catch (error) {
//       console.error('Error deleting field:', error);
//     }
//   };

//   // Handle deleting a file
//   const handleDeleteFile = async (fileId) => {
//     try {
//       await axios.delete(`https://government-services.runasp.net/api/Files/${fileId}`);
//       await fetchServiceDetails(selectedService.id);
//     } catch (error) {
//       console.error('Error deleting file:', error);
//     }
//   };

//   // Animation variants for table and rows
//   const tableVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1 }
//   };

//   const rowVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0 }
//   };

//   // Filter services based on search query
//   const filteredServices = services.filter(service =>
//     service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     service.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Get paginated services
//   const paginatedServices = filteredServices.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   // Handle rows per page change
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   // Handle page change
//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <HeaderTemp />
      
//       <Box sx={{ p: 3 }}>
//         {/* Search and Add button */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <TextField
//             placeholder="بحث عن الخدمات"
//             variant="outlined"
//             size="small"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{
//               width: '300px',
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '20px',
//               }
//             }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddCircleIcon />}
//             onClick={() => setOpenFieldsDialog(true)}
//             sx={{
//               borderRadius: '20px',
//               transition: 'transform 0.2s',
//               '&:hover': {
//                 transform: 'scale(1.05)'
//               }
//             }}
//           >
//             إضافة خدمة
//           </Button>
//         </Box>

//         {/* Services table with animation */}
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={tableVariants}
//         >
//           <TableContainer component={Paper}>
//             <TableBody>
//               {paginatedServices.map((service, index) => (
//                 <motion.div
//                   key={service.id}
//                   variants={rowVariants}
//                   initial="hidden"
//                   animate="visible"
//                 >
//                   <TableRow
//                     hover
//                     onClick={() => handleServiceClick(service)}
//                     sx={{
//                       cursor: 'pointer',
//                       transition: 'background-color 0.2s',
//                       '&:hover': {
//                         backgroundColor: 'action.hover'
//                       }
//                     }}
//                   >
//                     <TableCell>
//                       <Typography variant="h6" color="primary">
//                         {service.serviceName}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {service.serviceDescription}
//                       </Typography>
//                       <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
//                         <Chip label={`الرسوم: ${service.fee} ريال`} size="small" />
//                         <Chip label={`المدة: ${service.processingTime}`} size="small" />
//                       </Box>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" color="text.secondary">
//                         {service.category}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" color="text.secondary">
//                         {service.contactInfo}
//                       </Typography>
//                     </TableCell>
//                   </TableRow>
//                 </motion.div>
//               ))}
//             </TableBody>
//           </TableContainer>
//         </motion.div>

//         {/* Pagination controls */}
//         <TablePagination
//           component="div"
//           count={filteredServices.length}
//           page={page}
//           onPageChange={handlePageChange}
//           rowsPerPage={rowsPerPage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//           sx={{ mt: 2 }}
//         />

//         {/* Fields Dialog */}
//         <Dialog
//           open={openFieldsDialog}
//           onClose={() => setOpenFieldsDialog(false)}
//           maxWidth="sm"
//           fullWidth
//         >
//           <DialogTitle>إدارة حقول الخدمة</DialogTitle>
//           <DialogContent>
//             <Box sx={{ mt: 2 }}>
//               {fields.map((field) => (
//                 <Box key={field.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                   <Chip
//                     label={field.fieldName}
//                     variant="outlined"
//                     sx={{ flex: 1 }}
//                   />
//                   <IconButton onClick={() => handleDeleteField(field.id)} color="error">
//                     <DeleteIcon />
//                   </IconButton>
//                 </Box>
//               ))}
//             </Box>
//             <Box sx={{ mt: 2 }}>
//               <TextField
//                 fullWidth
//                 label="اسم الحقل"
//                 value={newField.fieldName}
//                 onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
//                 sx={{ mb: 2 }}
//               />
//               <TextField
//                 fullWidth
//                 label="الوصف"
//                 value={newField.description}
//                 onChange={(e) => setNewField({ ...newField, description: e.target.value })}
//                 sx={{ mb: 2 }}
//               />
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                 <InputLabel>نوع الحقل</InputLabel>
//                 <Select
//                   value={newField.htmlType}
//                   onChange={(e) => setNewField({ ...newField, htmlType: e.target.value })}
//                 >
//                   <MenuItem value="text">نص</MenuItem>
//                   <MenuItem value="number">رقم</MenuItem>
//                   <MenuItem value="date">تاريخ</MenuItem>
//                   <MenuItem value="file">ملف</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenFieldsDialog(false)}>إلغاء</Button>
//             <Button onClick={handleAddField} variant="contained" color="primary">
//               إضافة حقل
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Files Dialog */}
//         <Dialog
//           open={openFilesDialog}
//           onClose={() => setOpenFilesDialog(false)}
//           maxWidth="sm"
//           fullWidth
//         >
//           <DialogTitle>إدارة الملفات المطلوبة</DialogTitle>
//           <DialogContent>
//             <Box sx={{ mt: 2 }}>
//               {files.map((file) => (
//                 <Box key={file.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                   <Chip
//                     label={file.fileName}
//                     variant="outlined"
//                     sx={{ flex: 1 }}
//                   />
//                   <IconButton onClick={() => handleDeleteFile(file.id)} color="error">
//                     <DeleteIcon />
//                   </IconButton>
//                 </Box>
//               ))}
//             </Box>
//             <Box sx={{ mt: 2 }}>
//               <TextField
//                 fullWidth
//                 label="اسم الملف"
//                 value={newFile.fileName}
//                 onChange={(e) => setNewFile({ ...newFile, fileName: e.target.value })}
//                 sx={{ mb: 2 }}
//               />
//               <FormControl fullWidth sx={{ mb: 2 }}>
//                 <InputLabel>نوع الملف</InputLabel>
//                 <Select
//                   value={newFile.contentType}
//                   onChange={(e) => setNewFile({ ...newFile, contentType: e.target.value })}
//                 >
//                   <MenuItem value="application/pdf">PDF</MenuItem>
//                   <MenuItem value="image/jpeg">صورة</MenuItem>
//                   <MenuItem value="application/msword">Word</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenFilesDialog(false)}>إلغاء</Button>
//             <Button onClick={handleAddFile} variant="contained" color="primary">
//               إضافة ملف
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </Box>
//   );
// };

// // export default AdminServices;

//               '&:hover' {
//                 backgroundColor: '#1565c0';
//               }
//             }}
//           >
//             إضافة خدمة جديدة
//           </Button>
//         </Box>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <motion.div
//               initial="hidden"
//               animate="visible"
//               variants={tableVariants}
//               transition={{ duration: 0.5 }}
//             >
//               <Paper sx={{ width: '100%', overflow: 'hidden', p: 3, direction: 'rtl' }}>
//                 <TableContainer sx={{ maxHeight: 'none' }}>
//                   <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
//                     <TableHead>
//                       <TableRow>
//                         <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>اسم الخدمة</TableCell>
//                         <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>الوصف</TableCell>
//                         <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>الفئة</TableCell>
//                         <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>الرسوم</TableCell>
//                         <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>وقت المعالجة</TableCell>
//                         <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>معلومات الاتصال</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {paginatedServices.map((service, index) => (
//                         <motion.tr
//                           key={service.id}
//                           variants={rowVariants}
//                           initial="hidden"
//                           animate="visible"
//                           transition={{ delay: index * 0.1 }}
//                           whileHover={{ backgroundColor: '#f5f5f5' }}
//                           style={{ cursor: 'pointer' }}
//                         >
//                           <TableCell>{service.serviceName}</TableCell>
//                           <TableCell>{service.serviceDescription}</TableCell>
//                           <TableCell>{service.category}</TableCell>
//                           <TableCell>${service.fee}</TableCell>
//                           <TableCell>{service.processingTime}</TableCell>
//                           <TableCell>{service.contactInfo}</TableCell>
//                         </motion.tr>
//                       ))}
//                     </TableBody>
//                   </table>
//                 </TableContainer>
//                 <TablePagination
//                   rowsPerPageOptions={[7, 25, 100]}
//                   component="div"
//                   count={filteredServices.length}
//                   rowsPerPage={rowsPerPage}
//                   page={page}
//                   onPageChange={handlePageChange}
//                   onRowsPerPageChange={handleChangeRowsPerPage}
//                   labelRowsPerPage="عدد الصفوف في الصفحة"
//                   labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
//                   sx={{
//                     direction: 'rtl',
//                     '.MuiTablePagination-select': {
//                       marginRight: '8px',
//                       marginLeft: '16px',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }
//                   }}
//                 />
//               </Paper>
//             </motion.div>
//           </Grid>
//         </Grid>
//       </Box>
//       <Grid/>
//     </Box>
//   );
// }
// export default AdminServices