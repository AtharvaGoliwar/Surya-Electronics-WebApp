import React from 'react'
import Sidebar from './sidebar'
import  {JsonToTable}  from 'react-json-to-table';
import data from "../data/data.json"
import "./home.css"

function Home() {
  return (
    <div style={{display:"flex",backgroundColor:"white" , marginLeft:200}}>
     <Sidebar /> 
     <div>

     <div className='user-management-container'>
     {/* <h1> HOME PAGE </h1> */}
     </div>
     <div style={{color:"black",width:"100vw"}}>
      <h1>Customer Records</h1>
      <JsonToTable json={data} />
    </div>
     </div>
    </div>
  )
}

export default Home
