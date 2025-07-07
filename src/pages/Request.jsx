import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Chip, CircularProgress, Box, Typography,
  TextField, InputAdornment, Pagination, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { HeaderTemp } from '../Components';
import { motion } from "framer-motion";
import Scroll from '../Components/scroll';

export default function Request() {
  const navigate = useNavigate();

 // State hooks
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  

  // مذكرة لوظيفة جلب الطلبات لتجنب إعادة الإنشاء      Get All Member Requests
  const memoizedFetchRequests = useCallback(async (page = 1) => {
  try {
    setIsLoading(true);
    setFetchError(null);

    const token = localStorage.getItem('token');
    const response = await fetch(`https://government-services.runasp.net/api/Requests/All?pageNumber=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();

    const formattedData = Array.isArray(data) ? data : (data.items || []);

    const sortedData = formattedData
      .filter(request => request !== null)
      .map(request => ({
        id: request.requestId,
        serviceName: request.serviceName || 'خدمة غير معروفة',
        requestDate: request.requestDate
          ? new Date(request.requestDate).toLocaleDateString('ar-EG')
          : 'تاريخ غير معروف',
        requestStatus: mapStatusToArabic(request.requestStatus || 'Pending'),
        adminComment: request.adminComment || '',
        fullName: `${request.firstName || ''} ${request.lastName || ''}`.trim(),
        fieldValueString: request.fieldValueString || ''
      }))
      .sort((a, b) => a.id - b.id);

    setRows(sortedData);
    setPageNumber(data.pageNumber);
    setTotalPages(data.totalPages);

  } catch (error) {
    console.error("Error fetching requests:", error);
    setFetchError("حدث خطأ في جلب البيانات من الخادم");
  } finally {
    setIsLoading(false);
  }
}, []);

  useEffect(() => {
      memoizedFetchRequests(pageNumber);
  }, [pageNumber, memoizedFetchRequests]);

  // استدعاء وظيفة جلب الطلبات عند تحميل المكون
  useEffect(() => {
    console.log("Component mounted, fetching requests...");
    memoizedFetchRequests();
  }, [memoizedFetchRequests]);

  // تحويل حالة الطلب من الإنجليزية إلى العربية
  const mapStatusToArabic = (requestStatus) => {
    if (!requestStatus) return 'قيد الانتظار';

    switch (requestStatus) {
      case 'Pending':
        return 'قيد الانتظار';
      case 'Approved':
      case 'Completed':
        return 'مقبول';
      case 'Rejected':
        return 'مرفوض';
      default:
        return requestStatus;
    }
  };

  // تحديد لون الحالة
  const getStatusColor = (requestStatus) => {
    if (!requestStatus) return 'warning';

    switch (requestStatus) {
      case 'مقبول':
        return 'success';
      case 'مرفوض':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <>
      
    {/* <HeaderTemp/> */}
     <div style={{backgroundColor:'var(--background-default)', minHeight: '100vh' , maxWidth: '100vw', width: '100%', overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',    alignItems: 'center'}} >
      <div className="container my-5" style={{backgroundColor:'var(--background-paper)',boxShadow: '4px 8px 20px var(--shadow-medium)',borderRadius: '12px',}} >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container text-center mb-4"
        >
          <h2 className=" text-primary mb-4 text-center" style={{marginTop:'30px'}}>الطلبات المقدمه</h2>

          <Box sx={{ display:'flex',  p: 2, direction: 'rtl' }}>
              
            <TextField
              placeholder="اسم المستخدم..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dir='rtl'
              sx={{
                width: '250px',
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
                dir: 'rtl'
              }}
            />
          </Box>
      </motion.div>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {fetchError && (
          <Box sx={{ textAlign: 'center', color: 'error.main', my: 2 }}>
            {fetchError}
          </Box>
        )}

        {!isLoading && !fetchError && rows.length === 0 && (
          <Box sx={{ textAlign: 'center', my: 2 }}>
            <Typography className='title'>لا توجد طلبات لعرضها</Typography>
          </Box>
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container text-center mb-4"
        > 
        {!isLoading && !fetchError && rows.length > 0 && (
          <div>
            <TableContainer component={Paper}>
              <Table  sx={{ minWidth: 650 }} aria-label="الطلبات">
              <TableHead>
                <TableRow>
                  <TableCell align="right">رقم الطلب</TableCell>
                  <TableCell align="right">اسم الخدمة</TableCell>
                  <TableCell align="right">اسم المستخدم</TableCell>
                  <TableCell align="right">تاريخ الطلب</TableCell>
                  <TableCell align="right">حالة الطلب</TableCell>
                  <TableCell align="right">إجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                  >
                    <TableCell align="right">{row.requestId || `#${index + 1}`}</TableCell>
                    <TableCell align="right">{row.serviceName}</TableCell>
                    <TableCell align="right">{row.fullName}</TableCell>
                    <TableCell align="right">{row.requestDate}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={row.requestStatus}
                        color={getStatusColor(row.requestStatus)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        onClick={() => navigate(`/request-details/${row.id}`)}
                        style={{ marginLeft: 5 }}
                      >
                        عرض التفاصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </TableContainer>
            <Stack spacing={2} alignItems="center" sx={{ mt: 3, mb: 3 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Pagination
                  count={totalPages}               // عدد الصفحات الكلي
                  page={pageNumber}                // الصفحة الحالية
                  onChange={(event, value) => setPageNumber(value)}  // تغيير الصفحة
                  color="primary"
                  shape="rounded"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </motion.div>
            </Stack>
          </div>
        )}
        </motion.div>
      </div>
      </div>
      <Scroll/>
    </>
  );
}