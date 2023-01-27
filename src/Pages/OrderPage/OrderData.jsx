import React from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import { Container } from "@material-ui/core";
import OrderImg from '../../Images/product1.png'

export default function OrderData() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    // Example data (invoice items)
    const invoiceItems = [
        {
            qty: 1,
            price: 84.99,
            subtotal: 84.99,
            currency: "IND",
            name: "Nike Shoe(Sports)",
            itemNumb: '010201',
            size: '12',
            image: OrderImg,
        },
        {
            qty: 2,
            price: 99.99,
            subtotal: 199.98,
            currency: "IND",
            itemNumb: '010202',
            size: '11',
            name: "Nike Shoe(Sports)"
        },
        {
            qty: 1,
            price: 19.99,
            subtotal: 19.99,
            currency: "IND",
            itemNumb: '010203',
            size: '10',
            name: "Nike Shoe(Sports)"
        },
        {
            qty: 5,
            price: 5.08,
            subtotal: 25.4,
            currency: "IND",
            size: '10',
            itemNumb: '010204',
            name: "Nike Shoe(Sports)"
        },
        {
            qty: 3,
            price: 17.99,
            subtotal: 53.97,
            currency: "IND",
            itemNumb: '010205',
            size: '9',
            name: "Nike Shoe(Sports)"
        },
        {
            qty: 1,
            price: 33.96,
            subtotal: 33.96,
            currency: "IND",
            size: '8',
            itemNumb: '010206',
            name: "Nike Shoe(Sports)"
        },
        {
            qty: 0,
            price: 8.49,
            subtotal: 0,
            currency: "IND",
            itemNumb: '010207',
            size: '6',
            name: "Nike Shoe(Sports)"
        },
        {
            qty: 1,
            price: 79.99,
            subtotal: 79.99,
            currency: "IND",
            size: '5',
            itemNumb: '010208',
            name: "Nike Shoe(Sports)"
        },
        {
            qty: 0,
            price: 11.44,
            subtotal: 0,
            size: '4',
            currency: "IND",
            itemNumb: '010201',
            name: "Sunglasses"
        },
        {
            qty: 1,
            price: 21.99,
            subtotal: 21.99,
            size: '3',
            currency: "IND",
            itemNumb: '010209',
            name: "Nike Shoe(Sports)"
        }
    ];

    const reducer = (acc, value) => acc + value;

    // console.log("jisoo", Object.keys(invoiceItems[0]));
    // console.log("lisa", invoiceItems.map((item) => item.name).sort());

    return (
        <>
            <Container maxWidth="md">
                {/* <h2 style={{ textAlign: "center" }}>Invoice</h2> */}
                <Paper>
                    <TableContainer className="TableContainer">
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead className="TableHeadCompt">
                                <TableRow>
                                    <TableCell>{Object.keys(invoiceItems[0])[4]}</TableCell>
                                    <TableCell align="right">
                                        {Object.keys(invoiceItems[0])[1]}
                                    </TableCell>
                                    <TableCell align="right">
                                        {Object.keys(invoiceItems[0])[0]}
                                    </TableCell>
                                    
                                    <TableCell align="right">
                                        {Object.keys(invoiceItems[0])[2]}
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {invoiceItems
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .filter((item) => item.subtotal > 0)
                                    .sort((a, b) => (a.name > b.name ? 1 : -1))
                                    .map((item) => {
                                        return (
                                            <TableRow key={item.name}>
                                                <TableCell className="OrderItemCustomize">
                                                    <img src={OrderImg} alt="OrderImage" />
                                                    <div className="SubItem">
                                                        
                                                        <div className="OrderItemDetails">
                                                            {item.name}<br />
                                                            <span>Item Number : </span>{item.itemNumb}<br />
                                                            <span>Size : </span>{item.size}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {"$"}
                                                    {(item.price * 0.84).toFixed(2)}{" "}
                                                </TableCell>
                                                <TableCell align="right">x{item.qty} </TableCell>
                                                
                                                <TableCell align="right">{"$"}
                                                    {(item.subtotal * 0.84).toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                <TableRow className="orderTotal">
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="right" className="orderTotal">
                                        <strong>Total </strong>
                                    </TableCell>
                                    <TableCell className="orderTotal" align="right">{"$"} 
                                        {invoiceItems
                                            .map((item) => item.subtotal * 0.84)
                                            .reduce((acc, value) => acc + value)
                                            .toFixed(2)}{" "}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 20, 30]}
                        component="div"
                        count={invoiceItems.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </Container>
        </>
    );
}
