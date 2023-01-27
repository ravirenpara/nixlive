import React, { useState } from 'react'
import './DashBoard.css'
import Grow from '../../Images/stocks.e619d9fb.svg'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrendingUpTwoToneIcon from '@mui/icons-material/TrendingUpTwoTone';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import Tooltip from '@mui/material/Tooltip';
import NoCrashIcon from '@mui/icons-material/NoCrash';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GridViewIcon from '@mui/icons-material/GridView';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RecentOrder from '../../Components/RecentOrder/RecentOrder';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { getDashboardStats } from '../../Api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "@mui/material/Button";

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
function DashBoard() {

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem("token");
  } else if (sessionStorage.getItem("token") != null) {
    token = sessionStorage.getItem("token");
  }

  const [stats, setStats] = useState({});

  const fetchStats = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(getDashboardStats)
      .then((res) => {
        setStats(res.data.result)
      })
  }
  useEffect(() => {
    fetchStats();
  }, []);

  console.log(stats)


  const refreshStats = () => {
    // this.addClass("hello")
    fetchStats();
    toast.success("All Data refreshed ✨🎉", toastStyle);
  }


  return (
    <div className='DashBoard'>
      <div className="DashbordFirstRow">
        <div className="DashbordAnalytics">
          <div className="insidedashbord">
            <div className="anyliticsofdb">
              <div className='DBImageBG'>
                <LocalShippingIcon />
              </div>
              <div className="icontextinside">
                <div>
                  <h2>{stats.TotalSale} $</h2>
                </div>
                <div className='icontplushtextflex'>
                  <Tooltip title="Refresh" onClick={refreshStats}>
                    <CachedRoundedIcon />
                  </Tooltip>
                </div>
              </div>
              <p>Total Sales</p>
            </div>
            <div className="anyliticsofdb">
              <div className='DBImageBG'>
                <MonetizationOnRoundedIcon />
              </div>
              <div className="icontextinside">
                <div>
                  <h2>{stats.TodaySale} $</h2>
                </div>
                <div className='icontplushtextflex'>
                  <div style={{ cursor: 'pointer' }}>
                    <Tooltip title="Refresh" onClick={refreshStats}>
                      <CachedRoundedIcon />
                    </Tooltip>
                  </div>
                </div>
              </div>
              <p>Today's Sales</p>
            </div>
          </div>
          <div className="insidedashbordsection2">
            <div className="anyliticsofdb">
              <div className='icontplushtextflexsec'>

                <div className='DBImageBG'>
                  <MonetizationOnRoundedIcon />
                </div>
                <div style={{ cursor: 'pointer' }}>
                  <Tooltip title="Refresh" onClick={refreshStats}>
                    <CachedRoundedIcon />
                  </Tooltip>
                </div>
              </div>
              <div className="icontextinsidenew">
                <h2>{stats.TodayOrder} $</h2>
                <p>Today Order</p>
              </div>
            </div>
            <div className="anyliticsofdb">
              <div className='icontplushtextflexsec'>
                <div className='DBImageBG'>
                  <PendingActionsIcon />
                </div>
                <div style={{ cursor: 'pointer' }}>
                  <Tooltip title="Refresh" onClick={refreshStats}>
                    <CachedRoundedIcon />
                  </Tooltip>
                </div>
              </div>
              <div className="icontextinsidenew">
                <h2>{stats.PendingOrder}</h2>
                <p>Order Pending</p>
              </div>
            </div>
            <div className="anyliticsofdb">
              <div className='icontplushtextflexsec'>
                <div className='DBImageBG'>
                  <NoCrashIcon />
                </div>
                <div style={{ cursor: 'pointer' }}>
                  <Tooltip title="Refresh" onClick={refreshStats}>
                    <CachedRoundedIcon />
                  </Tooltip>
                </div>
              </div>
              <div className="icontextinsidenew">
                <h2>{stats.DeliveredOrder}</h2>
                <p>Order Delivered</p>
              </div>
            </div>
          </div>
        </div>
        <div className="DashbordOrderAnalytics">
          <div className="orderanylitics">
            <div className='icontplushtextflexsecthierd'>
              <div className='DBImageBG'>
                <PeopleAltIcon />
              </div>
            </div>
            <div className='iconovergroth'>
              <div className="icontextinsidenewthierd">
                <p>Users</p>
                <h2>{stats.UserCount}</h2>
              </div>
              <div className='icontplushtextflexthired'>
                <div style={{ cursor: 'pointer' }}>
                  <Tooltip title="Refresh" onClick={refreshStats}>
                    <CachedRoundedIcon />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="orderanylitics">
            <div className='icontplushtextflexsecthierd'>
              <div className='DBImageBG'>
                <GridViewIcon />
              </div>
            </div>
            <div className='iconovergroth'>
              <div className="icontextinsidenewthierd">
                <p>Product View</p>
                <h2>{stats.ProductView}</h2>
              </div>
              <div className='icontplushtextflexthired'>
                <div style={{ cursor: 'pointer' }}>
                  <Tooltip title="Refresh" onClick={refreshStats}>
                    <CachedRoundedIcon />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="orderanylitics">
            <div className='icontplushtextflexsecthierd'>
              <div className='DBImageBG'>
                <ThumbUpIcon />
              </div>
            </div>
            <div className='iconovergroth'>
              <div className="icontextinsidenewthierd">
                <p>Product Likes</p>
                <h2>{stats.ProductLike}</h2>
              </div>
              <div className='icontplushtextflexthired'>
                <div style={{ cursor: 'pointer' }}>
                  <Tooltip title="Refresh" onClick={refreshStats}>
                    <CachedRoundedIcon />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
          <div className="orderanylitics">
            <div className='icontplushtextflexsecthierd'>
              <div className='DBImageBG'>
                <ShoppingCartCheckoutIcon />
              </div>
            </div>
            <div className='iconovergroth'>
              <div className="icontextinsidenewthierd">
                <p>Product In Cart</p>
                <h2>{stats.ProductInCart}</h2>
              </div>
              <div className='icontplushtextflexthired'>
                <div style={{ cursor: 'pointer' }}>
                  <Tooltip title="Refresh" onClick={refreshStats}>
                    <CachedRoundedIcon />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="DashbordSeconfRow">
        <div className="title_text_dashboard product-wrapper">
          <h1>Recent Order</h1>
          <NavLink to="/order" key="Orders" className="common-button">
            View More
          </NavLink>
        </div>

        <RecentOrder />
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
    </div>
  )
}

export default DashBoard