import React , { useEffect } from "react";
import { HeaderTemp , Footer } from "../Components";
import Scroll from "../Components/scroll";



function Contact(){

    useEffect(() => {
        // تحميل خريطة Bing
        const script = document.createElement("script");
        script.src = `https://www.bing.com/api/maps/mapcontrol?callback=loadMapScenario&key=YOUR_BING_MAPS_API_KEY`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        window.loadMapScenario = function () {
            const map = new window.Microsoft.Maps.Map(document.getElementById("map"), {
                center: new window.Microsoft.Maps.Location(30.0444, 31.2357), // موقع القاهرة
                zoom: 10,
            });
        };

    return () => {
    document.body.removeChild(script);
    };
    }, []);

    return (
    <>
    <HeaderTemp />
        <div className="container  ">
            <h2 className="text-center m-4">اتصل بنا </h2>
            <hr />
        <div className="row ">
           
          {/* بيانات الاتصال */}
            <div className="col-md-4 contact ">
            <h2>بيانات الإتصال</h2>
            <p>
                <strong>العنوان:</strong> العباسية، القاهرة
            </p>
            <p>
                <strong>التليفون:</strong> 00227956301
            </p>
            <p>
                <strong>البريد الإلكتروني:</strong>{" "}
                <a href="mailto:p.academy@moi.gov.eg">p.academy@moi.gov.eg</a>
            </p>
            </div>
             {/* جزء الخريطة */}
            <div className="col-md-6   ">
            <div id="map" className="mb-4 " style={{ width: "100%", height: "400px" }}>
            </div>
            </div>
        </div>
        </div>
        <Footer/>
        <Scroll/>
    </>
  );
        
        
  
}
export default Contact