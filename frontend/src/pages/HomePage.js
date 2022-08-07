import React, {useState, useEffect}from 'react'

const HomePage = () => {

    let [data, setData] = useState([])

    useEffect(()=> {
        
        
        // To fetch all the restaurants
        let getData = async() =>{
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/data/`, {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                }
            })
            let data = await response.json()

            if(response.status === 200){
                setData(data)
            } else {
                console.log('SOME ERROR WHILE GETTING DATA')
            }
            
        }
        
        getData()

    }, [])

    
    console.log('data: ', data)
    return (
        <div>
            This is the home page!
            <p> Data recieved from backend: {data}  </p>
        </div>
    )
}

export default HomePage
