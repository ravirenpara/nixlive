import React from 'react'
import CompletedOrder from '../../../Components/CompletedOrder/CompletedOrder'
import PandinOrder from '../../../Components/PandingOrder/PandingOrder'
import './CustomerOrder.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FormControlLabel, IconButton } from '@material-ui/core';
import { Link, useNavigate, useParams } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import IosShareIcon from '@mui/icons-material/IosShare';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@mui/material/Button';
import { AiOutlinePlus } from 'react-icons/ai'
import Menu from '@mui/material/Menu';
import { bindTrigger, bindMenu } from 'material-ui-popup-state';
import PopupState from 'material-ui-popup-state';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { useState , useEffect } from 'react';
import { GetCustomerList, getCustomerOrder } from '../../../Api';
import axios from 'axios';



function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomerOrder() {

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem('token');
  } else if (sessionStorage.getItem('token') != null) {
    token = sessionStorage.getItem('token')
  }

  const customerId = useParams();
  const [customerList , setCustomerList] = useState({});
  const [activeOredrs , setActiveOrders] = useState({});
  const [completedOrder , setCompletedOrder] = useState({});
  const [orders , setOrders] = useState({});
  const [viewOrder , setViewOrder] = useState({});
  const navigate = useNavigate();



  // Get All Customers List
  const fetchCustomers = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(GetCustomerList)
      .then((res) => {
        setCustomerList(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetchCustomers();
  }, []);


  // Get Customer Detail
  const customer = Array.from(customerList).find((ele) => {
    return ele._id === customerId.id;
  })

  const [pageState, setPageState] = useState({
    total: 0,
    page: 1,
    pageSize: 10
  })

   // Get All Active Order List
   const fetchActiveOrder = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${getCustomerOrder}${customerId.id}?page=${pageState.page}&limit=${pageState.pageSize}&orderStatus=1,2`)
      .then((res) => {
        const json = res.data.result
        setPageState(old => ({ ...old, total: json.totalDocs }))

        res.data.result.docs.map((ele) => {
          ele.id = ele.OrderId

          ele.productId = []
          ele.products.map((data) => {
            ele.productId.push(data.productId)
          })

          if (ele.orderStatus == 1) {
            ele.orderStatus = "Order Placed"
          }
          else if (ele.orderStatus == 2) {
            ele.orderStatus = "Item Shipped"
          }
          else if (ele.orderStatus == 3) {
            ele.orderStatus = "Item Delivered"
          }
          else {
            ele.orderStatus = ""
          }
        })
        setActiveOrders(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetchActiveOrder();
  }, [pageState.page, pageState.pageSize]);

  // Get All Active Order List
  const fetchCompletedOrder = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${getCustomerOrder}${customerId.id}?page=${pageState.page}&limit=${pageState.pageSize}&orderStatus=3`)
      .then((res) => {
        const json = res.data.result
        setPageState(old => ({ ...old, total: json.totalDocs }))

        res.data.result.docs.map((ele) => {
          ele.id = ele.OrderId

          ele.productId = []
          ele.products.map((data) => {
            ele.productId.push(data.productId)
          })

          if (ele.orderStatus == 1) {
            ele.orderStatus = "Order Placed"
          }
          else if (ele.orderStatus == 2) {
            ele.orderStatus = "Item Shipped"
          }
          else if (ele.orderStatus == 3) {
            ele.orderStatus = "Item Delivered"
          }
          else {
            ele.orderStatus = ""
          }
        })
        setCompletedOrder(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetchCompletedOrder();
  }, [pageState.page, pageState.pageSize]);
  

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  // Get all ordres
  const fetchOredrs = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(getCustomerOrder+customerId.id)
      .then((res) => {
        setOrders(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetchOredrs();
  }, []);

  const MatEdit = ({ index }) => {
    const handleEditClick = () => {
      let selected = orders.find((ele) => {
        return ele._id === index;
      })
      setViewOrder(selected)      
      navigate(`/vieworder/${selected._id}`);
    }
    return <FormControlLabel
      control={
        <IconButton color="secondary" aria-label="add an alarm" onClick={handleEditClick} >
          <VisibilityIcon style={{ color: '#766d6d7a' }} />
        </IconButton>
      }
    />
  };


  const columns = [
    { field: 'OrderDate', headerName: 'Date', width: 200 },
    { field: 'id', headerName: 'Order ID', width: 170 },
    { field: 'orderStatus', headerName: 'Status', width: 250 },
    {
      field: 'productId', headerName: 'Product ID', width: 240,
      renderCell: (prevent) => {
        var value = prevent.row.productId.map((data) => (
          <>
            <li key={data}>{data}</li>
          </>
        ))
        return value
      }
    },
    { field: 'shippingId', headerName: 'Shipping ID', width: 200 },
    { field: 'subTotal', headerName: 'Total', type: 'number', width: 150, },
    {
      field: "actions", headerName: "Actions", sortable: false, width: 140,
      renderCell: (prevent) => {
        return (
          // <Link to={`/vieworder/${viewOrder._id}`}>
            <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
              <MatEdit index={prevent.row._id} />
            </div>
          // </Link>
        );
      }
    }
  ];

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className='CustomerOrderContainer'>

      <div className="title_text">
        <h1><b>{customer?.userName}'s</b> Orders</h1>
      </div>
      <Box sx={{ width: '100%' }}>
        <Box >
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Active Orders" {...a11yProps(0)} />
            <Tab label="Completed Order" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <div style={{ height: 660, width: '100%' }} className="datagridtablefororder">
            <DataGrid
              rows={activeOredrs}
              columns={columns}
              rowCount={pageState.total}
              pagination
              page={pageState.page - 1}
              pageSize={pageState.pageSize}
              paginationMode="server"
              onPageChange={(newPage) => {
                setPageState(old => ({ ...old, page: newPage + 1 }))
              }}
              onPageSizeChange={(newPageSize) => setPageState(old => ({ ...old, pageSize: newPageSize }))}
              components={{
                Toolbar: CustomToolbar,
              }}
            // checkboxSelection
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div style={{ height: 660, width: '100%' }} className="datagridtablefororder">
            <DataGrid
              rows={completedOrder}
              columns={columns}
              rowCount={pageState.total}
              pagination
              page={pageState.page - 1}
              pageSize={pageState.pageSize}
              paginationMode="server"
              onPageChange={(newPage) => {
                setPageState(old => ({ ...old, page: newPage + 1 }))
              }}
              onPageSizeChange={(newPageSize) => setPageState(old => ({ ...old, pageSize: newPageSize }))}
              components={{
                Toolbar: CustomToolbar,
              }}
            // checkboxSelection
            />
          </div>
        </TabPanel>
      </Box>

    </div>
  )
}

export default CustomerOrder