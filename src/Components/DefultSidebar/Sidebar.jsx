import React from 'react'
import { Link } from "react-router-dom";
import './Sidebar.css'
import { NavLink } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import { FaTag } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaPercentage } from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa"
import Logo1 from "../../Images/NIX_logo.png"
import { FaShoppingBag } from "react-icons/fa";
import { FaUserLock } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import { useState } from 'react';
import { CFooter } from '@coreui/react';
import { FaRegCaretSquareLeft } from 'react-icons/fa'
import GridViewIcon from '@mui/icons-material/GridView';
import NewspaperIcon from '@mui/icons-material/Newspaper';






const routes = [
    {
        path: "/",
        name: "Dashboard",
        icons: <GridViewIcon />,
        id: "dashboard",
        key:"DASHBOARD"

    },
    {
        path: "/order",
        name: "Orders",
        icons: <FaShoppingCart />,
        id: "order",
        key: "ORDERS"
    },
    {
        path: "/products",
        name: "Products",
        icons: <FaTag />,
        id: "products",
        key:"PRODUCTS"
    },
    {
        path: "/customers",
        name: "Customers",
        icons: <FaUsers />,
        id: "CUSTOMERS"
    },
    {
        path: "/promotions",
        name: "Promotions",
        icons: <FaPercentage />,
        id: "promotions",
        key: "PROMOTION"
    },

    {
        path: "/datacollection",
        name: "Data Collection",
        icons: <FaRegChartBar />,
        id: "datacollection"
    },
    {
        path: "/brands",
        name: "Brands/Catergory",
        icons: <FaShoppingBag />,
        id: "brands-categiry"
    },
    {
        path: "/roles",
        name: "Roles",
        icons: <FaUserLock />,
        id: "roles"
    },
    {
        path: "/employees",
        name: "Employees",
        icons: <FaUserPlus />,
        id: "employees"
    }


]

function Sidebar({ children }) {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const [sideOpen, setIsopen] = useState(false);
    const ToggleSidebar = () => {
        sideOpen === true ? setIsopen(false) : setIsopen(true);
    }
    const handleCloseSidebar = () => {
        sideOpen === true ? setIsopen(false) : setIsopen(false);
    };

    var data = {}
    var finalroutes = []
    var permissions = []


    if (localStorage.getItem('adminData')) data = JSON.parse(localStorage.getItem('adminData'))
    if (sessionStorage.getItem('adminData')) data = JSON.parse(sessionStorage.getItem('adminData'))

    if (data.permissionData) {
        if (data.type === "SUPER") finalroutes = routes
        else {
            data.permissionData.map((value) => {
                permissions.push(value.key)
            })
            // permissions.push("")
            finalroutes = routes.filter((ele) => {
                return permissions.includes(ele.key)
            })
            finalroutes.unshift(routes[0])
        }

    }


    return (
        <div className='wrapper'>
            <div className={isOpen ? "Main-Container open" : "Main-Container"}>
                <div className={`sidebarOverlay ${sideOpen == true ? 'active' : ''}`} onClick={handleCloseSidebar}></div>
                <div className="mobile-menu">
                    <button className={`menu-toggler ${sideOpen == true ? 'active' : ''}`} onClick={ToggleSidebar} id='menu-toggler' type="button"></button>
                </div>
                <div className={`Siderbar ${sideOpen == true ? 'active' : ''}`} id='mobileSidebar' style={{ width: isOpen ? "300px" : "78px" }}>
                    <Link to="/">
                        <div className='top_section'>
                            <img src={Logo1} alt="" className='logo' />
                            <h1 className="logo_text">Shoe Store</h1>
                            {/* <div className="fa_bars"><FaBars /></div> */}
                        </div>
                    </Link>
                    <section className='routes'>
                        {finalroutes.map((route) => (
                            <NavLink onClick={handleCloseSidebar} to={route.path} key={route.name} className="link" id={route.id} >
                                <div className="icon">{route.icons}</div>
                                {isOpen && <div className="link_text">{route.name}</div>}
                            </NavLink>
                        ))}

                        <CFooter style={{ width: isOpen ? "300px" : "75px" }}>
                            <div>
                                <div className='ft-col-1'>
                                    {isOpen && <span>&copy; 2022 Nix Shoe Store.</span>}
                                </div>
                                <div className='ft-col-2'>
                                    <FaRegCaretSquareLeft onClick={toggle} />
                                </div>
                            </div>
                        </CFooter>
                    </section>
                </div>
                <main className='main-wrap' style={{ width: isOpen ? 'calc(100% - 300px)' : "100%" }}> {children} </main>
            </div>
        </div>
    )
}

export default Sidebar