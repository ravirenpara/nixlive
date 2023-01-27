import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import './Order.css'
import Button from '@mui/material/Button';
import IosShareIcon from '@mui/icons-material/IosShare';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { AiOutlinePlus } from 'react-icons/ai'
import Menu from '@mui/material/Menu';
import { bindTrigger, bindMenu } from 'material-ui-popup-state';
import PopupState from 'material-ui-popup-state';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FormControlLabel, IconButton } from '@material-ui/core';
import { Link } from "react-router-dom";
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import DateRangePicker from 'rsuite/DateRangePicker';
import 'rsuite/dist/rsuite.min.css';
import { getUserOrderList } from "../../Api";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import { RangeDatePicker } from 'react-google-flight-datepicker';
import 'react-google-flight-datepicker/dist/main.css';


export default function DataTable() {


  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState([]);
  const MatEdit = ({ index }) => {
    const handleEditClick = () => {
      let selected = rows.find((ele) => {
        return ele._id === index
      })
      setSelectedOrder(selected)
      navigate(`/vieworder/${selected._id}`);
    }
    return <FormControlLabel
      control={
        // <Link to={"/vieworder/"+selectedOrder._id}>
        <IconButton color="secondary" aria-label="add an alarm" onClick={handleEditClick} >
          <VisibilityIcon style={{ color: '#766d6d7a' }} />
        </IconButton>
        // </Link>
      }
    />
  };
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const columns = [
    { field: 'srno', headerName: 'Sr No', width: 80 },
    { field: 'OrderDate', headerName: 'Date', width: 130 },
    { field: 'OrderId', headerName: 'Order ID', width: 240 },
    { field: 'userName', headerName: 'Full Name', width: 150 },
    {
      field: 'orderStatus', headerName: 'Status', width: 160,
    },
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
    { field: 'shippingId', headerName: 'Shipping ID', width: 180 },
    { field: 'subTotal', headerName: 'Total', type: 'number', width: 150, },
    {
      field: "actions", headerName: "Actions", sortable: false, width: 140,
      renderCell: (prevent) => {
        return (
          // <Link to={"/vieworder/"+prevent.row._id}>
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <MatEdit index={prevent.row._id} />
          </div>
          // </Link>
        );
      }
    }
  ];



  const [rows, setRows] = useState([])
  const [pageState, setPageState] = useState({
    total: 0,
    page: 1,
    pageSize: 10
  })
  
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    if (e.target.value == null) {
      setSearch("")
    } else {
      setSearch(e.target.value)
    }
  }

  const [dateStart, setDateStart] = useState("")
  const [dateEnd, setDateEnd] = useState("")
  const onDateChange = (startDate, endDate) => {
    let sday = new Date(startDate).getDate();
    let smonth = new Date(startDate).getMonth() + 1;
    let syear = new Date(startDate).getFullYear();
    if (sday < 10) sday = "0" + sday;
    if (smonth < 10) smonth = "0" + smonth;
    startDate = `${smonth}/${sday}/${syear}`;
    setDateStart(startDate)

    let eday = new Date(endDate).getDate();
    let emonth = new Date(endDate).getMonth() + 1;
    let eyear = new Date(endDate).getFullYear();
    if (eday < 10) eday = "0" + eday;
    if (emonth < 10) emonth = "0" + emonth;
    endDate = `${emonth}/${eday}/${eyear}`;
    setDateEnd(endDate)
  }

  const [filter, setFilter] = useState({
    orderStatus: "",
    dateStart: "",
    dateEnd: "",
    activeOrder: ""
  })

  const [FilterActive, setFilterActive] = useState([]);
  const handleActiveFilter = (e) => {
    if (FilterActive.includes(1) && FilterActive.includes(2)) {
      setFilterActive(FilterActive.filter(item => item !== 1 && item !== 2 && item === 3));
    } else {
      setFilterActive([...FilterActive, 1, 2]);
    }
  }
  const handleStatusFilter = (e) => {
    const { value } = e.target;
    if (FilterActive.includes(Number(value))) {
      setFilterActive(FilterActive.filter(item => item !== Number(value)));
    } else {
      setFilterActive([...FilterActive, Number(value)]);
    }  
  }

  const handleFilter = (e) => {
    e.preventDefault();
    fetcOrderDetails()
    setFilter({
      ...filter,
      dateStart: dateStart,
      dateEnd: dateEnd,
      orderStatus: FilterActive.join(",")
    })
  }

  const handleResetFilter = (e) => {
    setFilter({
      orderStatus: "",
      dateStart: "",
      dateEnd: "",
      activeOrder: ""
    })
    setDateStart("");
    setDateEnd("");
    setFilterActive([])
  }

  const fetcOrderDetails = () => {
    console.log(`?orderStatus=${filter.orderStatus}&dateStart=${filter.dateStart}&dateEnd=${filter.dateEnd}`);
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${getUserOrderList}?page=${pageState.page}&limit=${pageState.pageSize}&search=${search}`)
      .then((res) => {
        const json = res.data.result
        setPageState(old => ({ ...old, total: json.totalDocs }))

        res.data.result.docs.map((ele, i) => {
          ele.id = i + 1
          ele.srno = (res.data.result.page * 10) + (i + 1) - 10

          let day = new Date(ele.createdAt).getDate();
          let month = new Date(ele.createdAt).getMonth() + 1;
          let year = new Date(ele.createdAt).getFullYear();
          ele.OrderDate = `${day}/${month}/${year}`;

          ele.productId = []
          ele.products.map((data) => {
            ele.productId.push(data.productItemNo)
          })

          if (ele.userName === null) {
            ele.userName = "";
          } else {
            ele.userName = ele.userData[0]?.userName
          }
          // console.log(ele.userName)


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
        setRows(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetcOrderDetails();
  }, [pageState.page, pageState.pageSize, search, filter]);

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem('token');
  } else if (sessionStorage.getItem('token') != null) {
    token = sessionStorage.getItem('token')
  }


  const [startDate, setStartDate] = useState(new Date());
  return (
    <>
      <div className='orderpage'>
        <div className="title_text">
          <h1>Orders Page</h1>

        </div>
        <div className="active_btns pageFilterBar">
          <div className='explore_btns'>
            <div className='fillter'>
              <PopupState variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <React.Fragment>
                    <Button variant="contained" className='fillter_btn' {...bindTrigger(popupState)} startIcon={<AiOutlinePlus />}>
                      Filter
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                      <div className="section_p_20">
                        <div className="drwdownMenus">
                          <Button className='rst-Btn-Lnk' onClick={(e) => handleResetFilter(e)} autoFocus  >
                            Reset
                          </Button>
                          <Button className='aply-Btn-Lnk' onClick={(e) => handleFilter(e)} autoFocus>
                            Apply
                          </Button>
                        </div>
                        <div className='filter-item on-sale'>
                          <div className="drwTitle">
                            <h2>Active Orders</h2>
                          </div>
                          <div className="checkstatus">
                            <input type="checkbox" onChange={(e) => handleActiveFilter(e)} checked={FilterActive.includes(1) && FilterActive.includes(2) ? true : (FilterActive.includes(3)) ? false : false} hidden="hidden" id="onsale" />
                            <label className="switch" for="onsale"></label>
                          </div>
                        </div>
                        <div className="drwTitle">
                          <h2>Status</h2>
                        </div>
                        <div className="checkstatus">
                          <div className="allStetus">
                            <div className='status-item '>
                              <input type="checkbox" id='order-place' value={1} checked={FilterActive.includes(1) ? true : false} onChange={(e) => handleStatusFilter(e)} />
                              <label htmlFor="order-place">Order Placed</label>
                            </div>
                            <div className='status-item '>
                              <input type="checkbox" id='shipped' value={2} checked={FilterActive.includes(2) ? true : false} onChange={(e) => handleStatusFilter(e)} />
                              <label htmlFor="shipped">Order Shipped</label>
                            </div>
                          </div>
                          <div className="allStetus ">
                            <div className='status-item'>
                              <input type="checkbox" id='delivered' value={3} checked={FilterActive.includes(3) ? true : false} onChange={(e) => handleStatusFilter(e)} />
                              <label htmlFor="delivered">Order Delivered</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='HL'></div>
                      <div className="datePiker">
                        <label htmlFor="">Date</label>
                        <div >
                          <RangeDatePicker
                            startDate={new Date()}
                            endDate={new Date()}
                            onChange={(startDate, endDate) => onDateChange(startDate, endDate)}
                            minDate={new Date(1900, 0, 1)}
                            maxDate={new Date(2100, 0, 1)}
                            dateFormat="DD/MM/YYYY"
                            monthFormat="MMM YYYY"
                            startDatePlaceholder="Start Date"
                            endDatePlaceholder="End Date"
                            disabled={false}
                            className="my-own-class-name"
                            startWeekDay="monday"
                          />
                        </div>
                      </div>
                    </Menu>
                  </React.Fragment>
                )}
              </PopupState>
            </div>
          </div>
          <div className='searchbaar'>
            <div className='serach_icon'>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e) => handleSearch(e)}
            />
          </div>
        </div>
      </div>
      <div className="datagridtablefororder">
        <DataGrid
          autoHeight
          getRowHeight={() => 'auto'}
          rows={rows}
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
          // checkboxSelection
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </div>
    </>
  );
}


