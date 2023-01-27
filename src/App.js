import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useParams, unstable_HistoryRouter } from 'react-router-dom';
import loadingscreen from "./Images/Applogo-removebg-preview.png";
import Preloader from './Images/shoes.gif'
import DashBoard from './Pages/DashBoard/DashBoard';
import Order from './Pages/OrderPage/Order'
import Sidebar from './Components/DefultSidebar/Sidebar';
import Promotions from './Pages/PromotionPage/Promotions';
import Roles from './Pages/RolesPage/Roles';
import Products from './Pages/ProductsPage/Products';
import Employees from './Pages/EmployeesPage/Employees';
import DataCollection from './Pages/DataCollectionPage/DataCollection';
import Customers from './Pages/CustomersPage/Customers';
import BrandsCategory from './Pages/BrandsCatergoryPage/BrandsCategory';
import Header from './Components/DefultHeader/Header';
import Login from './Pages/Login/Login';
import ChangePassword from './Pages/ChangePassword/ChangePassword';
import Categories from './Pages/BrandsCatergoryPage/Categories';
import Vieworder from './Pages/ViewOrder/Vieworder';
import CustomerOrder from './Pages/CustomersPage/CustomerOrder/CustomerOrder';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import Error from './Pages/Error/Error';
import Notification from './Components/NotificationBoday/Notification';
import firebase from './firebase';

function App() {

  React.useEffect(()=>{
    const msg=firebase.messaging();
    msg.requestPermission().then(()=>{
      return msg.getToken();
    }).then((data)=>{
      console.warn("token",data)
    })
  })

  const [loading, setLoading] = useState(false);
 
  useEffect(
    () => {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
      }, 3000)
    }, []
  )

  return (
    <div className="App">
      {
        loading ?
          <div className="loading-image">
            <img src={Preloader} />
          </div>
          :
          <>
            <Router>
              {window.location.pathname !== "/login" ?
                <Sidebar>
                  {window.location.pathname !== "/login" ? <Header /> : null}{" "}
                  <div className='wrapper-main-cnt'>
                    <div className='body-layout'>
                      <Routes>
                        <Route path="/"
                          element={
                            <PrivateRoute>
                              <DashBoard />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/order" 
                          element={
                            <PrivateRoute>
                              <Order />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/promotions"
                          element={
                            <PrivateRoute>
                              <Promotions />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/roles"
                          element={
                            <PrivateRoute>
                              <Roles />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/products"
                          element={
                            <PrivateRoute>
                              <Products />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/employees"
                          element={
                            <PrivateRoute>
                              <Employees />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/datacollection"
                          element={
                            <PrivateRoute>
                              <DataCollection />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/customers"
                          element={
                            <PrivateRoute>
                              <Customers />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/customerorder/:id"
                          element={
                            <PrivateRoute>
                              <CustomerOrder />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/brands"
                          element={
                            <PrivateRoute>
                              <BrandsCategory />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/categories"
                          element={
                            <PrivateRoute>
                              <Categories />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/vieworder/:id"
                          element={
                            <PrivateRoute>
                              <Vieworder />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/*"
                          element={
                            <PrivateRoute>
                              <Error />
                            </PrivateRoute>
                          }
                        />
                        <Route path="/changepassword" element={<ChangePassword />} />
                      </Routes>
                    </div>
                  </div>
                </Sidebar> :
                <Routes>
                  <Route path="/login" element={<Login />} />
                </Routes>
              }
            </Router>
          </>
      }
    </div>
  );
}


export default App;
