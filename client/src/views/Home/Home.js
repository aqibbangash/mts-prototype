import React, { Component } from 'react';
import ReactPlayer from 'react-player'
// import { Player, ControlBar } from 'video-react';
// import ReactJWPlayer from 'react-jw-player';
// import { Button } from 'react-bootstrap';
import Screenshots from'./Screenshots.js'
import './Home.css'

class Home extends Component {

  constructor()
  {
    super();
  }

  componentDidMount = () =>
  {
    console.log("did mount ::");
    this.HomeContent=
    <div className="HomeStyle">

      <div className="videoGrid" >
        <div style={{height:"10%"}}>
          <p>Ary news</p>
        </div>
        <div className="videoStyle" onClick={this.handleVideo}>
          <ReactPlayer width="100%" height="100%"  url={"/video/vid1.mp4"} playing controls={true}/>
        </div>
        <div style={{height:"10%"}}>
          <p>Click on video to view </p>
        </div>
      </div>



    </div>
     this.setState((state, props) => {
       return {counter: 0 + props.step};
     });
   }

   handleVideo=()=>
   {
     console.log("video clicked ::");
     this.HomeContent=<Screenshots />

       this.setState((state, props) => {
         return {counter: 0 + props.step};
       });
   }


  render() {
    console.log("render");

    return (
      <div>
      {this.HomeContent}
      </div>
    )
  }
}

export default Home;


// <Player ref="player1"
//   src="https://s3.amazonaws.com/codecademy-content/courses/React/react_video-slow.mp4"
// >
//   <ControlBar autoHide={true} />
// </Player>
