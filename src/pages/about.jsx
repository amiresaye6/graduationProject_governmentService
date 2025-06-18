import React from "react";
import { HeaderTemp , Footer  , Info} from "../Components";
import Scroll from "../Components/scroll";



function About (){
    return(
        <>
         
        <HeaderTemp/>
        <div className=" container mt-4">
           <h1 className="text-center">عن الإدارة</h1>
           <hr className="m-4"/>
           <div className=" info info-container mt-4 mb-4 bg-body-secondary p-4">
            <p>الإدارة في موقع الخدمات الحكومية تشير إلى الجهة المسؤولة عن تنظيم وتشغيل الخدمات الرقمية التي يقدمها الموقع. تهدف هذه الإدارة إلى تسهيل وصول المواطنين والمقيمين إلى المعلومات والخدمات الحكومية بأفضل طريقة ممكنة.

           <h5>✅ مهام الإدارة:</h5>
                1️⃣ تنظيم وتحديث المحتوى ليكون واضحًا وسهل الاستخدام.
                2️⃣ ضمان أمان وحماية البيانات الخاصة بالمستخدمين.
                3️⃣ تحسين تجربة المستخدم لتسهيل الوصول إلى الخدمات.
                4️⃣ متابعة الطلبات والاستفسارات والتأكد من تنفيذها بسرعة.
                5️⃣ تطوير الخدمات الرقمية وإضافة مزايا جديدة باستمرار.

           <h5>🚀 دور الإدارة:</h5>
               ✔️ تبسيط الإجراءات الحكومية إلكترونيًا.
               ✔️ تحسين كفاءة العمل الحكومي وتقليل الازدحام.
               ✔️ تقديم تجربة رقمية سهلة وسريعة للمستخدمين.</p>
           </div>
           <hr className="m-4" />
        </div>
        <div className="container  text-center"><p className="fw-bold fs-2">الخدمات المتاحه</p></div>
        
        
        <Info/>
        <Footer/>
        <Scroll/>





         

        </>
    )
}

export default About 
