// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useAuth } from './AuthContext';
// import ThemeToggle from './ThemeToggle';
// import { Dropdown } from 'react-bootstrap';

// const HeaderTemp = () => {
//     const { isAuthenticated, logout, user } = useAuth();
//     const [userName, setUserName] = useState('');
//     const isAdmin = user?.role === 'admin';

//     useEffect(() => {
//         if (isAuthenticated) {
//             const storedName = localStorage.getItem('userName');
//             if (storedName) {
//                 setUserName(storedName);
//             }


//         }
//     }, [isAuthenticated]);

//     return (
//         <nav className="navbar navbar-expand-lg  py-0 sticky-top" style={{ transition: 'all 0.3s ease' }}>
//             <div className="container">
//                 <img
//                     src="./assets/images.jpg"
//                     alt="شعار وزارة الداخلية"
//                     width="70"
//                     height="60"
//                     className=""
//                     style={{
//                         borderRadius: "15px",
//                         transition: 'transform 0.3s ease',
//                     }}
//                     onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
//                     onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
//                 />
//                 <NavLink className="navbar-brand px-2 mx-2" to="/">
//                     <h1 className="fs-3">وزارة الداخلية</h1>
//                     <p className="text m-0">الإدارة العامة للخدمات الحكومية</p>
//                 </NavLink>
//                 <button className="navbar-toggler mx-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//                     <span className="navbar-toggler-icon"></span>
//                 </button>

//                 <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                     <ul className="navbar-nav m-auto text-center">
//                         {!isAuthenticated ? (
//                             <>
//                                 <li className="nav-item">
//                                     <NavLink className="btn nav-link" to="/">الرئيسية</NavLink>
//                                 </li>
//                                 <li className="nav-item">
//                                     <NavLink className="btn nav-link" to="/about">عن الإدارة</NavLink>
//                                 </li>
//                                 <li className="nav-item">
//                                     <NavLink className="btn nav-link" to="/Services">الخدمات</NavLink>
//                                 </li>
//                                 <li className="nav-item">
//                                     <NavLink className="btn nav-link" to="/contact">إتصل بنا</NavLink>
//                                 </li>
//                                 <li className="nav-item">
//                                     <NavLink className="btn nav-link" to="/MyRequests">طلباتي</NavLink>
//                                 </li>
//                             </>
//                         ) : (
//                             // Admin navigation - only showing essential tabs
//                             <>
//                                 <li className="nav-item">
//                                     <NavLink className="btn nav-link" to="/">الرئيسية</NavLink>
//                                 </li>
//                                 <li className="nav-item">
//                                     <NavLink className="btn nav-link" to="/admin/services">الخدمات</NavLink>
//                                 </li>
//                                 <li className="nav-item">
//                                     <NavLink className="btn nav-link" to="/admin/request">الطلبات</NavLink>
//                                 </li>
//                                 <li className="nav-item">
//                                     <NavLink className="btn nav-link" to="/MyRequests">طلباتي</NavLink>
//                                 </li>
//                             </>
//                         )}
//                     </ul>
//                     <ul>

//                     </ul>
//                     <div className=" text-center  d-flex align-items-center">
//                         {!isAuthenticated ? (
//                             <NavLink
//   to="/login"
//   className={({ isActive }) =>
//     `btn btn-outline m-2 ${isActive ? 'btn-active' : ''}`
//   }
// >
//                                 <i className="fa  fa-sign-in-alt me-1"></i> تسجيل الدخول
//                             </NavLink>
//                         ) : (
//                             <Dropdown align="end">
//                                 <Dropdown.Toggle
//                                     as="div"
//                                     id="dropdown-user"
//                                     className="d-flex align-items-center cursor-pointer"
//                                 >
//                                     <div className="d-flex align-items-center">
//                                         <img
//                                             src="../assets/2.jpg"
//                                             alt="صورة المستخدم"
//                                             className="rounded-circle me-2"
//                                             width="40"
//                                             height="40"
//                                             style={{
//                                                 objectFit: 'cover',
//                                                 border: '2px solid white'
//                                             }}
//                                         />
//                                         <span className="text-light d-none d-md-inline me-2">{userName || 'المستخدم'}</span>
//                                     </div>
//                                 </Dropdown.Toggle>

