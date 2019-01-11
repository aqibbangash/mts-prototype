import React, { Component } from 'react';
import ReactPlayer from 'react-player'
// import { Player, ControlBar } from 'video-react';
// import ReactJWPlayer from 'react-jw-player';
import { Button } from 'react-bootstrap';
import Screenshots from'./Screenshots.js'
import Transcript from'./Transcript.js'
import './Home.css'

var request = require("request");
const url = "http://localhost:5000/"
// const url = "https://mts-prototype.herokuapp.com/"

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
        <div>
          <p className="videoTitle">Ary news</p>
        </div>
        <div className="videoStyle" onClick={this.handleVideo}>
          <ReactPlayer
            width="99.9%"
            height="100%"
            url={url+"uploads/videoplayback.mp4"}
            playing
            controls={true}
            volume={null}
            muted
            />
        </div>
        <div>
          <p className="videoClickDescription">Click on video to view sorted News Tickers</p>
          <Button bsStyle="primary" onClick={this.handleTranscript}>View Transcripts</Button>
        </div>
      </div>



    </div>
     this.setState((state, props) => {
       return {counter: 0 + props.step};
     });
   }

   handleTranscript=()=>
   {
     console.log("transcript button clicked ::");

     var options = {
       method: 'POST',
       url: url + 'createTranscription',
       headers: { },
       // form:{screenshots:imageArray},
       json: true
     };

     request(options, (error, response, body) =>
     {
       if (error)
       {
         console.log("Error", error);
       }
       else
       {
         console.log("Response :: ", body.transcription);

         this.HomeContent=<Transcript content={body.transcription} />

         this.setState((state, props) => {
           return {counter: 0 + props.step};
         });
       }
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
