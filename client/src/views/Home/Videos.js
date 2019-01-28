import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { Button,Glyphicon, glyph, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Transcript from'./Transcript.js'
import Screenshots from'./Screenshots.js'
import Home from'./Home.js'
import EventBus from 'eventing-bus';
import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

import './Videos.css'

var request = require("request");
const url = "http://localhost:5000"
// const url = "https://mts-prototype.herokuapp.com"

class Videos extends Component {

  constructor(props){
    super(props);
      this.state={
        value:'00',
        WhatsAppValue:''
      }
        this.handleChange = this.handleChange.bind(this);
        this.handleClipping = this.handleClipping.bind(this);
    }

  componentDidMount()
  {

    console.log(" videos did mount ::");
    this.recipent=''
    this.EmailBody=''
    this.EmailSubject=''
    this.videoName=''
    this.start=''
    this.end=''
    this.hh=''
    this.mm=''
    this.ss=''
    this.videoPath=''
    this.HomeContent=''
    this.screen=''
    this.TickerLimit=''
    this.SetTickerBtn=''
    this.screenshotsList=''
    this.VideosList=[]
    this.GetVideoResponse=''
    this.videoDetail=[]
    EventBus.publish("showLoading");
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
        EventBus.publish("stopLoading");
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
              <div className="BtnDiv">

                <Button bsStyle="success" className='newsTickerBtn' onClick={()=>this.handleVideo(this.videoDetail[idx])}>Get Tickers</Button>
                <Button bsStyle="danger" className='transcriptionBtn' onClick={()=>this.handleTranscript(this.videoDetail[idx])} title="View Transcripts">View Transcripts</Button>
                <Button bsStyle="info" className='LogoDetectBtn' onClick={()=>this.handleLogoDetect(this.videoDetail[idx])}>Detect Logo Change</Button>
              </div>
            </div>)
        })

          this.setState((state, props) => {
            return {counter: 0 + props.step};
          });
      }
    });

  }

  handleLogoDetect=(e)=>
  {
    EventBus.publish("showLoading");
    console.log("video detail :: ",e);

    var options = {
      method: 'POST',
      url: url + '/checkLogoChange',
      headers: { },
      form:{
        videoName:e.videoName,
      },
      json: true
    };
    console.log("Options :: ", options);

    request(options, (error, response, body) =>
    {

      EventBus.publish("stopLoading");
      if (error)
      {
        console.log("Error", error);
      }
      else
      {
        console.log("Response", response)

      }
    })


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

  handleChange(e) {
      this.setState({ value: e.target.value });
      if(e.target.name=='email')
      {
        this.recipent=e.target.value
      }
      else if (e.target.name=='subject')
      {
        this.subject=e.target.value
      }
      else if (e.target.name=='body')
      {
        this.body=e.target.value
      }
      else if (e.target.name =='WhatsAppNumber')
      {
        this.setState({ WhatsAppValue: e.target.value });
      }

  }

  forceDownload=(link)=>{
    console.log("Download Video clicked ", link);
    var url = this.videoPath;
    var fileName = 'Video.mp4';
    link.innerText = "Working...";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
      var urlCreator = window.URL || window.webkitURL;
      var imageUrl = urlCreator.createObjectURL(this.response);
      var tag = document.createElement('a');
      tag.href = imageUrl;
      tag.download = fileName;
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
      link.innerText="Download Vidoe";
    }
    xhr.send();
  }

  handleEmailForm=()=>
  {
    console.log("send Email button clicked");
    this.showEmail=true;

    this.VideosList=<div className="emailModal">
      <div className="EmailModalBody">
        <p className="emailLabel">Send via Email</p>
        <FormGroup className="EmailField">

          <FormControl
            type="email"
            name='email'
            placeholder="Enter Email"
            onChange={this.handleChange}
          />
        </FormGroup>

        <FormGroup className="EmailField">

          <FormControl
            type="text"
            name='subject'
            placeholder="Subject"
            onChange={this.handleChange}
          />
        </FormGroup>

        <FormGroup className="EmailBody">

          <FormControl
            style={{height:"100px"}}
            componentClass="textarea"
            placeholder="Body"
            name='body'
            onChange={this.handleChange}
          />
        </FormGroup>

        <Button bsStyle="success" onClick={this.sendEmail} className="EmailSendBtn">Send</Button>
      </div>
    </div>

    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });
  }

  sendEmail=()=>
  {
    EventBus.publish("showLoading");
    console.log("email sent !");

    console.log("Recipent :: ", this.recipent);
    console.log("Suject :: ", this.subject);
    console.log("Body  :: ", this.body);
    console.log("Video Name :: ", this.videoName);

    var options = {
      method: 'GET',
      url: url + '/sendVideoEmail/'+this.recipent+"/"+this.subject+"/"+this.body+"/"+this.videoName,
      headers: { },
      json: true
    };
    console.log("Options :: ", options);

    request(options, (error, response, body) =>
    {

      EventBus.publish("stopLoading");
      if (error)
      {
        console.log("Error", error);
      }
      else
      {
        console.log("Response", response)
        if(response.statusCode==200)
        {
          alert("E-Mail sent!")
        }
        // this.componentDidMount();
      }
    })

  }


  handleClip=(e)=>
  {
    EventBus.publish("showLoading");
    console.log("clip pressed")
    this.start=this.hh+":"+this.mm+":"+this.ss
    console.log("Start :: ", this.start)
    console.log("End :: ", this.end)
    this.videoName=e.videoName
    console.log("VideoName :: ", this.videoName)

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
        EventBus.publish("stopLoading");
        this.videoPath=url+body.result
        console.log("Video Path :: ", this.videoPath);
        this.VideosList=
        <div style={{height:"700px", width:"100%"}}>
        <div className="videoStyle">
          <ReactPlayer
            width="99.9%"
            height="100%"
            url={url+body.result}
            playing
            controls={true}
            volume={null}
            muted
            />
            <div className="ShareBtnDiv">

              <Button bsStyle='primary' className='DownloadBtn' onClick={()=>this.forceDownload(this)}><img className="DownloadBtnLogo" src='./download.png' />Download Video</Button>
              <Button className='WhatsappBtn' onClick={()=>this.handleWhatsapp()}><img className="DownloadBtnLogo" src='./whatsapp.png' />Share via WhatsApp</Button>
                {/*<WhatsappShareButton
                   url={this.videoPath}

                   className="WhatsappBtn">
                     <WhatsappIcon size={32} round />
                     <p className="whatsAppTitle">Share via WhatsApp</p>

                 </WhatsappShareButton>*/}

                 <Button className="EmailBtn" onClick={this.handleEmailForm}> <img className="DownloadBtnLogo" src='./email.png' /> Share via E-Mail</Button>

           </div>
        </div>
        </div>

        this.setState((state, props) => {
          return {counter: 0 + props.step};
        });
      }
    });
  }

  handleWhatsapp=()=>
  {
    console.log("WhatsApp clicked :: ");
    this.VideosList=
    <div className="WhatsAppBody">
      <div className="WhatsAppFormDiv">
        <FormGroup >
          <ControlLabel className="whatsAppTitle">Enter whatsApp Number</ControlLabel>
          <FormControl
            className="WhatsAppNumberField"
            type="text"
            name="WhatsAppNumber"
            onChange={this.handleChange}
          />
        </FormGroup>
        <Button bsStyle="primary" onClick={this.handleWhatsappSend} className="whatsAppSendbtn">Send</Button>
      </div>
    </div>

    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });
  }

  handleWhatsappSend=()=>
  {
    console.log("Number :: ", this.state.WhatsAppValue);
    console.log("sent!!");
    var WPUrl='https://web.whatsapp.com/send?phone='+this.state.WhatsAppValue+'&text='+this.videoPath;
    window.open(
      WPUrl,
      '_blank'
    );
    this.componentDidMount();
  }

  handleTranscript=(n)=>
  {
    EventBus.publish("showLoading");
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
        EventBus.publish("stopLoading");
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
    EventBus.publish("showLoading");
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
        EventBus.publish("stopLoading");
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
