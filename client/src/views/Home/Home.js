import React, { Component } from 'react';
import ReactPlayer from 'react-player'
// import {  NavItem, Nav, NavDropdown,MenuItem, Navbar, Image  } from 'react-bootstrap';


// import './footer.css'

class Home extends Component {

  render() {
    return (

      <div style={{width:"100%", height:"400px",border:"1px solid", display:"flex", justifyContent:"center", padding:"100px 0px 100px 0px"}}>

        <div style={{width:"30%", marginRight:"10px"}}>
          <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
            playing={true}
            volume
            muted={true}
            width="100%"
            height="100%"
          />
        </div>

        <div style={{width:"30%"}}>
          <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
            playing={true}
            volume
            muted={true}
            width="100%"
            height="100%"
          />
        </div>

        <div style={{width:"30%", marginLeft:"10px"}}>
          <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
            playing={true}
            volume
            muted={true}
            width="100%"
            height="100%"
          />
        </div>

      </div>

    )
  }
}

export default Home;
