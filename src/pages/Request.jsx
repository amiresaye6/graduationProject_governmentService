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
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import Scroll from '../Components/scroll';

const statusColors = {
  مقبول: "success",
  مرفوض: "error",
  "قيد الانتظار": "warning",
  "معدلة": "info",
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
  justifyContent: "flex-start", // Changed to flex-start for RTL layout
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
const selectSx = {
  width: 200,
  fontWeight: "bold",
  borderRadius: "12px",
  backgroundColor: "#fff",
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
};

export default function Request() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Add new filter states
  const [requestStatus, setRequestStatus] = useState("الكل");
  const [sortDirection, setSortDirection] = useState("تنازلي");

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

  // تحويل حالة الطلب من العربية إلى الإنجليزية للاستعلام
  const mapStatusToEnglish = useCallback((arabicStatus) => {
    switch (arabicStatus) {
      case 'قيد الانتظار':
        return 'Pending';
      case 'مقبول':
        return 'Approved';
      case 'مرفوض':
        return 'Rejected';
      case 'معدلة':
        return 'Edited';
      case 'الكل':
        return '';
      default:
        return '';
    }
  }, []);

  // جلب الطلبات
  const fetchRequests = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setFetchError(null);

      const token = localStorage.getItem('token');
      const englishStatus = mapStatusToEnglish(requestStatus);
      const sortParam = sortDirection === "تنازلي" ? "desc" : "asc";

      // بناء رابط الاستعلام مع المعلمات
      const url = new URL('https://government-services.runasp.net/api/Requests/All');
      url.searchParams.append('PageNumber', page);
      url.searchParams.append('PageSize', 10);

      if (searchQuery.trim()) {
        url.searchParams.append('Search', searchQuery.trim());
      }

      if (englishStatus) {
        url.searchParams.append('RequestStatus', englishStatus);
      }

      url.searchParams.append('SortBy', 'RequestDate');
      url.searchParams.append('SortDirection', sortParam);
      url.searchParams.append('onlyEditedAfterRejection', false);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const formattedData = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);

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
        }));

      setRows(sortedData);
      setPageNumber(data.pageNumber || page);
      setTotalPages(data.totalPages || 1);
      setTotalItems(data.totalCount || formattedData.length);

    } catch (error) {
      console.error("Error fetching requests:", error);
      setFetchError("حدث خطأ في جلب البيانات من الخادم");
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  }, [mapStatusToArabic, mapStatusToEnglish, requestStatus, searchQuery, sortDirection]);

  // إعادة تعيين الصفحة عند تغيير المعلمات
  useEffect(() => {
    setPageNumber(1);
  }, [searchQuery, requestStatus, sortDirection]);

  useEffect(() => {
    fetchRequests(pageNumber);
  }, [pageNumber, fetchRequests]);

  // عدد العناصر المعروضة في الصفحة الحالية
  const startItem = rows.length > 0 ? (pageNumber - 1) * 10 + 1 : 0;
  const endItem = Math.min(pageNumber * 10, totalItems);

  return (
    <>
      <Box dir="rtl" sx={{ ...containerSx, direction: 'rtl' }}>
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
              الطلبات المقدمة
            </Typography>
            <Box sx={filterBarSx}>
              <TextField
                placeholder="البحث عن مستخدم، رقم طلب، أو خدمة..."
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
              <Select
                value={requestStatus}
                onChange={(e) => setRequestStatus(e.target.value)}
                displayEmpty
                sx={selectSx}
                size="small"
              >
                <MenuItem value="الكل">جميع الحالات</MenuItem>
                <MenuItem value="قيد الانتظار">قيد الانتظار</MenuItem>
                <MenuItem value="مقبول">مقبول</MenuItem>
                <MenuItem value="مرفوض">مرفوض</MenuItem>
                <MenuItem value="معدلة">معدلة</MenuItem>
              </Select>
              <Select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
                displayEmpty
                sx={selectSx}
                size="small"
              >
                <MenuItem value="تنازلي">الأحدث أولاً</MenuItem>
                <MenuItem value="تصاعدي">الأقدم أولاً</MenuItem>
              </Select>

              {/* Add flex spacer if needed */}
              <Box sx={{ flexGrow: 1 }} />
            </Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                <CircularProgress />
              </Box>
            ) : fetchError ? (
              <Box sx={{ textAlign: 'center', color: 'error.main', my: 6 }}>
                <Typography color="error">{fetchError}</Typography>
              </Box>
            ) : rows.length === 0 ? (
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
                      {rows.map((row, index) => (
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
                        عرض {startItem} - {endItem} من{" "}
                        {totalItems}
                      </Typography>
                      <Pagination
                        count={totalPages}
                        page={pageNumber}
                        onChange={(event, value) => setPageNumber(value)}
                        color="primary"
                        dir="ltr" // Ensure pagination controls display correctly
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