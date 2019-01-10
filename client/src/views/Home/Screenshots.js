import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';
import { Button } from 'react-bootstrap';

import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

import './screenshots.css'

var request = require("request");
// const url = "http://localhost:5000"
const url = "https://mts-prototype.herokuapp.com"

var imageArray=[]

class Screenshots extends Component {

  constructor(props){
        super(props);

        this.state = {
            imgSelect:false
        };

        this.onSelectImage = this.onSelectImage.bind(this);
    }

   componentDidMount()
   {

     console.log("base url", url);
     var images=[]
     this.props.screenshots.result.screenshots.forEach((i,idx,x)=>{
       // console.log("images url :: ",i);
       images.push({
          src: url+i,
          thumbnail: url+i,
          thumbnailWidth: 2300,
          thumbnailHeight: 200,
          showLightboxThumbnails:true,
          caption: "ARY News",

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
      if(imageArray.length<6)
      {
        image.isSelected = true;

        imageArray[imageArray.length] = image.src.replace(url+"/","");
        console.log("added to array");
        console.log("added :: ", imageArray);
      }
      else {
        alert('only 6 images can be selected');
      }

    }

    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });


     // console.log( "length : ",imageArray.length);
     // console.log("array :: ", imageArray);
   }

   onCombine=()=>
   {
     var title= "title";
     console.log("combined ", imageArray);
    //  this.bottomContent=
    //  <div>
    //    <div className="combinedImg">
    //      // <img src='https://www.google.com/imgres?imgurl=https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/New_Logo_Gmail.svg/1014px-New_Logo_Gmail.svg.png&imgrefurl=https://commons.wikimedia.org/wiki/File:New_Logo_Gmail.svg&h=768&w=1014&tbnid=HzHY2q6zZ1IPCM:&q=gmail&tbnh=114&tbnw=151&usg=AI4_-kTzLjE2netxgzO2BA9A_Xei2Q0Q9g&vet=1&docid=VU16gnGLPAljTM&itg=1&sa=X&ved=2ahUKEwjBnpPq0eLfAhXITxUIHUpSC6UQ_B0wFXoECAUQEA' />
    //    </div>
    //    <div className="ShareBtnDiv">
    //        <WhatsappShareButton
    //           url="http://github.com"
    //           title={title}
    //           separator=":: "
    //           className="WhatsappBtn">
    //             <WhatsappIcon size={32} round />
    //             <p className="whatsAppTitle">Share via WhatsApp</p>
    //
    //         </WhatsappShareButton>
    //
    //         <EmailShareButton
    //           url="www.something.com"
    //           subject={title}
    //           body="body"
    //           className="EmailBtn">
    //
    //           <EmailIcon size={32} round />
    //           <p className="emailTitle">Share via E-Mail</p>
    //
    //         </EmailShareButton>
    //   </div>
    // </div>

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
         // this.bottomContent=<div>{<img src=''>}</div>

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
