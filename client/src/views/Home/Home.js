import React, { Component } from 'react';
import ReactPlayer from 'react-player'
// import { Player, ControlBar } from 'video-react';
// import ReactJWPlayer from 'react-jw-player';
// import { Button } from 'react-bootstrap';
import Screenshots from'./Screenshots.js'
import './Home.css'

var request = require("request");
// const url = "http://localhost:5000/"
const url = "https://mts-prototype.herokuapp.com/"

class Home extends Component {

  // constructor()
  // {
  //   super();
  // }

  componentDidMount = () =>
  {
    console.log("did mount ::");
    this.screenshotsList=''
    this.HomeContent=
    <div className="HomeStyle">

      <div className="videoGrid" >
        <div style={{height:"10%"}}>
          <p className="videoTitle">Ary news</p>
        </div>
        <div className="videoStyle" onClick={this.handleVideo}>
          <ReactPlayer
            width="100%"
            height="100%"
            url={url+"uploads/file.mov"}
            playing
            controls={true}
            volume={null}
            muted
            />
        </div>
        <div style={{height:"10%"}}>
          <p style={{fontWeight:"bold"}}>Click on video to view sorted News Tickers</p>
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

     var options = {
       method: 'POST',
       url: url + 'getvideos',
       headers: { },
     };

     request(options, (error, response, body) =>
     {
       if (error)
       {
         console.log("Error", error);
       }
       else
       {
         console.log("Response body :: ", JSON.parse(body));
         this.screenshotsList=JSON.parse(body)

         this.HomeContent=<Screenshots  screenshots={this.screenshotsList}/>

           this.setState((state, props) => {
             return {counter: 0 + props.step};
           });

       }
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
