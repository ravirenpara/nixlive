import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {

    let token;
    if(localStorage.getItem("token") != null) {
        token = localStorage.getItem('token');
    } else if (sessionStorage.getItem('token') != null) {
        token = sessionStorage.getItem('token')
    }

    return token ? children : window.location.href = '/login';
}

export default PrivateRoute