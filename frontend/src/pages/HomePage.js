import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const HomePage = () => {

    let { tweets } = useContext(AuthContext)
    
    console.log('tweet: ', tweets)

    return (
        <div>
            <h1> Below tweets are received from the server and updated in real time </h1>
            {tweets.map((tweet) => (
                <div key={tweet.id}>
                    <p> {tweet.username} says {tweet.text} </p>
                    <a href={tweet.link}> Go to tweet </a>
                    <p> Posted on {tweet.created_at}</p>
                    {tweet.media_type === 'photo'
                    ?   <div>
                            <img src={tweet.media} width="320" height="240" alt='tweet media'/>
                        </div>
                    :   <div>    
                            <video width="320" height="240" controls>
                                <source src={tweet.media} type="video/mp4" />
                                Your browser does not support this video tag.
                            </video>
                        </div>
                    }
                    <hr/>
                    <br/><br/>
                </div>
            ))}
        </div>
    )
}

export default HomePage
