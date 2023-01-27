import React, { useState }  from 'react'
import { DataGrid } from '@mui/x-data-grid';
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FormControlLabel, IconButton } from '@material-ui/core';
import { Link } from "react-router-dom";


function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const MatEdit = ({ index }) => {
  const handleEditClick = () => {
    // some action
  }
  return <FormControlLabel
    control={
      <IconButton color="secondary" aria-label="add an alarm" onClick={handleEditClick} >
        <VisibilityIcon style={{ color: '#766d6d7a' }} />
      </IconButton>
    }
  />
};

const columns = [
  { field: 'date', headerName: 'Date', width: 200 },
  { field: 'id', headerName: 'Order ID', width: 170 },
  { field: 'status', headerName: 'Status', width: 250 },
  { field: 'productId', headerName: 'Product ID', width: 250 },
  { field: 'shippingId', headerName: 'Shipping ID', width: 200 },
  { field: 'total', headerName: 'Total', type: 'number', width: 150,},
  {
    field: "actions", headerName: "Actions", sortable: false, width: 140,
    renderCell: (prevent) => {
      return (
        <Link to="/vieworder">
          <div className="d-flex justify-content-between align-items-center" style={{ cursor: "pointer" }}>
            <MatEdit index={prevent.row.id} />
          </div>
        </Link>
      );
    }
  }
];

const rows = [
  { id: '#1', date: '20-5-2022', status: 'Oreder Completed', productId: '1.KLYU2987', shippingId: 'KLYU2987', total: '$35' },
  { id: '#2', date: '20-5-2022', status: 'Oreder Completed', productId: '2.KLYU2987', shippingId: 'KLYU2987', total: '$42' },
  { id: '#3', date: '20-5-2022', status: 'Oreder Completed', productId: '3.KLYU2987', shippingId: 'KLYU2987', total: '$45' },
  { id: '#4', date: '20-5-2022', status: 'Oreder Completed', productId: '4.KLYU2987', shippingId: 'KLYU2987', total: '$16' },
  { id: '#5', date: '20-5-2022', status: 'Oreder Completed', productId: '5.KLYU2987', shippingId: 'KLYU2987', total: '$85' },
  { id: '#6', date: '20-5-2022', status: 'Oreder Completed', productId: '6.KLYU2987', shippingId: 'KLYU2987', total: '$150' },
  { id: '#7', date: '20-5-2022', status: 'Oreder Completed', productId: '7.KLYU2987', shippingId: 'KLYU2987', total: '$44' },
  { id: '#8', date: '20-5-2022', status: 'Oreder Completed', productId: '8.KLYU2987', shippingId: 'KLYU2987', total: '$85' },
  { id: '#9', date: '20-5-2022', status: 'Oreder Completed', productId: '8.KLYU2987', shippingId: 'KLYU2987', total: '$85' },
  { id: '#10', date: '20-5-2022', status: 'Oreder Completed', productId: '9.KLYU2987', shippingId: 'KLYU2987', total: '$445' },
];

function CompletedOrder() {
  return (
    <>   
      <div style={{ height: 660, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          components={{
            Toolbar: CustomToolbar,
          }}
          // checkboxSelection
        />      
    </div>
    </>
  )
}

export default CompletedOrder