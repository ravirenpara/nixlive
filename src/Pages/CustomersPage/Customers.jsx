import React, { useState, useEffect } from "react";
import "./Customers.css";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { AiOutlinePlus } from "react-icons/ai";
import { FormControlLabel, IconButton } from "@material-ui/core";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Form from "react-bootstrap/Form";
import Typography from "@mui/material/Typography";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PopupState from "material-ui-popup-state";
import Menu from "@mui/material/Menu";
import { bindTrigger, bindMenu } from "material-ui-popup-state";
import ImageSearchOutlinedIcon from "@mui/icons-material/ImageSearchOutlined";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import Avtar from "../../Images/default-avatar.png";
import { GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import IosShareIcon from "@mui/icons-material/IosShare";
import Tooltip from "@mui/material/Tooltip";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import { Link } from "react-router-dom";
import axios from "axios";
import { GetCustomerList } from "../../Api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const secondmodel = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const style = {
  position: "absolute",
  top: "0",
  right: "0",
  bottom: "0",
  width: "50%",
  bgcolor: "background.paper",
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

function Customers(props) {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = (e) => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  function MatDelete({ index }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [deleteCustomer, setDeleteCustomer] = React.useState(false);
    const handleDelete = (e) => {
      handleOpen()
      let selected = rows.find((ele) => {
        return ele._id === index;
      })
      setDeleteCustomer(selected)
    }

    const handleDeleteCustomer = (e) => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.delete(GetCustomerList + "/" + deleteCustomer._id)
        .then((res) => {
          fetcCustomerList()
          toast.success(res.data.message, toastStyle);
        }).catch((err) => {
          console.log(err)
          toast.error(err.response.data.message, toastStyle);
        })

      handleClose();
    }

    return (
      <FormControlLabel
        control={
          <>
            <div className="ActionButtons">
              <Tooltip title="Delete User">
                <IconButton color="secondary" aria-label="add an alarm" onClick={(e) => handleDelete(e)} className="dyFlextIcon" >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Tooltip>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="delete-data-model" sx={secondmodel}>
                  <Typography className="model-icon" id="modal-modal-title" variant="h6" component="h1" >
                    <DeleteSweepIcon />
                  </Typography>
                  <Typography className="model-text" id="modal-modal-description" sx={{ mt: 2 }} >
                    <h2> Are You Sure! Want to Delete{" "} <strong>{deleteCustomer.userName}</strong> Record? </h2>
                    <p>Do you really want to delete these records? You can't view this in your list anymore if you delete! </p>
                  </Typography>
                  <Typography className="model-button">
                    <Button variant="contained" className="primaryBtn order_active" onClick={handleClose} >
                      No, Keep it
                    </Button>
                    <Button variant="contained" className="primaryBtn order_active green" onClick={(e) => handleDeleteCustomer(e)} >
                      Yes, Delete it
                    </Button>
                  </Typography>
                </Box>
              </Modal>
            </div>
          </>
        }
      />
    );
  }

  const MatOrders = ({ index }) => {
    const handleCustomer = (e) => {

    }
    return (
      <FormControlLabel
        control={
          <>
            <Link to={`/customerorder/${index}`}>
              <Tooltip title="Orders">
                <IconButton color="secondary" aria-label="add an alarm" onClick={(e) => handleCustomer(e)} className="dyFlextIcon" >
                  <ManageHistoryIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </>
        }
      />
    );
  };
  const columns = [
    { field: "srno", headerName: "ID", width: 130 },
    { field: "userName", headerName: "Name", width: 250 },
    { field: "createdAt", headerName: "Created", width: 250 },
    { field: "userMobileNo", headerName: "Mobile No", width: 200 },
    {
      field: "status",
      headerName: "Orders",
      width: 180,

      renderCell: (prevents) => {
        return (
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }} >
            <MatOrders index={prevents.row._id} />
          </div>
        );
      },
    },
    {
      field: "enbdesuser",
      headerName: "Disable User",
      width: 180,

      renderCell: (prevents) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <MatSwitchUser index={prevents.row.id} id={prevents.row._id} />
          </div>
        );
      },
    },

    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (prevents) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <MatDelete index={prevents.row._id} />
          </div>
        );
      },
    },
  ];

  const MatSwitchUser = ({ index, id }) => {
    const handleDisableUser = (e) => {
      console.log(rows[index - 1].status);
      let selectUser = rows.find((ele) => {
        return ele._id === id;
      })

      if (selectUser.status == 1) {
        selectUser.status = 2;
      } else {
        selectUser.status = 1;
      }

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      const disableUser = new FormData();
      disableUser.append('status', selectUser.status);
      console.log(disableUser);
      axios.put(GetCustomerList + "/enableDisableUser/" + selectUser._id, disableUser)
        .then((res) => {
          fetcCustomerList();
          toast.success(res.data.message, toastStyle);
        }).catch((err) => {
          console.log(err);
          toast.error(err.response.data.message, toastStyle);
        })
    }
    return (
      <FormControlLabel
        control={
          <>
            <Tooltip title="Disable User">
              <div>
                <input type="checkbox" hidden="hidden" onChange={(e) => handleDisableUser(e)} id={"user" + index} checked={rows[index - 1]?.status == 1 ? true : false} />
                <label className="switch" for={"user" + index}></label>
              </div>
            </Tooltip>
          </>
        }
      />
    );
  };

  const [rows, setRows] = useState([]);
  const [pageState, setPageState] = useState({
    total: 0,
    page: 1,
    pageSize: 10
  })
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    if(e.target.value != null) {
      setSearch(e.target.value)
    } else {
      setSearch("")
    }
    console.log(e.target.value)
    fetcCustomerList()
  }

  // Get All Customers List
  const fetcCustomerList = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${GetCustomerList}?page=${pageState.page}&limit=${pageState.pageSize}&search=${search}`)
      .then((res) => {
        const json = res.data.result
        setPageState(old => ({ ...old, total: json.totalDocs }))

        res.data.result.docs.map((ele, i) => {
          ele.id = i + 1;
          ele.srno = (res.data.result.page * 10) + (i + 1) - 10

          let day = new Date(ele.createdAt).getDate();
          let month = new Date(ele.createdAt).getMonth() + 1;
          let year = new Date(ele.createdAt).getFullYear();
          ele.createdAt = `${day}/${month}/${year}`;

          if (ele?.status === 2) {
            ele.status = 2;
          } else {
            ele.status = 1;
          }
        });
        setRows(res.data.result.docs);
      });
  };
  useEffect(() => {
    fetcCustomerList();
  }, [pageState.page, pageState.pageSize, search]);

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem("token");
  } else if (sessionStorage.getItem("token") != null) {
    token = sessionStorage.getItem("token");
  }

  const OpenExport = () => {
    document
      .querySelector(
        ".MuiDataGrid-toolbarContainer.css-1j9kmqg-MuiDataGrid-toolbarContainer button "
      )
      .click();
    return false;
  };

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="Products">
        <div className="product-wrapper">
          <h1>Customers</h1>
        </div>
        <div className="productserchBtn pageFilterBar">
          <div className="fillter"></div>
          <div className="searchbaar">
            <div className="serach_icon">
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => handleSearch(e)}
            />
          </div>
        </div>
      </div>
      <div style={{ height: 660, width: "100%" }}>
        <DataGrid
          components={{
            Toolbar: CustomToolbar,
          }}
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
export default Customers;
