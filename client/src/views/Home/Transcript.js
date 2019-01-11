import React, { Component } from 'react';
// import ReactPlayer from 'react-player'
// import { Player, ControlBar } from 'video-react';
// import ReactJWPlayer from 'react-jw-player';
// import { Button } from 'react-bootstrap';
// import Screenshots from'./Screenshots.js'
import './Transcript.css'

// var request = require("request");
const url = "http://localhost:5000/"
//const url = "https://mts-prototype.herokuapp.com/"

class Transcript extends Component {

  render() {
    console.log("render");

    return (
      <div className="transcriptBody">
        <p className="transcriptContent">Transcript here</p>
      </div>
    )
  }
}

export default Transcript;
