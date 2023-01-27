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
    { field: 'id', headerName: 'Brand ID', width: 110 },
    { field: 'BrandName', headerName: 'Brand Name', width: 150 },
    { field: 'InCartBrand', headerName: 'In Cart', width: 110 },
    { field: 'liked', headerName: 'liked', width: 110 },
    { field: 'viewed', headerName: 'Viewed', width: 110 },
    { field: 'sold', headerName: 'Sold', width: 110 },
  ];
  
  const rows = [
    { id: '#1', BrandName: 'Nike Air', InCartBrand: '12', liked: '15', viewed: '20', sold: "50" },
    { id: '#2', BrandName: 'Nike Air', InCartBrand: '51', liked: '15', viewed: '20', sold: "50" },
    { id: '#3', BrandName: 'Nike Air', InCartBrand: '5', liked: '15', viewed: '20', sold: "50" },
    { id: '#4', BrandName: 'Nike Air', InCartBrand: '259', liked: '15', viewed: '20', sold: "50" },
    { id: '#5', BrandName: 'Nike Air', InCartBrand: '1', liked: '15', viewed: '20', sold: "50" },
    { id: '#6', BrandName: 'Nike Air', InCartBrand: '45', liked: '15', viewed: '20', sold: "50" },
    { id: '#7', BrandName: 'Nike Air', InCartBrand: '26', liked: '15', viewed: '20', sold: "50" },
    { id: '#8', BrandName: 'Nike Air', InCartBrand: '2', liked: '15', viewed: '20', sold: "50" },
    { id: '#9', BrandName: 'Nike Air', InCartBrand: '26', liked: '15', viewed: '20', sold: "50" },
    { id: '#10', BrandName: 'Nike Air', InCartBrand: '26', liked: '15', viewed: '20', sold: "50" },
  ];

function BrandData() {
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

export default BrandData