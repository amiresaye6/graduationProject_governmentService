import React from "react";
import { Link } from "react-router-dom";
 // Adjust the path as necessary

function Info (){
    return(
        <>
         

          <div className="container mt-5 mb-5  p-4 ">
              <div className="row ">
               {/* <!-- عن الإدارة --> */}
              <div className="col-md-4   mt-5">
                <div className="bg-paper card p-3 shadow " >
                    <h3 className=" card-title " >الاستعلامات</h3>
                    <p  className="text-secondary">هي خدمة إلكترونية تتيح للمستخدم معرفة معلومات معينة عن طريق الإنترنت دون الحاجة إلى زيارة الجهات الحكومية أو المؤسسات الخدمية مثل الإستعلام عن (فواتير الكهرباء والمياه , المخالفات المروريه , حاله معامله حكوميه ...).</p>
                    <Link className="info" >إقرأ المزيد...</Link>
                </div>
              </div>

            {/* <!-- خدمات قسم الجنسية --> */}
            <div className="col-md-4 mt-5">
                <div className=" bg-paper card p-3 shadow">
                    <h3 className="card-title">الخدمات الرقمية</h3>
                    <p className="text-secondary" >هي خدمات حكومية يمكن تنفيذها إلكترونيًا بالكامل دون الحاجة لزيارة المؤسسة أو الجهة الحكومية عن طريق ملأ النموذج الالكتروني مثل (تجديد رخصه القيادة , اصدار شهادة ميلاد  , التسجيل في المدارس والجامعات الحكومية , حجز موعد في مستشفى حكومي  ...)</p>
                    <Link className="info" >إقرأ المزيد...</Link>
                </div>
            </div>

            {/* <!-- خدمات قسم الهجرة --> */}
            <div className="col-md-4 mt-5" >
                <div className="bg-paper card p-3 shadow " >
                    <h3 className=" card-title " >الدفع الإلكتروني </h3>
                    <p className="text-secondary">هو وسيلة دفع آمنة عبر الإنترنت تسمح للأفراد بتسديد الفواتير الحكومية أو رسوم الخدمات الرقمية دون الحاجة لاستخدام النقود الورقية أو الذهاب إلى المكاتب مثل :(دفع فواتير الكهرباء والمياه والانترنت , تسديد المخالفات الحكوميه , دفع رسوم تجديد البطاقه الشخصيه ....).</p>
                    <Link className="info">إقرأ المزيد...</Link>
                </div>
            </div>
        </div>
    </div>  

        </>
    )
}

export default Info
