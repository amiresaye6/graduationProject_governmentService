import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
    return (
        <footer className="footer mb-0   text-white py-3 ">
            <div className="container">
                <div className="row">
                    {/* About Section */}
                    <div className="col-md-3 mb-2">
                        <h4 className="text  text-opacity-75 border-bottom pb-2">الإدارة العامة للجوازات والهجرة والجنسية</h4>
                        <p>
                            الإدارة العامة للجوازات والجنسية هي أحد أجهزة وزارة الداخلية التي تؤدي خدماتها للمواطنين والأجانب. 
                            إنها تعد أحد المصادر الرئيسية للدولة بما يتوفر لديها من معلومات. وقد أُنشئت "إدارة الجوازات والجنسية" 
                            بقرار وزاري صادر في 9/4/1939.
                        </p>
                    </div>

                    {/* Related Links */}
                    <div className="col-md-3 mb-2">
                        <h4 className="text   text-opacity-75 border-bottom pb-2">روابط ذات صلة</h4>
                        <ul className="list-unstyled  ">
                            <li><a href="Nav" className="text  text-decoration-none">وزارة الداخلية المصرية</a></li>
                            <li><a href="Nav" className="text  text-decoration-none">بوابة الحكومة المصرية</a></li>
                            <li><a href="Nav" className="text  text-decoration-none">مصلحة الأحوال المدنية</a></li>
                            <li><a href="Nav" className="text  text-decoration-none">البريد المصري</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-md-3 mb-4">
                        <h4 className="text  text-opacity-75 border-bottom pb-2">هل لديك أسئلة ؟</h4>
                        <p>العنوان: العباسية, القاهرة</p>
                        <p>00227956301</p>
                        <p><a href="mailto:p.academy@mai.gov.eg" className="text  text-decoration-none">p.academy@mai.gov.eg</a></p>
                    </div>

                    {/* Working Hours */}
                    <div className="col-md-3 ">
                        <h4 className="text  text-opacity-75 border-bottom pb-2">ساعات العمل الرسمية</h4>
                        <p>
                            <strong>أيام العمل:</strong> السبت إلى الخميس<br/>
                            8 صباحاً إلى 2:30 مساءً
                        </p>
                        <p>
                            <strong>الإجازة:</strong> الجمعة من كل أسبوع و العطلات الرسمية
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;