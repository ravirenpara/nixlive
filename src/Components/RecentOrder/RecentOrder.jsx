import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import {GetRecentOrderList} from "../../Api";


function RecentOrder() {

  const columns = [
    { field: 'id', headerName: 'Sr No', width: 50 },
    { field: 'productImage', headerName: 'Product Image', width: 150, renderCell: (params) => <img src={params.value} height="40px" /> },
    { field: 'OrderDate', headerName: 'Date', width: 120 },
    { field: 'OrderId', headerName: 'Order ID', width: 200 },
    { field: 'userName', headerName: 'Full Name', width: 180 },
    { field: 'orderStatus', headerName: 'Status', width: 150 },
    {
      field: 'productId', headerName: 'Product ID', width: 280,
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
  ];
  const [rows, setRows] = useState([])
  const fetcOrderDetails = () => {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    axios.get(GetRecentOrderList)
      .then((res) => {
        res.data.result.docs.map((ele, i) => {
          ele.id = i + 1
          ele.productImage = "http://192.168.1.5:3001/"+ele.products[0]?.productImage;

          // ele.productImage = []
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
  }, []);

  let token;
  if (localStorage.getItem("token") != null) {
    token = localStorage.getItem('token');
  } else if (sessionStorage.getItem('token') != null) {
    token = sessionStorage.getItem('token')
  }

  return (
    <>
      <div>
        <DataGrid
          autoHeight
          getRowHeight={() => 'auto'}
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          pagination
        // checkboxSelection
        />
      </div>
    </>
  )
}

export default RecentOrder