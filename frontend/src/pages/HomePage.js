import './HomePage.css';
import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Pagination from '@mui/material/Pagination';
import TwitterIcon from '../assets/twitter_icon.png';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

const HomePage = () => {

    let { tweets, pageCount, disasterType, disasterArea, setPageNo, setPageCount, setTweets} = useContext(AuthContext)
    
    let handleChange = async (event, value) => {
        setPageNo(value);
        // Make a post request to the api to update the tweets
        let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-tweets/?page=${value}`, {
            method:'GET'
        })
        let data = await response.json()
        
        if (response.status === 200) {   
            setTweets(data[0])
            setPageCount(data[1])
        }else{
            console.log('ERROR: Getting tweet data from server')
        }
    };
    

    console.log('tweet: ', tweets)

    return (
        <div>
            <Grid2 container spacing={2}>
                <Grid2 xs={6}>
                    <div>disasteropedia</div>
                </Grid2>
                <Grid2 xs={3}>
                    <div>Dropdown menu</div>
                </Grid2>
                <Grid2 xs={1}>
                    <div>Support Icon</div>
                </Grid2>
                <Grid2 xs={1}>
                    <div>Info Icon</div>
                </Grid2>
                <Grid2 xs={1}>
                    <div>GitHub Icon</div>
                </Grid2>

            </Grid2>

            <hr/>
            <Grid2 container spacing={2}>
                <Grid2 xs={6}>
                    {/* ------------------------ PROCESSED DATA SECTION ------------------------- */}
                    <div>
                        <h2 className='heading'> Processed Data </h2>
                        <div className='row'>
                            <p className='subheading'> Calamity type: </p>
                            {disasterType.map((disaster) => (
                                <p key={disaster.disaster_type} className='subheading-content'>
                                    {disaster.disaster_type}, 
                                </p>
                            ))}
                        </div>
                        <div>
                            <p className='subheading'> Areas affected: </p>
                            <div className='row'>
                            {disasterArea.map((area) => (
                                <p key={area.tweet_state} className='area-subheading-content'>
                                    {area.tweet_state},
                                </p>
                            ))}
                            </div>
                        </div>
                    </div>
                    <hr />
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
                                        <InfoIcon />
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
                    <h2> Latest Posts </h2>
                    <Grid2 container spacing={0}>
                        {tweets.map((tweet) => (
                            <div key={tweet.id} className='row'>
                                <Grid2 xs={2}>
                                    <img src={TwitterIcon} alt='twitter' className='twitterIcon' />
                                </Grid2>
                                <Grid2 xs={10}>
                                    <a href={tweet.link}>
                                        <p> "{tweet.text}" </p>
                                        <p> {tweet.created_at.split("T")[1].slice(0, -4)} • {tweet.created_at.split("T")[0]} </p>
                                    </a>
                                </Grid2>
                                <hr/>
                            </div>
                        ))}
                    </Grid2>
                    <Pagination count={pageCount} color="primary" onChange={handleChange}/>
                </Grid2>
            </Grid2>
            
            
        </div>
    )
}

export default HomePage
