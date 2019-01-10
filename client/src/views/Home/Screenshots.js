import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';
import { Button } from 'react-bootstrap';

import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
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



  // componentDidMount = () =>
  // {
  //   console.log(" screenshots did mount ::");
  //   console.log("screenshots recieved ::", this.props.screenshots.result);
  //
  //    this.images=[];
  //
  //
  //
  //   // this.props.screenshots.result.screenshots.forEach(function(i,idx,x){
  //   //   console.log("images url :: ",i);
  //   // })
  //   // console.log("url :: ", url+images);
  //   // console.log("images :: ", images);
  //    // this.setState((state, props) => {
  //    //   return {counter: 0 + props.step};
  //    // });
  //  }

   componentDidMount()
   {

     console.log("base url", url);
     var images=[]
     // this.imgState="";
     // var imgSelect=this.imgState;
     // var handleImageSelect=this.handleImageSelect()
     this.props.screenshots.result.screenshots.forEach((i,idx,x)=>{
       // console.log("images url :: ",i);
       images.push({
          src: url+i,
          thumbnail: url+i,
          thumbnailWidth: 320,
          thumbnailHeight: 174,
          showLightboxThumbnails:true,
          // isSelected: this.state.imgSelect,
          caption: "ARY News"
       })
     })
     this.images=images

     this.bottomContent=<div><Button onClick={this.onCombine} bsStyle="primary" className="combineBtn">Combine</Button>
    <Gallery
      images={this.images}
      onSelectImage={this.onSelectImage}/>
    </div>

    this.setState((state, props) => {
         return {counter: 0 + props.step};
       });

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
     this.bottomContent=
     <div>
         <WhatsappShareButton
            url="http://github.com"
            title={title}
            separator=":: ">

              <WhatsappIcon size={32} round />

          </WhatsappShareButton>
    </div>
     // var options = {
     //   method: 'POST',
     //   url: url + '/combineTickers',
     //   headers: { },
     //   form:{screenshots:imageArray},
     //   json: true
     // };
     //
     // request(options, (error, response, body) =>
     // {
     //   if (error)
     //   {
     //     console.log("Error", error);
     //   }
     //   else
     //   {
     //     console.log("Response :: ", response);
     //     // this.bottomContent=<div>{<img src=''>}</div>
     //
           this.setState((state, props) => {
             return {counter: 0 + props.step};
           });
     //   }
     // });

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