//                                 <Dropdown.Menu className="dropdown-menu-end shadow">
//                                     {!isAdmin && (
//                                         <Dropdown.Item as={NavLink} to="/profile">
//                                             <i className="fa fa-user me-2"></i> الملف الشخصي
//                                         </Dropdown.Item>
//                                     )}
//                                     {!isAdmin && (
//                                         <Dropdown.Item as={NavLink} to="/admin">
//                                             <i className="fa fa-tachometer-alt me-2"></i> لوحة التحكم
//                                         </Dropdown.Item>
//                                     )}
//                                     <Dropdown.Divider />
//                                     <Dropdown.Item
//                                         onClick={() => {
//                                             logout();
//                                             localStorage.removeItem('token');
//                                             localStorage.removeItem('userName');
//                                             localStorage.removeItem('userEmail');
//                                             window.location.href = '/';
//                                         }}
//                                     >
//                                         <i className="fa fa-sign-out-alt me-2"></i> تسجيل الخروج
//                                     </Dropdown.Item>
//                                 </Dropdown.Menu>
//                             </Dropdown>
//                         )}
//                     </div>

//                 </div>
//                 <ThemeToggle />


//             </div>
           
//         </nav>
//     )
// }

// export default HeaderTemp
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './AuthContext';
import ThemeToggle from './ThemeToggle';
import { Dropdown } from 'react-bootstrap';
import { ReactComponent as CitioLogo } from '../assets/citio(1).svg';

