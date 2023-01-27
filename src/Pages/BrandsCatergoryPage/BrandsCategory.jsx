import React from 'react'
import Brands from './Brand'
import Categories from './Categories';
import './BrandsCategory.css'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomerOrder() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className='CustomerOrderContainer brands-category-page'>

      <div className="title_text">
        <h1>Brands & Category</h1>
      </div>
      <Box sx={{ width: '100%' }}>
        <Box >
          <div className='productserchBtn pageFilterBar '>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Brands" {...a11yProps(0)} />
              <Tab label="Category" {...a11yProps(1)} />
            </Tabs>
            <div className='searchbaar'>
              {/* <div className='serach_icon'>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              /> */}
            </div>
          </div>
        </Box>
        <div className='tab-content'>
          <TabPanel value={value} index={0}>
            <Brands />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Categories />
          </TabPanel>
        </div>
      </Box>

    </div>
  )
}

export default CustomerOrder