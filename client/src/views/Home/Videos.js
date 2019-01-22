import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Button } from 'react-bootstrap';
import Transcript from'./Transcript.js'
import Screenshots from'./Screenshots.js'
import Home from'./Home.js'
import EventBus from 'eventing-bus';
import './Videos.css'

var request = require("request");
const url = "http://localhost:5000/"
// const url = "https://mts-prototype.herokuapp.com/"

class Videos extends Component {

  componentDidMount()
  {

    console.log(" videos did mount ::");
    this.HomeContent=''
    this.screen=''
    this.TickerLimit=''
    this.SetTickerBtn=''
    this.screenshotsList=''

    var options = {
      method: 'POST',
      url: url + 'getVideosUrls',
      headers: { },
    };
    console.log("Get Videos :: ", options);
    request(options, (error, response, body) =>
    {
      if (error)
      {
        console.log("Error", error);
      }
      else
      {
        console.log("Response :: ", body);
      }
    });

  }

  handleTranscript=(n)=>
  {
    console.log("transcript button clicked ::", n );

    var options = {
      method: 'POST',
      url: url + 'createTranscription',
      headers: { },
      form:{
        videoName:n
      },
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
        EventBus.publish("HomeScreenView", this.HomeContent);
        this.setState((state, props) => {
          return {counter: 0 + props.step};
        });
      }
    });


  }

  handleVideo=(n)=>
  {
    console.log("video clicked ::", n);
    var timeStamp=''
    if(n=='ary')
    {
      timeStamp=15
    }
    else if(n=='bol')
    {
      timeStamp=30
    }
    else if(n=='ary')
    {
      timeStamp=40
    }

    var options = {
      method: 'POST',
      url: url + 'getvideos',
      headers: { },
      form:{
        videoName:n,
        timestamp : timeStamp
      },
      json:true
    };
    console.log("Get video Call options :: ", options);
    request(options, (error, response, body) =>
    {
      if (error)
      {
        console.log("Error", error);
      }
      else
      {
        console.log("Response body :: ", body);
        this.screenshotsList=body

        this.HomeContent=<Screenshots  screenshots={this.screenshotsList}/>
        EventBus.publish("HomeScreenView", this.HomeContent);
        // this.handleClose();
        this.setState((state, props) => {
          return {counter: 0 + props.step};
        });

      }
    });




  }

  render() {
    console.log(" video render");

    return (
      <div className="HomeStyle">

        <div className="videoGrid" >
          <div>
            <p className="videoTitle">ARY News</p>
          </div>
          <div className="videoStyle">
            <ReactPlayer
              width="99.9%"
              height="100%"
              url={url+"uploads/ary.mp4"}
              playing
              controls={true}
              volume={null}
              muted
              />
          </div>
          <div >
            <Button bsStyle="success" className='newsTickerBtn' onClick={()=>this.handleVideo('ary')}>Get Tickers</Button>
            <Button bsStyle="danger" className='transcriptionBtn' onClick={()=>this.handleTranscript('ary')} title="View Transcripts">View Transcripts</Button>
          </div>
        </div>


        <div className="videoGrid" >
          <div>
            <p className="videoTitle">BOL News</p>
          </div>
          <div className="videoStyle">
            <ReactPlayer
              width="99.9%"
              height="100%"
              url={url+"uploads/bol.mp4"}
              playing
              controls={true}
              volume={null}
              muted
              />
          </div>
          <div>
            <Button bsStyle="success" className='newsTickerBtn' onClick={()=>this.handleVideo('bol')}>Get Tickers</Button>
            <Button bsStyle="danger" className='transcriptionBtn' onClick={()=>this.handleTranscript('bol')} title="View Transcripts">View Transcripts</Button>
          </div>
        </div>

        <div className="videoGrid" >
          <div>
            <p className="videoTitle">AAP News</p>
          </div>
          <div className="videoStyle">
            <ReactPlayer
              id='ary'
              width="99.9%"
              height="100%"
              url={url+"uploads/aap.mp4"}
              playing
              controls={true}
              volume={null}
              muted
              />
          </div>
          <div>
            <Button bsStyle="success" className='newsTickerBtn' onClick={()=>this.handleVideo('aap')}>Get Tickers</Button>
            <Button bsStyle="danger" className='transcriptionBtn' onClick={()=>this.handleTranscript('aap')} title="View Transcripts">View Transcripts</Button>
          </div>
        </div>


      </div>
    )
  }
}

export default Videos;
