import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Pagination,
  CircularProgress,
  Fade,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Scroll from '../Components/scroll';

const statusColors = {
  مقبول: "success",
  مرفوض: "error",
  "قيد الانتظار": "warning",
};

const containerSx = {
  minHeight: "100vh",
  p: 4,
  bgcolor: "var(--background-default)",
};
const cardSx = {
  borderRadius: 3,
  maxWidth: 1100,
  margin: "0 auto",
};
const filterBarSx = {
  display: "flex",
  gap: 2,
  mb: 3,
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "flex-end",
};
const searchSx = {
  width: 280,
  fontWeight: "bold",
  borderRadius: "12px",
  backgroundColor: "#fff",
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
};

export default function Request() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // تحويل حالة الطلب من الإنجليزية إلى العربية
  const mapStatusToArabic = useCallback((requestStatus) => {
    if (!requestStatus) return 'قيد الانتظار';
    switch (requestStatus) {
      case 'Pending':
        return 'قيد الانتظار';
      case 'Approved':
      case 'Completed':
        return 'مقبول';
      case 'Rejected':
        return 'مرفوض';
      case 'Edited':
        return 'معدلة';
      default:
        return requestStatus;
    }
  }, []);

  // جلب الطلبات
  const fetchRequests = useCallback(async (page = 1) => {
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
      setPageNumber(data.pageNumber || 1);
      setTotalPages(data.totalPages || 1);

    } catch (error) {
      console.error("Error fetching requests:", error);
      setFetchError("حدث خطأ في جلب البيانات من الخادم");
    } finally {
      setIsLoading(false);
    }
  }, [mapStatusToArabic]);

  useEffect(() => {
    fetchRequests(pageNumber);
  }, [pageNumber, fetchRequests]);

  // Filtered rows by search query (case-insensitive, RTL safe)
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const lower = searchQuery.trim().toLowerCase();
    return rows.filter(row =>
      row.fullName.toLowerCase().includes(lower) ||
      row.serviceName.toLowerCase().includes(lower)
    );
  }, [searchQuery, rows]);

  return (
    <>
      <Box dir="rtl" sx={containerSx}>
        <Card elevation={6} sx={cardSx}>
          <CardContent>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary"
              gutterBottom
              textAlign="center"
              sx={{ mb: 3 }}
            >
              الطلبات المقدمه
            </Typography>
            <Box sx={filterBarSx}>
              <TextField
                placeholder="اسم المستخدم أو الخدمة..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                dir="rtl"
                sx={searchSx}
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
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
              </Box>
            ) : fetchError ? (
              <Box sx={{ textAlign: 'center', color: 'error.main', my: 6 }}>
                <Typography color="error">{fetchError}</Typography>
              </Box>
            ) : filteredRows.length === 0 ? (
              <Box sx={{ textAlign: 'center', my: 6 }}>
                <Typography color="text.secondary" fontWeight="medium" fontSize={18}>
                  لا توجد طلبات لعرضها
                </Typography>
              </Box>
            ) : (
              <Fade in timeout={500}>
                <Box>
                  <Table>
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
                      {filteredRows.map((row, index) => (
                        <TableRow
                          key={row.id || index}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                          }}
                        >
                          <TableCell align="right">{row.id || `#${index + 1}`}</TableCell>
                          <TableCell align="right">{row.serviceName}</TableCell>
                          <TableCell align="right">{row.fullName}</TableCell>
                          <TableCell align="right">{row.requestDate}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={row.requestStatus}
                              color={statusColors[row.requestStatus] || "warning"}
                              variant="outlined"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              color="primary"
                              variant="contained"
                              onClick={() => navigate(`/request-details/${row.id}`)}
                            >
                              عرض التفاصيل
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {totalPages > 1 && (
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                      <Typography variant="body2">
                        عرض {(pageNumber - 1) * 10 + 1} -{" "}
                        {Math.min(pageNumber * 10, filteredRows.length)} من{" "}
                        {filteredRows.length}
                      </Typography>
                      <Pagination
                        count={totalPages}
                        page={pageNumber}
                        onChange={(event, value) => setPageNumber(value)}
                        color="primary"
                      />
                    </Box>
                  )}
                </Box>
              </Fade>
            )}
          </CardContent>
        </Card>
      </Box>
      <Scroll />
    </>
  );
}