import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {

    let [loading, setLoading] = useState(true)
    let [tweets, setTweets] = useState([])


    // Context data for AuthContext so that it can be used in other pages
    let contextData = {
        tweets:tweets,
    }


    // To update the access tokens after every few time interval
    useEffect(()=> {

        // --------------------------- updateToken method  ----------------------------------------
        // To update the access token
        let updateTweet = async ()=> {

            // Make a post request to the api with the refresh token to update the access token
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-tweet/`, {
                method:'GET'
            })
            let data = await response.json()
            
            if (response.status === 200) {   
                setTweets(data)
            }else{
                console.log('ERROR: Getting tweet data from server')
            }

            if(loading){
                setLoading(false)
            }
        }
        // --------------------------- updateToken method end  ----------------------------------------


        if(loading){
            updateTweet()
        }

        let thirtySeconds = 1000 * 30

        let interval =  setInterval(()=> {
            updateTweet()
        }, thirtySeconds)
        // Clear the interval after firing preventing re-initializing every time, refer to docs for more details
        return ()=> clearInterval(interval)

    }, [loading])

    return(
        <AuthContext.Provider value={contextData} >
            {/* Render children components only after AuthContext loading is complete */}
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
