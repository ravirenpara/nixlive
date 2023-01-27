import React, { useState, useEffect } from "react";
import './Vieworder.css'
import { Button } from '@material-ui/core'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router-dom';
import { GetCustomerList, getCustomerOrder, getUserOrderList } from "../../Api";
import axios from "axios";
import { useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { Container } from "@material-ui/core";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { IconButton } from '@material-ui/core';
import Tooltip from "@mui/material/Tooltip";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Form from 'react-bootstrap/Form';
import SendIcon from '@mui/icons-material/Send';


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

function Vieworder() {
    const orderId = useParams();

    let token;
    if (localStorage.getItem("token") != null) {
        token = localStorage.getItem('token');
    } else if (sessionStorage.getItem('token') != null) {
        token = sessionStorage.getItem('token')
    }

    const navigate = useNavigate();
    // const handleChange = (event) => {
        //     setStatus(event.target.value);
    // };

    const [currentOrder, setCurrentOrder] = useState([])
    const [customer, setCustomer] = useState([])
    const [invoiceItemss, setInvoiceItems] = useState({});
    let invoiceItems = [
        {}
    ];
    Array.from(invoiceItemss).map((ele) => {
        invoiceItems.push(ele)
    })

    // Get Current Order Details
    const fetcViewOrderDetails = () => {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        axios.get(getUserOrderList)
            .then((res) => {
                res.data.result.docs.map((ele) => {
                    if(ele.orderShippedDate === undefined) {
                        ele.orderShippedDate = "Order Not Shipped yet"
                    }
                    if(ele.orderShippedTime === undefined) {
                        ele.orderShippedTime = ""
                    }
                    if(ele.orderDeliveredDate === undefined) {
                        ele.orderDeliveredDate = "Order Not delivered yet"
                    }
                    if(ele.orderDeliveredTime === undefined) {
                        ele.orderDeliveredTime = ""
                    }
                })
                let order = res.data.result.docs.find((ele) => {
                    return ele._id === orderId.id;
                })
                let temp = 0;
                order.products.map((ele, i) => {
                    ele.productImage = `http://localhost:7000/${ele.productImage}`;
                    ele.total = ele.productPrice * ele.productQuantity;
                    temp += (ele.productPrice * ele.productQuantity);
                })
                // axios.get(GetCustomerList)
                // .then ((res) => {
                //     let customer = res.data.result.docs.find((ele) => {
                //         return ele._id == order.CustomerId;
                //     })
                // })
                setCurrentOrder({...order,grandtotle: temp,})
                setInvoiceItems(Object.values(order.products))
                setCustomer(order.userData[0])
                setUpdatedStatus({
                    ...updatedStatus,
                    orderStatus: order.orderStatus,
                })
            })
    }
    useEffect(() => {
        fetcViewOrderDetails();
    }, []);


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [updatedStatus, setUpdatedStatus] = useState({
        orderStatus: "",
        shippingId: ""
    })
    const [status, setStatus] = React.useState('');
    const handleStatus = (e) => {
        setStatus(e.target.value);
        setUpdatedStatus({
            ...updatedStatus,
            [e.target.name]: e.target.value
        })
    }

    const handleUpdateStatus = (e) => {
        e.preventDefault();
        
        const updateStatus = new FormData();
        if(updatedStatus.orderStatus == undefined) {
            updateStatus.append("orderStatus", currentOrder.orderStatus)
        } else {
            updateStatus.append("orderStatus", updatedStatus.orderStatus)
        }
        if(updatedStatus.shippingId == undefined) {
            updateStatus.append("shippingId", currentOrder.shippingId)
        } else {
            updateStatus.append("shippingId", updatedStatus.shippingId)
        }

        axios.put(`${getUserOrderList}${currentOrder._id}`,updateStatus)
        .then((res) => {
            fetcViewOrderDetails();
            toast.success(res.data.message, toastStyle);
            setUpdatedStatus({})
        }).catch((err) => {
            toast.error(err.response.data.message, toastStyle);
        })
    } 


    return (
        <div className='ViewOrder'>
            <Button onClick={() => navigate(-1)} startIcon={<KeyboardBackspaceIcon />}>Back to Orders</Button>
            <div className="ViewOrderContainer">
                <div className='flexWrap'>
                    <div className="OrderSummery">
                        <div className="OrderDetaiks">
                            <div className="OrderDetails">
                                <div className="ordersummery">
                                    <h1 value="">Order #{currentOrder.OrderId}</h1>
                                    <span>{currentOrder.OrderDate}, {currentOrder.OrderTime}</span>
                                </div>
                                <div className="contactinfo">
                                    <div className="">
                                        <span>Phone</span>
                                        <h4 className='userorderinfodetails'>{customer?.userMobileNo}</h4>
                                    </div>
                                    <div className="vl"></div>
                                    <div className="">
                                        <span>Name</span>
                                        <h4 className='userorderinfodetails'>{customer?.userName}</h4>
                                    </div>
                                </div>
                            </div>
                            <div className="update-status">
                                <div className="ordersummerydetai">
                                    <Box sx={{ minWidth: 120 }}>
                                        <FormControl fullWidth>
                                            <Form.Select className="order-status" name='orderStatus' value={updatedStatus.orderStatus} onChange={(e) => handleStatus(e)} aria-label="Product Type">
                                                <option value={1}>Oreder Placed</option>
                                                <option value={2}>Items Shipped</option>
                                                <option value={3}>Items Delivered</option>
                                            </Form.Select>
                                        </FormControl>
                                    </Box>
                                </div>
                                {updatedStatus.orderStatus != 1 && <div className="shippindinfo">
                                    <span>Shipping ID</span>
                                    <div className="update">
                                        {currentOrder.orderStatus == 3 ?
                                            <input type="text" disabled={currentOrder.orderStatus == 3 ? true : false} value={currentOrder.shippingId} className='modifyshpID' name="shippingId" />
                                            :
                                            <input type="text" className='modifyshpID' name="shippingId" onChange={(e) => handleStatus(e)} placeholder="XYZ01234" />
                                        }
                                        <Tooltip title="Update Order Status">
                                            <IconButton color="secondary" aria-label="add an alarm" onClick={(e) => handleUpdateStatus(e)} disabled={currentOrder.orderStatus == 3 ? true : false} className={currentOrder.orderStatus == 3 ? 'update-btn dyFlextIcon disable' : 'update-btn dyFlextIcon'}>
                                                <SendIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className="GivenOrderItems">
                        <h1>Summary</h1>
                        <Container maxWidth="md">
                            {/* <h2 style={{ textAlign: "center" }}>Invoice</h2> */}
                            <Paper>
                                <TableContainer className="TableContainer">
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead className="TableHeadCompt">
                                            <TableRow>
                                                <TableCell align="left"> Product Detail </TableCell>
                                                <TableCell align="right"> Price </TableCell>
                                                <TableCell align="right"> Qty. </TableCell>
                                                <TableCell align="right"> Total </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {
                                                invoiceItems
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .filter((item) => item.total > 0)
                                                    .sort((a, b) => (a.name > b.name ? 1 : -1))
                                                    .map((item) => {
                                                        return (
                                                            <TableRow key={item.name}>
                                                                <TableCell className="OrderItemCustomize">
                                                                    <img src={item.productImage} alt="OrderImage" />
                                                                    <div className="SubItem">
                                                                        <div className="OrderItemDetails">
                                                                            <b>{item.productName}({item.productBrand})({item.productCategory})</b><br />
                                                                            <span>Item Number : </span><b>{item.productItemNo}</b><br />
                                                                            <span>Size : </span><b>{item.productSize}</b>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {"$"}
                                                                    {(item.productPrice).toFixed(2)}{" "}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    x{item.productQuantity}
                                                                </TableCell>
                                                                <TableCell align="right">{"$"}
                                                                    {(item.productPrice * item.productQuantity).toFixed(2)}
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                            }
                                            <TableRow className="orderTotal">
                                                <TableCell></TableCell>
                                                <TableCell></TableCell>
                                                <TableCell align="right" className="orderTotal">
                                                    <strong>Total </strong>
                                                </TableCell>
                                                <TableCell className="orderTotal" align="right">{"$"}
                                                     {currentOrder.grandtotle?.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 20, 30]}
                                    component="div"
                                    count={invoiceItems.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Paper>
                        </Container>
                    </div>
                </div>
                <div className="OrderStatus">
                    <div className="orderdetailinside" id={"status"+currentOrder.orderStatus}>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} aria-label="contacts" >
                            <ListItem disablePadding>
                                <ListItemIcon>
                                    <DoneIcon />
                                </ListItemIcon>
                                <ListItemText primary="Order placed" className="BoldTextFiled" />
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText inset primary={`${currentOrder.OrderDate}, ${currentOrder.OrderTime}`} />
                            </ListItem>
                        </List>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} aria-label="contacts" >
                            <ListItem disablePadding>
                                <ListItemIcon>
                                    <LocalShippingIcon />
                                </ListItemIcon>
                                <ListItemText primary="Items Shipped" className="BoldTextFiled" />
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText inset primary={`${currentOrder.orderShippedDate}, ${currentOrder.orderShippedTime}`} />
                            </ListItem>
                        </List>
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} aria-label="contacts" >
                            <ListItem disablePadding>
                                <ListItemIcon>
                                    <DoneAllIcon />
                                </ListItemIcon>
                                <ListItemText primary="Items Delivered" className="BoldTextFiled" />
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText inset primary={`${currentOrder.orderDeliveredDate}, ${currentOrder.orderDeliveredTime}`} />
                            </ListItem>
                        </List>
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
        </div>
    )
}

export default Vieworder


