import React, { useState } from 'react';
import './login.css';
import Banner_image from "../../Images/banner.png";
import Bg_texture from "../../Images/bg-texture.jpg";
import Form from 'react-bootstrap/Form';
import Button from '@mui/material/Button';
import { Crypt, RSA } from 'hybrid-crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAdminLogin } from '../../Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const toastStyle = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
}

function Login() {

    var crypt = new Crypt();

    const [error, setError] = useState([]);
    const [error2, setError2] = useState([]);
    const [stayLoggedIn, setStayLoggedIn] = useState("");

    const [state, setState] = useState({
        email: "",
        password: "",
        stayLoggedIn: ""
    });
    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    const handleChecked = (e) => {
        if (e.target.checked == true) {
            setStayLoggedIn(true)
        } else {
            setStayLoggedIn(false)
        }
    }

    const handleLogin = (e) => {
        e.preventDefault()
        let encryptedPassword = crypt.encrypt(process.env.REACT_APP_KEY, state.password);

        const loginData = new FormData();
        loginData.append('email', state.email);
        loginData.append('password', encryptedPassword);

        axios.post(getAdminLogin, loginData)
            .then((res) => {
                console.log("new girlfriend")
                console.log(res.data)                
                const adminObj = {
                    id : res.data.admin._id,
                    permissionData : res.data.admin.permissionData,
                    type : res.data.admin.type
                 }
                 console.log(adminObj)
                if (stayLoggedIn == true) {
                    localStorage.setItem("token", res.data.token)
                    localStorage.setItem('adminData',JSON.stringify(adminObj))
                } else {
                    sessionStorage.setItem("token", res.data.token)
                    sessionStorage.setItem('adminData',JSON.stringify(adminObj))
                }
                window.location.href = "/";
                toast.success(res.data.message, toastStyle);
            })
            .catch((err) => {
                toast.error(err.response.data.message, toastStyle);
                toast.error(err.response.data.errors, toastStyle);
            })
    }

    console.log(stayLoggedIn)


    return (
        <>
            <div className='loginSection'>
                <div className='background'>
                    <img src={Bg_texture} alt="" className='banner-image' />
                </div>
                <div className='login-box'>
                    <div className='row'>
                        <div className='col-6'>
                            <img src={Banner_image} alt="" className='banner-image' />
                        </div>
                        <div className='col-6'>
                            <div className='login-block'>
                                <div className='heading'>
                                    <h2>Login</h2>
                                    <div className='login-form'>
                                        <Form>
                                            <Form.Group className="form-control" controlId="formBasicEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control type="email" placeholder="Enter email" name="email" onChange={(e) => handleChange(e)} />
                                            </Form.Group>
                                            <Form.Group className="form-control" controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)} />
                                            </Form.Group>
                                            <Form.Group className="checkbox" controlId="formBasicCheckbox">
                                                <div className='check'>
                                                    <Form.Check type="checkbox" onChange={(e) => handleChecked(e)} name="stayLoggedIn" label="Stay Signed in" />
                                                </div>
                                            </Form.Group>
                                            <Button variant="contained" type="submit" onClick={(e) => handleLogin(e)} className='primaryBtn order_export'>
                                                Login
                                            </Button>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />        </>
    )
}

export default Login