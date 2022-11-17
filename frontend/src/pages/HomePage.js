import './HomePage.css';
import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Pagination from '@mui/material/Pagination';
import TwitterIcon from '../assets/twitter_icon.png';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LoadingIcon from '../assets/loading.gif';

const HomePage = () => {

    let { tweets, pageCount, disasterType, disasterArea, queryState, setPageNo, setPageCount, setTweets, setDisasterType, setDisasterArea, setQueryState} = useContext(AuthContext)
    
    let handleChange = async (event, value) => {
        setPageNo(value);
        // Make a post request to the api to update the tweets
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-tweet/${queryState}/?page=${value}`, {
            method:'GET'
        })
        let data = await response.json()
        
        if (response.status === 200) {   
            setTweets(data[0])
            setPageCount(data[1])
            setDisasterType(data[2])
            setDisasterArea(data[3])
        }else{
            console.log('ERROR: Getting tweet data from server')
        }
    };
    
    let handleSelectChange = async (event) => {
        let value = event.target.value;
        setQueryState(event.target.value);
        // Make a post request to the api to update the tweets
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-tweet/${value}`, {
            method:'GET'
        })
        let data = await response.json()
        
        if (response.status === 200) {   
            setTweets(data[0])
            setPageCount(data[1])
            setDisasterType(data[2])
            setDisasterArea(data[3])
        }else{
            console.log('ERROR: Getting tweet data from server')
        }
    };

    // To change date from YYYY-MM-DD type to DD-MM-YYYY type
    function getDate(date) {

        let day = date.split('-')[2];
        let month = date.split('-')[1];
        let year = date.split('-')[0];
        
        let newDate = day + '-' + month + '-' + year;
        return newDate;
    }

    // To check if we need to add a comma after the list of items
    function addComma(index, array) {
        if (index < array.length - 1) {
            return ","
        }
        return ""
    }

    console.log('tweet: ', tweets)

    return (
        <div>
            <Grid2 container spacing={2} className='navbar-parent-grid'>
                <Grid2 xs={6} className='parent-heading'>
                    <h1 className='main-heading'> disasteropedia</h1>
                </Grid2>
                <Grid2 xs={3} className='parent-location-drowpdown'>
                    <Box sx={{ minWidth: 120 }} className='location-dropdown'>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Location</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={queryState}
                            label="Age"
                            onChange={handleSelectChange}
                            className="location-dropdown-select"
                        >
                        <MenuItem value={'All'}>All India</MenuItem>
                        {disasterArea.map((area) => (
                            <MenuItem key={area.tweet_state} value={area.tweet_state}>{area.tweet_state}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </Box>
                </Grid2>
                <Grid2 xs={1} textAlign='right' className='parent-top-icons'>
                    <IconButton
                        className='top-icons'
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        href={'/about'}
                    >
                        <HelpOutlineOutlinedIcon fontSize='medium' className='top-icons' />
                    </IconButton>
                </Grid2>
                <Grid2 xs={1} textAlign='left' className='parent-top-icons'>
                    <IconButton
                        className='top-icons'
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        href={'https://github.com/anubhav06/disasteropedia'}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        <GitHubIcon fontSize='medium' className='top-icons' />
                    </IconButton>
                </Grid2>

            </Grid2>

            {/* <hr/> */}
            <Grid2 container spacing={10}>
                <Grid2 xs={6} className='left-section'>
                    {/* ------------------------ PROCESSED DATA SECTION ------------------------- */}
                    <div>
                        <h2 className='heading'> Processed Data </h2>
                        <div className='row'>
                            <p className='subheading'> Calamity type: </p>
                            <div className='data-row' >
                            {disasterType.map((disaster, index) => (
                                <p key={disaster.disaster_type} className='data-subheading-content'>
                                    {disaster.disaster_type} {addComma(index, disasterType)}
                                </p>
                            ))}
                            </div>
                        </div>
                        <div className='row2'>
                            <p className='subheading'> Areas affected: </p>
                            <div className='area-row'>
                            {disasterArea.map((area, index) => (
                                <p key={area.tweet_state} className='area-subheading-content'>
                                    {area.tweet_state} {addComma(index, disasterArea)}
                                </p>
                            ))}
                            </div>
                        </div>
                    </div>
                    <hr className='media-top' align="left" />
                    {/* ------------------------ LATEST MEDIA SECTION ------------------------------- */}
                    <div>
                        <h2 className='heading'> Latest Media </h2>
                        <ImageList className="media-parent">
                            {tweets.map((tweet) => (
                                <ImageListItem key={tweet.id}>
                                {tweet.media_type === 'photo'
                                    ?   <img
                                            src={tweet.media}
                                            srcSet={tweet.media}
                                            alt='tweet media'
                                            loading="lazy"
                                            className="media-section"
                                        />
                                    :   <video
                                            className="media-section"
                                            controls
                                        >
                                            <source src={tweet.media} type="video/mp4" />
                                            Your browser does not support this video tag.
                                    </video>
                                    
                                }
                                <ImageListItemBar   
                                    title={"Twitter"}
                                    subtitle={`@${tweet.username}`}
                                    sx={{ width: 290 }}
                                    actionIcon={
                                    <IconButton
                                        sx={{ color: 'white' }}
                                            aria-label={`info about ${tweet.link}`}
                                            href={tweet.link}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                    >
                                        <InfoIcon htmlColor='#f3f3f3'/>
                                    </IconButton>
                                    }
                                />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </div>
                </Grid2>
                {/* ----------------------------- LATEST POSTS SECTION --------------------------------------- */}
                <Grid2 xs={6}
                    textAlign={'left'}
                    className='right-section'
                >
                    <h2 className='heading'> Latest Posts </h2>
                    {tweets.map((tweet) => (
                        <div key={tweet.id} className='flex-container'>
                            <div>
                                <img src={TwitterIcon} alt='twitter' className='twitterIcon' />
                            </div>
                            <div className='tweet'>
                                <a href={tweet.link}>
                                    <p className='tweet-text'>
                                        "{tweet.text}"
                                    </p>
                                    <p className='tweet-date'>
                                        {tweet.created_at.split("T")[1].slice(0, -9)} • {getDate(tweet.created_at.split("T")[0])}
                                    </p>
                                </a>
                            </div>  
                            
                        </div>
                    ))}
                    <Pagination count={pageCount} color="primary" onChange={handleChange} className='pagination' />
                    <div className='loading-row'>
                        <img src={LoadingIcon} alt='idk' className='loading-icon'/>
                        <p className='loading-text'> LIVE : Data is being updated in real time </p>
                    </div>
                </Grid2>
            </Grid2>
            
            
        </div>
    )
}

export default HomePage
