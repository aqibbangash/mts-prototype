import React from "react";
import  { Redirect, Link } from 'react-router-dom'
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
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Fade,
  InputGroup
} from "reactstrap";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ReactPlayer from 'react-player';

import "../Style.css"

var request = require('request');
const url = "http://localhost:5000"

class Videos extends React.Component {
  constructor(){
    super()
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      fadeIn: false,
      videoList:"",
      dropdownCheck:'',
      getTickerUrl:''
    };
  }

  componentDidMount(){
    this.getAllVideos()
  }

  getAllVideos=()=>{

  }

  componentWillMount(){
    EventBus.on("reRender", this.reRender)
  }

  reRender=(e)=>{
    this.setState({videoList:e})
  }

  toggle(e) {
    console.log(e);
    this.setState({dropdownCheck:e})
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }


    handleClip=(n)=>{
      var url="/home/clip-video/"+n.videoName+"/"+n.timeStamp
      window.location.href=(url)
      console.log("handleClip");
    }

    handleOptionClick=(e)=>{
      console.log("button option clicked :: ", e);
    }

    handleVideo=(n)=>
    {
      EventBus.publish("showLoading");
      var getTickerUrl="/home/tickers/"+n.videoName+"/"+n.timeStamp
      console.log("**** getTickerUrl :: ", getTickerUrl);
      window.location.href=getTickerUrl
      this.setState({getTickerUrl:getTickerUrl})
    }

    handleTranscript=(n)=>
    {
      EventBus.publish("showLoading");
      console.log("transcript button clicked ::", n );
      var url="/home/view-transcripts/"+n.videoName
      window.location.href=(url)

    }

render() {
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
      var body=JSON.parse(response.body)
      console.log("getVideosUrls body :: ", body);
      var videoDetail=[]
      var videoList=[]
      body.result.forEach((i,idx,x)=>{
        var videoName=i['videoName'].split(".")
        videoDetail[idx]={
          videoName: videoName[0],
          timeStamp : i['timestamp']
        }
        videoList.push(

          <div key={i._id} className="col-lg-4 col-md-6 col-sm-12" style={{ marginBottom: "15px"}}>
            <div>
              <h4 style={{marginBottom:"5px"}}>{videoName[0].toUpperCase()} News</h4>
            </div>
            <div>
            <ReactPlayer
              width="100%"
              height="100%"
              url={url+i["path"]}
              playing
              controls={true}
              volume={null}
              muted
              />
            </div>
            <div className="col-lg-12">
              <Dropdown isOpen={this.state.dropdownOpen && this.state.dropdownCheck==i._id} toggle={()=>this.toggle(i._id)}>
                <DropdownToggle className="VideosDropOptions" caret>
                  Options
                </DropdownToggle>
                <DropdownMenu className="col-lg-12" style={{border:"1px solid lightgray"}}>
                    <DropdownItem className="cursorPointer colorBlack" onClick={()=>this.handleVideo(videoDetail[idx]) } >Get Tickers</DropdownItem>

                  <DropdownItem divider />
                  <DropdownItem className="cursorPointer colorBlack" onClick={()=>this.handleTranscript(videoDetail[idx]) }>View Transcripts</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem className="cursorPointer colorBlack" onClick={()=>this.handleLogoDetect(videoDetail[idx]) }>Detect Logo</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem className="cursorPointer colorBlack" onClick={()=>this.handleClip(videoDetail[idx]) }>Clip</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

        )
      })
      EventBus.publish("reRender", videoList)
    }
  })

  return (
      <div className="content">
        <div className="row">
          {this.state.videoList}

        </div>
      </div>
    );
  }
}

export default Videos;
