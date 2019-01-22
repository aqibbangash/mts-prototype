import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Button } from 'react-bootstrap';
import Transcript from'./Transcript.js'
import Screenshots from'./Screenshots.js'
import Home from'./Home.js'
import EventBus from 'eventing-bus';
import './Videos.css'

var request = require("request");
const url = "http://localhost:5000"
// const url = "https://mts-prototype.herokuapp.com"

class Videos extends Component {

  constructor(props){
    super(props);
      this.state={
        value:'00' ,
      }
        this.handleClipping = this.handleClipping.bind(this);
    }

  componentDidMount()
  {

    console.log(" videos did mount ::");
    this.start=''
    this.end=''
    this.hh=''
    this.mm=''
    this.ss=''
    this.HomeContent=''
    this.screen=''
    this.TickerLimit=''
    this.SetTickerBtn=''
    this.screenshotsList=''
    this.VideosList=[]
    this.GetVideoResponse=''
    this.videoDetail=[]
    var options = {
      method: 'POST',
      url: url + '/getVideosUrls',
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
        this.GetVideoResponse=JSON.parse(body)
        console.log("Response :: ", this.GetVideoResponse);

        this.GetVideoResponse.result.forEach((i,idx,x)=>{
          var videoName=i['videoName'].split(".")
          this.videoDetail[idx]={
            videoName: videoName[0],
            timeStamp : i['timestamp']
          }
          this.VideosList.push(<div className="videoGrid" >
              <div>
                <p className="videoTitle">{videoName[0].toUpperCase()} News</p>
              </div>
              <div className="videoStyle">
                <ReactPlayer
                  width="99.9%"
                  height="100%"
                  url={url+i["path"]}
                  playing
                  controls={true}
                  volume={null}
                  muted
                  />
              </div>
              <div className="ClippingDiv">
                <div className="HHMMSS">

                  <label className="clippingStart"> Start<br/>
                    <input name="HH" onChange={this.handleClipping} placeholder="HH" className="clippingStartText" type="number" />
                    :
                    <input name="MM" onChange={this.handleClipping} placeholder="MM" className="clippingStartText" type="number" />
                    :
                    <input name="SS" onChange={this.handleClipping} placeholder="SS" className="clippingStartText" type="number" />
                  </label>

                </div>
                <div className="durationDiv">
                  <label className="clippingEnd"> Duration
                    <input name="Duration" onChange={this.handleClipping} placeholder="SS" className="clippingEndText" type="number" />
                  </label>
                </div>
                <Button className="ClipBtn" bsStyle="primary" onClick={()=>this.handleClip(this.videoDetail[idx])}>Clip</Button>
              </div>
              <div >

                <Button bsStyle="success" className='newsTickerBtn' onClick={()=>this.handleVideo(this.videoDetail[idx])}>Get Tickers</Button>
                <Button bsStyle="danger" className='transcriptionBtn' onClick={()=>this.handleTranscript(this.videoDetail[idx])} title="View Transcripts">View Transcripts</Button>
              </div>
            </div>)
        })

          this.setState((state, props) => {
            return {counter: 0 + props.step};
          });
      }
    });

  }

  handleClipping=(e)=>
  {
    console.log("chnaging value for ",e.target.name, " to ",e.target.value  )
    this.setState({ value: e.target.value });

    if(e.target.name =="HH" )
    {
      this.hh=e.target.value
    }
    else if(e.target.name =="MM" )
    {
      this.mm=e.target.value
    }
    else if(e.target.name =="SS" )
    {
      this.ss=e.target.value
    }
    else if(e.target.name="Duration")
    {
      this.end=e.target.value
    }
    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });
  }

  handleClip=(e)=>
  {
    console.log("clip pressed")
    this.start=this.hh+":"+this.mm+":"+this.ss
    console.log("Start :: ", this.start)
    console.log("End :: ", this.end)
    console.log("VideoName :: ", e.videoName)

    var options = {
      method: 'POST',
      url: url + '/getClip',
      headers: { },
      form:{
        videoName:e.videoName,
        start:this.start,
        end:this.end
      },
      json: true
    };
    console.log("clip options :: ", options )
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
      url: url + '/createTranscription',
      headers: { },
      form:{
        videoName:n.videoName
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


    var options = {
      method: 'POST',
      url: url + '/getvideos',
      headers: { },
      form:{
        videoName:n.videoName,
        timestamp : n.timeStamp
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

        {this.VideosList}

      </div>
    )
  }
}

export default Videos;
