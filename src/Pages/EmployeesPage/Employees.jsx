import React, { useState, useEffect } from "react";
import './Employees.css'
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { bindTrigger, bindMenu } from 'material-ui-popup-state';
import PopupState from 'material-ui-popup-state';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import EditIcon from '@mui/icons-material/Edit';
import { FormControlLabel, IconButton } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai'
import Menu from '@mui/material/Menu';
import Form from 'react-bootstrap/Form';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { GetEmployeeList, GetRoleList } from "../../Api";
import axios from "axios";

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







function Employees() {

  // delete api
  const [deleteRole, setDeleteRole] = useState([])
  function MatView({ index  }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleDeleteClick = () => {
      handleOpen()
      let selected = rows.find((ele) => {
        return ele._id === index;
      })
      setDeleteRole(selected)
    };
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
                  <h2>Are You Sure! Want to Delete <strong>{deleteRole.name} </strong> Record?</h2>
                  <p>Do you really want to delete these records? You can't view this in your list anymore if you delete!</p>
                </Typography>
                <Typography className="model-button">
                  <Button variant="contained" className='primaryBtn order_active' onClick={handleClose} >No, Keep it</Button>
                  <Button variant="contained" className='primaryBtn order_active green' onClick={(e) => handleDeleteRole(e)} >Yes, Delete it</Button>
                </Typography>
              </Box>
            </Modal>
          </div>
        </div>
      </>
      } />;
  };
  const handleDeleteRole = (e) => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.delete(GetEmployeeList + "/" + deleteRole._id)
    .then((res) => {
      fetcEmployeeList()
    }).catch((err) => {
      console.log(err)
    })
    console.log(deleteRole)
    handleClose();
  }



  // edit api
  const [selectedrole, setSelectedRole] = useState("");
  const [editEmployee, setEditEmployee] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  })
  const handelEditemployee = () => {
    axios.put(GetEmployeeList + editEmployee._id, editEmployee)
    .then((res) => {
      fetcEmployeeList()
    }).catch((err) => {
      console.log(err)
    })
  }
  const MatEdit = ({ index  }) => {
    const handleEditClick = () => {
      document.getElementById("edit-data").click();
      let selectEmployee = rows.find((ele) => {
        return ele._id === index;
      })
      setSelectedRole(selectEmployee.roleData[0]?._id)
      setEditEmployee(selectEmployee)
      
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
    { field: 'srno', headerName: 'Employee ID', width: 200 },
    { field: 'name', headerName: 'Employee Name', width: 300 },
    { field: 'email', headerName: 'Employee Email', width: 300 },
    { field: 'EmployeeRole', headerName: 'Role', width: 300 },
    {
      field: "actions", headerName: "Actions", sortable: false, width: 150,
      renderCell: (prevent) => {
        return (
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <MatEdit index={prevent.row._id}  />
            <MatView EmployeeName={prevent.row.EmployeeName} />
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

  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    if (e.target.value == null) {
      setSearch("")
    } else {
      setSearch(e.target.value)
    }
  }

  const fetcEmployeeList = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(GetEmployeeList)
    axios.get(`${GetEmployeeList}?page=${pageState.page}&limit=${pageState.pageSize}&search=${search}`)
      .then((res) => {
        const json = res.data.result
        setPageState(old => ({ ...old, total: json.totalDocs }))

        res.data.result.docs.map((ele, i) => {
          ele.id = i + 1
          ele.srno = (res.data.result.page * 10) + (i + 1) - 10

          if (ele.EmployeeRole === null) {
            ele.EmployeeRole = "";
          } else {
            ele.EmployeeRole = ele.roleData[0]?.name
          }
        })
        setRows(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetcEmployeeList();
  }, [pageState.page, pageState.pageSize, search] );

  const [roles, setRoles] = useState([])
  const fetchRoles = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(GetRoleList)
      .then((res) => {
        axios.get(`${GetRoleList}/?limit=${res.data.result.totalDocs}`)
        .then((resp) => {
          setRoles(resp.data.result.docs)
        })
      })
  }
  useEffect(() => {
    fetchRoles();
  }, []);
  // Add New Brand API
  const [employee, setEmployee] = useState([])

  const [addEmployee, setAddEmployee] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  const handleChange = (e) => {
    setAddEmployee({
      ...addEmployee,
      [e.target.name]: e.target.value,
    })
    setEditEmployee({
      ...editEmployee,
      [e.target.name]: e.target.value,
    })
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  }
  const handleAddEmployee = (e) => {
    e.preventDefault()

    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.post(GetEmployeeList + "add", addEmployee)
      .then((res) => {
        fetcEmployeeList()
      }).catch((err) => {
        console.log(err)
      })

  }

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem('token');
  } else if (sessionStorage.getItem('token') != null) {
    token = sessionStorage.getItem('token')
  }
  const [startDate, setStartDate] = useState(new Date());
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  // password velidation

  const [input, setInput] = useState({
    name:'',
    email:'',
    password: '',
    confirmPassword: '',
    roleId:''
  });
  const [error, setError] = useState({
    name:'',
    email:'',
    password: '',
    confirmPassword: '',
    roleId:''
  })
  const validateInput = e => {
    let { name, value } = e.target;
  setError(prev => {
    const stateObj = { ...prev, [name]: "" };
    switch (name) {

      case "roleId":
        if(!value) {
          stateObj[name] = "Please Select Employee Role"
        }
        break;

      case "name":
        if(!value) {
          stateObj[name] = "Enter Employee Name"
        }
        break;

      case "email":
        if (!value) {
          stateObj[name] = "Enter Email Address";
        }
        break;
 
      case "password":
        if (!value) {
          stateObj[name] = "Please enter Password.";
        } else if (input.confirmPassword && value !== input.confirmPassword) {
          stateObj["confirmPassword"] = "Password and Confirm Password does not match.";
        } else {
          stateObj["confirmPassword"] = input.confirmPassword ? "" : error.confirmPassword;
        }
        break;
 
      case "confirmPassword":
        if (!value) {
          stateObj[name] = "Please enter Confirm Password.";
        } else if (input.password && value !== input.password) {
          stateObj[name] = "Password and Confirm Password does not match.";
        }
        break;
 
      default:
        break;
    }
 
    return stateObj;
  });
  }

  return (
    <>
      <div className='innerpage-top employees-page'>
        <div className="title_text">
          <h1>Employees</h1>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button variant="contained" className='fillter_btn' id="" {...bindTrigger(popupState)} startIcon={<AiOutlinePlus />}>
                  Add Employee
                </Button>
                <Menu className="data-dropdown roles-dropdown" {...bindMenu(popupState)}>
                  <div className="pad-20">
                    <div className="drwdownMenus">
                      <Form className="category-form" key={addEmployee._id}>
                        <div className="title">
                          <h3>Add Employee</h3>
                        </div>
                        <div className="employee-row">
                          <div className="form-group">
                            <Form.Group className="form-control" controlId="formBasicName">
                              <Form.Control type="text" name="name" value={input.name} onBlur={validateInput} placeholder="Employee Name" onChange={(e) => handleChange(e)} />
                              {error.name && <span className='err'>{error.name}</span>}
                            </Form.Group>
                          </div>
                          <div className="form-group">
                            <Form.Group className="form-control" controlId="formBasicEmail">
                              <Form.Control type="email" value={input.email} onBlur={validateInput}  name="email" placeholder="Employee Email" onChange={(e) => handleChange(e)} />
                              {error.email && <span className='err'>{error.email}</span>}
                            </Form.Group>
                          </div>
                        </div>
                        <div className="employee-row">
                          <div className="form-group">
                            <Form.Group className="form-control" controlId="formBasicPassword">
                              <Form.Control type="password" value={input.password} onBlur={validateInput} name="password" placeholder="Password" onChange={(e) => handleChange(e)} />
                              {error.password && <span className='err'>{error.password}</span>}
                            </Form.Group>
                          </div>
                          <div className="form-group">
                            <Form.Group className="form-control" controlId="formBasicPassword">
                              <Form.Control type="text" value={input.confirmPassword} onBlur={validateInput} name="confirmPassword" placeholder="Re Enter Password" onChange={(e) => handleChange(e)} />
                              {error.confirmPassword && <span className='err'>{error.confirmPassword}</span>}
                            </Form.Group>
                          </div>
                          <div className="form-group">
                            <Form.Group className="form-control" name="roleId" controlId="formBasicEmail">                            
                              <Form.Select name="roleId" value={input.roleId} onBlur={validateInput} onChange={(e) => handleChange(e)}>
                                <option>Select Role</option>
                                
                                {
                                  roles.map((role, i) => {
                                    return (
                                      <option value={role._id}>{role.name}</option>
                                    )
                                  })
                                }
                              </Form.Select>
                              {error.roleId && <span className='err'>{error.roleId}</span>}
                            </Form.Group>
                          </div>
                        </div>
                        <Button className='aply-Btn-Lnk button-full' autoFocus onClick={(e) => handleAddEmployee(e)}>
                          Add Employee
                        </Button>
                      </Form>
                    </div>
                  </div>
                </Menu>
              </React.Fragment>
            )}
          </PopupState>

          {/* edit */}
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button variant="contained" className='fillter_btn edit-button' id="edit-data" {...bindTrigger(popupState)} startIcon={<AiOutlinePlus />}>
                  Edit Employee
                </Button>
                <Menu className="data-dropdown roles-dropdown" {...bindMenu(popupState)}>
                  <div className="pad-20">
                    <div className="drwdownMenus">
                      <Form className="category-form" key={addEmployee._id}>
                        <div className="title">
                          <h3>Edit Employee</h3>
                        </div>
                        <div className="employee-row">
                          <div className="form-group">
                            <Form.Group className="form-control" controlId="formBasicName">
                              <Form.Control type="text" name="name" value={editEmployee.name} onBlur={validateInput} placeholder="Employee Name" onChange={(e) => handleChange(e)} />
                              {error.name && <span className='err'>{error.name}</span>}
                            </Form.Group>
                          </div>
                          <div className="form-group">
                            <Form.Group className="form-control" controlId="formBasicEmail">
                              <Form.Control type="email" value={editEmployee.email} onBlur={validateInput}  name="email" placeholder="Employee Email" onChange={(e) => handleChange(e)} />
                              {error.email && <span className='err'>{error.email}</span>}
                            </Form.Group>
                          </div>
                        </div>
                        <div className="employee-row">
                          <div className="form-group">
                            <Form.Group className="form-control" controlId="formBasicPassword">
                              <Form.Control type="password" value={editEmployee.password} onBlur={validateInput} name="password" placeholder="Password" onChange={(e) => handleChange(e)} />
                              {error.password && <span className='err'>{error.password}</span>}
                            </Form.Group>
                          </div>
                          <div className="form-group">
                            <Form.Group className="form-control" controlId="formBasicPassword">
                              <Form.Control type="text" value={editEmployee.confirmPassword} onBlur={validateInput} name="confirmPassword" placeholder="Re Enter Password" onChange={(e) => handleChange(e)} />
                              {error.confirmPassword && <span className='err'>{error.confirmPassword}</span>}
                            </Form.Group>
                          </div>
                          <div className="form-group">
                            <Form.Group className="form-control" name="roleId" controlId="formBasicEmail">                            
                              <Form.Select name="roleId"  value={selectedrole} onBlur={validateInput} onChange={(e) => handleChange(e)}>
                                <option   >Select Role</option>
                                
                                {
                                  roles.map((role, i) => {
                                    return (
                                      <option value={role._id}>{role.name}</option>
                                    )
                                  })
                                }
                              </Form.Select>
                              {error.roleId && <span className='err'>{error.roleId}</span>}
                            </Form.Group>
                          </div>
                        </div>
                        <Button className='aply-Btn-Lnk button-full' autoFocus onClick={(e) => handelEditemployee(e)}>
                          Edit Employee
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
          <div className='explore_btns'>
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
      <div className="data-col data-table employees-page">
        <div style={{ height: 660, width: '100%' }}>
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

    </>
  );
}

export default Employees