const HeaderTemp = () => {
    const { isAuthenticated, logout, user } = useAuth();
    const [userName, setUserName] = useState('');
    const isAdmin = user?.role === 'admin';
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            const storedName = localStorage.getItem('userName');
            if (storedName) {
                setUserName(storedName);
            }
        }
    }, [isAuthenticated]);

    return (
        <nav 
            className="navbar navbar-expand-lg py-0 sticky-top" 
            style={{ 
                transition: 'all 0.3s ease',
                backgroundColor: 'var(--navbar-background)',
                color: 'var(--navbar-text)',
                boxShadow: '0 2px 4px var(--shadow-light)'
            }}
        >
            <div className="container">

                <NavLink className="navbar-brand px-2 mx-2" to="/">
                <div className="logo-container">
                    <CitioLogo className="logo-svg" />
                </div>
                </NavLink>
                <button 
                    className="navbar-toggler mx-2" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                    style={{
                        borderColor: 'var(--primary-main)',
                        color: 'var(--primary-main)'
                    }}
                >
                    <span 
                        className="navbar-toggler-icon"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='var(--primary-main)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`
                        }}
                    ></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto text-center">
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <NavLink 
                                        className="btn nav-link" 
                                        to="/"
                                        style={({isActive}) => ({
                                            color: isActive ? 'var(--primary-main)' : 'var(--navbar-text)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderBottom: isActive ? '2px solid var(--primary-main)' : 'none'
                                        })}
                                    >
                                        الرئيسية
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        className="btn nav-link" 
                                        to="/about"
                                        style={({isActive}) => ({
                                            color: isActive ? 'var(--primary-main)' : 'var(--navbar-text)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderBottom: isActive ? '2px solid var(--primary-main)' : 'none'
                                        })}
                                    >
                                        عن الإدارة
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        className="btn nav-link" 
                                        to="/Services"
                                        style={({isActive}) => ({
                                            color: isActive ? 'var(--primary-main)' : 'var(--navbar-text)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderBottom: isActive ? '2px solid var(--primary-main)' : 'none'
                                        })}
                                    >
                                        الخدمات
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        className="btn nav-link" 
                                        to="/contact"
                                        style={({isActive}) => ({
                                            color: isActive ? 'var(--primary-main)' : 'var(--navbar-text)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderBottom: isActive ? '2px solid var(--primary-main)' : 'none'
                                        })}
                                    >
                                        إتصل بنا
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        className="btn nav-link" 
                                        to="/MyRequests"
                                        style={({isActive}) => ({
                                            color: isActive ? 'var(--primary-main)' : 'var(--navbar-text)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderBottom: isActive ? '2px solid var(--primary-main)' : 'none'
                                        })}
                                    >
                                        طلباتي
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            // Admin navigation - only showing essential tabs
                            <>
                                <li className="nav-item">
                                    <NavLink 
                                        className="btn nav-link" 
                                        to="/"
                                        style={({isActive}) => ({
                                            color: isActive ? 'var(--primary-main)' : 'var(--navbar-text)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderBottom: isActive ? '2px solid var(--primary-main)' : 'none'
                                        })}
                                    >
                                        الرئيسية
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        className="btn nav-link" 
                                        to="/admin/services"
                                        style={({isActive}) => ({
                                            color: isActive ? 'var(--primary-main)' : 'var(--navbar-text)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderBottom: isActive ? '2px solid var(--primary-main)' : 'none'
                                        })}
                                    >
                                        الخدمات
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        className="btn nav-link" 
                                        to="/admin/request"
                                        style={({isActive}) => ({
                                            color: isActive ? 'var(--primary-main)' : 'var(--navbar-text)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderBottom: isActive ? '2px solid var(--primary-main)' : 'none'
                                        })}
                                    >
                                        الطلبات
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink 
                                        className="btn nav-link" 
                                        to="/MyRequests"
                                        style={({isActive}) => ({
                                            color: isActive ? 'var(--primary-main)' : 'var(--navbar-text)',
                                            fontWeight: isActive ? '600' : '400',
                                            borderBottom: isActive ? '2px solid var(--primary-main)' : 'none'
                                        })}
                                    >
                                        طلباتي
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                    <ul>

                    </ul>
                    <div className=" text-center  d-flex align-items-center">
                        {!isAuthenticated ? (
                            <NavLink
                                to="/login"
                               className={({ isActive }) =>
                                    `btn m-2 ${isActive ? 'btn-active' : ''}`
                                }
    style={({ isActive }) => {
        const isHovered = isActive;
        return {
            border: isHovered ? '1px solid var(--primary-main)' : '1px solid white',
            color: isHovered ? 'var(--primary-contrast-text)' : 'white',
            backgroundColor: isHovered ? 'var(--primary-main)' : 'transparent',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center'
        };
    }}
    onMouseOver={(e) => {
        if (!e.currentTarget.classList.contains('btn-active')) {
            e.target.style.backgroundColor = 'var(--primary-main)';
            e.target.style.color = 'var(--primary-contrast-text)';
            e.target.style.borderColor = 'var(--primary-main)';
            const icon = e.target.querySelector('i');
            if (icon) {
                icon.style.color = 'var(--primary-contrast-text)';
            }
        }
    }}
    onMouseOut={(e) => {
        if (!e.currentTarget.classList.contains('btn-active')) {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'white';
            e.target.style.borderColor = 'white';
            const icon = e.target.querySelector('i');
            if (icon) {
                icon.style.color = 'white';
            }
        }
    }}
>
    <i 
        className="fa fa-sign-in-alt me-2" 
        style={{ 
            color: 'inherit',
            transition: 'color 0.3s ease',
            pointerEvents: 'none',
            marginLeft: '8px'
        }}></i> تسجيل الدخول
                            </NavLink>
                        ) : (
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    as="div"
                                    id="dropdown-user"
                                    className="d-flex align-items-center cursor-pointer"
                                    style={{ padding: '8px', borderRadius: '8px', transition: 'background 0.3s' }}
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
                                                border: '2px solid var(--border-medium)'
                                            }}
                                        />
                                        <span className=" d-none d-md-inline me-2  user-name" >{userName || 'المستخدم'}</span>
                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="dropdown-menu-end shadow custom-dropdown-menu">
                                    {!isAdmin && (
                                        <Dropdown.Item as={NavLink} to="/ProfilePage">
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