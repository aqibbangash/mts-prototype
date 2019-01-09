import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';

// import { Button } from 'react-bootstrap';


import './screenshots.css'
const url = "http://localhost:5000"
const IMAGES =
[{
   src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
   thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
   thumbnailWidth: 320,
   thumbnailHeight: 174,
   // isSelected: true,
   caption: "After Rain (Jeshu John - designerspics.com)"
}]
class Screenshots extends Component {

  // constructor()
  // {
  //   super();
  // }



  componentDidMount = () =>
  {
    console.log(" screenshots did mount ::");
    console.log("screenshots recieved ::", this.props.screenshots.result);

    var images=[];
    // this.props.screenshots.result.screenshots.forEach(function(i,idx,x){
    //   console.log("images url :: ",i);
    // })
    // console.log("url :: ", url+images);
    // console.log("images :: ", images);
     // this.setState((state, props) => {
     //   return {counter: 0 + props.step};
     // });
   }




  render() {
    console.log("render");

    return (

      <div className="screenshotPage">
       <Gallery images={IMAGES}/>

      </div>

    )
  }
}

export default Screenshots;
