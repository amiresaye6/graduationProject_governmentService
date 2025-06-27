import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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

function Products() {
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [selected, setSelected] = useState('all');
    const navigate = useNavigate();

    // Dialog state
    const [open, setOpen] = useState(false);
    const [scroll] = useState('paper');
    const descriptionElementRef = useRef(null);
    const [serviceDetails, setServiceDetails] = useState(null);

    // Fetch services data from API
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
                // if (token) {
                //     headers['Authorization'] = `Bearer ${token}`;
                // }

                console.log("Fetching services with headers:", headers);
                const response = await fetch('https://government-services.runasp.net/api/Services/Available', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    mode: 'cors',
                    // credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const apiData = await response.json();

                // عرض البيانات بشكل مفصل في وحدة التحكم
                console.log("===== SERVICES DATA FROM API =====");
                console.log("Total services:", apiData.length);

                // تجميع الخدمات حسب الفئة
                const categoriesMap = {};
                apiData.forEach(service => {
                    if (!categoriesMap[service.category]) {
                        categoriesMap[service.category] = [];
                    }
                    categoriesMap[service.category].push(service);
                });

                // عرض الفئات والخدمات في كل فئة
                console.log("Categories found:", Object.keys(categoriesMap));
                Object.keys(categoriesMap).forEach(category => {
                    console.log(`\n--- Category: ${category} (${categoriesMap[category].length} services) ---`);
                    categoriesMap[category].forEach(service => {
                        console.log(`ID: ${service.id}, Name: ${service.serviceName}`);
                    });
                });

                console.log("\nRaw API data:", apiData);

                setData(apiData);

                // تحديد فئة افتراضية (خدمات مدنية) بدلاً من عرض جميع الخدمات
                const civilServices = apiData.filter(service => service.category === "خدمات مدنية");
                if (civilServices.length > 0) {
                    setFilter(civilServices);
                    setSelected('civil'); // تحديث الزر المحدد
                } else {
                    setFilter(apiData);
                }

                setError(null);

            } catch (error) {
                console.error("Error fetching services:", error);
                setError("حدث خطأ في جلب البيانات من الخادم");

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

                // تحديد فئة افتراضية (خدمات مدنية) في البيانات الوهمية
                const civilServices = dummyServices.filter(service => service.category === "خدمات مدنية");
                if (civilServices.length > 0) {
                    setFilter(civilServices);
                    setSelected('civil'); // تحديث الزر المحدد
                } else {
                    setFilter(dummyServices);
                }

                // عرض رسالة للمستخدم
                toast.error("تم استخدام بيانات محلية بسبب مشكلة في الاتصال بالخادم");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);


    const fetchServiceDetails = async (serviceId) => {
        try {
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

            const response = await fetch(`https://government-services.runasp.net/api/Services/${serviceId}/Details`, {
                method: 'GET',
                headers: headers,
                mode: 'cors',
                // credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch service details: ${response.status}`);
            }

            const details = await response.json();
            console.log("Service Details:", details);
            setServiceDetails(details);
        } catch (error) {
            console.error('Error fetching service details:', error);
            toast.error("حدث خطأ في جلب تفاصيل الخدمة");
        }
    };
    // Handle request service button click
    const handleRequestService = (service) => {
        // توجيه المستخدم مباشرة إلى صفحة النموذج دون الحاجة لتسجيل الدخول
        navigate("/Form", {
            state: {
                service: service,
                // إضافة بيانات إضافية قد تكون مفيدة في صفحة النموذج
                requestInfo: {
                    serviceId: service.id,
                    serviceName: service.serviceName,
                    requestDate: new Date().toISOString(),
                    status: "Pending"
                }
            }
        });

        toast.success("تم الانتقال إلى نموذج طلب الخدمة");
    };

    // Dialog handlers
    const handleClickOpen = (service) => {
        setSelectedService(service);
        setOpen(true);
        fetchServiceDetails(service.id); // Fetch the full details
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedService(null);
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

    // Filter services by category using API
    const filterProducts = async (cat) => {
        try {
            setLoading(true);
            setError(null);

            console.log(`Filtering by category: ${cat}`);
            // ترميز اسم الفئة للاستخدام في عنوان URL
            const encodedCategory = encodeURIComponent(cat);
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

            // استخدام التصفية المحلية أولاً لتحسين تجربة المستخدم
            const localFilteredData = data.filter((service) => service.category === cat);
            setFilter(localFilteredData);

            // ثم محاولة الحصول على البيانات من واجهة برمجة التطبيقات
            console.log(`Fetching from API: https://government-services.runasp.net/api/Services/Available?serviceCategory=${encodedCategory}`);

            const response = await fetch(`https://government-services.runasp.net/api/Services/Available?serviceCategory=${encodedCategory}`, {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                console.warn(`API returned status: ${response.status}`);
                // إذا فشل الطلب، نستمر باستخدام البيانات المصفاة محلياً
                return;
            }

            const filteredData = await response.json();
            console.log(`Filtered services by category '${cat}':`, filteredData);

            // إذا كانت البيانات من واجهة برمجة التطبيقات فارغة، نستمر باستخدام البيانات المصفاة محلياً
            if (filteredData && filteredData.length > 0) {
                setFilter(filteredData);
            } else {
                console.log("API returned empty data, using local filtering");
            }
        } catch (error) {
            console.error("Error filtering services by category:", error);
            // لا نعرض رسالة خطأ للمستخدم لأننا نستخدم التصفية المحلية كاحتياط
            console.log("Using local filtering as fallback");
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

    return(
    <>
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container text-center my-4"
        >
           <h1 className="text-primary pt-4">دليل الخدمات</h1>
           <p className="lead">اختر الفئة المناسبة لعرض الخدمات المتاحة.</p>
        </motion.div>

        {/* <!-- أزرار التصنيف --> */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="container text-center mb-4"
        >
            <ToggleButton
                className={`btn btn-outline-dark btn-sm m-2 btn-category ${selected === 'all' ? 'active' : ''}`}
                onClick={async () => {
                    setSelected('all');
                    try {
                        setLoading(true);
                        const response = await fetch('https://government-services.runasp.net/api/Services/Available');
                        if (response.ok) {
                            const allServices = await response.json();
                            setFilter(allServices);
                        } else {
                            // Fallback to existing data
                            setFilter(data);
                        }
                    } catch (error) {
                        console.error("Error fetching all services:", error);
                        setFilter(data);
                    } finally {
                        setLoading(false);
                    }
                }}
                value="all"
                sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-3px)' }
                }}
            >
                الكل
            </ToggleButton>

            <ToggleButton
                className={`btn btn-outline-dark btn-sm m-2 btn-category ${selected === 'civil' ? 'active' : ''}`}
                onClick={async () => {
                    setSelected('civil');
                    await filterProducts("النقل");
                }}
                value="civil"
                sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-3px)' }
                }}
            >
             خدمات النقل
            </ToggleButton>

            <ToggleButton
                className={`btn btn-outline-dark btn-sm m-2 btn-category ${selected === 'travel' ? 'active' : ''}`}
                onClick={async () => {
                    setSelected('travel');
                    await filterProducts("السفر");
                }}
                value="travel"
                sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-3px)' }
                }}
            >
                خدمات السفر
            </ToggleButton>

            <ToggleButton
                className={`btn btn-outline-dark btn-sm m-2 btn-category ${selected === 'traffic' ? 'active' : ''}`}
                onClick={async () => {
                    setSelected('traffic');
                    await filterProducts("السجل المدني");
                }}
                value="traffic"
                sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-3px)' }
                }}
            >
                السجل المدني
            </ToggleButton>
        </motion.div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="container"
        >
            <div className="row">
                <ShowServices/>
            </div>
        </motion.div>

        {/* Service Details Dialog */}
        <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="service-dialog-title"
            aria-describedby="service-dialog-description"
            maxWidth="md"
            fullWidth
        >
            {selectedService && serviceDetails && (
                <>
                    <DialogTitle id="service-dialog-title" style={{ fontWeight: 'bold' }}>
                        {selectedService.serviceName}
                    </DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        <DialogContentText
                            id="service-dialog-description"
                            ref={descriptionElementRef}
                            tabIndex={-1}
                        >
                            <Typography variant="h6" gutterBottom style={{ color: 'green', fontWeight: 'bold' }}>
                                وصف الخدمة
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }} >
                                {selectedService.serviceDescription || 'لا يوجد وصف متاح'}
                            </Typography>

                            <Typography variant="h6" gutterBottom style={{ color: 'green', fontWeight: 'bold' }}>متطلبات الخدمة </Typography>

                                {/* Render requirements if available */}
                                {serviceDetails.requirements && serviceDetails.requirements.length > 0 ? (
                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                    {serviceDetails.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                    ))}
                                    {/* عرض السعر بعد المتطلبات */}
                                    {serviceDetails.fee && (
                                    <li >
                                        رسوم الخدمة: {serviceDetails.fee} ج.م
                                    </li>
                                    )}
                                </ul>
                                ) : (
                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                    {/* لو مفيش متطلبات، فقط عرض السعر لو موجود */}
                                    {serviceDetails.fee ? (
                                    <li >
                                        رسوم الخدمة: {serviceDetails.fee} ج.م
                                    </li>
                                    ) : (
                                    <Typography variant="body2">لا توجد متطلبات</Typography>
                                    )}
                                </ul>
                                )}


                                <Typography variant="h6" gutterBottom style={{ color: 'green', fontWeight: 'bold' }}>
                                خطوات الحصول على الخدمة
                                </Typography>

                                {/* Render steps if available */}
                                {serviceDetails.steps && serviceDetails.steps.length > 0 ? (
                                <ol style={{ paddingLeft: '20px' }}>
                                    {serviceDetails.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                    ))}

                                    {/* إضافة مدة تنفيذ الخدمة */}
                                    {serviceDetails.processingTime && (
                                    <li >
                                        مدة تنفيذ الخدمة: {serviceDetails.processingTime}
                                    </li>
                                    )}

                                    {/* إضافة بيانات التواصل لو موجودة */}
                                    {serviceDetails.contactInfo && (
                                    <li >
                                        للتواصل: {serviceDetails.contactInfo}
                                    </li>
                                    )}
                                </ol>
                                ) : (
                                        <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                                            {/* لو مفيش متطلبات، فقط عرض السعر لو موجود */}
                                             {/* إضافة بيانات التواصل لو موجودة */}
                                                {serviceDetails.processingTime && (
                                                <li >
                                                مدة تنفيذ الخدمة: {serviceDetails.processingTime}
                                                </li>
                                             )}
                                            {serviceDetails.contactInfo ? (
                                            <li >
                                                للتواصل: {serviceDetails.contactInfo}
                                            </li>
                                            ) : (
                                            <Typography variant="body2">لا توجد متطلبات</Typography>
                                            )}
                                        </ul>

                                    ) }


                                <Typography variant="h6" gutterBottom style={{ color: 'green', fontWeight: 'bold' }}>المستندات المطلوبة:</Typography>

                                {serviceDetails.requiredFiles && serviceDetails.requiredFiles.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {serviceDetails.requiredFiles.map((file, index) => (
                                    <li key={index} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginRight: '10px' }}>
                                        {file.fileName}
                                        </Typography>

                                        {/* زر التحميل مع أيقونة */}
                                        {file.fileName.endsWith('.pdf') && (
                                        <a
                                            href={`https://your-download-link.com/${file.fileName}`} // <-- عدلي هنا بالرابط الصحيح للملف
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                            marginLeft: 'auto',
                                            textDecoration: 'none',
                                            color: '#1976d2',
                                            display: 'flex',
                                            alignItems: 'center'
                                            }}
                                        >
                                            <i className="fas fa-file-pdf" style={{ fontSize: '20px', marginRight: '5px' }}></i>
                                            تحميل PDF
                                        </a>
                                        )}
                                    </li>
                                    ))}
                                </ul>
                                ) : (
                                <Typography variant="body2" color="textSecondary">
                                    لا توجد مستندات مطلوبة
                                </Typography>
                                )}


                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="inherit">
                            إغلاق
                        </Button>
                        <Button
                            onClick={() => {
                                handleRequestService(selectedService);
                                handleClose();
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

export default Products;
