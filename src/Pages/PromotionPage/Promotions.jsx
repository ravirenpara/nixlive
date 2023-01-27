import React, { useState, useEffect } from 'react';
import './Promotions.css'
import './AddPromo.css'
import AddPromo from './AddPromo';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import IosShareIcon from '@mui/icons-material/IosShare';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { bindTrigger, bindMenu } from 'material-ui-popup-state';
import PopupState from 'material-ui-popup-state';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import { FormControlLabel, IconButton } from '@material-ui/core';
import Avtar from '../../Images//images.png'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AiOutlinePlus } from 'react-icons/ai';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Menu from '@mui/material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Form from 'react-bootstrap/Form';
import DateRangePicker from 'rsuite/DateRangePicker';
import 'rsuite/dist/rsuite.min.css';
import { GetCustomerList, getCustomerOrder, getProduct } from '../../Api';
import { GetPromotionList } from "../../Api";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RangeDatePicker } from 'react-google-flight-datepicker';
import 'react-google-flight-datepicker/dist/main.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const secondmodel = {
  position: 'absolute',
  top: '0',
  right: '0',
  bottom: '0',
  width: '50%',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  // p: '1.5rem',
};
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




function Promotions() {

  // add promotion
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [promoImage, setpromofeaturedImage] = useState({})
  const [rowss, setRowss] = useState([]);
  const [addPromotion, setAddPromotion] = useState({
    promoImage: "",
    promotitle: "",
    selected_products: "",
    notificationBody: ""
  });
  const handleChange = (e) => {
    setAddPromotion({
      ...addPromotion,
      [e.target.name]: e.target.value,
    })
  }

  // Add Promotion API
  const handleAddPromotion = (e) => {
    e.preventDefault()
    let slectedProduct = [];
    // selectedRows.map((ele) => {
    //   slectedProduct.push(ele._id)
    // })
    let newPromotion = {
      ...addPromotion,
      selected_products: selectedRows,
      promoImage: promoImage,
    }
    console.log(newPromotion)
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    // axios.post(GetPromotionList, newPromotion)
    //   .then((res) => {
    //     fetcPromotionList()
    //     toast.success(res.data.message, toastStyle);
    //     handleClose()
    //     newPromotion = "";
    //   }).catch((err) => {
    //     console.log(err)
    //     toast.error(err.response.data.message, toastStyle);
    //     newPromotion = "";
    //   })

  }

  const [productPageState, setproductPageState] = useState({
    total: 0,
    page: 1,
    pageSize: 5
  })
  const [searchProduct, setSearchProduct] = useState("");
  const handleSearchProduct = (e) => {
    setSearchProduct(e.target.value)
    fetcAddPromotionList()
  }

  // Get all Products list
  const fetcAddPromotionList = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${getProduct}?page=${productPageState.page}&limit=${productPageState.pageSize}&search=${searchProduct}`)
      .then((res) => {
        const json = res.data.result
        setproductPageState(old => ({ ...old, total: json.totalDocs }))

        res.data.result.docs.map((ele, i) => {
          ele.id = i + 1
          ele.srno = (res.data.result.page * 5) + (i + 1) - 5
          ele.featuredProductImage = `http://${ele.featuredProductImage}`;
          const enable = ele.flag;

          ele.brandName = ele.brandData[0]?.brandName;

          if (ele.productCategory === null) {
            ele.productCategory = "";
          } else {
            ele.productCategory = ele.categoryData[0]?.categoryName
          }

        })
        setRowss(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetcAddPromotionList();
  }, [productPageState.page, productPageState.pageSize]);

  const columnss = [
    { field: 'srno', headerName: 'Sr No', width: 100 },
    { field: 'featuredProductImage', headerName: 'Image', width: 120, editable: true, renderCell: (params) => <img src={params.value} width="40px" />, },
    { field: 'productName', headerName: 'Product', width: 150 },
    { field: 'productPrice', headerName: 'Price', width: 150 },
    { field: 'brandName', headerName: 'Brand', width: 150 },
    { field: 'productCategory', headerName: 'Category', width: 150 }
  ];

  const [selectedPromo, setSelectedPromo] = useState("");
  const [editPromotion, setEditPromotion] = useState({
    promoImage: "",
    promotitle: "",
    selected_products: "",
    notificationBody: ""
  })

  // Delete promotion
  function MatDelete({ index }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [deletePromo, setDeletePromo] = useState([])
    const handleDeleteClick = (e) => {
      handleOpen()
      let selected = rows.find((ele) => {
        return ele._id === index;
      })
      setDeletePromo(selected)
    };
    const handleDeletePromo = (e) => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.delete(GetPromotionList + "/" + deletePromo._id)
        .then((res) => {
          fetcPromotionList()
          toast.success(res.data.message, toastStyle);
        }).catch((err) => {
          console.log(err)
          toast.error(err.response.data.message, toastStyle);
        })

      handleClose();
    }

    return <FormControlLabel
      control={<>
        <div className='ActionButtons'>
          <IconButton color="secondary" aria-label="add an alarm" onClick={handleDeleteClick} className='dyFlextIcon'>
            <DeleteOutlinedIcon />
          </IconButton>
          <div className="delete-popup">
            <Button id="delete-data" onClick={handleOpen}></Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="delete-data-model" sx={style}>
                <Typography className="model-icon" id="modal-modal-title" variant="h6" component="h1">
                  <DeleteSweepIcon />
                </Typography>
                <Typography className="model-text" id="modal-modal-description" sx={{ mt: 2 }}>
                  <h2>Are You Sure! Want to Delete <strong>{deletePromo.promotitle} </strong> Record?</h2>
                  <p>Do you really want to delete these records? You can't view this in your list anymore if you delete!</p>
                </Typography>
                <Typography className="model-button">
                  <Button variant="contained" className='primaryBtn order_active' onClick={handleClose} >No, Keep it</Button>
                  <Button variant="contained" className='primaryBtn order_active green' onClick={handleDeletePromo} >Yes, Delete it</Button>
                </Typography>
              </Box>
            </Modal>
          </div>
        </div>
      </>} />;
  }
  const [editPromo, setEditPromo] = useState([])
  function MatEdit({ index }) {
    const handleEditClick = (e) => {
      handleEditOpen()
      let selected = rows.find((ele) => {
        return ele._id === index;
      })
      setEditPromo(selected)
      console.log(selected);
    };

    return <FormControlLabel
      control={<>
        <div className='ActionButtons'>
          <IconButton color="secondary" aria-label="add an alarm" onClick={handleEditClick} className='dyFlextIcon'>
            <ModeEditOutlineOutlinedIcon />
          </IconButton>
        </div>
      </>} />;
  }

  // edit promotion
  const [editpromotion, setEditpromotion] = useState([])
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const handleImageUpload = e => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = e => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      // setpromofeaturedImage(e.target.files[0])
    }

    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    const promoImageChange = new FormData();
    promoImageChange.append('Image', e.target.files[0]);
    axios.post(getProduct + "/productImage", promoImageChange)
    .then((res) => {
      setpromofeaturedImage(res.data.urlArray[0])
    }).catch((err) => {
      toast.error(err.response.data.message, toastStyle);
    })
  };

  const columns = [
    { field: 'srno', headerName: 'Promo ID', width: 300 },
    { field: 'promotitle', headerName: 'Title', width: 300 },
    { field: 'createdAt', headerName: 'Date', width: 300 },
    {
      field: 'enable', headerName: 'Enable', width: 300,

      renderCell: (prevents) => {
        return (
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <MatSwitch index={prevents.row._id} id={prevents.row.id} />
          </div>
        );
      }

    },
    {
      field: "actions", headerName: "Actions", sortable: false, width: 150,
      renderCell: (prevents) => {
        return (
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <MatEdit index={prevents.row._id} />
            <MatDelete index={prevents.row._id} />
          </div>
        );
      }
    }
  ];

  // Enable / Disable Promotion
  let MatSwitch = ({ index, id }) => {
    const handleDisableCustomer = (e) => {
      console.log(rows[index - 1]);
      let selectCustomer = rows.find((ele) => {
        return ele._id === index;
      })

      if (selectCustomer.status == 1) {
        selectCustomer.status = 2;
      } else {
        selectCustomer.status = 1;
      }

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      const disableCustomer = new FormData();
      disableCustomer.append('status', selectCustomer.status);
      console.log(disableCustomer);
      axios.put(GetPromotionList + "/enableDisablePromo/" + selectCustomer._id, disableCustomer)
        .then((res) => {
          fetcPromotionList();
          toast.success(res.data.message, toastStyle);
        }).catch((err) => {
          console.log(err);
          toast.error(err.response.data.message, toastStyle);
        })
    }
    return <FormControlLabel
      control={
        <>
          <input type="checkbox" hidden="hidden" onChange={(e) => handleDisableCustomer(e)} id={"user" + index} checked={rows[id - 1]?.status == 1 ? true : false} />
          <label className="switch" for={"user" + index}></label>
        </>
      }
    />
  };

  // Get all promotion List
  const [rows, setRows] = useState([])
  const [pageState, setPageState] = useState({
    total: 0,
    page: 1,
    pageSize: 10
  })
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    setSearch(e.target.value)
    fetcPromotionList()
  }
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
    startDate = `${sday}/${smonth}/${syear}`;
    setDateStart(startDate)

    let eday = new Date(endDate).getDate();
    let emonth = new Date(endDate).getMonth() + 1;
    let eyear = new Date(endDate).getFullYear();
    if(eday < 10) eday = "0" + eday;
    if(emonth < 10) emonth = "0" + emonth;
    endDate  = `${eday}/${emonth}/${eyear}`;
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
  const fetcPromotionList = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    
    axios.get(`${GetPromotionList}?page=${pageState.page}&limit=${pageState.pageSize}&search=${search}&dateStart=${filter.dateStart}&dateEnd=${filter.dateEnd}`)
      .then((res) => {
        const json = res.data.result
        setPageState(old => ({ ...old, total: json.totalDocs }))
        
        res.data.result.docs.map((ele, i) => {
          ele.id = (i + 1)
          ele.srno = (res.data.result.page * 10) + (i + 1) - 10

          let day = new Date(ele.createdAt).getDate();
          let month = new Date(ele.createdAt).getMonth() + 1;
          let year = new Date(ele.createdAt).getFullYear();
          ele.createdAt = `${day}/${month}/${year}`;

          const enable = ele.flag;

          if (ele.enable == 1) {
            ele.enable = "Order Placed"
          }
          else if (ele.enable == 2) {
            ele.enable = "Item Shipped"
          }

          else {
            ele.enable = "Promotion Dose Not Exist"
          }

        })
        setRows(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetcPromotionList();
  }, [pageState.page, pageState.pageSize, filter]);

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem('token');
  } else if (sessionStorage.getItem('token') != null) {
    token = sessionStorage.getItem('token')
  }


  const [editPromotionDetail, setEditPromotionDetail] = useState({
    promoImage: "",
    promotitle: "",
    selected_products: "",
    notificationBody: ""
  });
  const handleChangeEdit = (e) => {
    setEditPromotionDetail({
      ...editPromotionDetail,
      [e.target.name]: e.target.value,
    })
  }



  const [startDate, setStartDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);
  return (
    <>
      <div className='innerpage-top data-collection-page'>
        <div className='product-wrapper'>
          <h1>Promotions</h1>
          <Button variant="contained" className='addproduct_btn' onClick={handleOpen} >
            Add New Promo
          </Button>
          {/* ADDD PROMO */}
          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
            <Box className="Product_Model_Container" sx={secondmodel}>
              <div className="ProductHeader">
                <div className="ProductTitel">
                  <h4>Add New Promo</h4>
                  <p>Add New Promo and necessary information from here</p>
                </div>
                <div className="ProductBtn">
                  <CloseIcon className='CloseIcon' onClick={handleClose} />
                </div>
              </div>
              <Form>

                <div className="ProductBody">
                  <Form.Group className="form-control-product" controlId="formBasicImage">
                    <Form.Label>Promo Image</Form.Label>
                    {/* <Form.Control type="file" placeholder="" />     */}
                    <div className='ChangePOrfileCard'   >
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} ref={imageUploader} style={{ display: "none" }} />
                      <div className='UserProfileCard' onClick={() => imageUploader.current.click()} >
                        <img ref={uploadedImage} className='UserProfileImg' src={Avtar} name='promoImage' />
                        <p className='ProfileUploadImgTitle'><ImageSearchOutlinedIcon /><span>Upload Image</span></p>
                      </div>
                    </div>

                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicPassword">
                    <Form.Label>Promo Name</Form.Label>
                    <Form.Control type="text" placeholder="Promo Name" name="promotitle" onChange={(e) => handleChange(e)} />
                  </Form.Group>
                  <Form.Group className="form-control-product" controlId="formBasicPassword">
                    <Form.Label>Notification Body</Form.Label>
                    <Form.Control type="text" placeholder="Notification Body" name="notificationBody" onChange={(e) => handleChange(e)} />
                  </Form.Group>

                  <Form.Group className="form-control-product full-width" controlId="formBasicTitel">
                    <div className='search-and-cta'>
                      <Form.Label>Product Title/Name</Form.Label>
                      <div className='productserchBtn pageFilterBar'>
                        {/* <Button variant="contained" className='fillter_btn'>
                          Filter
                        </Button> */}
                        <div className='searchbaar'>
                          <div className='serach_icon'>
                            <SearchIcon />
                          </div>
                          <InputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            onChange={(e) => handleSearchProduct(e)}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={rowss}
                        columns={columnss}
                        checkboxSelection
                        rowCount={productPageState.total}
                        pagination
                        page={productPageState.page - 1}
                        pageSize={productPageState.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          setproductPageState(old => ({ ...old, page: newPage + 1 }))
                        }}
                        onPageSizeChange={(newPageSize) => setproductPageState(old => ({ ...old, pageSize: newPageSize }))}
                        onSelectionModelChange={(ids) => {
                          const selectedIDs = new Set(ids);
                          const selectedRows = rowss.filter((row) =>
                            selectedIDs.has(row.id),
                          );
                          setSelectedRows(selectedIDs);
                        }}
                      />
                    </div>
                  </Form.Group>
                </div>

                <div className="ProductFooter">
                  <Button className='' type='reset' autoFocus  >
                    Cancel
                  </Button>
                  <Button className='' type='submit' autoFocus onClick={(e) => handleAddPromotion(e)}>
                    Add Promotion
                  </Button>
                </div>
              </Form>
            </Box>
          </Modal>

          {/* EDIT PROMO */}
          <Modal open={openEdit} onClose={handleEditClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
            <Box className="Product_Model_Container" sx={secondmodel}>
              <div className="ProductHeader">
                <div className="ProductTitel">
                  <h4>Edit Promotion</h4>
                  <p>Add New Promo and necessary information from here</p>
                </div>
                <div className="ProductBtn">
                  <CloseIcon className='CloseIcon' onClick={handleEditClose} />
                </div>
              </div>
              <Form>

                <div className="ProductBody">
                  <Form.Group className="form-control-product" controlId="formBasicImage">
                    <Form.Label>Promo Image</Form.Label>
                    {/* <Form.Control type="file" placeholder="" />     */}
                    <div className='ChangePOrfileCard'   >
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} ref={imageUploader} style={{ display: "none" }} />
                      <div className='UserProfileCard' onClick={() => imageUploader.current.click()} >
                        <img ref={uploadedImage} className='UserProfileImg' src={`http://${editPromo.promoImage}`} name='promoImage' />
                        <p className='ProfileUploadImgTitle'><ImageSearchOutlinedIcon /><span>Upload Image</span></p>
                      </div>
                    </div>

                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicPassword">
                    <Form.Label>Promo Name</Form.Label>
                    <Form.Control type="text" placeholder="Promo Name" value={editPromo.promotitle} name="promotitle" onChange={(e) => handleChangeEdit(e)} />
                  </Form.Group>
                  <Form.Group className="form-control-product" controlId="formBasicPassword">
                    <Form.Label>Notification Body</Form.Label>
                    <Form.Control type="text" placeholder="Notification Body" value={editPromo.notificationBody} name="notificationBody" onChange={(e) => handleChangeEdit(e)} />
                  </Form.Group>

                  <Form.Group className="form-control-product full-width" controlId="formBasicTitel">
                    <div className='search-and-cta'>
                      <Form.Label>Product Title/Name</Form.Label>
                      <div className='productserchBtn pageFilterBar'>
                        <Button variant="contained" className='fillter_btn'>
                          Filter
                        </Button>
                        <div className='searchbaar'>
                          <div className='serach_icon'>
                            <SearchIcon />
                          </div>
                          <InputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rowss}
                        columns={columnss}
                        checkboxSelection
                        rowCount={productPageState.total}
                        pagination
                        page={productPageState.page - 1}
                        pageSize={productPageState.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          setproductPageState(old => ({ ...old, page: newPage + 1 }))
                        }}
                        onPageSizeChange={(newPageSize) => setproductPageState(old => ({ ...old, pageSize: newPageSize }))}
                        onSelectionModelChange={(ids) => {
                          const selectedIDs = new Set(ids);
                          const selectedRows = rowss.filter((row) =>
                            selectedIDs.has(row.id),
                          );
                          setSelectedRows(selectedRows);
                        }}
                      />
                    </div>
                  </Form.Group>
                </div>

                <div className="ProductFooter">
                  <Button className='' type='reset' autoFocus onClick={handleEditClose}  >
                    Cancel
                  </Button>
                  <Button className='' type='submit' autoFocus onClick={(e) => handleEditClose(e)}>
                    Edit Promotion
                  </Button>
                </div>
              </Form>
            </Box>
          </Modal>
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
                        <div className="date-range">
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
      <div className="data-collection-page" style={{ height: 660, width: '100%' }}>
        <DataGrid
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

        />
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
  );
}

export default Promotions