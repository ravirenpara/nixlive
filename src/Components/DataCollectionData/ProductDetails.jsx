import React from 'react'
import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

const columns = [
    { field: 'id', headerName: 'Product ID', width: 110 },
    { field: 'ProductName', headerName: 'Product Name', width: 150 },
    { field: 'InCartProduct', headerName: 'In Cart Product', width: 110 },
    { field: 'liked', headerName: 'liked', width: 110 },
    { field: 'viewed', headerName: 'Viewed', width: 110 },
    { field: 'sold', headerName: 'Sold', width: 110 },
  ];
  
  const rows = [
    { id: '#1', ProductName: 'Nike Air', InCartProduct: '12', liked: '15', viewed: '20', sold: "50" },
    { id: '#2', ProductName: 'Nike Air', InCartProduct: '51', liked: '15', viewed: '20', sold: "50" },
    { id: '#3', ProductName: 'Nike Air', InCartProduct: '5', liked: '15', viewed: '20', sold: "50" },
    { id: '#4', ProductName: 'Nike Air', InCartProduct: '259', liked: '15', viewed: '20', sold: "50" },
    { id: '#5', ProductName: 'Nike Air', InCartProduct: '1', liked: '15', viewed: '20', sold: "50" },
    { id: '#6', ProductName: 'Nike Air', InCartProduct: '45', liked: '15', viewed: '20', sold: "50" },
    { id: '#7', ProductName: 'Nike Air', InCartProduct: '26', liked: '15', viewed: '20', sold: "50" },
    { id: '#8', ProductName: 'Nike Air', InCartProduct: '2', liked: '15', viewed: '20', sold: "50" },
    { id: '#9', ProductName: 'Nike Air', InCartProduct: '26', liked: '15', viewed: '20', sold: "50" },
    { id: '#10', ProductName: 'Nike Air', InCartProduct: '26', liked: '15', viewed: '20', sold: "50" },
  ];
function ProductDetails() {
  return (
    <>
    <div className="data-collection-page" style={{ height: 660, width: '100%' }}>
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

export default ProductDetails




