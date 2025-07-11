import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VpnKeyIcon from '@mui/icons-material/Key';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ReactComponent as CitioLogo } from '../assets/citio(1).svg';
import axiosInstance from './axiosConfig';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState('email'); // 'email', 'verification', 'newPassword'
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [emailError, setEmailError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  // New password form states
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // API related states
  const [resetToken, setResetToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password === confirmPassword && password !== '';

  // Calculate password strength
  const getPasswordStrength = () => {
    const criteria = [hasMinLength, hasUppercase, hasLowercase, hasNumber];
    const score = criteria.filter(Boolean).length;

    if (score === 0) return { label: 'ضعيف', color: 'var(--error-main)', progress: 0 };
    if (score <= 2) return { label: 'ضعيف', color: 'var(--error-main)', progress: 25 };
    if (score === 3) return { label: 'متوسط', color: 'var(--warning-main)', progress: 50 };
    if (score === 4) return { label: 'قوي', color: 'var(--success-main)', progress: 100 };
  };

  const strength = getPasswordStrength();

  // Load Google Fonts and set RTL direction
  useEffect(() => {
    // Load Arabic font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.body.style.direction = '';
      document.body.style.fontFamily = '';
    };
  }, []);

  // Timer for verification code
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle verification code input
  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle email submission using forgot-password API
  const handleSendCode = async () => {
    if (!email) {
      setEmailError('يرجى إدخال عنوان البريد الإلكتروني');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('يرجى إدخال عنوان بريد إلكتروني صحيح');
      return;
    }

    setEmailError('');
    setIsSubmitting(true);
    setIsSending(true);

    try {
      console.log('Sending forgot password request for email:', email);
      
      const response = await axios.post(
        '/gateway/government/Account/forgot-password',
        { email: email },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Forgot password response:', response);

      // Check if request was successful
      if (response.status >= 200 && response.status < 300) {
        setCurrentState('verification');
        setTimeLeft(300);
        setIsTimerActive(true);
        setVerificationError('');
        alert('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
      } else {
        throw new Error('Failed to send verification code');
      }
    } catch (error) {
      console.error('Error sending reset code:', error);
      
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error || 'حدث خطأ في إرسال رمز التحقق';
        
        if (statusCode === 404) {
          setEmailError('البريد الإلكتروني غير مسجل في النظام');
        } else if (statusCode === 400) {
          setEmailError('البريد الإلكتروني غير صحيح');
        } else {
          setEmailError(errorMessage);
        }
      } else if (error.request) {
        // Network error
        setEmailError('خطأ في الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت');
      } else {
        // Other error
        setEmailError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى');
      }
    } finally {
      setIsSubmitting(false);
       setIsSending(false);
    }
  };

  // Handle verification using verify-otp API
  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setVerificationError('يرجى إدخال رمز التحقق كاملاً');
      return;
    }

    setIsSubmitting(true);
    setVerificationError('');
    setIsVerifying(true);

    try {
      console.log('Verifying OTP for email:', email, 'OTP:', code);
      
      const response = await axios.post(
        '/gateway/government/Account/verify-otp',
        {
          email: email,
          otp: code
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('OTP verification response:', response);

      if (response.status >= 200 && response.status < 300) {
        setVerificationError('');
        setCurrentState('newPassword');
        
        // Get reset token from response
        if (response.data && response.data.resetToken) {
          setResetToken(response.data.resetToken);
        } else if (response.data && response.data.token) {
          setResetToken(response.data.token);
        } else {
          // If no token in response, we'll use email and OTP for password reset
          setResetToken(code); // Use OTP as temporary token
        }
        
        alert('تم التحقق بنجاح!');
      } else {
        throw new Error('OTP verification failed');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error;
        
        if (statusCode === 400) {
          setVerificationError('رمز التحقق غير صحيح أو منتهي الصلاحية');
        } else if (statusCode === 404) {
          setVerificationError('لم يتم العثور على طلب إعادة تعيين كلمة المرور');
        } else {
          setVerificationError(errorMessage || 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى');
        }
      } else if (error.request) {
        setVerificationError('خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى');
      } else {
        setVerificationError('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى');
      }
    } finally {
      setIsSubmitting(false);
      setIsVerifying(false);
    }
  };

  // Resend code
  const handleResendCode = async () => {
    setVerificationError('');
    setVerificationCode(['', '', '', '', '', '']);
    await handleSendCode();
  };

  // Change email
  const handleChangeEmail = () => {
    setCurrentState('email');
    setEmail('');
    setEmailError('');
    setVerificationError('');
    setIsTimerActive(false);
    setTimeLeft(300);
    setVerificationCode(['', '', '', '', '', '']);
  };

  // Handle password reset submission using API
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !passwordsMatch) {
      alert('يرجى التأكد من أن كلمة المرور تلبي جميع المتطلبات');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Resetting password for email:', email);
      
      const response = await axios.post(
        '/gateway/government/Account/reset-password',
        {
          email: email,
          resetToken: resetToken,
          newPassword: password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Password reset response:', response);

      if (response.status >= 200 && response.status < 300) {
        alert('تم إعادة تعيين كلمة المرور بنجاح!');
        navigate('/login');
      } else {
        throw new Error('Password reset failed');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      
      if (error.response) {
        const statusCode = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error;
        
        if (statusCode === 400) {
          alert('بيانات غير صحيحة. يرجى المحاولة مرة أخرى');
        } else if (statusCode === 404) {
          alert('لم يتم العثور على طلب إعادة تعيين كلمة المرور');
        } else {
          alert(errorMessage || 'حدث خطأ في إعادة تعيين كلمة المرور');
        }
      } else if (error.request) {
        alert('خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى');
      } else {
        alert('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validation Item Component
  const ValidationItem = ({ condition, text }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '4px 0',
      fontSize: '14px',
      color: condition ? 'var(--success-main)' : 'var(--text-secondary)'
    }}>
      <span style={{
        marginLeft: '8px',
        fontSize: '16px',
        color: condition ? 'var(--success-main)' : 'var(--error-main)'
      }}>
        {condition ? '✓' : '✗'}
      </span>
      {text}
    </div>
  );

  const ShieldIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H15.5C16.4,11 17,11.4 17,12V16C17,16.6 16.6,17 16,17H8C7.4,17 7,16.6 7,16V12C7,11.4 7.4,11 8,11H8.5V10C8.5,8.6 9.6,7 12,7M12,8.2C10.2,8.2 9.8,9.2 9.8,10V11H14.2V10C14.2,9.2 13.8,8.2 12,8.2Z"/>
    </svg>
  );

  return (
    <div 
      className="container-fluid"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        direction: 'rtl',
        fontFamily: 'Tajawal, Arial, sans-serif'
      }}
    >
      <div
        className="col-12 col-sm-8 col-md-6 col-lg-5"
        style={{
          maxWidth: '480px',
          backgroundColor: 'var(--background-default)',
          textAlign: 'center',
          marginTop:'-20px',
          marginBottom:'20px'
        }}
      >
        <div className="logo-container" style={{margin:'10px auto 10px 150px'}}>
          <CitioLogo className="logo-svg"  />
        </div>

         {currentState === 'email' ? (
          // Email Input State
          <>
            <div style={{width: '70px',height: '70px',backgroundColor: 'var(--primary-white)',borderRadius: '50%',display: 'flex',
              alignItems: 'center', justifyContent: 'center',margin: '0 auto 20px auto'}}
            >   
              <VpnKeyIcon  sx={{ fontSize: 36, color: 'var(--primary-main)', transform: 'rotate(45deg)' }}/>
            </div>
            <h2
              style={{ fontSize: '32px',fontWeight: 'bold',color: 'var(--text-primary)', marginBottom: '8px', margin: '0 0 8px 0'
              }}
            >
              إعادة تعيين كلمة المرور
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                fontSize: '16px',
                margin: '0 0 32px 0'
              }}
            >
              أدخل عنوان بريدك الإلكتروني وسنرسل لك رمز التحقق
            </p>


           <div  
            style={{      
              backgroundColor: 'var(--background-paper)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px var(--shadow-medium)',
              maxWidth: '480px',
              textAlign: 'center',
              padding: '48px 32px'}}>

            <div style={{ textAlign: 'right', marginBottom: '16px' }}>
              <label
                style={{
                  color: 'var(--text-primary)',
                  fontWeight: '500',
                  marginBottom: '8px',
                  display: 'block'
                }}
              >
                عنوان البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني المسجل"
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: `2px solid ${emailError ? 'var(--error-main)' : 'var(--border-medium)'}`,
                  fontSize: '16px',
                  outline: 'none',
                  direction: 'ltr',
                  textAlign: 'left',
                  backgroundColor: 'var(--background-paper)',
                  color: 'var(--text-primary)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = emailError ? 'var(--error-main)' : 'var(--primary-main)';
                }}
              />
              {emailError && (
                <div
                  style={{
                    color: 'var(--error-main)',
                    fontSize: '14px',
                    marginTop: '4px',
                    textAlign: 'right'
                  }}
                >
                  {emailError}
                </div>
              )}
            </div>

            <button
              onClick={handleSendCode}
              disabled={isSending}
              style={{
                width: '100%',
                backgroundColor: isSending ? 'var(--border-medium)' : 'var(--primary-main)',
                color: isSending ? 'var(--text-secondary)' : 'var(--primary-contrast-text)',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '24px',
                border: 'none',
                cursor: isSending ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => {
               if (!isSending) {
                  e.target.style.backgroundColor = 'var(--primary-dark)';
                }
              }}
              onMouseOut={(e) => {
                  if (!isSending) {
                  e.target.style.backgroundColor = 'var(--primary-main)';
                }
              }}
            >
              إرسال رمز التحقق
            </button>

            <p style={{ color: 'var(--text-secondary)' }}>
              تذكرت كلمة المرور؟{' '}
              <button
                onClick={() => navigate('/login')}
                style={{
                  color: 'var(--primary-main)',
                  textDecoration: 'none',
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 'inherit'
                }}
                onMouseOver={(e) => {
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                  e.target.style.textDecoration = 'none';
                }}
              >
                العودة إلى تسجيل الدخول
              </button>
            </p>
            </div>
          </>
        ) : currentState === 'verification' ? (
          // Verification Code State
          <>

            <div
              style={{
                width: '72px',
                height: '72px',
                backgroundColor: 'var(--primary-white)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}
            >
                
               <VpnKeyIcon  sx={{ fontSize: 36, color: 'var(--primary-main)', transform: 'rotate(45deg)' }}/>
            </div>

            <h2
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}
            >
              تحقق من بريدك الإلكتروني
            </h2>

            <p
              style={{
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                fontSize: '16px',
                margin: '0 0 32px 0'
              }}
            >
              أدخل رمز التحقق للمتابعة
            </p>
              <div  
             style={{      
              backgroundColor: 'var(--background-paper)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px var(--shadow-medium)',
              maxWidth: '480px',
              textAlign: 'center',
              padding: '30px 32px',
              height:'520px'
             }}
              >
            <div
              style={{
                width: '77px',
                height: '77px',
                backgroundColor: 'var(--secondary-white)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                color: 'var(--success-main)'
              }}
            >
              <ShieldIcon />
            </div>

            <h3
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}
            >
              أدخل رمز التحقق
            </h3>

            <p
              style={{
                color: 'var(--text-secondary)',
                marginBottom: '32px',
                fontSize: '16px',
                margin: '0 0 32px 0'
              }}
            >
              لقد أرسلنا رمزاً مكوناً من 6 أرقام إلى{' '}
              <span style={{ color: 'var(--primary-main)',fontWeight:'bold' }}>{email}</span>
            </p>

            {/* Verification Code Inputs */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                marginBottom: '32px',
                direction: 'ltr'
              }}
            >
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  id={`code-input-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength="1"
                  style={{
                    width: '56px',
                    height: '56px',
                    textAlign: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    border: `2px solid ${digit ? 'var(--primary-main)' : 'var(--border-medium)'}`,
                    outline: 'none',
                    backgroundColor: 'var(--background-paper)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--primary-main)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = digit ? 'var(--primary-main)' : 'var(--border-medium)';
                  }}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={verificationCode.join('').length !== 6 || isVerifying}
              style={{
                width: '100%',
                backgroundColor: verificationCode.join('').length === 6 && !isVerifying ? 'var(--primary-main)' : 'var(--border-medium)',
                color: verificationCode.join('').length === 6 && !isVerifying  ? 'var(--primary-contrast-text)' : 'var(--text-secondary)',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '24px',
                border: 'none',
                cursor: verificationCode.join('').length === 6 && !isVerifying  ? 'pointer' : 'not-allowed'
              }}
              onMouseOver={(e) => {
                if (verificationCode.join('').length === 6 && !isVerifying ) {
                  e.target.style.backgroundColor = 'var(--primary-dark)';
                }
              }}
              onMouseOut={(e) => {
                if (verificationCode.join('').length === 6 && !isVerifying) {
                  e.target.style.backgroundColor = 'var(--primary-main)';
                }
              }}
            >
              تحقق من الرمز
            </button>

            <div style={{ marginBottom: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                لم تستلم الرمز؟{' '}
                <button
                  onClick={handleResendCode}
                  disabled={timeLeft > 0}
                  style={{
                    color: timeLeft > 0 ? 'var(--text-disabled)' : 'var(--primary-main)',
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    cursor: timeLeft > 0 ? 'not-allowed' : 'pointer',
                    fontSize: 'inherit'
                  }}
                  onMouseOver={(e) => {
                    if (timeLeft === 0) {
                      e.target.style.textDecoration = 'underline';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  إعادة إرسال الرمز
                </button>
              </p>

              <button
                onClick={handleChangeEmail}
                style={{
                  color: 'var(--text-secondary)',
                  padding: 0,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  marginBottom: '16px'
                }}
                onMouseOver={(e) => {
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseOut={(e) => {
                  e.target.style.textDecoration = 'none';
                }}
              >
                تغيير عنوان البريد الإلكتروني
              </button>

              {isTimerActive && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
                  انتهاء صلاحية الرمز خلال {formatTime(timeLeft)}
                </p>
              )}
            </div>

          <p style={{ color: 'var(--text-secondary)' }}>
            تذكرت كلمة المرور؟{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                color: 'var(--primary-main)',
                textDecoration: 'none',
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 'inherit'
              }}
              onMouseOver={(e) => {
                e.target.style.textDecoration = 'underline';
              }}
              onMouseOut={(e) => {
                e.target.style.textDecoration = 'none';
              }}
            >
              العودة إلى تسجيل الدخول
            </button>
          </p>
          </div>
          </>
        ) : currentState === 'newPassword' ? (
          // New Password Form State
          <>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: 'var(--background-default)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              border: '3px solid var(--success-main)'
            }}>
              <span style={{ fontSize: '32px', color: 'var(--success-main)' }}>🛡️</span>
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 8px 0'
            }}>
              إنشاء كلمة مرور جديدة
            </h2>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '14px',
              margin: '0 0 32px 0'
            }}>
              يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمات المرور المستخدمة سابقاً
            </p>

            {/* New Password Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                كلمة المرور الجديدة
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور الجديدة"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 12px',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: 'var(--background-paper)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: 'var(--text-secondary)'
                  }}
                >
                 {showPassword ? 
                    <FaEyeSlash color="var(--text-secondary)" /> : 
                    <FaEye color="var(--text-secondary)" />
                  }
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    height: '4px',
                    backgroundColor: 'var(--border-light)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${strength.progress}%`,
                      backgroundColor: strength.color,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: strength.color,
                    marginTop: '4px',
                    display: 'block'
                  }}>
                    قوة كلمة المرور: {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                تأكيد كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="تأكيد كلمة المرور الجديدة"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 12px',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: 'var(--background-paper)',
                    boxSizing: 'border-box',
                    outline: 'none',
                    color: 'var(--text-primary)'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: 'var(--text-secondary)'
                  }}
                >
                {showPassword ? 
                    <FaEyeSlash color="var(--text-secondary)" /> : 
                    <FaEye color="var(--text-secondary)" />
                }
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: passwordsMatch ? 'var(--success-main)' : 'var(--error-main)'
                }}>
                  <span style={{ marginLeft: '4px' }}>
                    {passwordsMatch ? '✓' : '✗'}
                  </span>
                  {passwordsMatch ? 'كلمات المرور متطابقة' : 'كلمات المرور غير متطابقة'}
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: '0 0 8px 0'
              }}>
                يجب أن تحتوي كلمة المرور على:
              </h3>
              <div>
                <ValidationItem condition={hasMinLength} text="8 أحرف على الأقل" />
                <ValidationItem condition={hasUppercase} text="حرف كبير واحد" />
                <ValidationItem condition={hasLowercase} text="حرف صغير واحد" />
                <ValidationItem condition={hasNumber} text="رقم واحد" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePasswordReset}
              disabled={!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !passwordsMatch || isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '4px',
                backgroundColor: (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !passwordsMatch || isSubmitting)
                  ? 'var(--border-medium)' : 'var(--primary-main)',
                color: (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !passwordsMatch || isSubmitting)
                  ? 'var(--text-disabled)' : 'var(--primary-contrast-text)',
                border: 'none',
                cursor: (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !passwordsMatch || isSubmitting)
                  ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'var(--primary-dark)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'var(--primary-main)';
                }
              }}
            >
              {isSubmitting ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ResetPasswordPage;