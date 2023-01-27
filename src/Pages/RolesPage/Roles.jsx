import React, { useState, useEffect } from "react";
import "./Roles.css";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { bindTrigger, bindMenu } from "material-ui-popup-state";
import PopupState from "material-ui-popup-state";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import EditIcon from "@mui/icons-material/Edit";
import { FormControlLabel, IconButton } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import Menu from "@mui/material/Menu";
import Form from "react-bootstrap/Form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import axios from "axios";
import { getPermission, GetRoleList } from "../../Api";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
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

function Relos() {

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem("token");
  } else if (sessionStorage.getItem("token") != null) {
    token = sessionStorage.getItem("token");
  }
  const [rows, setRows] = useState([]);
  const [pageState, setPageState] = useState({
    total: 0,
    page: 1,
    pageSize: 10
  })
  const [Permissions, setRoles] = useState({});
  const [role, setRole] = useState({});
  const [rolePermission, setRolePermission] = useState({
    permissions: [],
  });
  const [selectedPermission, setSelectedPermission] = useState({});
  const [editRole, setEditRole] = useState([])

  const columns = [
    { field: "srno", headerName: "Role ID", width: 120 },
    { field: "name", headerName: "Role Name", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 150,
      renderCell: (prevent) => {
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ cursor: "pointer" }}
          >
            <MatEdit index={prevent.row._id} />
            <MatDelete index={prevent.row._id} />
          </div>
        );
      },
    },
  ];

  const MatEdit = ({ index }) => {
    const handleEditClick = () => {
      document.getElementById("edit-data").click();
      let selectRole = rows.find((ele) => {
        return ele._id === index;
      })
      setSelectedPermission(selectRole.permissions)
      setEditRole(selectRole)
      setRole({
        name: selectRole.name
      })
      console.log(selectRole);
    };
    return (
      <FormControlLabel
        control={
          <IconButton color="secondary" aria-label="add an alarm" onClick={handleEditClick} >
            <ModeEditOutlineOutlinedIcon />
          </IconButton>
        }
      />
    );
  };

  function MatDelete({ index, i }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [deleteRole, setDeleteRole] = useState([])
    const handleDeleteClick = (e) => {
      handleOpen()
      let selected = rows.find((ele) => {
        return ele._id === index;
      })
      setDeleteRole(selected)
    };

    const handleDeleteRole = (e) => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.delete(GetRoleList + "/" + deleteRole._id)
        .then((res) => {
          fetchRoleList()
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
              <IconButton color="secondary" aria-label="add an alarm" onClick={(e) => handleDeleteClick(e)} className="dyFlextIcon" >
                <DeleteOutlinedIcon />
              </IconButton>
              <div className="delete-popup">
                {/* <Button onClick={handleOpen}></Button> */}
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description" >
                  <Box className="delete-data-model" sx={style}>
                    <Typography className="model-icon" id="modal-modal-title" variant="h6" component="h1" >
                      <DeleteSweepIcon />
                    </Typography>
                    <Typography className="model-text" id="modal-modal-description" sx={{ mt: 2 }} >
                      <h2> Are You Sure! Want to Delete{" "} <strong>{deleteRole.name} </strong> Record? </h2>
                      <p>Do you really want to delete these records? You can't view this in your list anymore if you delete!</p>
                    </Typography>
                    <Typography className="model-button">
                      <Button variant="contained" className="primaryBtn order_active" onClick={handleClose} >
                        No, Keep it
                      </Button>
                      <Button variant="contained" className="primaryBtn order_active green" onClick={(e) => handleDeleteRole(e)} >
                        Yes, Delete it
                      </Button>
                    </Typography>
                  </Box>
                </Modal>
              </div>
            </div>
          </>
        }
      />
    );
  }

  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    if (e.target.value == null) {
      setSearch("")
    } else {
      setSearch(e.target.value)
    }
  }

  // Get All Roles List
  const fetchRoleList = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${GetRoleList}?page=${pageState.page}&limit=${pageState.pageSize}&search=${search}`)
    .then((res) => {
      res.data.result.docs.map((ele, i) => {
        ele.id = i + 1;
        ele.srno = (res.data.result.page * 10) + (i + 1) - 10
      });
      const json = res.data.result
      setPageState(old => ({ ...old, total: json.totalDocs }))
      setRows(res.data.result.docs);
    });
  };
  useEffect(() => {
    fetchRoleList();
  }, [pageState.page, pageState.pageSize, search]);

  // Get all Permissions List
  const fetchPermissions = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(getPermission)
    .then((res) => {
      axios.get(`${getPermission}/?limit=${res.data.result.totalDocs}`)
      .then((resp) => {
        resp.data.result.docs.map((ele, i) => {
          ele.id = i + 1;
        });
        setRoles(resp.data.result.docs);
      })
    });
  };
  useEffect(() => {
    fetchPermissions();
  }, []);


  // Get Role Name From From
  const handleChange = (e) => {
    setRole({
      ...role,
      [e.target.name]: e.target.value
    })
    role.permissions = rolePermission;
  }

  // Get Selected Permissions From Checkbox
  const handleChecked = (e) => {
    const { value, checked } = e.target;
    const { permissions } = rolePermission;

    console.log(`${value} is ${checked}`);

    if (selectedPermission.includes(value)) {
      const data = selectedPermission.filter((res) => (res !== value))
      setSelectedPermission(data)
    }
    else {
      const data = [...selectedPermission]
      data.push(value)
      setSelectedPermission(data)
    }

    if (checked) {
      setRolePermission({
        permissions: [...permissions, value],
      })
    } else {
      setRolePermission({
        permissions: permissions.filter((e) => e !== value)
      })
    }
  };

  // Add New Role API
  const handleAddRole = (e) => {
    e.preventDefault()

    let newRole = {
      name: role.name,
      permissions: rolePermission.permissions
    }

    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.post(GetRoleList, newRole)
      .then((res) => {
        fetchRoleList()
        toast.success(res.data.message, toastStyle);
        document.getElementsByClassName("data-dropdown").click();
      }).catch((err) => {
        toast.error(err.response.data.message, toastStyle);
        setRole("")
      })

    console.log(newRole)
  }

  // Edit Role Detail
  const handleEditRole = () => {
    const editedRole = {
      name: role.name,
      permissions: selectedPermission
    }
    axios.put(GetRoleList + "/" + editRole._id, editedRole)
      .then((res) => {
        fetchRoleList()
        toast.success(res.data.message, toastStyle);
        document.getElementById("edit-data").close()
      }).catch((err) => {
        toast.error(err.response.data.message, toastStyle);
      })
    fetchRoleList();
    console.log(editedRole)
  }



  return (
    <>
      <div className="innerpage-top roles-page">
        <div className="title_text roles-header">
          <h1>Roles</h1>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button
                  variant="contained"
                  className="fillter_btn"
                  {...bindTrigger(popupState)}
                  startIcon={<AiOutlinePlus />}
                >
                  Add Role
                </Button>
                <Menu
                  className="data-dropdown roles-dropdown"
                  {...bindMenu(popupState)}
                >
                  <div className="pad-20">
                    <div className="drwdownMenus">
                      <Form className="category-form">
                        <div className="title">
                          <h3>Role Name</h3>
                        </div>
                        <Form.Group
                          className="form-control"
                          controlId="formBasicEmail"
                        >
                          <Form.Control type="text" name="name" placeholder="Role Name" onChange={(e) => handleChange(e)} />
                        </Form.Group>
                        <div className="title">
                          <h3>Permission</h3>
                        </div>
                        <Form.Group className="roles-row">
                          {
                            Array.from(Permissions).map((ele, i) => {
                              return (
                                <Form.Check type="checkbox" id={ele._id}
                                  name={ele.name}
                                  value={ele._id}
                                  label={ele.name}
                                  onChange={(e) => handleChecked(e)}
                                />
                              )
                            })
                          }
                        </Form.Group>
                        <Button className="aply-Btn-Lnk button-full" onClick={(e) => handleAddRole(e)} autoFocus>
                          Add Role
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
                <Button
                  variant="contained"
                  className="fillter_btn edit-button"
                  id="edit-data"
                  {...bindTrigger(popupState)}
                  startIcon={<AiOutlinePlus />}
                >
                  Edit Role
                </Button>
                <Menu
                  className="data-dropdown roles-dropdown"
                  {...bindMenu(popupState)}
                >
                  <div className="pad-20">
                    <div className="drwdownMenus">
                      <Form className="category-form">
                        <div className="title">
                          <h3>Role Name</h3>
                        </div>
                        <Form.Group className="form-control" controlId="formBasicEmail">
                          <Form.Control type="text" name="name" value={role.name} placeholder="Role Name" onChange={(e) => handleChange(e)} />
                        </Form.Group>
                        <div className="title">
                          <h3>Permission</h3>
                        </div>
                        <Form.Group className="roles-row">
                          {
                            Array.from(Permissions).map((ele, i) => {
                              return (
                                <Form.Check type="checkbox" id={ele._id}
                                  name={ele.name}
                                  value={ele._id}
                                  label={ele.name}
                                  onChange={(e) => handleChecked(e)}
                                  checked={Array.from(selectedPermission)?.includes(ele._id)}
                                />
                              )
                            })
                          }
                        </Form.Group>
                        <Button className="aply-Btn-Lnk button-full" onClick={(popupState) => handleEditRole(popupState)} autoFocus>
                          Edit Role
                        </Button>
                      </Form>
                    </div>
                  </div>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>
        </div>
        <div className="active_btns pageFilterBar">
          <div className="explore_btns"></div>
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
      <div className="data-col data-table roles-page">
        <div style={{ height: 660, width: "100%" }}>
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
      />    </>
  );
}

export default Relos;
