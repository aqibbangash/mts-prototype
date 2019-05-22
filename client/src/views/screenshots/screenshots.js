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
} from "reactstrap";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Videos from "../Videos/Videos.js"
import "../Style.css"
import Gallery from 'react-grid-gallery';
import SendViaEmail from "./sendViaEmail"
import ShareViaWhatsapp from "./shareViaWhatsapp"
var request = require('request');
const url = "http://localhost:5000"

var imageArray=[]
class Screenshots extends React.Component {

  componentDidMount(){
  }

  constructor(){
    super()
    this.state={
      imgSelect:false,
      WhatsAppValue:'',
      images:'',
      bottomContent:'',
      imageSelected:false,
      disableCombine:true,
      sendViaEmail:true,
      sendViaWhatsapp:true
    }

    this.onSelectImage = this.onSelectImage.bind(this);
    // this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount(){
    console.log("screenshot props recieved :: ", this.props.match.params.timstamp, this.props.match.params.name);
    this.getTickers()
  }

  getTickers=()=>{
    EventBus.publish("showLoading");
    console.log("thi.state :: ", this.state);
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
        console.log("getvideo tickers body :: ", body);
        var images=[]
        body.result.screenshots.forEach((i,idx,x)=>{
          // console.log("images url :: ",i);
          images.push({
             src: url+i,
             thumbnail: url+i,
             thumbnailWidth: 2300,
             thumbnailHeight: 200,
             showLightboxThumbnails:true,
             caption: this.videoName + " News",

          })
        })

        this.setState({images:images})

      }
    });
  }

  handlethumbnailStyle=()=>
  {
    return{
      height:"100%",
      width:"100%"
    }
  }

  onSelectImage= (index, image)=>
  {
    console.log("Array length", imageArray.length);

    var i=0
    var imgSrc=image.src.replace(url+"/","")
    if(image.isSelected)
    {
      console.log("true");

      image.isSelected = false;
      console.log("imgSrc :: ", imgSrc);

      imageArray.forEach((i,idx,x)=>{
        var index = imageArray.indexOf(i);
        if(i==imgSrc)
        {
          console.log("found",i);
          console.log("found on index :: ", idx);
          imageArray.splice(index, 1);
          console.log("removed :: ", imageArray);
            this.setState({disableCombine:true})
        }
        else
        {
          console.log("not found");
        }
      })


    }
    else
    {
      console.log("false");
      image.isSelected = true;
      imageArray[imageArray.length] = image.src.replace(url+"/","");
      console.log("added to array");
      console.log("added :: ", imageArray);
      this.setState({disableCombine:false})
    }

    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });
  }

  forceDownload=(link)=>{
    console.log("Download image clicked ", link);
    var url = this.imagePath;
    var fileName = 'image.jpg';
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
      link.innerText="Download Image";
    }
    xhr.send();
  }

  onCombine=()=>
  {
    var bottomContent=''
    EventBus.publish("showLoading");
    var title= "title";
    console.log("combined ", imageArray);


    var options = {
      method: 'POST',
      url: url + '/combineTickers',
      headers: { },
      form:{screenshots:imageArray},
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
        EventBus.publish("stopLoading");
        console.log("Response :: ", response);
        console.log("url :: ", url+"/"+body.image)
        this.imagePath=url+"/"+body.image
        this.imageName=body.image;
        console.log("url :: ", this.imagePath)
        // this.bottomContent=<div><img src={url+"/"+body.image}/></div>
         bottomContent=
         <div>
           <div className="combinedImg">
             <img src={url+"/"+body.image} />
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

        this.setState({imageShareView:bottomContent})
        this.setState({imageSelected:true})
      }
    });
  }

  handleEmailForm=()=>{
    this.setState({sendViaEmail:false})
  }

  handleWhatsapp=()=>{
    this.setState({sendViaWhatsapp:false})
  }

  goBack=()=>{
    this.setState({imageSelected:false})
  }

render() {
  if(!this.state.sendViaEmail)
  {
    return <SendViaEmail imageName={this.imageName}/>
  }
  else if(!this.state.sendViaWhatsapp) {
    return <ShareViaWhatsapp imageName={this.imageName}/>
  }
  else {
    return (
      <div className="content">
      {
        (this.state.imageSelected)
        ?<div>
          <div style={{width:"15%", marginBottom:"15px"}}>
            <Button onClick={this.goBack} className="infoBtn">Go back</Button>
          </div>
          {this.state.imageShareView}
          <div hidden={this.state.hideSendViaEmail} className="SendViaEmailDiv">

          </div>
        </div>
       :<div>
         <div style={{width:"15%", marginBottom:"15px"}}>
         <Button disabled={this.state.disableCombine} onClick={this.onCombine} className="infoBtn">Combine</Button>
         </div>
          <Gallery
            images={this.state.images}
            onSelectImage={this.onSelectImage}
            thumbnailStyle={this.handlethumbnailStyle}
          />
        </div>}
      </div>
    );
  }

  }
}

export default Screenshots;
