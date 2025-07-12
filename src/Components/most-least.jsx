// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   LinearProgress,
//   Stack,
//   Grid
// } from '@mui/material';

// const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f97316', '#ef4444', '#6b7280'];

// const DashboardServicesStats = () => {
//   const [mostRequested, setMostRequested] = useState([]);
//   const [leastRequested, setLeastRequested] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
    
//     const headers = {
//       'Content-Type': 'application/json'
//     };

//     axios.get('https://government-services.runasp.net/api/Dashboard/services', {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//     .then(res => {
//       setMostRequested(res.data.mostRequestedServices || []);
//       setLeastRequested(res.data.leastRequestedServices || []);
//       setLoading(false);
//     })
//     .catch(err => {
//       console.error('خطأ في جلب البيانات:', err);
//       setLoading(false);
//     });
//   }, []);

//   const renderList = (title, subtitle, services, colorOffset = 0) => {
//     const max = Math.max(...services.map(s => s.requestCount), 1);

//     return (
//       <Card sx={{ 
//         borderRadius: 2, 
//         boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
//         height: '100%',
//         border: '1px solid #e5e7eb'
//       }}>
//         <CardContent sx={{ p: 3 }}>
//           <Typography 
//             variant="h6" 
//             fontWeight="600" 
//             mb={0.5}
//             sx={{ color: '#111827', fontSize: '1.125rem' }}
//           >
//             {title}
//           </Typography>
//           <Typography 
//             variant="body2" 
//             sx={{ color: '#6b7280', mb: 3, fontSize: '0.875rem' }}
//           >
//             {subtitle}
//           </Typography>
          
//           <Stack spacing={3}>
//             {services.map((service, index) => {
//               const percent = (service.requestCount / max) * 100;
//               const color = COLORS[index + colorOffset] || '#ccc';

//               return (
//                 <Box key={service.serviceId}>
//                   <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
//                     <Box display="flex" alignItems="center" gap={1.5}>
//                       <Box
//                         sx={{
//                           width: 12,
//                           height: 12,
//                           borderRadius: '50%',
//                           backgroundColor: color,
//                           flexShrink: 0
//                         }}
//                       />
//                       <Typography 
//                         variant="body2" 
//                         sx={{ 
//                           color: '#374151', 
//                           fontWeight: '500',
//                           fontSize: '0.875rem'
//                         }}
//                       >
//                         {service.serviceName}
//                       </Typography>
//                     </Box>
//                     <Typography 
//                       variant="body2" 
//                       fontWeight="600"
//                       sx={{ 
//                         color: '#111827',
//                         minWidth: '40px',
//                         textAlign: 'right',
//                         fontSize: '0.875rem'
//                       }}
//                     >
//                       {service.requestCount}
//                     </Typography>
//                   </Box>
                  
//                   <Box sx={{ position: 'relative' }}>
//                     <LinearProgress
//                       variant="determinate"
//                       value={percent}
//                       sx={{
//                         height: 6,
//                         borderRadius: 3,
//                         backgroundColor: '#f3f4f6',
//                         '& .MuiLinearProgress-bar': {
//                           backgroundColor: color,
//                           borderRadius: 3,
//                         },
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               );
//             })}
//           </Stack>
//         </CardContent>
//       </Card>
//     );
//   };

//   if (loading) return <Typography>جاري تحميل الإحصائيات...</Typography>;

//   return (
//     <Grid container spacing={4}>
//       <Grid item xs={12} md={6}>
//         {renderList(
//           'Most Requested Services',
//           'Top 3 services by request volume',
//           mostRequested
//         )}
//       </Grid>
//       <Grid item xs={12} md={6}>
//         {renderList(
//           'Least Requested Services',
//           'Bottom 3 services by request volume',
//           leastRequested,
//           3
//         )}
//       </Grid>
//     </Grid>
//   );
// };

// export default DashboardServicesStats;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Avatar,
  Stack,
  Grid
} from '@mui/material';

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f97316', '#ef4444', '#6b7280'];

const DashboardServicesStats = () => {
  const [mostRequested, setMostRequested] = useState([]);
  const [leastRequested, setLeastRequested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        const token = localStorage.getItem('token');

        // تحضير الهيدرز مع التوكن
        const headers = {
            Authorization: `Bearer ${token}`
        };
         axios.get('https://government-services.runasp.net/api/Dashboard/services', {
            headers: headers
           
        })
      .then(res => {
        setMostRequested(res.data.mostRequestedServices || []);
        setLeastRequested(res.data.leastRequestedServices || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('خطأ في جلب البيانات:', err);
        setLoading(false);
      });
  }, []);

  const renderList = (title, subtitle, services, colorOffset = 0) => {
    const max = Math.max(...services.map(s => s.requestCount), 1);

    return (
      <Card sx={{ borderRadius: 3, p: 3, height: '100%', boxShadow: 2, border: '1px solid #e5e7eb' }}  >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" textAlign="right">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3} textAlign="right">
            {subtitle}
          </Typography>
          <Stack spacing={2} dir="rtl">
            {services.map((service, index) => {

              const color = COLORS[index + colorOffset] || '#ccc';

              return (
                <Box key={service.serviceId}  display="flex">
                  <Box display="flex" alignItems="center"   mb={0.5} width={'60%'} justifyContent="space-between" >
                    {/* اسم الخدمه+ الايقونه */}
                    <Box display="flex" alignItems="center" gap={1} >
                      <Avatar sx={{ width: 16, height: 16, bgcolor: color, color:color }} />
                      <Typography variant="body2" noWrap >{service.serviceName}</Typography>
                    </Box>
                      </Box>
                   <Box display="flex" alignItems="left" justifyContent="left" flexGrow={6}  mr={2}>
                 {/* شريط التقدم */}
                  <LinearProgress
                    variant="determinate"
                    value={(service.requestCount / 70) * 100}
                    sx={{
                        flexGrow: 2,
                        marginLeft: 2,
                        marginRight: 2,
                      height: 8,
                      width: '50%',
                      borderRadius: 5,
                   
                      backgroundColor: '#f0f0f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: color,
                      },
                    }}
                  />

                
                    {/* العدد */}
                    <Typography variant="body2" fontWeight="bold"  >
                      {service.requestCount}
                    </Typography>
                      </Box>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  if (loading) return <Typography>جاري تحميل الإحصائيات...</Typography>;

  return (
    <Grid container spacing={3} dir="rtl">
      <Grid item xs={12} md={6}>
        {renderList(
          'الخدمات الأكثر طلبًا',
          'أكثر 3 خدمات من حيث عدد الطلبات',
          mostRequested
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        {renderList(
          'الخدمات الأقل طلبًا',
          'أقل 3 خدمات من حيث عدد الطلبات',
          leastRequested,
          3 // لتغيير الألوان
        )}
      </Grid>
    </Grid>
  );
};

export default DashboardServicesStats;
