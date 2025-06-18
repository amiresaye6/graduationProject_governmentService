import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { addCart } from "../redux/action";
import { useDispatch } from "react-redux";
import { servicesService } from "../services/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "./ThemeContext";
import { useAuth } from "./AuthContext";

// MUI Components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ToggleButton from '@mui/material/ToggleButton';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';


// function filterProducts(category) {
//     let products = document.querySelectorAll(".product");
//     products.forEach(product => {
//         if (category === "all") {
//             product.style.display = "block";

//         } else {
//             product.classList.contains(category) ? product.style.display = "block" : product.style.display = "none";
//         }
//     });
// }

// function FloatingActionButtons() {
//   return (
//     <Box sx={{ '& > :not(style)': { m: 1 } }}>

//       <Fab variant="extended">
//         Navigate
//       </Fab>

//     </Box>
//   );
// }



function Products() {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    // Dialog state
    const [open, setOpen] = useState(false);
    const [scroll, setScroll] = useState('paper');
    const descriptionElementRef = useRef(null);

    // Add service to cart
    const addService = (service) => {
        dispatch(addCart(service));
        toast.success("تمت إضافة الخدمة بنجاح");
    };

    // Handle request service button click
    const handleRequestService = (service) => {
        // بدلاً من التحقق من تسجيل الدخول، سننتقل مباشرة إلى نموذج الطلب
        const formData = {
            serviceId: service.id,
            userId: localStorage.getItem('userId') || 'guest_user',
            requestDate: new Date().toISOString(),
            status: "Pending",
            notes: "طلب جديد"
        };

        // استدعاء وظيفة إرسال الطلب أو الانتقال إلى صفحة النموذج
        navigate("/Form", { state: { service: service } });
        toast.success("تم الانتقال إلى نموذج طلب الخدمة");

        // يمكن أيضًا استدعاء وظيفة إرسال الطلب مباشرة إذا لم تكن هناك حاجة لنموذج
        // submitServiceRequest(service.id, formData);
    };

    // سنستخدم البيانات من API مباشرة

    // Fetch services data
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true);
                setError(null);

                // الحصول على التوكن من localStorage
                const token = localStorage.getItem('token');

                // تحضير الهيدرز مع التوكن
                const headers = {
                    'Content-Type': 'application/json'
                };

                // إضافة التوكن إذا كان موجوداً
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                // 1. https://government-services.runasp.net/api/Services/Available
                // جلب قائمة بجميع الخدمات المتاحة
                console.log("Fetching services with headers:", headers);
                const response = await fetch('https://government-services.runasp.net/api/Services/Available', {
                    method: 'GET',
                    headers: headers,
                    mode: 'cors',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const servicesData = await response.json();
                console.log("Services data from API:", servicesData);

                setData(servicesData);
                setFilter(servicesData);

                // If ID is provided, fetch specific service details
                if (id) {
                    // 4. https://government-services.runasp.net/api/Services/1/Details
                    // جلب تفاصيل خدمة محددة برقم معرف
                    const detailsResponse = await fetch(`https://government-services.runasp.net/api/Services/${id}/Details`, {
                        method: 'GET',
                        headers: headers
                    });

                    if (!detailsResponse.ok) {
                        throw new Error(`API error when fetching service details: ${detailsResponse.status}`);
                    }

                    const serviceData = await detailsResponse.json();
                    setService(serviceData);
                    setSelectedService(serviceData);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
                setError("حدث خطأ في جلب البيانات من الخادم");
                toast.error("حدث خطأ في جلب البيانات من الخادم");

                // استخدام بيانات وهمية في حالة فشل الاتصال بالخادم
                const dummyServices = [
                    {
                        id: 1,
                        serviceName: "استخراج بطاقة هوية وطنية",
                        serviceDescription: "خدمة إلكترونية تتيح للمواطنين استخراج بطاقة الهوية الوطنية الجديدة أو تجديدها.",
                        category: "خدمات مدنية"
                    },
                    {
                        id: 2,
                        serviceName: "تجديد جواز السفر",
                        serviceDescription: "خدمة إلكترونية تمكن المواطنين من تجديد جواز السفر دون الحاجة لزيارة مكاتب الجوازات.",
                        category: "خدمات السفر"
                    },
                    {
                        id: 3,
                        serviceName: "استخراج رخصة قيادة",
                        serviceDescription: "خدمة إلكترونية تتيح للمواطنين استخراج رخصة قيادة جديدة أو تجديد الرخصة الحالية.",
                        category: "خدمات المرور"
                    },
                    {
                        id: 4,
                        serviceName: "تسجيل مركبة جديدة",
                        serviceDescription: "خدمة إلكترونية تمكن المواطنين من تسجيل مركبة جديدة وإصدار لوحات مرورية لها.",
                        category: "خدمات المرور"
                    },
                    {
                        id: 5,
                        serviceName: "استخراج شهادة ميلاد",
                        serviceDescription: "خدمة إلكترونية تتيح للمواطنين استخراج شهادة ميلاد جديدة أو بدل فاقد.",
                        category: "خدمات مدنية"
                    },
                    {
                        id: 6,
                        serviceName: "دفع المخالفات المرورية",
                        serviceDescription: "خدمة إلكترونية تمكن المواطنين من الاستعلام عن المخالفات المرورية وسدادها إلكترونياً.",
                        category: "خدمات المرور"
                    }
                ];

                console.log("Using dummy services data:", dummyServices);
                setData(dummyServices);
                setFilter(dummyServices);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [id]);

    // Dialog handlers
    const handleClickOpen = (service) => {
        setSelectedService(service);
        setOpen(true);
    };

    // Focus on dialog description when opened
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);





    // State for search
    const [searchTerm, setSearchTerm] = useState('');

    // Filter services by category
    const filterProductsByCategory = async (cat) => {
        try {
            setLoading(true);
            setError(null);

            // الحصول على التوكن من localStorage
            const token = localStorage.getItem('token');

            // تحضير الهيدرز مع التوكن
            const headers = {
                'Content-Type': 'application/json'
            };

            // إضافة التوكن إذا كان موجوداً
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // 3. https://government-services.runasp.net/api/Services/Available?serviceCategory=خدمات المرور
            // تصفية الخدمات حسب الفئة
            const response = await fetch(`https://government-services.runasp.net/api/Services/Available?serviceCategory=${cat}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const filteredData = await response.json();
            console.log(`Filtered services by category '${cat}':`, filteredData);

            setFilter(filteredData);
        } catch (error) {
            console.error("Error filtering services by category:", error);
            toast.error("حدث خطأ في تصفية البيانات");

            // Fallback to local filtering
            const updatedList = data.filter((service) => service.category === cat);
            setFilter(updatedList);
        } finally {
            setLoading(false);
        }
    };

    // Search services by name
    const searchServices = async () => {
        if (!searchTerm.trim()) {
            setFilter(data);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // الحصول على التوكن من localStorage
            const token = localStorage.getItem('token');

            // تحضير الهيدرز مع التوكن
            const headers = {
                'Content-Type': 'application/json'
            };

            // إضافة التوكن إذا كان موجوداً
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // 2. https://government-services.runasp.net/api/Services/Available?ServiceName=Gov
            // البحث عن خدمات بناءً على اسم الخدمة
            const response = await fetch(`https://government-services.runasp.net/api/Services/Available?ServiceName=${searchTerm}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const searchResults = await response.json();
            console.log(`Search results for '${searchTerm}':`, searchResults);

            setFilter(searchResults);
        } catch (error) {
            console.error("Error searching services:", error);
            toast.error("حدث خطأ في البحث");

            // Fallback to local search
            const searchResults = data.filter((service) =>
                service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilter(searchResults);
        } finally {
            setLoading(false);
        }
    };

    // Card animation variants
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    // Services display component
    const ShowServices = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Alert severity="error" sx={{ my: 2 }}>
                    {error}
                </Alert>
            );
        }

        if (filter.length === 0) {
            return (
                <Alert severity="info" sx={{ my: 2 }}>
                    لا توجد خدمات متاحة في هذه الفئة
                </Alert>
            );
        }

        return (
            <div className="row">
                {filter.map((item, index) => (
                    <div className="col-md-4 mb-4" key={item.id || index}>
                        <motion.div
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: 3,
                                    transition: 'all 0.3s ease'
                                }}
                                className="h-100"
                            >
                                <CardActionArea onClick={() => handleClickOpen(item)}>
                                    <CardMedia
                                        component="img"
                                        height="180"
                                        image="./assets/Image1_8201622134118.png"
                                        alt={item.serviceName}
                                        sx={{
                                            objectFit: 'contain',
                                            p: 2
                                        }}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div" align="center">
                                            {item.serviceName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" align="center">
                                            {item.serviceDescription?.substring(0, 100)}
                                            {item.serviceDescription?.length > 100 ? '...' : ''}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleRequestService(item)}
                                        sx={{
                                            borderRadius: '20px',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-3px)',
                                                boxShadow: 4
                                            }
                                        }}
                                    >
                                        طلب الخدمة
                                    </Button>
                                </CardActions>
                            </Card>
                        </motion.div>
                    </div>
                ))}
            </div>
        );
    };











        const [selected, setSelected] = useState('all');





    // Function to download required files
    const downloadRequiredFile = (fileId) => {
        // 5. https://government-services.runasp.net/api/Files/Required/Download/1
        // تنزيل ملف مطلوب محدد برقم معرف
        try {
            // الحصول على التوكن من localStorage
            const token = localStorage.getItem('token');

            // إنشاء URL مع التوكن كمعلمة استعلام
            let downloadUrl = `https://government-services.runasp.net/api/Files/Required/Download/${fileId}`;

            // إضافة التوكن إذا كان موجوداً
            if (token) {
                // يمكن استخدام هذه الطريقة إذا كان الخادم يدعم تمرير التوكن كمعلمة استعلام
                // downloadUrl += `?token=${token}`;

                // أو يمكن استخدام طريقة أخرى مثل إنشاء عنصر a وتعيين الهيدرز
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.target = '_blank';

                // إضافة التوكن كهيدر (لن يعمل مباشرة في المتصفح، ولكن يمكن استخدام طرق أخرى)
                // يمكن استخدام fetch بدلاً من window.open
                fetch(downloadUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    link.href = url;
                    link.download = `file-${fileId}.pdf`; // اسم افتراضي للملف
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    toast.success("جاري تنزيل الملف");
                })
                .catch(error => {
                    console.error("Error downloading file:", error);
                    toast.error("حدث خطأ أثناء تنزيل الملف");
                });

                return; // الخروج من الدالة بعد بدء التنزيل
            }

            // إذا لم يكن هناك توكن، استخدم الطريقة العادية
            window.open(downloadUrl, '_blank');
            toast.success("جاري تنزيل الملف");
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("حدث خطأ أثناء تنزيل الملف");
        }
    };

    // Function to submit service request - لن نستخدمها حاليًا
    // نحتفظ بها للمستقبل في حالة الحاجة إليها
    const _submitServiceRequest = async (serviceId, formData) => {
        try {
            // الحصول على التوكن من localStorage (اختياري)
            const token = localStorage.getItem('token');

            // تحضير الهيدرز
            const headers = {
                'Content-Type': 'application/json'
            };

            // إضافة التوكن إذا كان موجوداً (اختياري)
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // 8. https://government-services.runasp.net/api/Requests/Submit
            // إرسال طلب خدمة جديد
            const response = await fetch('https://government-services.runasp.net/api/Requests/Submit', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    serviceId: serviceId,
                    ...formData
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Request submitted successfully:", result);
                toast.success("تم إرسال الطلب بنجاح");
                navigate("/my-requests");
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Error submitting request:", response.status, errorData);
                toast.error(errorData.message || "فشل في إرسال الطلب");
            }
        } catch (error) {
            console.error("Error submitting request:", error);
            toast.error("حدث خطأ أثناء إرسال الطلب");
        }
    };

    return(
    <>
        <div className="container text-center my-4 ">
           <h1 className="text-primary pt-4 ">دليل الخدمات</h1>
           <p className="lead">اختر الفئة المناسبة لعرض الخدمات المتاحة.</p>

           {/* شريط البحث */}
           <div className="row justify-content-center mb-4">
               <div className="col-md-6">
                   <div className="input-group">
                       <input
                           type="text"
                           className="form-control"
                           placeholder="ابحث عن خدمة..."
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                       />
                       <button
                           className="btn btn-primary"
                           type="button"
                           onClick={searchServices}
                       >
                           بحث
                       </button>
                   </div>
               </div>
           </div>
        </div>

        {/* <!-- أزرار التصنيف --> */}
        <div className="container text-center mb-4">
      <ToggleButton
        className={`btn btn-outline-dark btn-sm m-2 btn-category ${selected === 'all' ? 'active' : ''}`}
        onClick={() => {
          setSelected('all');
          setFilter(data);
        }}
        value="all"
      >
        الكل
      </ToggleButton>

      <ToggleButton
        className={`btn btn-outline-dark btn-sm m-2 btn-category ${selected === 'civil' ? 'active' : ''}`}
        onClick={() => {
          setSelected('civil');
          filterProductsByCategory("خدمات مدنية");
        }}
        value="civil"
      >
        تقديم الطلبات
      </ToggleButton>

      <ToggleButton
        className={`btn btn-outline-dark btn-sm m-2 btn-category ${selected === 'travel' ? 'active' : ''}`  }
        onClick={() => {
          setSelected('travel');
          filterProductsByCategory("خدمات السفر");
        }}
        value="travel"
      >
        الدفع الالكتروني
      </ToggleButton>

      <ToggleButton
        className={`btn btn-outline-dark btn-sm m-2 btn-category ${selected === 'traffic' ? 'active' : ''}`}
        onClick={() => {
          setSelected('traffic');
          filterProductsByCategory("خدمات المرور");
        }}
        value="traffic"
      >
        خدمات المرور
      </ToggleButton>
    </div>
        <div className="container">
            <div className="row"> <ShowServices/></div>
        </div>

        {/* نافذة تفاصيل الخدمة */}
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            scroll={scroll}
            aria-labelledby="service-dialog-title"
            aria-describedby="service-dialog-description"
            maxWidth="md"
            fullWidth
        >
            {selectedService && (
                <>
                    <DialogTitle id="service-dialog-title">
                        {selectedService.serviceName}
                    </DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        <DialogContentText
                            id="service-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                        >
                            <Typography variant="h6" gutterBottom>
                                وصف الخدمة
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {selectedService.serviceDescription || 'لا يوجد وصف متاح'}
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                                متطلبات الخدمة
                            </Typography>
                            <ul>
                                <li>بطاقة الهوية الوطنية سارية المفعول</li>
                                <li>صورة شخصية حديثة</li>
                                <li>إثبات محل الإقامة</li>
                                <li>سداد الرسوم المقررة</li>
                            </ul>

                            <Typography variant="h6" gutterBottom>
                                الملفات المطلوبة
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => downloadRequiredFile(selectedService.id || 1)}
                                    startIcon={<i className="fas fa-download"></i>}
                                    sx={{ mb: 1, mr: 1 }}
                                >
                                    نموذج الطلب
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => downloadRequiredFile(2)}
                                    startIcon={<i className="fas fa-download"></i>}
                                    sx={{ mb: 1, mr: 1 }}
                                >
                                    قائمة المستندات المطلوبة
                                </Button>
                            </Box>

                            <Typography variant="h6" gutterBottom>
                                خطوات الحصول على الخدمة
                            </Typography>
                            <ol>
                                <li>تسجيل الدخول إلى النظام</li>
                                <li>اختيار الخدمة المطلوبة</li>
                                <li>تعبئة النموذج المطلوب</li>
                                <li>إرفاق المستندات المطلوبة</li>
                                <li>تقديم الطلب ومتابعة حالته</li>
                            </ol>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)} color="inherit">
                            إغلاق
                        </Button>
                        <Button
                            onClick={() => {
                                handleRequestService(selectedService);
                                setOpen(false);
                            }}
                            color="primary"
                            variant="contained"
                        >
                            طلب الخدمة
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    </>
   )
}



export default Products