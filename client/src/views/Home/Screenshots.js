import React, { Component } from 'react';
// import { Button } from 'react-bootstrap';


import './screenshots.css'

class Screenshots extends Component {

  constructor()
  {
    super();
  }


  componentDidMount = () =>
  {
    console.log(" screenshots did mount ::");
     // this.setState((state, props) => {
     //   return {counter: 0 + props.step};
     // });
   }




  render() {
    console.log("render");

    return (

      <div className="screenshotPage">
        Screenshots here

      </div>

    )
  }
}

export default Screenshots;
