import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { Player, ControlBar } from 'video-react';
import ReactJWPlayer from 'react-jw-player';
// import { Button } from 'react-bootstrap';


import './Home.css'

class Home extends Component {

  constructor()
  {
    super();


    this.play = this.play.bind(this);

  }

  play =()=>
  {
    console.log("player played");
    // this.refs.player.play();
    this.refs.player1.play();
    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });
  }

  componentDidMount = () =>
  {
    console.log("did mount ::");
    // this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
     // this.play();
     this.refs.player1.play();
     this.setState((state, props) => {
       return {counter: 0 + props.step};
     });
   }



  render() {
    console.log("render");

    return (

      <div style={{width:"100%", height:"400px",border:"1px solid", display:"flex", justifyContent:"center", padding:"100px 0px 100px 0px"}}>

        <div style={{width:"39%", marginRight:"10px", background:"red"}}>

          <Player ref="player1"
            src="https://s3.amazonaws.com/codecademy-content/courses/React/react_video-slow.mp4"
          >
            <ControlBar autoHide={true} />
          </Player>

        </div>

        <div style={{width:"39%", background:"red"}}>

          <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' playing />

        </div>

      </div>

    )
  }
}

export default Home;


// <div style={{width:"30%"}}>
//   <ReactPlayer url='https://www.youtube.com/watch?v=H3p99E4Hw9Q&list=RDH3p99E4Hw9Q&start_radio=1'
//
//     playing={true}
//     volume
//     muted={true}
//     width="100%"
//     height="100%"
//   />
// </div>
//
// <div style={{width:"30%", marginLeft:"10px"}}>
//   <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
//     playing={true}
//     volume
//     muted={true}
//     width="100%"
//     height="100%"
//   />
// </div>
