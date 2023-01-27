import React, { useState } from 'react';
import './ChangePassword.css';
import Banner_image from "../../Images/banner.png";
import Bg_texture from "../../Images/bg-texture.jpg";
import Form from 'react-bootstrap/Form';
import Button from '@mui/material/Button';
import { Crypt, RSA } from 'hybrid-crypto-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getChangePassword } from '../../Api';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

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
function ChangePassword() {


    const [input, setInput] = useState({
        currentpassword: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState({
        currentpassword: '',
        password: '',
        confirmPassword: '',
    })
    const validateInput = e => {
        let { name, value } = e.target;
        setError(prev => {
            const stateObj = { ...prev, [name]: "" };
            switch (name) {

                case "currentpassword":
                    if (!value) {
                        stateObj[name] = "Please Enter You Current Password"
                    }
                    break;

                case "password":
                    if (!value) {
                        stateObj[name] = "Please enter Password.";
                    } else if (input.confirmPassword && value !== input.confirmPassword) {
                        stateObj["confirmPassword"] = "New Password and Confirm Password does not match.";
                    } else {
                        stateObj["confirmPassword"] = input.confirmPassword ? "" : error.confirmPassword;
                    }
                    break;

                case "confirmPassword":
                    if (!value) {
                        stateObj[name] = "Please enter Confirm Password.";
                    } else if (input.password && value !== input.password) {
                        stateObj[name] = "New Password and Confirm Password does not match.";
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    }



    var crypt = new Crypt();

    // const [state, setState] = useState({
    //     email: "",
    //     password: "",
    //     stayLoggedIn: ""
    // });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
        validateInput(e);
    }

    const handleLogin = (e) => {
        // const oldPassword[]
        // const newPassword,
        e.preventDefault()
        const loginObj = {
            oldPassword: input.currentpassword,
            newPassword: input.password,

        }
        var id = ""
        let token;
        if (localStorage.getItem("token") != null) {
            token = localStorage.getItem('token');
        } else if (sessionStorage.getItem('token') != null) {
            token = sessionStorage.getItem('token')
        }

        if (localStorage.getItem('adminData')) {
            const obj = JSON.parse(localStorage.getItem('adminData'))
            id = obj.id
        } if (sessionStorage.getItem('adminData')) {
            const obj = JSON.parse(sessionStorage.getItem('adminData'))
            id = obj.id
        }
        if (id) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            axios.put(getChangePassword + id, loginObj)
                .then((res) => {

                    // window.location.href = "/";
                    toast.success(res.data.message, toastStyle);
                    setInput({
                        currentpassword: '',
                        password: '',
                        confirmPassword: '',
                    })
                })
        }

    }




    return (
        <>
            <div className='loginSection changePassword'>
                <div className='login-box'>
                    <div className='row'>
                        <div className='col-6'>
                            <img src={Banner_image} alt="" className='banner-image' />
                        </div>
                        <div className='col-6'>
                            <div className='login-block'>
                                <div className='heading'>
                                    <h2>Change Password</h2>
                                    <div className='login-form'>
                                        <Form>
                                            <Form.Group className="form-control" controlId="formBasicEmail">
                                                <Form.Label>Enter Current Password</Form.Label>
                                                <Form.Control type="password" placeholder="Enter Current Password" value={input.currentpassword} onBlur={validateInput} name="currentpassword" onChange={(e) => handleChange(e)} />
                                                {error.currentpassword && <span className='err'>{error.currentpassword}</span>}
                                            </Form.Group>
                                            <Form.Group className="form-control" controlId="formBasicPassword">
                                                <Form.Label>New Password</Form.Label>
                                                <Form.Control type="password" placeholder="Enter New Password" value={input.password} onBlur={validateInput} name="password" onChange={(e) => handleChange(e)} />
                                                {error.password && <span className='err'>{error.password}</span>}
                                            </Form.Group>
                                            <Form.Group className="form-control" controlId="formBasicPassword">
                                                <Form.Label>Re Enter Password</Form.Label>
                                                <Form.Control type="text" placeholder="Re Enter Password" value={input.confirmPassword} onBlur={validateInput} name="confirmPassword" onChange={(e) => handleChange(e)} />
                                                {error.confirmPassword && <span className='err'>{error.confirmPassword}</span>}
                                            </Form.Group>

                                            <Button variant="contained" onClick={(e) => handleLogin(e)} className='primaryBtn order_export'>
                                                Change Password
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
            />
        </>
    )
}

export default ChangePassword