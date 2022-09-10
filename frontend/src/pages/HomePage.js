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

    console.log('tweet: ', tweets)

    return (
        <div>
            <Grid2 container spacing={2}>
                <Grid2 xs={6} className='parent-heading'>
                    <h1 className='main-heading'>disasteropedia</h1>
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
                        >
                        <MenuItem value={'All'}>All India</MenuItem>
                        {disasterArea.map((area) => (
                            <MenuItem value={area.tweet_state}>{area.tweet_state}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    </Box>
                </Grid2>
                <Grid2 xs={1} textAlign='right' className='parent-top-icons'>
                    <IconButton
                        className='top-icons'
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        href={'info'}
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

            <hr/>
            <Grid2 container spacing={5}>
                <Grid2 xs={6}>
                    {/* ------------------------ PROCESSED DATA SECTION ------------------------- */}
                    <div>
                        <h2 className='heading'> Processed Data </h2>
                        <div className='row'>
                            <p className='subheading'> Calamity Type: </p>
                            {disasterType.map((disaster) => (
                                <p key={disaster.disaster_type} className='subheading-content'>
                                    {disaster.disaster_type},
                                </p>
                            ))}
                        </div>
                        <div>
                            <p className='subheading'> Areas affected: </p>
                            <div className='area-row'>
                            {disasterArea.map((area) => (
                                <p key={area.tweet_state} className='area-subheading-content'>
                                    {area.tweet_state},
                                </p>
                            ))}
                            </div>
                        </div>
                    </div>
                    <hr className='media-top' align="left" />
                    {/* ------------------------ LATEST MEDIA SECTION ------------------------------- */}
                    <div>
                        <h2 className='heading'> Latest Media </h2>
                        <ImageList sx={{ width: 600, height: 450 }} className="media-parent">
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
                                    actionIcon={
                                    <IconButton
                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`info about ${tweet.link}`}
                                            href={tweet.link}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                    >
                                        <InfoIcon color='primary'/>
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
                >
                    <h2 className='heading'> Latest Posts </h2>
                    {tweets.map((tweet) => (
                        <div key={tweet.id} className='flex-container'>
                            <div>
                                <img src={TwitterIcon} alt='twitter' className='twitterIcon' />
                            </div>
                            <div>
                                <a href={tweet.link}>
                                    <p className='tweet-text'> "{tweet.text}" </p>
                                    <p className='tweet-date'> {tweet.created_at.split("T")[1].slice(0, -9)} • {tweet.created_at.split("T")[0]} </p>
                                </a>
                            </div>  
                            
                        </div>
                    ))}
                    <Pagination count={pageCount} color="primary" onChange={handleChange} className='pagination'/>
                </Grid2>
            </Grid2>
            
            
        </div>
    )
}

export default HomePage
