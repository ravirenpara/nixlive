import React, { useState, useEffect } from "react";
import './DataCollection.css'
import Button from '@mui/material/Button';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { bindTrigger, bindMenu } from 'material-ui-popup-state';
import PopupState from 'material-ui-popup-state';
import { AiOutlinePlus } from 'react-icons/ai';
import "react-datepicker/dist/react-datepicker.css";
import Menu from '@mui/material/Menu';
import DateRangePicker from 'rsuite/DateRangePicker';
import 'rsuite/dist/rsuite.min.css';
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import { getDataCollection } from "../../Api";
import axios from "axios";
import { RangeDatePicker } from 'react-google-flight-datepicker';
import 'react-google-flight-datepicker/dist/main.css';

function DataCollection() {
  const [startDate, setStartDate] = useState(new Date());
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem('token');
  } else if (sessionStorage.getItem('token') != null) {
    token = sessionStorage.getItem('token')
  }

  const productColumns = [
    { field: 'srno', headerName: 'Product ID', width: 110 },
    { field: 'productName', headerName: 'Product Name', width: 150 },
    { field: 'productInCart', headerName: 'In Cart Product', width: 110 },
    { field: 'productInWishlist', headerName: 'liked', width: 110 },
    { field: 'viewed', headerName: 'Viewed', width: 110 },
    { field: 'sold', headerName: 'Sold', width: 110 },
  ];
  const brandColumns = [
    { field: 'srno', headerName: 'Brand ID', width: 110 },
    { field: 'brandName', headerName: 'Brand Name', width: 150 },
    { field: 'productInCart', headerName: 'In Cart Product', width: 110 },
    { field: 'productInWishlist', headerName: 'liked', width: 110 },
    { field: 'viewed', headerName: 'Viewed', width: 110 },
    { field: 'sold', headerName: 'Sold', width: 110 },
  ];
  const [productData, setProductData] = useState({});
  const [brandData, setBrandData] = useState({});
  const [productDataState, setproductDataState] = useState({
    total: 0,
    page: 1,
    pageSize: 10
  })
  const [pageState, setPageState] = useState({
    total: 0,
    page: 1,
    pageSize: 10
  })
  const [filter, setFilter] = useState({
    dateStart: "",
    dateEnd: ""
  })
  const [dateStart , setDateStart] = useState("")
  const [dateEnd , setDateEnd] = useState("")

  const onDateChange = (startDate , endDate) => {

    let sday = new Date(startDate).getDate();
    let smonth = new Date(startDate).getMonth() + 1;
    let syear = new Date(startDate).getFullYear();
    if(sday < 10) sday = "0" + sday;
    if(smonth < 10) smonth = "0" + smonth;
    startDate = `${smonth}/${sday}/${syear}`;
    setDateStart(startDate)

    let eday = new Date(endDate).getDate();
    let emonth = new Date(endDate).getMonth() + 1;
    let eyear = new Date(endDate).getFullYear();
    if(eday < 10) eday = "0" + eday;
    if(emonth < 10) emonth = "0" + emonth;
    endDate  = `${emonth}/${eday}/${eyear}`;
    setDateEnd(endDate)  
  }
  const applyFilter = () => {
    setFilter({
      ...filter,
      dateStart: dateStart,
      dateEnd: dateEnd
    })
  }
  const resetFilter = () => {
    setFilter({
      ...filter,
      dateStart: "",
      dateEnd: ""
    })
  }

  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    if(e.target.value != null) {
      setSearch(e.target.value)
    } else {
      setSearch("")
    }
    fetchProductData();
    fetchBrandData();
  }

  // Get All Products Data
  const fetchProductData = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;

    axios.get(`${getDataCollection}/productDataCollection?page=${productDataState.page}&limit=${productDataState.pageSize}&search=${search}&dateStart=${filter.dateStart}&dateEnd=${filter.dateEnd}`)
      .then((res) => {
        const json = res.data.result
        setproductDataState(old => ({ ...old, total: json.totalDocs }))

        res.data.result.docs.map((ele, i) => {
          ele.id = i + 1
          ele.srno = (res.data.result.page * 10) + (i + 1) - 10
        })
        setProductData(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetchProductData();
  }, [productDataState.page, productDataState.pageSize, search, filter]);


  // Get All Brands Data
  const fetchBrandData = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${getDataCollection}/brandDataCollection?page=${pageState.page}&limit=${pageState.pageSize}&search=${search}&dateStart=${filter.dateStart}&dateEnd=${filter.dateEnd}`)
      .then((res) => {
        const json = res.data.result
        setPageState(old => ({ ...old, total: json.totalDocs }))

        res.data.result.docs.map((ele, i) => {
          ele.id = i + 1
          ele.srno = (res.data.result.page * 10) + (i + 1) - 10
        })
        setBrandData(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetchBrandData();
  }, [pageState.page, pageState.pageSize ,search , filter]);


  return (
    <>
      <div className='innerpage-top data-collection-page'>
        <div className="title_text">
          <h1>Data Collection</h1>
        </div>
        <div className="active_btns pageFilterBar">
          <div className='explore_btns'>
            <div className='fillter'>
              <PopupState variant="popover" popupId="demo-popup-menu data-collection-filter">
                {(popupState) => (
                  <React.Fragment>
                    <Button variant="contained" className='fillter_btn' {...bindTrigger(popupState)} startIcon={<AiOutlinePlus />}>
                      Filter
                    </Button>
                    <Menu {...bindMenu(popupState)}>
                      <div className="section_p_20 data-collection-page">
                        <div className="drwdownMenus">
                          <Button className='rst-Btn-Lnk' onClick={resetFilter} autoFocus  >
                            Reset
                          </Button>
                          <Button className='aply-Btn-Lnk' onClick={applyFilter} autoFocus>
                            Apply
                          </Button>
                        </div>
                      </div>
                      <div className='HL'></div>
                      <div className="datePiker">
                        <label htmlFor="">Date</label>
                        <div >
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
                          {/* <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} startIcon={<IosShareIcon />} /> */}
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
      <div className="flaxdyforbtn">
        <div className="data-collection-page" style={{ height: 660, width: '100%' }}>
          <DataGrid
            rows={productData}
            columns={productColumns}
            rowCount={productDataState.total}
            pagination
            page={productDataState.page - 1}
            pageSize={productDataState.pageSize}
            paginationMode="server"
            onPageChange={(newPage) => {
              setproductDataState(old => ({ ...old, page: newPage + 1 }))
            }}
            onPageSizeChange={(newPageSize) => setproductDataState(old => ({ ...old, pageSize: newPageSize }))}
            components={{
              Toolbar: CustomToolbar,
            }}
          // checkboxSelection
          />
        </div>
        <div className="data-collection-page" style={{ height: 660, width: '100%' }}>
          <DataGrid
            rows={brandData}
            columns={brandColumns}
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
      </div>
    </>
  );
}

export default DataCollection