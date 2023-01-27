import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { bindTrigger, bindMenu } from 'material-ui-popup-state';
import PopupState from 'material-ui-popup-state';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { FormControlLabel, IconButton } from '@material-ui/core';
import { AiOutlinePlus } from 'react-icons/ai'
import Menu from '@mui/material/Menu';
import Form from 'react-bootstrap/Form';
import axios from "axios";
import { getCategory } from "../../Api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';


// hello
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


function Categories() {

  const [toggleEdit, setToggeEdit] = useState(true);
  const [data, setData] = useState({
    categoryName: "",
    key: ""
  })

  const [newCategory, setNewCategory] = useState({});

  const MatEdit = ({ index }) => {
    const handleEditClick = () => {
      document.getElementById("edit-data").click();
      let newCategory = rows.find((ele) => {
        return ele._id === index;
      })
      setToggeEdit(false)
      setData({
        categoryName: newCategory.categoryName
      })
      setNewCategory(newCategory)
      console.log(index, newCategory._id)
    }
    return <FormControlLabel
      control={
        <IconButton color="secondary" aria-label="add an alarm" onClick={handleEditClick} >
          <ModeEditOutlineOutlinedIcon />
        </IconButton>
      }
    />
  };

  const columns = [
    { field: 'srno', headerName: 'Category ID', width: 150 },
    { field: 'categoryName', headerName: 'Category Name', width: 180 },
    { field: 'productCount', headerName: 'Products', width: 150 },
    {
      field: "actions", headerName: "Actions", sortable: false, width: 200,
      renderCell: (prevent) => {
        return (
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <MatEdit index={prevent.row._id} />
          </div>
        );
      }
    }
  ];


  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem('token');
  } else if (sessionStorage.getItem('token') != null) {
    token = sessionStorage.getItem('token')
  }
  // Get All Category API Integration
  const [rows, setRows] = useState([]);
  const [pageState, setPageState] = useState({
    total: 0,
    page: 1,
    pageSize: 10
  })

  //Search
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    if (e.target.value == null) {
      setSearch("")
    } else {
      setSearch(e.target.value)
    }
  }


  const fetchCategory = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${getCategory}?page=${pageState.page}&limit=${pageState.pageSize}&search=${search}`)
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
    fetchCategory();
  }, [pageState.page, pageState.pageSize, search])

  // Add Category API Integration
  const handleChange = (e) => {
    setData({
      categoryName: e.target.value,
      key: e.target.value
    })
  }

  const addCategory = (e) => {
    e.preventDefault()
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.post(getCategory, data)
      .then((res) => {
        fetchCategory()
        toast.success(res.data.message, toastStyle);
      }).catch((err) => {
        console.log(err)
        toast.error(err.response.data.message, toastStyle);
      })
    setToggeEdit(true)
  }


  // Edit Category API

  const editCategory = (e) => {
    e.preventDefault()
    // axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.put(getCategory + "/" + newCategory._id, data)
      .then((res) => {
        fetchCategory()
        toast.success(res.data.message, toastStyle);
      }).catch((err) => {
        console.log(err)
        toast.error(err.response.data.message, toastStyle);
      })
  }


  return (
    <>
      <div className='innerpage-top brand_ceteg_design'>
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <React.Fragment>
              <Button variant="contained" className='fillter_btn'  {...bindTrigger(popupState)} startIcon={<AiOutlinePlus />}>
                Add Category
              </Button>
              <Menu className="data-dropdown" {...bindMenu(popupState)}>
                <div className="pad-20">
                  <div className="drwdownMenus">
                    <Form className="category-form">
                      <Form.Group className="form-control" controlId="formBasicEmail">
                        <Form.Control type="text" name="categoryName" placeholder="Category Name" onChange={(e) => handleChange(e)} />
                      </Form.Group>
                      <Button className='aply-Btn-Lnk button-full' autoFocus onClick={(e) => addCategory(e)}> Add Category </Button>
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
                Edit Category
              </Button>
              <Menu className="data-dropdown" {...bindMenu(popupState)}>
                <div className="pad-20">
                  <div className="drwdownMenus">
                    <Form className="category-form edit ">
                      <Form.Group className="form-control" controlId="formBasicEmail">
                        <Form.Control type="text" name="categoryName" value={data.categoryName} onChange={(e) => handleChange(e)} placeholder="Category Name" />
                      </Form.Group>
                      <Button className='aply-Btn-Lnk button-full' autoFocus onClick={(e) => editCategory(e)}> Edit Category </Button>
                    </Form>
                  </div>
                </div>
              </Menu>
            </React.Fragment>
          )}
        </PopupState>
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
      <div className="data-col data-table">
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

export default Categories