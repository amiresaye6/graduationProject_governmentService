import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function main(){

    return(
        <>
           <div className="hero" style={{
                position: 'relative',
                // width: '100vw',
                height: '100vh',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(https://source.unsplash.com/featured/?city,government)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 1
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '20px',
                        color: 'white'
                    }}>
                        <h1 style={{
                            fontSize: '3.5rem',
                            marginBottom: '1rem',
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                        }}>مرحبا بكم</h1>
                        <h2 style={{
                            fontSize: '2rem',
                            marginBottom: '2rem',
                            maxWidth: '800px',
                            lineHeight: '1.4',
                            textShadow: '1px 1px 3px rgba(0,0,0,0.5)'
                        }}>الإدارة العامة للخدمات الحكومية الخاصه بالمدينه</h2>
                        <button  className="btn-login">
                            <Link to="/Services" style={{ color: 'white', textDecoration: 'none' }}>دليل الخدمات</Link>
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}
export default main