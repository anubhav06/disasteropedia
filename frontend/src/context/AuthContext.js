import { createContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export default AuthContext;


export const AuthProvider = ({children}) => {

    let [loading, setLoading] = useState(true)
    let [tweets, setTweets] = useState([])

    let [pageNo, setPageNo] = useState(1)
    let [pageCount, setPageCount] = useState(0)

    let [disasterType, setDisasterType] = useState([])
    let [disasterArea, setDisasterArea] = useState([])

    let [queryState, setQueryState] = useState('All')

    // Context data for AuthContext so that it can be used in other pages
    let contextData = {
        tweets: tweets,
        pageCount: pageCount,
        disasterType: disasterType,
        disasterArea: disasterArea,
        queryState: queryState,
        setPageNo: setPageNo,
        setTweets: setTweets,
        setPageCount: setPageCount,
        setDisasterType: setDisasterType,
        setDisasterArea: setDisasterArea,
        setQueryState: setQueryState,
    }


    // To update the access tokens after every few time interval
    useEffect(()=> {

        // --------------------------- updateToken method  ----------------------------------------
        let updateTweet = async ()=> {
            // Make a post request to the api to update the tweets
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/get-tweet/${queryState}/?page=${pageNo}`, {
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

    }, [loading, pageNo, queryState])

    return(
        <AuthContext.Provider value={contextData} >
            {/* Render children components only after AuthContext loading is complete */}
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
