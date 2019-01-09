import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';

// import { Button } from 'react-bootstrap';


import './screenshots.css'

var request = require("request");
//const url = "http://localhost:5000"
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



  componentDidMount = () =>
  {
    console.log(" screenshots did mount ::");
    console.log("screenshots recieved ::", this.props.screenshots.result);

     this.images=[];



    // this.props.screenshots.result.screenshots.forEach(function(i,idx,x){
    //   console.log("images url :: ",i);
    // })
    // console.log("url :: ", url+images);
    // console.log("images :: ", images);
     // this.setState((state, props) => {
     //   return {counter: 0 + props.step};
     // });
   }

   componentWillMount()
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
          isSelected: this.state.imgSelect,
          caption: "ARY News"
       })
     })
     this.images=images

     this.bottomContent=<div><button onClick={this.onCombine} className="combineBtn">Combine</button>
    <Gallery
      images={this.images}
      onSelectImage={this.onSelectImage}/>
    </div>

   }

   onSelectImage= (index, image)=>
   {
     var imgLength=''

     imageArray[imageArray.length] = image.src.replace(url+"/","");
     console.log( "length : ",imageArray.length);
     console.log("images :: ", imageArray);
     // console.log("image index :: ", index);
     // console.log("image click :: ", image);
     // console.log("img property :: ", index.hasOwnProperty("isSelected") );
     // if(index.hasOwnProperty("isSelected"))
     // {
     //   console.log("true");
     //   this.setState({
     //        imgSelect: false
     //    })
     // }
     // else {
     //   console.log("false");
     //   this.setState({
     //        imgSelect: true
     //    })
     // }

   }

   onCombine=()=>
   {
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
