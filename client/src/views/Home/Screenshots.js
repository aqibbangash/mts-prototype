import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';
import { Button, Glyphicon, glyph, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

import './screenshots.css'

var request = require("request");
  const url = "http://localhost:5000"
// const url = "https://mts-prototype.herokuapp.com"

var imageArray=[]

class Screenshots extends Component {

  constructor(props){
    super(props);

    this.state = {
      imgSelect:false
    };

        this.onSelectImage = this.onSelectImage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

   componentDidMount()
   {
     this.imageName=''
     this.recipent=''
     this.showEmail=false;
     this.EmailBody=''
     this.EmailSubject=''
     this.imagePath=''
     imageArray=[]
     console.log("base url", url);
     var images=[];
     this.videoName=this.props.screenshots.result.videoName.toUpperCase();
     console.log("Video Name :: ", this.videoName);
     this.props.screenshots.result.screenshots.forEach((i,idx,x)=>{
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
     this.images=images

     this.bottomContent=<div>
       <Button onClick={this.onCombine} bsStyle="primary" className="combineBtn">Combine</Button>

        <Gallery
          images={this.images}
          onSelectImage={this.onSelectImage}
          thumbnailStyle={this.handlethumbnailStyle}
        />

    </div>

    this.setState((state, props) => {
      return {counter: 0 + props.step};
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
    // console.log("array :: ", imageArray);
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
    }

    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });


    // console.log( "length : ",imageArray.length);
    // console.log("array :: ", imageArray);
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
    var title= "title";
    console.log("combined ", imageArray);


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

  }

  sendEmail=()=>
  {
    console.log("email sent !");

    console.log("Recipent :: ", this.recipent);
    console.log("Suject :: ", this.subject);
    console.log("Body  :: ", this.body);
    var imageName= this.imageName.split('/');
    console.log("Image Name :: ", imageName[1]);

    var options = {
      method: 'GET',
      url: url + '/sendemail/'+this.recipent+"/"+this.subject+"/"+this.body+"/"+imageName[1],
      headers: { },
      json: true
    };
    console.log("Options :: ", options);
    request(options, (error, response, body) =>
    {
      if (error)
      {
        console.log("Error", error);
      }
      else
      {
        console.log("Response", response);

        this.componentDidMount();
      }
    })

  }

  handleEmailForm=()=>
  {
    console.log("send Email button clicked");
    this.showEmail=true;

    this.bottomContent=<div className="emailModal">
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

   onCombine=()=>
   {
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
         console.log("Response :: ", response);
         console.log("url :: ", url+"/"+body.image)
         this.imagePath=url+"/"+body.image
         this.imageName=body.image;
         console.log("url :: ", this.imagePath)
         // this.bottomContent=<div><img src={url+"/"+body.image}/></div>
          this.bottomContent=
          <div>
            <div className="combinedImg">
              <img src={url+"/"+body.image} />
            </div>
            <div className="ShareBtnDiv">

              <Button bsStyle='primary' className='DownloadBtn' onClick={()=>this.forceDownload(this)}><img className="DownloadBtnLogo" src='./download.png' />Download Image</Button>

                <WhatsappShareButton
                   url={url+"/"+body.image}

                   className="WhatsappBtn">
                     <WhatsappIcon size={32} round />
                     <p className="whatsAppTitle">Share via WhatsApp</p>

                 </WhatsappShareButton>

                 <Button className="EmailBtn" onClick={this.handleEmailForm}> <img className="DownloadBtnLogo" src='./email.png' /> Share via E-Mail</Button>

           </div>
         </div>
           this.setState((state, props) => {
             return {counter: 0 + props.step};
           });
       }
     });

   }

  render() {

    console.log("render");

    return (

      <div className="screenshotPage">

        {this.bottomContent}

      </div>

    )
  }
}

export default Screenshots;
