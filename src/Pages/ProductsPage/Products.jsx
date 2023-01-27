import React, { Component } from 'react';
import { useState } from 'react';
import './Products.css'
import { DataGrid } from '@mui/x-data-grid';
// import Button from '@mui/material/Button';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { AiOutlinePlus } from 'react-icons/ai'
import { FormControlLabel, IconButton } from '@material-ui/core';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Form from 'react-bootstrap/Form';
import Typography from '@mui/material/Typography';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import PopupState from 'material-ui-popup-state';
import { bindTrigger, bindMenu } from 'material-ui-popup-state';
import Menu from '@mui/material/Menu';
import ImageSearchOutlinedIcon from '@mui/icons-material/ImageSearchOutlined';
import DefaultProduct from '../../Images/default-product.png'
import ImageUploader from '../../Components/ImageUploader/ImageUploader';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import { Scrollbar } from 'react-scrollbars-custom';
import axios from 'axios';
import { getProduct } from '../../Api';
import { getCategory } from '../../Api';
import { getBrands } from '../../Api';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageUploading from "react-images-uploading";
import { Alert, Button, ButtonGroup } from "reactstrap";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
const style = {
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
const secondmodel = {
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



export default function DataTable() {

  const maxNumber = 10;
  const acceptType = ["jpeg", "jpg", "png"];
  const maxFileSize = 5000000;
  const [images, setImages] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const productImage = [];
  const [pageState, setPageState] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
  })

  const onChange = (imageList, addUpdateIndex) => {
    console.log("Hello", imageList);
    setImages(imageList);
    imageList.map((data) => {
      productImage.push(data.file)
    })
    setImage(productImage)
  };
  const onError = () => {
    setImages([]);
  };


  const [imagePreview, setImagePreview] = useState([]);
  const [openmodel, setOpenmodel] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState([]);
  const [validation, setvalidation] = useState([
    "png", "JPEG", "PNG", "jpeg", "jpg", "JPG", "GIF", "gif",
  ]);
  const [imageEdited, setImageEdited] = useState(false);

  const calculateSize = (files, validation) => {
    let result = true;
    for (const file of files) {
      if (file.size / 1024 / 1024 > validation) {
        result = false;
        break;
      }
    }
    return result;
  };
  const getFileExtension = (files, validation) => {
    let result = true;
    let previewFile = [];
    let imageFile = [];
    for (const file of files) {
      const [extension] = file.name.split(".").reverse();
      if (!validation.includes(extension.toLowerCase())) {
        result = false;
      }
      previewFile.push(URL.createObjectURL(file));
      imageFile.push(file);
    }
    return [result, previewFile, imageFile];
  };
  const onChageImage = async (e) => {
    let files = e.target.files;
    const checkFileSize = await calculateSize(files, 10);

    if (!checkFileSize) {
      setError(`Please select less then ${10} mb image`);
      setFile([]);
      setImagePreview([]);
    } else {
      const [checkValidation, preview] = await getFileExtension(
        files,
        validation
      );
      if (!checkValidation) {
        setError("Please select valid image");
        setImagePreview([]);
      } else {
        setError("");
        const temp = imagePreview.concat(preview)
        const images = [...file, ...files]
        setImagePreview(temp);
        setFile(images);

      }
    }
  };
  const handleDeleteImage = (e , i) => {
    e.preventDefault();
    const impArray = [...imagePreview]
    const impFiles = [...file]
    
    impArray.splice(i,1)
    impFiles.splice(i,1)
  
    setImagePreview(impArray)
    setFile(impFiles)
  }
  

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem('token');
  } else if (sessionStorage.getItem('token') != null) {
    token = sessionStorage.getItem('token')
  }

  const columns = [
    { field: 'srno', headerName: 'ID', width: 100, },
    {
      field: 'featuredProductImage', headerName: 'Image', width: 100, editable: false,
      renderCell: (params) => <img src={params.value} width="40px" />,
    },
    { field: 'productName', headerName: 'Product', width: 200 },
    { field: 'productDate', headerName: 'Date', width: 200 },
    { field: 'productPrice', headerName: 'Price', width: 170 },
    { field: 'productBrand', headerName: 'Brand', width: 170 },
    { field: 'productCategory', headerName: 'Category', width: 170 },
    {
      field: 'status', headerName: 'Status', width: 100,

      renderCell: (prevents) => {
        return (
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <MatSwitch index={prevents.row.id} pId={prevents.row._id} />
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

  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const [rows, setRows] = useState([]);
  const [category, setCategory] = useState([])
  const [brand, setBrand] = useState([])
  const [onSale, setOnSale] = useState("1")
  const [featuredProductImage, setFeaturedProductImage] = useState({})
  const [proSize, setProSize] = useState({})
  const [selectedSize, setSelectedSize] = useState({
    productSize: [],
  })
  const [proGender, setProGender] = useState({})
  const [selectedGender, setSelectedGender] = useState({
    productGender: []
  })

  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);

  const [editProduct, setEditProduct] = useState("")
  
  const [addProduct, setAddProduct] = useState({
    productItemNo: "",
    productName: "",
    productPrice: "",
    productDescription: "",
    productColor: "",
    productSize: "",
    productCategory: "",
    productBrand: "",
    productGender: "",
    productOnsale: "",
    discountValue: "",
    featuredProductImage: "",
    productImage: "",
    productDiscountedPrice: ""
  });
  const [products, setProducts] = useState([]);

  const fetchProducts = (e) => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${getProduct}?page=${pageState.page}&limit=${pageState.pageSize}`)
    .then((res) => {
      res.data.result.docs.map((ele, i) => {
          ele.brandData = ele.brandData[0]?._id;
          ele.categoryData = ele.categoryData[0]?._id;
        })
        setProducts(res.data.result.docs)
      }).catch((err) => {
        console.log(err)
      })
  }
  useEffect(() => {
    fetchProducts();
  }, []);
  
  
  const MatEdit = ({ index }) => {
    const handleEditClick = () => {
      let images = [];
      handleOpenEdit();
      let selectProduct = products.find((ele) => {
        return ele._id === index;
      })
      selectProduct?.productImage.map((ele) => {
        images.push("https://192.168.1.3:7000/"+ele)
      })
      selectProduct.productDiscountedPrice = Math.round(selectProduct.productPrice - ((selectProduct.productPrice * selectProduct.discountValue) / 100));
      setEditProduct(selectProduct)
      setProSize(selectProduct.productSize)
      setProGender(selectProduct.productGender)
      setOnSale(selectProduct.productOnsale)
      setFile(images)
      setImagePreview(images)
    };
    return (
      <FormControlLabel
        control={
          <IconButton color="secondary" aria-label="add an alarm" onClick={handleEditClick} className='dyFlextIcon'>
            <ModeEditOutlineOutlinedIcon />
          </IconButton>
        }
      />
    );
  };

  function MatDelete({ index }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [deleteProduct, setDeleteProduct] = useState("")
    
    const handleDeleteClick = (e) => {
      handleOpen()
      let selectProduct = products.find((ele) => {
        return ele._id === index;
      })
      console.log(deleteProduct);
      setDeleteProduct(selectProduct)
    }
    const handleDeleteProduct = (e) => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      axios.delete(getProduct + "/" + deleteProduct._id)
        .then((res) => {
          fetchProducts()
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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="delete-data-model" sx={secondmodel}>
              <Typography className="model-icon" id="modal-modal-title" variant="h6" component="h1">
                <DeleteSweepIcon />
              </Typography>
              <Typography className="model-text" id="modal-modal-description" sx={{ mt: 2 }}>
                <h2>Are You Sure! Want to Delete <strong>{deleteProduct?.productName}</strong> Record?</h2>
                <p>Do you really want to delete these records? You can't view this in your list anymore if you delete!</p>
              </Typography>
              <Typography className="model-button">
                <Button variant="contained" className='primaryBtn order_active' onClick={handleClose}  >No, Keep it</Button>
                <Button variant="contained" className='primaryBtn order_active green' onClick={handleDeleteProduct} >Yes, Delete it</Button>
              </Typography>
            </Box>
          </Modal>

        </div>
      </>} />;
  }

  const MatSwitch = ({ index, pId }) => {
    const handleEnableProduct = (e) => {
      let selectProduct = rows.find((ele) => {
        return ele._id === pId;
      })

      if (selectProduct.status == 1) {
        selectProduct.status = 2;
      } else {
        selectProduct.status = 1;
      }

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;

      const disableProduct = new FormData();
      disableProduct.append('status', selectProduct.status);
      axios.put(getProduct + "/enableDisable/" + selectProduct._id, disableProduct)
        .then((res) => {
          fetchProdusts();
          toast.success(res.data.message, toastStyle);
        }).catch((err) => {
          console.log(err);
          toast.error(err.response.data.message, toastStyle);
        })
    }
    return <FormControlLabel
      control={
        <>
          <input type="checkbox" hidden="hidden" id={"productEnable" + index} onChange={(e) => handleEnableProduct(e)} checked={rows[index - 1]?.status == 1 ? true : false} />
          <label className="switch" for={"productEnable" + index}></label>
        </>
      }
    />
  };


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

  // Get All Brands List
  const fetchBrands = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(getBrands)
      .then((res) => {
        axios.get(`${getBrands}/?limit=${res.data.result.totalDocs}`)
        .then((resp) => {
          setBrand(resp.data.result.docs)
        })
      })
  }
  useEffect(() => {
    fetchBrands();
  }, []);

  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    if(e.target.value == null) {
      setSearch("")
    } else {
      setSearch(e.target.value)
    }
  }

  // Filter 

  const [filter, setFilter] = useState({
    productOnsale: "",
    productBrand: "",
    productGender: "",
    productCategory: "",
    orderBy: "",
  })
  
  const [filterOnSale , setFilterOnSale] = useState("")
  const handleOnSaleFilter = (e) => {
    let temp;
    if(e.target.checked) {
      temp = 2;
    } else {
      temp = "";
    }
    setFilterOnSale(temp)
  }
  
  const [filterOrderBy , setFilterOrderBy] = useState("")
  const handleOrderBy = (e) => {
    setFilterOrderBy(e.target.value)
  }

  const [filterGender , setFilterGender] = useState([])
  const handleGenderFilter = (e) => {
    const { value } = e.target;
    if (filterGender.includes(Number(value))) {
      setFilterGender(filterGender.filter(item => item !== Number(value)));
    } else {
      setFilterGender([...filterGender, Number(value)]);
    }  
  }

  const [filterBrand , setFilterBrand] = useState([])
  const handleBrandFilter = (e) => {
    const { value } = e.target;
    if (filterBrand.includes(value)) {
      setFilterBrand(filterBrand.filter(item => item !== value));
    } else {
      setFilterBrand([...filterBrand, value]);
    }  
  }

  const [filterCategory , setFilterCategory] = useState([])
  const handleCategoryFilter = (e) => {
    const { value } = e.target;
    if (filterCategory.includes(value)) {
      setFilterCategory(filterCategory.filter(item => item !== value));
    } else {
      setFilterCategory([...filterCategory, value]);
    }  
  }

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProdusts()
    setFilter({
      ...filter,
      productOnsale: filterOnSale,
      productGender: filterGender,
      orderBy: filterOrderBy,
      productBrand: filterBrand,
      productCategory: filterCategory
    })
    console.log(filterGender)
  }
  const handleResetFilter = (e) => {
    setFilter({
      productOnsale: "",
      productBrand: "",
      productGender: "",
      productCategory: "",
      orderBy: "",
    })
    setFilterGender("");
    setFilterOnSale("");
    setFilterOrderBy("");
    setFilterBrand("");
    setFilterCategory("");
  }
  

  // Get Product List API
  const fetchProdusts = () => {
    console.log(search)
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(`${getProduct}?page=${pageState.page}&limit=${pageState.pageSize}&search=${search}&productOnsale=${filter.productOnsale}&productBrand=${filter.productBrand}&productCategory=${filter.productCategory}&orderBy=${filter.orderBy}&productGender=${filter.productGender}`)
      .then((res) => {
        const json = res.data.result
        setPageState(old => ({ ...old, total: json.totalDocs }))

        res.data.result.docs.map((ele, i) => {
          ele.id = i + 1;
          ele.srno = (res.data.result.page * 10) + (i + 1) - 10
          ele.featuredProductImage = `http://${ele.featuredProductImage}`;

          let day = new Date(ele.productDate).getDate();
          let month = new Date(ele.productDate).getMonth() + 1;
          let year = new Date(ele.productDate).getFullYear();
          ele.productDate = `${day}/${month}/${year}`;

          if (ele?.status === 2) {
            ele.status = 2;
          } else {
            ele.status = 1;
          }

          if (ele.productPrice != null) {
            ele.productPrice = `$ ${ele.productPrice}`
          } else {
            ele.productPrice = "";
          }

          if (ele.productBrand === null) {
            ele.productBrand = "";
          } else {
            ele.productBrand = ele.brandData[0]?.brandName
          }

          if (ele.productCategory === null) {
            ele.productCategory = "";
          } else {
            ele.productCategory = ele.categoryData[0]?.categoryName
          }
        })
        setRows(res.data.result.docs)
      })
  }
  useEffect(() => {
    fetchProdusts()
  }, [pageState.page, pageState.pageSize, search, filter])

  // Get Selected Size
  const handleCheckedSize = (e , data) => {
    const { value, checked } = e.target;
    const { productSize } = selectedSize;

    console.log(`${value} is ${checked}`);

    if( data == "edit") {
      if (Array.from(proSize)?.includes(value)) {
        const data = proSize.filter((res) => (res !== value))
        setProSize(data)
      }
      else {
        const data = [...proSize]
        data.push(value)
        setProSize(data)
      }
    }

    if (checked) {
      setSelectedSize({
        productSize: [...productSize, value],
      })
    } else {
      setSelectedSize({
        productSize: productSize.filter((e) => e !== value)
      })
    }
    console.log(selectedSize);
  };

  // Get Selected Gender
  const handleCheckedGender = (e , data) => {
    const { value, checked } = e.target;
    const { productGender } = selectedGender;
    
    if( data == "edit") {
      if (Array.from(proGender)?.includes(Number(value))) {
        const data = proGender.filter((res) => (res !== Number(value)))
        setProGender(data)
      }
      else {
        const data = [...proGender]
        data.push(Number(value))
        setProGender(data)
      }
    }
    console.log(`${value} is ${checked}`);

    if (checked) {
      setSelectedGender({
        productGender: [...productGender, Number(value)],
      })
    } else {
      setSelectedGender({
        productGender: productGender.filter((e) => e !== Number(value))
      })
    }
  }

  // Get Featured Product Image
  const handleImageUpload = (e) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      current.file = file;
      reader.onload = e => {
        current.src = e.target.result;
      };
      reader.readAsDataURL(file);
    setFeaturedProductImage(e.target.files[0])
    }
    // console.log(featuredProductImage);
  };

  // Get Product Other Data
  const handleChange = (e, data) => {
    if (data == "add") {
      setAddProduct({
        ...addProduct,
        [e.target.name]: e.target.value,
      })
    }
    if (data == "edit") {
      setEditProduct({
        ...editProduct,
        [e.target.name]: e.target.value,
      })
    }
  }

  // On Sale data
  const handleOnSale = (e) => {
    document.getElementById("discountPrice").value = "";
    if (!e.target.checked) {
      setOnSale(1)
    } else {
      setOnSale(2)
    }
  }

  let discoutPrice = Math.round(addProduct.productPrice - ((addProduct.productPrice * addProduct.discountValue) / 100));


  // Add Product API
  const handleAddProduct = (e) => {
    e.preventDefault();

    let productImg = [];
    image.map((ele) => {
      if (ele.file) {
        const reader = new FileReader();
        const { current } = uploadedImage;
        current.file = ele.file;
        reader.onload = e => {
          current.src = e.target.result;
        };
        reader.readAsDataURL(ele.file);
        productImg.push(ele.file)
      }
      console.log(productImg, featuredProductImage);
    })
    
    if(onSale == 1) {
      setAddProduct({
        ...addProduct,
        discountValue : "0",
      })
    }

    console.log(selectedSize, selectedGender);
    
    const AddProductForm = new FormData();
    AddProductForm.append("featuredProductImage", featuredProductImage)
    // AddProductForm.append("productImage", Object.values(file))
    if (imageEdited) {
      AddProductForm.append("productImage", file);
    } else {
      for (let i = 0; i < file.length; i++) {
        AddProductForm.append("productImage", file[i]);
      }
    }
    AddProductForm.append("productItemNo", addProduct.productItemNo)
    AddProductForm.append("productName", addProduct.productName)
    AddProductForm.append("productDescription", addProduct.productDescription)
    AddProductForm.append("productCategory", addProduct.productCategory)
    AddProductForm.append("productSize", JSON.stringify(Object.values(selectedSize?.productSize)))
    AddProductForm.append("productBrand", addProduct.productBrand)
    AddProductForm.append("productColor", addProduct.productColor)
    AddProductForm.append("productGender", JSON.stringify(Object.values(selectedGender?.productGender)))
    AddProductForm.append("productPrice", addProduct.productPrice)
    AddProductForm.append("productOnsale", onSale);
    AddProductForm.append("discountValue", addProduct.discountValue);
    AddProductForm.append("productDiscountedPrice", String(discoutPrice))



    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.post(getProduct, AddProductForm)
      .then((res) => {
        fetchProdusts()
        handleClose()
        toast.success(res.data.message, toastStyle);
        setFile([]);
        setImagePreview([]);
      }).catch((err) => {
        console.log(err)
        toast.error(err.response.data.message, toastStyle);
      })
  }

  // Edit Product API
  const handleEditProduct = (e) => {
    e.preventDefault();

    const editProductForm = new FormData();
    editProductForm.append("featuredProductImage", featuredProductImage)
    // editProductForm.append("productImage", Object.values(file))
    if (imageEdited) {
      editProductForm.append("productImage", file);
    } else {
      for (let i = 0; i < file.length; i++) {
        editProductForm.append("productImage", file[i]);
      }
    }
    editProductForm.append("productItemNo", editProduct.productItemNo)
    editProductForm.append("productName", editProduct.productName)
    editProductForm.append("productDescription", editProduct.productDescription)
    editProductForm.append("productCategory", editProduct.productCategory)
    editProductForm.append("productSize", JSON.stringify(proSize))
    editProductForm.append("productBrand", editProduct.productBrand)
    editProductForm.append("productColor", editProduct.productColor)
    editProductForm.append("productGender", JSON.stringify(proGender))
    editProductForm.append("productPrice", editProduct.productPrice)
    editProductForm.append("productOnsale", onSale);
    if(editProduct.discountValue == undefined) {
      editProductForm.append("discountValue", "");
    } else {
      editProductForm.append("discountValue", editProduct.discountValue);
    }
    editProductForm.append("productDiscountedPrice", String(discoutPrice))



    // axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    // axios.put(`${getProduct}/${editProduct._id}`, editProductForm)
    //   .then((res) => {
    //     fetchProdusts()
    //     handleClose()
    //     toast.success(res.data.message, toastStyle);
    //     setFile([]);
    //     setImagePreview([]);
    //   }).catch((err) => {
    //     console.log(err)
    //     toast.error(err.response.data.message, toastStyle);
    //   })
  }

  return (
    <>
      <div className='Products'>

        <div className='product-wrapper'>
          <h1>Product Page</h1>
          <Button variant="contained" className='addproduct_btn product-btn' onClick={handleOpen} >
            Add Product
          </Button>
          {/* Add Product Model */}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="Product_Model_Container" sx={style}>
              <div className="ProductHeader">
                <div className="ProductTitel">
                  <h4>Add Product</h4>
                  <p>Add your product and necessary information from here</p>
                </div>
                <div className="ProductBtn">
                  <CloseIcon className='CloseIcon' onClick={handleClose} />
                </div>
              </div>

              <Form>
                <div className="ProductBody">
                  <Form.Group className="form-control-product ProductSize-group" controlId="formBasicImage">
                    <Form.Label>Featured Image</Form.Label>
                    <div className='ChangePOrfileCard'   >
                      <input type="file" accept="image/*" onChange={handleImageUpload} ref={imageUploader} style={{ display: "none" }} />
                      <div className='UserProfileCard' onClick={() => imageUploader.current.click()} >
                        <img ref={uploadedImage} className='UserProfileImg' src={DefaultProduct} name='productImage' />
                        <p className='ProfileUploadImgTitle'><ImageSearchOutlinedIcon /><span>Upload Image</span></p>
                      </div>
                    </div>
                  </Form.Group>
                  <Form.Group className="form-control-product ProductSize-group" controlId="formBasicImage">
                    <Form.Label>Other Images</Form.Label>
                    <div className='multipal-image'>
                      <div className="form-group">
                        <div className='input-field'>
                          <input
                            id="image"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={onChageImage}
                            style={{ height: "auto" }}
                            className="form-control-file"
                          />
                          <span>Choose a file or Drag it here</span>
                        </div>

                        {error && error.length > 0 ? (
                          <div className="invalid-feedback capital">
                            <em>{error}</em>
                          </div>
                        ) : null}
                        <div className='images-block'>
                          {imagePreview && imagePreview.length > 0
                            ? imagePreview.map((s, i) =>
                              s ? (
                                <div className='delete'>
                                <img
                                  src={s}
                                  alt="new"
                                  key={i}
                                />
                                <Button
                                  onClick={(e) => handleDeleteImage(e,i)}
                                >
                                  <DeleteOutlinedIcon />
                                </Button>
                                </div>
                              ) : null
                            )
                            : null}
                        </div>
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicPassword">
                    <Form.Label>Product SKU</Form.Label>
                    <Form.Control type="text" name='productItemNo' placeholder="Product SKU" onChange={(e) => handleChange(e, "add")} />
                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicTitel">
                    <Form.Label>Product Title/Name</Form.Label>
                    <Form.Control type="text" name='productName' placeholder="Product Title" onChange={(e) => handleChange(e, "add")} />
                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicTitel">
                    <Form.Label>Product Description</Form.Label>
                    <Form.Control as="textarea" name='productDescription' placeholder="Leave a Description here" style={{ height: '100px' }} onChange={(e) => handleChange(e, "add")} />
                  </Form.Group>

                  <Form.Group className="form-control-product">
                    <Form.Label>Parent Category</Form.Label>
                    <Form.Select name='productCategory' onChange={(e) => handleChange(e, "add")} aria-label="Default select example">
                      <option value="">Select Category</option>
                      {
                        category.map((cat, i) => {
                          return (
                            <option value={cat._id}>{cat.categoryName}</option>
                          )
                        })
                      }
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="form-control-product ProductSize-group">
                    <Form.Label>Product Size</Form.Label>
                    <div className="ProductSize">
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize7' name='productSize' value='UK7' onChange={(e) => handleCheckedSize(e)} />
                        <label htmlFor="ProductSize7"> 7</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize8' name='productSize' value='UK8' onChange={(e) => handleCheckedSize(e)} />
                        <label htmlFor="ProductSize8"> 8</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize9' name='productSize' value='UK9' onChange={(e) => handleCheckedSize(e)} />
                        <label htmlFor="ProductSize9"> 9</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize10' name='productSize' value='UK10' onChange={(e) => handleCheckedSize(e)} />
                        <label htmlFor="ProductSize10"> 10</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize11' name='productSize' value='UK11' onChange={(e) => handleCheckedSize(e)} />
                        <label htmlFor="ProductSize11"> 11</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize12' name='productSize' value='UK12' onChange={(e) => handleCheckedSize(e)} />
                        <label htmlFor="ProductSize12"> 12</label>
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-control-product">
                    <Form.Label>Product Brand</Form.Label>
                    <Form.Select name='productBrand' onChange={(e) => handleChange(e, "add")} aria-label="Product Type">
                      <option value="">Select Brand</option>
                      {
                        brand.map((brand, i) => {
                          return (
                            <option value={brand._id}>{brand.brandName}</option>
                          )
                        })
                      }
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="form-control-product">
                    <Form.Label>Product Color</Form.Label>
                    <Form.Control type="text" name='productColor' placeholder="Color" onChange={(e) => handleChange(e, "add")} />
                  </Form.Group>

                  <Form.Group className="form-control-product">
                    <Form.Label>Gender</Form.Label>
                    <div className="ProductSize">
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='male' name='productGender' value='1' onChange={(e) => handleCheckedGender(e)} />
                        <label htmlFor="male">Male</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='female' name='productGender' value='2' onChange={(e) => handleCheckedGender(e)} />
                        <label htmlFor="female">Female</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='kids' name='productGender' value='3' onChange={(e) => handleCheckedGender(e)} />
                        <label htmlFor="kids">Kids</label>
                      </div>
                    </div>
                  </Form.Group>
                  
                  <Form.Group className="form-control-product" controlId="formBasicTitel">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control type="number" name='productPrice' maxLength="10" placeholder="Price" onChange={(e) => handleChange(e, "add")} />
                  </Form.Group>

                  <Form.Group className="form-control-product product-sale" controlId="formBasicTitel">
                    <Form.Label>Product Sale</Form.Label>
                    <div className='w-70'>
                      <input type="checkbox" hidden="hidden" id={"product"} value={"1"} onChange={(e) => handleOnSale(e)} />
                      <label className="switch" for={"product"}></label>
                      <input className='discount' id='discountPrice' type="number" name='discountValue' placeholder='Discount Value %' onChange={(e) => handleChange(e, "add")} />
                    </div>
                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicTitel">
                    <Form.Label>Discount Price</Form.Label>
                    <Form.Control type="text" name='productDiscountedPrice' value={discoutPrice} placeholder="Discount Price" disabled onChange={(e) => handleChange(e, "add")} />
                  </Form.Group>
                </div>

                <div className="ProductFooter">
                  <Button className='' type='reset' autoFocus onClick={handleClose}  >
                    Cancel
                  </Button>
                  <Button className='' type='submit' autoFocus onClick={(e) => handleAddProduct(e)} >
                    Add Product
                  </Button>
                </div>
              </Form>
            </Box>
          </Modal>
          {/* Edit Product Model */}
          <Modal
            open={openEdit}
            onClose={handleCloseEdit}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="Product_Model_Container" sx={style}>
              <div className="ProductHeader">
                <div className="ProductTitel">
                  <h4>Edit Product</h4>
                  <p>Edit your product and necessary information from here</p>
                </div>
                <div className="ProductBtn">
                  <CloseIcon className='CloseIcon' onClick={handleCloseEdit} />
                </div>
              </div>

              <Form>
                <div className="ProductBody">
                  <Form.Group className="form-control-product ProductSize-group" controlId="formBasicImage">
                    <Form.Label>Featured Image</Form.Label>
                    <div className='ChangePOrfileCard'   >
                      <input type="file" accept="image/*" onChange={handleImageUpload} ref={imageUploader} style={{ display: "none" }} />
                      <div className='UserProfileCard' onClick={() => imageUploader.current.click()} >
                        <img ref={uploadedImage} className='UserProfileImg' src={`http://${editProduct.featuredProductImage}`} name='productImage' />
                        <p className='ProfileUploadImgTitle'><ImageSearchOutlinedIcon /><span>Change Image</span></p>
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-control-product ProductSize-group" controlId="formBasicImage">
                    <Form.Label>Other Images</Form.Label>
                    <div className='multipal-image'>
                      <div className="form-group">
                        <div className='input-field'>
                          <input
                            id="image"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={onChageImage}
                            style={{ height: "auto" }}
                            className="form-control-file"
                          />
                          <span>Choose a file or Drag it here</span>
                        </div>

                        {error && error.length > 0 ? (
                          <div className="invalid-feedback capital">
                            <em>{error}</em>
                          </div>
                        ) : null}
                        <div className='images-block'>
                          {imagePreview && imagePreview.length > 0
                            ? imagePreview.map((s, i) =>
                              s ? (
                                <div className='delete'>
                                <img
                                  src={s}
                                  alt="new"
                                  key={i}
                                />
                                <Button onClick={(e) => handleDeleteImage(e,i)} >
                                  <DeleteOutlinedIcon />
                                </Button>
                                </div>
                              ) : null
                            )
                            : null}
                        </div>
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicPassword">
                    <Form.Label>Product SKU</Form.Label>
                    <Form.Control type="text" name='productItemNo' placeholder="Product SKU" value={editProduct.productItemNo} onChange={(e) => handleChange(e, "edit")} />
                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicTitel">
                    <Form.Label>Product Title/Name</Form.Label>
                    <Form.Control type="text" name='productName' placeholder="Product Title" value={editProduct.productName} onChange={(e) => handleChange(e, "edit")} />
                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicTitel">
                    <Form.Label>Product Description</Form.Label>
                    <Form.Control as="textarea" name='productDescription' placeholder="Leave a Description here" value={editProduct.productDescription} style={{ height: '100px' }} onChange={(e) => handleChange(e, "edit")} />
                  </Form.Group>

                  <Form.Group className="form-control-product">
                    <Form.Label>Parent Category</Form.Label>
                    <Form.Select name='productCategory' value={editProduct.categoryData} onChange={(e) => handleChange(e, "edit")} aria-label="Default select example">
                      <option value="">Select Category</option>
                      {
                        category.map((cat, i) => {
                          return (
                            <option value={cat._id}>{cat.categoryName}</option>
                          )
                        })
                      }
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="form-control-product ProductSize-group">
                    <Form.Label>Product Size</Form.Label>
                    <div className="ProductSize">
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize7' name='productSize' value='UK7' checked={Array.from(proSize)?.includes("UK7") ? true : false} onChange={(e) => handleCheckedSize(e , "edit")} />
                        <label htmlFor="ProductSize7"> 7</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize8' name='productSize' value='UK8' checked={Array.from(proSize)?.includes("UK8") ? true : false} onChange={(e) => handleCheckedSize(e , "edit")} />
                        <label htmlFor="ProductSize8"> 8</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize9' name='productSize' value='UK9' checked={Array.from(proSize)?.includes("UK9") ? true : false} onChange={(e) => handleCheckedSize(e , "edit")} />
                        <label htmlFor="ProductSize9"> 9</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize10' name='productSize' value='UK10' checked={Array.from(proSize)?.includes("UK10") ? true : false} onChange={(e) => handleCheckedSize(e , "edit")} />
                        <label htmlFor="ProductSize10"> 10</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize11' name='productSize' value='UK11' checked={Array.from(proSize)?.includes("UK11") ? true : false} onChange={(e) => handleCheckedSize(e , "edit")} />
                        <label htmlFor="ProductSize11"> 11</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='ProductSize12' name='productSize' value='UK12' checked={Array.from(proSize)?.includes("UK12") ? true : false} onChange={(e) => handleCheckedSize(e , "edit")} />
                        <label htmlFor="ProductSize12"> 12</label>
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-control-product">
                    <Form.Label>Product Brand</Form.Label>
                    <Form.Select name='productBrand' value={editProduct.brandData} onChange={(e) => handleChange(e, "edit")} aria-label="Product Type">
                      <option>Select Brand</option>
                      {
                        brand.map((brand, i) => {
                          return (
                            <option value={brand._id}>{brand.brandName}</option>
                          )
                        })
                      }
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="form-control-product">
                    <Form.Label>Product Color</Form.Label>
                    <Form.Control type="text" name='productColor' value={editProduct.productColor} placeholder="Color" onChange={(e) => handleChange(e, "edit")} />
                  </Form.Group>

                  <Form.Group className="form-control-product">
                    <Form.Label>Gender</Form.Label>
                    <div className="ProductSize">
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='male' name='productGender' value={1} checked={Array.from(proGender)?.includes(1) ? true : false} onChange={(e) => handleCheckedGender(e , "edit")} />
                        <label htmlFor="male">Male</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='female' name='productGender' value={2} checked={Array.from(proGender)?.includes(2) ? true : false} onChange={(e) => handleCheckedGender(e , "edit")} />
                        <label htmlFor="female">Female</label>
                      </div>
                      <div className="ProductLableSIze">
                        <input type="checkbox" id='kids' name='productGender' value={3} checked={Array.from(proGender)?.includes(3) ? true : false} onChange={(e) => handleCheckedGender(e , "edit")} />
                        <label htmlFor="kids">Kids</label>
                      </div>
                    </div>
                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicTitel">
                    <Form.Label>Product Price</Form.Label>
                    <Form.Control type="number" name='productPrice' value={editProduct.productPrice} maxLength="10" placeholder="Price" onChange={(e) => handleChange(e, "edit")} />
                  </Form.Group>

                  <Form.Group className="form-control-product product-sale" controlId="formBasicTitel">
                    <Form.Label>Product Sale</Form.Label>
                    <div className='w-70'>
                      <input type="checkbox" hidden="hidden" id={"product"} value={editProduct.productOnsale} checked={onSale == 1 ? false : true} onChange={(e) => handleOnSale(e)} />
                      <label className="switch" for={"product"}></label>
                      <input className='discount' id='discountPrice' type="number" name='discountValue' value={editProduct.discountValue} placeholder='Discount Value %' onChange={(e) => handleChange(e, "edit")} />
                    </div>
                  </Form.Group>

                  <Form.Group className="form-control-product" controlId="formBasicTitel">
                    <Form.Label>Discount Price</Form.Label>
                    <Form.Control type="text" name='productDiscountedPrice' value={editProduct.productDiscountedPrice} placeholder="Discount Price" disabled onChange={(e) => handleChange(e, "edit")} />
                  </Form.Group>
                </div>

                <div className="ProductFooter">
                  <Button className='' type='reset' autoFocus onClick={handleCloseEdit}  >
                    Cancel
                  </Button>
                  <Button className='' type='submit' autoFocus onClick={(e) => handleEditProduct(e)} >
                    Edit Product
                  </Button>
                </div>
              </Form>
            </Box>
          </Modal>
        </div>

        <div className='productserchBtn pageFilterBar'>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                <Button variant="contained" className='fillter_btn' {...bindTrigger(popupState)} startIcon={<AiOutlinePlus />}>
                  Filter
                </Button>
                <Menu {...bindMenu(popupState)}>
                  <Scrollbar style={{ width: 500, height: 500 }}>
                    <div className="section_p_20 product-filter">
                      <div className="drwdownMenus">
                        <Button className='rst-Btn-Lnk' onClick={(e) => handleResetFilter(e)} autoFocus  >
                          Reset
                        </Button>
                        <Button className='aply-Btn-Lnk apply-btn' onClick={(e) => handleFilter(e)} autoFocus>
                          Apply
                        </Button>
                      </div>
                      <div className='filter-item on-sale'>
                        <div className="drwTitle">
                          <h2>On Sale</h2>
                        </div>
                        <div className="checkstatus">
                          <input type="checkbox" onChange={(e) => handleOnSaleFilter(e)} checked={filterOnSale == 2 ? true : false} hidden="hidden" id="onsale" />
                          <label className="switch" for="onsale"></label>
                        </div>
                      </div>
                      <div className='filter-item'>
                        <div className="drwTitle">
                          <h2>Price</h2>
                        </div>
                        <div className="checkstatus">
                          <div className="allStetus">
                            <div className='status-item '>
                              <input type="radio" name='orderBy' value={1} checked={filterOrderBy == 1 ? true : false} id='order-place' onChange={(e) => handleOrderBy(e)} />
                              <label htmlFor="order-place">Low to High</label>
                            </div>
                            <div className='status-item '>
                              <input type="radio" name='orderBy' value={2} checked={filterOrderBy == 2 ? true : false} id='shipped' onChange={(e) => handleOrderBy(e)} />
                              <label htmlFor="shipped">High to Low</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='filter-item roles-dropdown'>
                        <div className="drwTitle">
                          <h2>Type</h2>
                        </div>
                        <div className="checkstatus">
                          <Form.Group className="roles-row" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" value={1} checked={filterGender?.includes(1) ? true : false} onChange={(e) => handleGenderFilter(e)}  id="men" name="men" label="Men" />
                            <Form.Check type="checkbox" value={2} checked={filterGender?.includes(2) ? true : false} onChange={(e) => handleGenderFilter(e)}  id="women" name="women" label="Women" />
                            <Form.Check type="checkbox" value={3} checked={filterGender?.includes(3) ? true : false} onChange={(e) => handleGenderFilter(e)}  id="kids" name="kids" label="Kids" />
                          </Form.Group>
                        </div>
                      </div>
                      <div className='filter-item roles-dropdown'>
                        <div className="drwTitle">
                          <h2>Brand</h2>
                        </div>
                        <div className="checkstatus">
                          <Form.Group className="roles-row" controlId="formBasicCheckbox">
                            {
                              brand.map((ele) => {
                                return (
                                  <Form.Check type="checkbox" id={ele._id} value={ele._id} name={ele.brandName} onChange={(e) => handleBrandFilter(e)} checked={filterBrand.includes(ele._id) ? true : false} label={ele.brandName} />
                                )
                              })
                            }
                          </Form.Group>
                        </div>
                      </div>
                      <div className='filter-item roles-dropdown'>
                        <div className="drwTitle">
                          <h2>Category</h2>
                        </div>
                        <div className="checkstatus">
                          <Form.Group className="roles-row" controlId="formBasicCheckbox">
                            {
                              category.map((ele) => {
                                return (
                                  <Form.Check type="checkbox" id={ele._id} name={ele.categoryName} value={ele._id} onChange={(e) => handleCategoryFilter(e)} checked={filterCategory.includes(ele._id) ? true : false} label={ele.categoryName} />
                                )
                              })
                            }
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </Scrollbar>
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
      </div>
      <div >
        <DataGrid
          autoHeight 
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
          components={{
            Toolbar: CustomToolbar,
          }}
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





