import React from "react";
import  { Redirect } from 'react-router-dom'
import EventBus from 'eventing-bus';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from "reactstrap";
import SendViaEmail from "./sendViaEmail"
import ShareViaWhatsapp from "./shareViaWhatsapp"
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Videos from "../Videos/Videos.js"
import ReactPlayer from 'react-player';
import TimePicker from 'rc-time-picker';
import "../Style.css"
import 'rc-time-picker/assets/index.css';
const showSecond = true;
const str = showSecond ? 'HH:mm:ss' : 'HH:mm';

var request = require('request');
const url = "http://localhost:5000"


class Clip extends React.Component {

  constructor(){
    super();
    this.state={
      video:'',
      dropdownOpen: false,
      videoName:'',
      duration:1,
      startTime:'',
      clippedvideo:false,
      isClipped:false,
      sendViaEmail:true,
      sendViaWhatsapp:true
    }
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  componentWillMount(){
    this.getVideo()
  }
  getVideo=()=>{
    console.log("thi.state :: ", this.state);
    EventBus.publish("showLoading");
    var options = {
      method: 'POST',
      url: url + '/getvideos',
      headers: { },
      form:{
        videoName:this.props.match.params.name,
        timestamp : parseInt(this.props.match.params.timstamp)
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
        console.log("getvideo clip body :: ", body);
        var videoName=body.result['videoName'].split(".")
        var videoDetail={
          videoName: videoName[0],
          timeStamp : body.result['timestamp']
        }
        this.setState({video:body.result})
        this.setState({videoName:videoName[0].toUpperCase()})
      }
    });
  }

  onChange=(value)=>{
    console.log("onchange :: ", value && value.format(str));

    this.setState({startTime:value && value.format(str)})

  }
  handleDurationChange=(e)=>{
    console.log("e ", e);
    if(e.target.value<=0)
    {
      console.log("no change");
    }
    else {
      this.setState({duration:e.target.value})
    }

  }

  forceDownload=(link)=>{
    console.log("Download image clicked ", link);
    var url = this.imagePath;
    var fileName = 'video.mp4';
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
      link.innerText="Download Video";
    }
    xhr.send();
  }

  handleWhatsapp=()=>{
    this.setState({sendViaWhatsapp:false})
  }

  handleEmailForm=()=>{
    this.setState({sendViaEmail:false})
  }

  handleClip=()=>{
    EventBus.publish("showLoading");
    var options = {
      method: 'POST',
      url: url + '/getClip',
      headers: { },
      form:{
        videoName:this.props.match.params.name,
        start:this.state.startTime,
        end:this.state.duration
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
        EventBus.publish("stopLoading");
        console.log("clip Response :: ", body);
        this.setState({isClipped:true})
        this.setState({clippedvideo:body.result})
        // EventBus.publish("stopLoading");

      }
    });
  }

render() {
  var nameSplit=''
  if(this.state.clippedvideo)
  {
    nameSplit=this.state.clippedvideo;
  }

  if(!this.state.sendViaEmail)
  {
    return <SendViaEmail imageName={nameSplit}/>
  }
  else if(!this.state.sendViaWhatsapp) {
    return <ShareViaWhatsapp imageName={nameSplit}/>
  }
  else if(this.state.isClipped)
  {
    return (
      <div className="content">
        <div className="col-lg-12 col-md-6 col-sm-12" style={{ marginBottom: "15px"}}>
          <div>
            <h4 style={{marginBottom:"5px"}}>{this.state.videoName} News Clip</h4>
          </div>
          <div>
          <ReactPlayer
            width="100%"
            height="100%"
            url={url+this.state.clippedvideo}
            playing
            controls={true}
            volume={null}
            muted
            />
          </div>
        </div>
        <div className="ShareBtnDiv">
          <div style={{width:"80%", display:"flex", flexDirection:"row", justifyContent:"center"}}>
            <Button
              className='sharebtn '
              onClick={()=>this.forceDownload(this)}>
              <img className="DownloadBtnLogo" src='/download.png' />
              Download Image
            </Button>
            <Button
              className='whatsappsharebtn'
              onClick={this.handleWhatsapp}>
              <img className="DownloadBtnLogo" src='/whatsapp.png' />
              Share via WhatsApp
            </Button>

             <Button
               className="sharebtn"
               onClick={this.handleEmailForm}>
               <img className="DownloadBtnLogo" src='/email.png'
             />
               Share via E-Mail
             </Button>
           </div>
       </div>
      </div>
    )
  }
  else
    {return (
      <div className="content">
        <div key={this.state._id} className="col-lg-12 col-md-6 col-sm-12" style={{ marginBottom: "15px"}}>
          <div>
            <h4 style={{marginBottom:"5px"}}>{this.state.videoName} News</h4>
          </div>
          <div>
          <ReactPlayer
            width="100%"
            height="100%"
            url={url+this.state.video["path"]}
            playing
            controls={true}
            volume={null}
            muted
            />
          </div>
          <div style={{margin:"16px", margin:"10px", display:"flex"}}>
            <div>
              <h4>Start time</h4>
              <TimePicker
                style={{ width: 100 }}
                showSecond={true}
                className="xxx"
                onChange={this.onChange}
                placeholder="HH:MM:SS"
              />
            </div>
            <div>
              <h4>Duration</h4>
              <input type="number" value={this.state.duration} name="duration" style={{padding:"5px",background:"white", width:"70px",height:"28px", border:"1px solid lightgray", borderRadius:"4px"}} onChange={(value)=>this.handleDurationChange(value)} />
            </div>
          </div>
          <div className="col-lg-3">
            <Button className="defaultBtn" onClick={this.handleClip}>Clip</Button>
          </div>
        </div>
      </div>
    );}
  }
}

export default Clip;
