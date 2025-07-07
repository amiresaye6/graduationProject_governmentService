import React, { useState } from "react";
import { ThemeToggle } from "../Components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';
// import AdminDashboard from "./AdminDashboard";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); // استخدام useAuth للوصول إلى وظيفة login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // حالة لتتبع عملية تسجيل الدخول
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // التحقق من صحة المدخلات
        if (!email || !password) {
            setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // استخدام واجهة برمجة التطبيقات المحددة للمستخدمين العاديين
            const response = await fetch('https://government-services.runasp.net/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Login Response:', data);

            if (response.ok) {
                // ✅ تسجيل الدخول ناجح
                console.log('Login Success:', data);

                // تخزين بيانات المستخدم في localStorage
                localStorage.setItem('userName', data.userName || 'مستخدم النظام');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', data.userId || 'user_' + Date.now());

                // تخزين التوكن
                localStorage.setItem('token', data.token);

                // تخزين معلومات إضافية إذا كانت متوفرة
                if (data.userRole) localStorage.setItem('userRole', data.userRole);
                if (data.userPhone) localStorage.setItem('userPhone', data.userPhone);

                // تحديث حالة المصادقة
                login(); // استدعاء وظيفة login من AuthContext

                // الانتقال إلى صفحة الخدمات
                navigate("/admin");
            } else {
                // ❌ بيانات خاطئة أو خطأ من السيرفر
                setError(data.message || 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div style={{ backgroundColor: 'var(--background-default)', width: '100%', minHeight: '100vh' , maxWidth: '100vw',overflow: 'hidden',
               boxSizing: 'border-box'}}>
                <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                    {/* <!-- Welcome Section --> */}
                    <div className="col-md-3 welcome-section">
                        <h2 style={{ color: 'var(--primary-main)', fontWeight: 'bold', marginBottom: '1rem' }}>مرحباً بك !</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>للإستمتاع بكامل خدمات الإدارة</p>
                        {/* <Link to="/register" className="text-decoration-none">
                            <button className="btn-login" style={{ 
                                backgroundColor: 'var(--primary-main)', 
                                color: 'var(--primary-contrast-text)',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 6px var(--shadow-light)'
                            }}>
                                انشاء حساب جديد
                            </button>
                        </Link> */}
                    </div>

                    {/* <!-- Login Form Section --> */}
                    <div className="col-md-4 login-form my-4" style={{
                        backgroundColor: 'var(--background-paper)',
                        borderRadius: '15px',
                        padding: '30px',
                        boxShadow: '0 8px 20px var(--shadow-medium)',
                        transition: 'all 0.3s ease',
                        border: '1px solid var(--border-light)'
                    }}>
                        <h3 className="mb-4 text-center" style={{ color: 'var(--primary-main)', fontWeight: 'bold' }}>تسجيل الدخول</h3>

                        {/* عرض رسالة الخطأ إذا كانت موجودة */}
                        {error && (
                            <div className="alert alert-danger mx-3 mb-4" role="alert" style={{
                                borderRadius: '8px',
                                backgroundColor: 'var(--error-light)',
                                color: 'var(--error-main)',
                                border: '1px solid var(--error-main)'
                            }}>
                                {error}
                            </div>
                        )}

                        <form id="loginForm" onSubmit={handleLogin}>
                            <div className="">
                                <label htmlFor="email" style={{ color: 'var(--text-primary)', fontWeight: '500', marginBottom: '8px' }}>
                                    البريد الإلكتروني
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text" style={{ 
                                        backgroundColor: 'var(--background-paper)', 
                                         borderRadius:'6px',
                                        borderColor: 'var(--border-medium)'
                                    }}>
                                        <FaEnvelope color="var(--primary-main)" />
                                    </span>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="أدخل البريد الإلكتروني"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                        style={{ 
                                             borderRadius:'6px',
                                            backgroundColor: 'var(--background-paper)',
                                            color: 'var(--text-secondary)',
                                            borderColor: 'var(--border-medium)',
                                            padding: '10px',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" style={{ color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '8px' }}>
                                    كلمة المرور
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text" style={{ 
                                        backgroundColor: 'var(--background-paper)', 
                                         borderRadius:'6px',
                                        borderColor: 'var(--border-medium)'
                                    }}>
                                        <FaLock color="var(--primary-main)" />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="form-control"
                                        placeholder="أدخل كلمة المرور"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        style={{ 
                                            // borderRight: '2',
                                            // borderLeft: '4px',
                                            backgroundColor: 'var(--background-paper)',
                                            color: 'var(--text-secondary)',
                                            borderColor: 'var(--border-medium)',
                                            padding: '10px',
                                            transition: 'all 0.3s ease',
                                            borderRadius:'6px'
                                        }}
                                    />
                                    <span 
                                        className="input-group-text" 
                                        onClick={togglePasswordVisibility}
                                        style={{ 
                                            cursor: 'pointer', 
                                            backgroundColor: 'var(--background-paper)',
                                             borderRadius:'6px',
                                            borderColor: 'var(--border-medium)'
                                        }}
                                    >
                                        {showPassword ? 
                                            <FaEyeSlash color="var(--text-secondary)" /> : 
                                            <FaEye color="var(--text-secondary)" />
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* <!-- reCAPTCHA --> */}
                            {/* <div className="mb-4" style={{
                                padding: '15px',
                                borderRadius: '8px',
                                backgroundColor: 'var(--background-default)',
                                border: '1px solid var(--border-light)'
                            }}>
                                <div className="form-check d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        id="captcha"
                                        className="form-check-input"
                                        required
                                        disabled={loading}
                                        style={{ 
                                            width: '20px', 
                                            height: '20px',
                                            borderColor: 'var(--primary-light)',
                                            marginLeft: '10px'
                                        }}
                                    />
                                    <label 
                                        htmlFor="captcha" 
                                        className="form-check-label"
                                        style={{ 
                                            color: 'var(--text-primary)',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <img 
                                            src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                                            alt="reCAPTCHA" 
                                            style={{ width: '30px', marginLeft: '10px' }}
                                        />
                                        I'm not a robot
                                    </label>
                                </div>
                            </div> */}

                            {/* <!-- Submit Button --> */}
                            <div className="text-center p-3">
                                <button
                                    type="submit"
                                    className="btn-login text-white"
                                    disabled={loading}
                                    style={{ 
                                        backgroundColor: 'var(--primary-main)',
                                        color: 'var(--primary-contrast-text)',
                                        border: 'none',
                                        padding: '12px 30px',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        width: '100%',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 6px var(--shadow-light)'
                                    }}
                                >
                                    {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-4 mb-2">
                            <a 
                                href="forget" 
                                onClick={(e) => e.preventDefault()}
                                style={{ 
                                    color: 'var(--primary-main)',
                                    textDecoration: 'none',
                                    fontWeight: '500',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                نسيت كلمة المرور؟
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <ThemeToggle />
        </>
    )
}
export default Login
