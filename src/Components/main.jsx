import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function main(){

    return(
        <>
           <div className="hero  " >
                <div className=" img text-white  ">
                    

                    <div className="img-overlay align-item-center text-center p-2 d-flex modalOverlay ">
                        <div className="container mt-5 " >
                            <h2 className="modal-title  m-4 ">مرحبا بكم</h2>
                            <h2 className="modal-title m-4">الخدمات الالكترونيه لادارة المدينه</h2>
                            <button  className="btn btn-custom btn-login my-4 "  ><Link to="/Services" className=" text-decoration-none text-white " >دليل الخدمات</Link></button>
                        </div>

                    </div>
                    
                </div>


            </div>

        </>
    )
}
export default main