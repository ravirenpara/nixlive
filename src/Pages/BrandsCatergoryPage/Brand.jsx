import React, { useState, useEffect } from "react";
import './BrandsCategory.css'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { bindTrigger, bindMenu } from 'material-ui-popup-state';
import PopupState from 'material-ui-popup-state';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { FormControlLabel, IconButton } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai'
import Menu from '@mui/material/Menu';
import Form from 'react-bootstrap/Form';
import { getBrands } from "../../Api";
import axios from "axios";
import { getCategory } from "../../Api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

function Brands() {

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem('token');
  } else if (sessionStorage.getItem('token') != null) {
    token = sessionStorage.getItem('token')
  }

  const columns = [
    { field: 'srno', headerName: 'Brand ID', width: 150 },
    { field: 'brandName', headerName: 'Brand Name', width: 180 },
    { field: 'products', headerName: 'Products', width: 150 },
    { field: 'onsale', headerName: 'No. Of Product Sale', width: 150 },
    {
      field: "actions", headerName: "Actions", sortable: false, width: 200,
      renderCell: (prevent) => {
        return (
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <MatEdit index={prevent.row._id} i={prevent.row.id} />
          </div>
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
  const [addBrand, setAddBrand] = useState({})
  const [category, setCategory] = useState([])
  const [editBrand, setEditBrand] = useState([])
  const [selectedCat, setSelectedCat] = useState({})
  const [brand, setBrand] = useState({
    brandName: "",
  })
  const [brandCat, setBrandCat] = useState({
    categories: [],
  })

  // Edit Brand Button click
  const MatEdit = ({ index }) => {
    const handleEditClick = () => {
      document.getElementById("edit-data").click();
      let selectBrand = rows.find((ele) => {
        return ele._id === index;
      })
      setSelectedCat(selectBrand.categories)
      setEditBrand(selectBrand)
      setBrand({
        brandName: selectBrand.brandName
      })
    }
    return <FormControlLabel
      control={
        <IconButton color="secondary" aria-label="add an alarm" onClick={handleEditClick} >
          <ModeEditOutlineOutlinedIcon />
        </IconButton>
      }
    />
  };

  //Search
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    if (e.target.value == null) {
      setSearch("")
    } else {
      setSearch(e.target.value)
    }
  }


  // Get All Brands List
  const fetchBrands = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${getBrands}?page=${pageState.page}&limit=${pageState.pageSize}&search=${search}`)
      .then((res) => {
        res.data.result.docs.map((ele, i) => {
          ele.id = i + 1
          ele.srno = (res.data.result.page * 10) + (i + 1) - 10
        })
        const json = res.data.result
        setPageState(old => ({ ...old, total: json.totalDocs }))
        setRows(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetchBrands();
  }, [pageState.page, pageState.pageSize, search]);


  // Get All Category List
  const fetchCategory = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(getCategory)
      .then((res) => {
        axios.get(`${getCategory}/?limit=${res.data.result.totalDocs}`)
          .then((resp) => {
            setCategory(resp.data.result.docs)
          })
      })
  }
  useEffect(() => {
    fetchCategory();
  }, [])


  // Get Brand Name From From
  const handleChange = (e) => {
    setBrand({
      ...brand,
      [e.target.name]: e.target.value
    })
    brand.categories = brandCat;
  }

  // Get Selected Category From Checkbox
  const handleChecked = (e) => {
    const { value, checked } = e.target;
    const { categories } = brandCat;

    console.log(`${value} is ${checked}`);

    if (selectedCat.includes(value)) {
      const data = selectedCat.filter((res) => (res !== value))
      setSelectedCat(data)
    }
    else {
      const data = [...selectedCat]
      data.push(value)
      setSelectedCat(data)
    }

    if (checked) {
      setBrandCat({
        categories: [...categories, value],
      })
    } else {
      setBrandCat({
        categories: categories.filter((e) => e !== value)
      })
    }
  };


  // Add New Brand API
  const handleAddBrand = (e) => {
    e.preventDefault()

    let newBrand = {
      brandName: brand.brandName,
      categories: JSON.stringify(brandCat.categories)
    }

    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.post(getBrands, newBrand)
      .then((res) => {
        fetchBrands()
        toast.success(res.data.message, toastStyle);
      }).catch((err) => {
        console.log(err)
        toast.error(err.response.data.message, toastStyle);
      })

    console.log(newBrand)
  }

  // Edit Brand API
  const handleEditBrand = (e) => {
    const editedBrand = {
      brandName: brand.brandName,
      categories: selectedCat
    }
    axios.put(getBrands + "/" + editBrand._id, editedBrand)
      .then((res) => {
        fetchCategory()
        toast.success(res.data.message, toastStyle);
      }).catch((err) => {
        console.log(err)
        toast.error(err.response.data.message, toastStyle);
      })
    fetchBrands();
    console.log(editedBrand)
  }

  return (
    <>
      <div className="innerpage-top brand_ceteg_design">
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <Button variant="contained" className='fillter_btn' {...bindTrigger(popupState)} startIcon={<AiOutlinePlus />}>
                Add Brand
              </Button>
              <Menu className="data-dropdown" {...bindMenu(popupState)}>
                <div className="pad-20">
                  <div className="drwdownMenus">
                    <Form className="category-form roles-dropdown">
                      <div className="title">
                        <h3>Brand Name</h3>
                      </div>
                      <Form.Group className="form-control" controlId="formBasicEmail">
                        <Form.Control type="text" name="brandName" onChange={(e) => handleChange(e)} placeholder="Brand Name" />
                      </Form.Group>
                      <div className="title">
                        <h3>Category</h3>
                      </div>
                      <Form.Group className="roles-row">
                        {
                          category.map((cat, i) => {
                            return (
                              <Form.Check type="checkbox" id={`category${i - 1}`} name={cat.categoryName} value={cat._id} onChange={(e) => handleChecked(e)} label={cat.categoryName} />
                            )
                          })
                        }
                      </Form.Group>
                      <Button className='aply-Btn-Lnk button-full' onClick={(e) => handleAddBrand(e)} autoFocus>
                        Add Brand
                      </Button>
                    </Form>
                  </div>
                </div>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <Button variant="contained" className='edit-button fillter_btn' id="edit-data" {...bindTrigger(popupState)} startIcon={<AiOutlinePlus />}>
                Edit Brand
              </Button>
              <Menu className="data-dropdown" {...bindMenu(popupState)}>
                <div className="pad-20">
                  <div className="drwdownMenus">
                    <Form className="category-form roles-dropdown">
                      <div className="title">
                        <h3>Brand Name</h3>
                      </div>
                      <Form.Group className="form-control" controlId="formBasicEmail">
                        <Form.Control type="text" name="brandName" value={brand.brandName} onChange={(e) => handleChange(e)} placeholder="Brand Name" />
                      </Form.Group>
                      <div className="title">
                        <h3>Category</h3>
                      </div>
                      <Form.Group className="roles-row">
                        {
                          category.map((cat, i) => {
                            return (
                              <Form.Check type="checkbox" id={`category${i - 1}`}
                                name={cat.categoryName} value={cat._id}
                                onChange={(e) => handleChecked(e)}
                                label={cat.categoryName}
                                checked={Array.from(selectedCat)?.includes(cat._id)}
                              />
                            )
                          })
                        }
                      </Form.Group>
                      <Button className='aply-Btn-Lnk button-full' onClick={(e) => handleEditBrand(e)} autoFocus>
                        Edit Brand
                      </Button>
                    </Form>
                  </div>
                </div>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
        <div className='searchbaar '>
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
      <div className='searchbaar brandCatSearch'>
        <div className='serach_icon'>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
          onChange={(e) => handleSearch(e)}
        />
      </div>

      <div className="brand-category-page" style={{ height: 660, width: '100%' }}>
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
      />    </>
  );
}

export default Brands