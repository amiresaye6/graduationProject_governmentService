import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ThemeToggle from './ThemeToggle';
import { Dropdown } from 'react-bootstrap';

const HeaderTemp = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const [userName, setUserName] = useState('');
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (isAuthenticated) {
            const storedName = localStorage.getItem('userName');
            if (storedName) {
                setUserName(storedName);
            }


        }
    }, [isAuthenticated]);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark py-0 sticky-top" style={{ transition: 'all 0.3s ease' }}>
            <div className="container">
                <img
                    src="./assets/images.jpg"
                    alt="شعار وزارة الداخلية"
                    width="70"
                    height="60"
                    className=""
                    style={{
                        borderRadius: "15px",
                        transition: 'transform 0.3s ease',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <NavLink className="navbar-brand px-2 mx-2" to="/">
                    <h1 className="fs-3">وزارة الداخلية</h1>
                    <p className="text m-0">الإدارة العامة للخدمات الحكومية</p>
                </NavLink>
                <button className="navbar-toggler mx-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto text-center">
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <NavLink className="btn nav-link" to="/">الرئيسية</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="btn nav-link" to="/about">عن الإدارة</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="btn nav-link" to="/Services">الخدمات</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="btn nav-link" to="/contact">إتصل بنا</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="btn nav-link" to="/MyRequests">طلباتي</NavLink>
                                </li>
                            </>
                        ) : (
                            // Admin navigation - only showing essential tabs
                            <>
                                <li className="nav-item">
                                    <NavLink className="btn nav-link" to="/">الرئيسية</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="btn nav-link" to="/admin/services">الخدمات</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="btn nav-link" to="/admin/request">الطلبات</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul>

                    </ul>
                    <div className="buttons text-center d-flex align-items-center">
                        {!isAuthenticated ? (
                            <NavLink to="/login" className="btn btn-outline-light m-2">
                                <i className="fa fa-sign-in-alt me-1"></i> تسجيل الدخول
                            </NavLink>
                        ) : (
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    as="div"
                                    id="dropdown-user"
                                    className="d-flex align-items-center cursor-pointer"
                                >
                                    <div className="d-flex align-items-center">
                                        <img
                                            src="../assets/2.jpg"
                                            alt="صورة المستخدم"
                                            className="rounded-circle me-2"
                                            width="40"
                                            height="40"
                                            style={{
                                                objectFit: 'cover',
                                                border: '2px solid white'
                                            }}
                                        />
                                        <span className="text-light d-none d-md-inline me-2">{userName || 'المستخدم'}</span>
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="dropdown-menu-end shadow">
                                    {!isAdmin && (
                                        <Dropdown.Item as={NavLink} to="/profile">
                                            <i className="fa fa-user me-2"></i> الملف الشخصي
                                        </Dropdown.Item>
                                    )}
                                    {!isAdmin && (
                                        <Dropdown.Item as={NavLink} to="/admin">
                                            <i className="fa fa-tachometer-alt me-2"></i> لوحة التحكم
                                        </Dropdown.Item>
                                    )}
                                    <Dropdown.Divider />
                                    <Dropdown.Item
                                        onClick={() => {
                                            logout();
                                            localStorage.removeItem('token');
                                            localStorage.removeItem('userName');
                                            localStorage.removeItem('userEmail');
                                            window.location.href = '/';
                                        }}
                                    >
                                        <i className="fa fa-sign-out-alt me-2"></i> تسجيل الخروج
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        )}
                    </div>

                </div>
                <ThemeToggle />


            </div>
           
        </nav>
    )
}

export default HeaderTemp