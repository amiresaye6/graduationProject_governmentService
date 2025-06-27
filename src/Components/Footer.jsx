// import React from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Footer = () => {
//     return (
//         <footer className="navbar mb-0    py-3 ">
//             <div className="container">
//                 <div className="row">
//                     {/* About Section */}
//                     <div className="col-md-3 mb-2">
//                         <h4 className="text  text-opacity-75 border-bottom pb-2">الإدارة العامة للجوازات والهجرة والجنسية</h4>
//                         <p>
//                             الإدارة العامة للجوازات والجنسية هي أحد أجهزة وزارة الداخلية التي تؤدي خدماتها للمواطنين والأجانب. 
//                             إنها تعد أحد المصادر الرئيسية للدولة بما يتوفر لديها من معلومات. وقد أُنشئت "إدارة الجوازات والجنسية" 
//                             بقرار وزاري صادر في 9/4/1939.
//                         </p>
//                     </div>

//                     {/* Related Links */}
//                     <div className="col-md-3 mb-2">
//                         <h4 className="text   text-opacity-75 border-bottom pb-2">روابط ذات صلة</h4>
//                         <ul className="list-unstyled  ">
//                             <li><a href="Nav" className="text  text-decoration-none">وزارة الداخلية المصرية</a></li>
//                             <li><a href="Nav" className="text  text-decoration-none">بوابة الحكومة المصرية</a></li>
//                             <li><a href="Nav" className="text  text-decoration-none">مصلحة الأحوال المدنية</a></li>
//                             <li><a href="Nav" className="text  text-decoration-none">البريد المصري</a></li>
//                         </ul>
//                     </div>

//                     {/* Contact Info */}
//                     <div className="col-md-3 mb-4">
//                         <h4 className="text  text-opacity-75 border-bottom pb-2">هل لديك أسئلة ؟</h4>
//                         <p>العنوان: العباسية, القاهرة</p>
//                         <p>00227956301</p>
//                         <p><a href="mailto:p.academy@mai.gov.eg" className="text  text-decoration-none">p.academy@mai.gov.eg</a></p>
//                     </div>

//                     {/* Working Hours */}
//                     <div className="col-md-3 ">
//                         <h4 className="text  text-opacity-75 border-bottom pb-2">ساعات العمل الرسمية</h4>
//                         <p>
//                             <strong>أيام العمل:</strong> السبت إلى الخميس<br/>
//                             8 صباحاً إلى 2:30 مساءً
//                         </p>
//                         <p>
//                             <strong>الإجازة:</strong> الجمعة من كل أسبوع و العطلات الرسمية
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// };

// export default Footer;

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

 // Assuming you have a CSS file for custom styles

const Footer = () => {
    return (
        <footer className="footer navbar mb-0 py-3" style={{ backgroundColor: 'var(--footer-background)' }}>
            <div className="container">
                <div className="row">
                    {/* About Section */}
                    <div className="col-md-3 mb-2">
                        <h4 
                            className="border-bottom pb-2" 
                            style={{ 
                                color: 'var(--footer-text)', 
                                opacity: 0.9,
                                borderBottomColor: 'var(--divider) !important'
                            }}
                        >
                            الإدارة العامة للجوازات والهجرة والجنسية
                        </h4>
                        <p style={{ color: 'var(--footer-text)', opacity: 0.8 }}>
                            الإدارة العامة للجوازات والجنسية هي أحد أجهزة وزارة الداخلية التي تؤدي خدماتها للمواطنين والأجانب. 
                            إنها تعد أحد المصادر الرئيسية للدولة بما يتوفر لديها من معلومات. وقد أُنشئت "إدارة الجوازات والجنسية" 
                            بقرار وزاري صادر في 9/4/1939.
                        </p>
                    </div>

                    {/* Related Links */}
                    <div className="col-md-3 mb-2">
                        <h4 
                            className="border-bottom pb-2" 
                            style={{ 
                                color: 'var(--footer-text)', 
                                opacity: 0.9,
                                borderBottomColor: 'var(--divider) !important'
                            }}
                        >
                            روابط ذات صلة
                        </h4>
                        <ul className="list-unstyled">
                            <li>
                                <a 
                                    href="Nav" 
                                    className="text-decoration-none"
                                    style={{ 
                                        color: 'var(--footer-link)',
                                        transition: 'color 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = 'var(--primary-light)'}
                                    onMouseOut={(e) => e.target.style.color = 'var(--footer-link)'}
                                >
                                    وزارة الداخلية المصرية
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="Nav" 
                                    className="text-decoration-none"
                                    style={{ 
                                        color: 'var(--footer-link)',
                                        transition: 'color 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = 'var(--primary-light)'}
                                    onMouseOut={(e) => e.target.style.color = 'var(--footer-link)'}
                                >
                                    بوابة الحكومة المصرية
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="Nav" 
                                    className="text-decoration-none"
                                    style={{ 
                                        color: 'var(--footer-link)',
                                        transition: 'color 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = 'var(--primary-light)'}
                                    onMouseOut={(e) => e.target.style.color = 'var(--footer-link)'}
                                >
                                    مصلحة الأحوال المدنية
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="Nav" 
                                    className="text-decoration-none"
                                    style={{ 
                                        color: 'var(--footer-link)',
                                        transition: 'color 0.3s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.color = 'var(--primary-light)'}
                                    onMouseOut={(e) => e.target.style.color = 'var(--footer-link)'}
                                >
                                    البريد المصري
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-md-3 mb-4">
                        <h4 
                            className="border-bottom pb-2" 
                            style={{ 
                                color: 'var(--footer-text)', 
                                opacity: 0.9,
                                borderBottomColor: 'var(--divider) !important'
                            }}
                        >
                            هل لديك أسئلة ؟
                        </h4>
                        <p style={{ color: 'var(--footer-text)', opacity: 0.8 }}>
                            العنوان: العباسية, القاهرة
                        </p>
                        <p style={{ color: 'var(--footer-text)', opacity: 0.8 }}>
                            00227956301
                        </p>
                        <p>
                            <a 
                                href="mailto:p.academy@mai.gov.eg" 
                                className="text-decoration-none"
                                style={{ 
                                    color: 'var(--footer-link)',
                                    transition: 'color 0.3s ease'
                                }}
                                onMouseOver={(e) => e.target.style.color = 'var(--primary-light)'}
                                onMouseOut={(e) => e.target.style.color = 'var(--footer-link)'}
                            >
                                p.academy@mai.gov.eg
                            </a>
                        </p>
                    </div>

                    {/* Working Hours */}
                    <div className="col-md-3">
                        <h4 
                            className="border-bottom pb-2" 
                            style={{ 
                                color: 'var(--footer-text)', 
                                opacity: 0.9,
                                borderBottomColor: 'var(--divider) !important'
                            }}
                        >
                            ساعات العمل الرسمية
                        </h4>
                        <p style={{ color: 'var(--footer-text)', opacity: 0.8 }}>
                            <strong style={{ color: 'var(--footer-text)' }}>أيام العمل:</strong> السبت إلى الخميس<br/>
                            8 صباحاً إلى 2:30 مساءً
                        </p>
                        <p style={{ color: 'var(--footer-text)', opacity: 0.8 }}>
                            <strong style={{ color: 'var(--footer-text)' }}>الإجازة:</strong> الجمعة من كل أسبوع و العطلات الرسمية
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;