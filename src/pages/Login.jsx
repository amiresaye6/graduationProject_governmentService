import React, { useState } from "react";
import { ThemeToggle } from "../Components";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }
        try {
            setLoading(true);
            setError('');
            const response = await fetch('https://government-services.runasp.net/Auth/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('userName', data.firstName || 'مستخدم النظام');
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', data.adminID || 'user_' + Date.now());
                localStorage.setItem('token', data.token);
                login();
                navigate("/admin");
            } else {
                setError(data.message || 'فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد الخاصة بك.');
            }
        } catch (error) {
            setError('خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى لاحقًا.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                style={{
                    backgroundColor: 'var(--background-default)',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 1rem'
                }}
            >
                <div
                    className="container"
                    style={{
                        maxWidth: 960,
                        width: '100%',
                        background: 'var(--background-paper)',
                        borderRadius: 18,
                        boxShadow: '0 8px 32px var(--shadow-medium)',
                        padding: '2.5rem 0.5rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0
                    }}
                >
                    {/* Welcome Section */}
                    <div
                        className="welcome-section"
                        style={{
                            flex: '1 1 320px',
                            minWidth: 280,
                            maxWidth: 350,
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRight: '1px solid var(--border-light)',
                        }}
                    >
                        <h2
                            style={{
                                color: 'var(--primary-main)',
                                fontWeight: 700,
                                marginBottom: '1rem',
                                fontSize: '2rem',
                                letterSpacing: '-0.5px'
                            }}
                        >
                            مرحباً بك !
                        </h2>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1.1rem',
                            marginBottom: '2rem',
                            textAlign: 'center'
                        }}>
                            للإستمتاع بكامل خدمات الإدارة
                        </p>
                    </div>

                    {/* Login Form Section */}
                    <div
                        className="login-form"
                        style={{
                            flex: '2 1 400px',
                            minWidth: 300,
                            padding: '2rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <h3
                            className="mb-4"
                            style={{
                                color: 'var(--primary-main)',
                                fontWeight: 700,
                                textAlign: 'center',
                                marginBottom: '1.5rem'
                            }}
                        >
                            تسجيل الدخول
                        </h3>

                        {/* Error Message */}
                        {error && (
                            <div
                                className="alert alert-danger"
                                role="alert"
                                aria-live="assertive"
                                style={{
                                    borderRadius: 8,
                                    backgroundColor: 'var(--error-light)',
                                    color: 'var(--error-main)',
                                    border: '1px solid var(--error-main)',
                                    width: '100%',
                                    marginBottom: 20,
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <form
                            id="loginForm"
                            autoComplete="on"
                            onSubmit={handleLogin}
                            style={{ width: '100%', maxWidth: 380 }}
                        >
                            {/* Email Field */}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label w-100 text-end fw-medium">
                                    البريد الإلكتروني
                                </label>
                                <div className="input-group flex-row-reverse">
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control text-end"
                                        placeholder="أدخل البريد الإلكتروني"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                        autoComplete="email"
                                        dir="rtl"
                                    />
                                    <span className="input-group-text bg-white border-start-0">
                                        <FaEnvelope />
                                    </span>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label w-100 text-end fw-medium">
                                    كلمة المرور
                                </label>
                                <div className="input-group flex-row-reverse">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        className="form-control text-end"
                                        placeholder="أدخل كلمة المرور"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                        autoComplete="current-password"
                                        dir="rtl"
                                    />
                                    <span
                                        className="input-group-text bg-white border-start-0"
                                        style={{ cursor: 'pointer' }}
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="text-center p-2">
                                <button
                                    type="submit"
                                    className="btn-login"
                                    disabled={loading}
                                    style={{
                                        backgroundColor: 'var(--primary-main)',
                                        color: 'var(--primary-contrast-text)',
                                        border: 'none',
                                        padding: '12px 0',
                                        borderRadius: 8,
                                        fontWeight: 700,
                                        width: '100%',
                                        fontSize: '1rem',
                                        transition: 'background 0.2s, box-shadow 0.2s',
                                        boxShadow: '0 4px 10px var(--shadow-light)',
                                        outline: 'none'
                                    }}
                                >
                                    {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-3">
                            <Link to="/reset">
                                نسيت كلمة المرور؟
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <ThemeToggle />
        </>
    );
};

export default Login;