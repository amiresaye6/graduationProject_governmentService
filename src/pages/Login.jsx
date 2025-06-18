import React, { useState } from "react";
import  HeaderTemp  from "../Components/HeaderTemp";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";
// import AdminDashboard from "./AdminDashboard";

const Login =()  => {
    const navigate = useNavigate();
    const { login } = useAuth(); // استخدام useAuth للوصول إلى وظيفة login
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // حالة لتتبع عملية تسجيل الدخول
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

                // عرض رسالة نجاح
                // alert('تم تسجيل الدخول بنجاح!');

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

    return(
        <>
        <HeaderTemp/>
        <div className="login-container m-3 d-flex justify-content-center align-items-center">
             {/* <!-- Welcome Section --> */}
            <div className="col-md-4 welcome-section">
              <h2 className="">مرحباً بك !</h2>
             <p>للإستمتاع بكامل خدمات الإدارة يرجى تسجيل الدخول أو إنشاء حساب جديد</p>
             <button className="btn btn-custom btn-login " onclick="createAccount()"><Link to="/register" className="text-decoration-none text-light">انشاء حساب جديد</Link></button>
            </div>

            {/* <!-- Login Form Section --> */}
            <div className="col-md-4 login-form align-items-center my-4 shadow-lg ">
                <h3 className="m-4 text-center">تسجيل الدخول</h3>

                {/* عرض رسالة الخطأ إذا كانت موجودة */}
                {error && (
                    <div className="alert alert-danger mx-3" role="alert">
                        {error}
                    </div>
                )}

                <form id="loginForm" onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email">البريد الإلكتروني</label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="أدخل البريد الإلكتروني"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="أدخل كلمة المرور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    {/* <!-- reCAPTCHA --> */}
                    <div className="form-check mb-3 border-black">
                        <input
                            type="checkbox"
                            id="captcha"
                            className="form-check-input"
                            required
                            disabled={loading}
                        />
                        <label htmlFor="captcha" className="form-check-label">I'm not a robot</label>
                    </div>
                    {/* <!-- Submit Button --> */}
                    <div className="text-center p-3">
                        <button
                            type="submit"
                            className="btn btn-login text-white"
                            disabled={loading}
                        >
                            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                        </button>
                    </div>
                </form>
                <div className="Forgett text-center mt-3 mb-3">
                    <a href="forget" onClick={(e) => e.preventDefault()}>نسيت كلمة المرور؟</a>
                </div>
            </div>
        </div>
        </>
    )
}
export default Login






