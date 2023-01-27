import React from 'react'
import './Error.css';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";


function Error() {
    const navigate = useNavigate();

    const toDeshboard = () => {
        navigate("/");
    }
  return (
    <div>
        <section className="page_404">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="col-sm-10 col-sm-offset-1  text-center">
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>
                            </div>

                            <div className="contant_box_404">
                                <h3 className="h2">Looks like are on wrong page.</h3>
                                <p>Back to Dashboard</p>
                                <Button variant="contained" type="submit" onClick={toDeshboard} className='primaryBtn back-btn'>
                                    Dashboard
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Error