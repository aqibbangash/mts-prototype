import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { Button,Modal } from 'react-bootstrap';
import EventBus from 'eventing-bus';
import Videos from'./Videos.js';
import axios, { post } from 'axios'
// import FileInput from 'react-file-input';
import './Home.css'

var request = require("request");
  const url = "http://localhost:5000/"
// const url = "https://mts-prototype.herokuapp.com/"

class Home extends Component {

  constructor(props, context) {
    super(props, context);

    EventBus.on("showLoadingg", this.showLoadingg.bind(this));
    EventBus.on("stopLoadingg", this.stopLoadingg.bind(this));

    // this.handleShow = this.handleShow.bind(this);
    // this.handleClose = this.handleClose.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    //
    // this.state = {
    //   show: false
    // };
  }

  showLoadingg(msg){
    this.loadingg = true

    this.setState((state, props) => {
    return {counter: state.counter + props.step};
    })

  }

  stopLoadingg(msg){
    this.loadingg = false

    if (msg != undefined)
    {alert(msg)}

    this.setState((state, props) => {
    return {counter: state.counter + props.step};
    })
  }

  // handleClose() {
  //   console.log("modal closed!");
  //   this.setState({ show: false });
  // }

  // handleShow = (e) => {
  //   console.log("Modal show for :: ", e);
  //
  //   if(e=='ary')
  //   {
  //     this.SetTickerBtn=<Button bsStyle="primary" className='GetTickerBtn' onClick={()=>this.handleVideo('ary')} title="View News Tickers">Confirm</Button>
  //   }
  //   else if (e=='bol')
  //   {
  //     this.SetTickerBtn=<Button bsStyle="primary" className='GetTickerBtn' onClick={()=>this.handleVideo('bol')} title="View News Tickers">Confirm</Button>
  //   }
  //   else if (e=='aap')
  //   {
  //     this.SetTickerBtn=<Button bsStyle="primary" className='GetTickerBtn' onClick={()=>this.handleVideo('aap')} title="View News Tickers">Confirm</Button>
  //   }
  //   this.setState({ show: true });
  //
  //
  // }

  callbackHomeScreenView=(e)=>
  {
    console.log("Home view screen recieved");
    this.HomeContent=e;

    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });
  }

  componentDidMount = () =>
  {
    EventBus.on("HomeScreenView", this.callbackHomeScreenView.bind(this));
    this.TickerDisable=true;
    this.TickerLimit=''
    this.SetTickerBtn=''
    console.log("did mount ::");
    this.screenshotsList=''
    this.HomeContent=<Videos />
    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });
  }

  // handleChange = (e) => {
  //     this.setState({ value: e.target.value });
  //     this.TickerLimit=e.target.value
  //     if(this.TickerLimit)
  //     {
  //       console.log("button enabled");
  //       this.TickerDisable=false
  //     }
  //     else
  //     {
  //       console.log("Button disabled");
  //       this.TickerDisable=true
  //     }
  //
  //
  //     // this.SetTickerBtn=<Button bsStyle="primary" disabled={this.TickerDisable} className='GetTickerBtn' onClick={()=>this.handleVideo('ary')} title="View News Tickers">Confirm</Button>
  //     // this.SetTickerBtn=<Button bsStyle="primary" disabled={this.TickerDisable} className='GetTickerBtn' onClick={()=>this.handleVideo('bol')} title="View News Tickers">Confirm</Button>
  //     // this.SetTickerBtn=<Button bsStyle="primary" disabled={this.TickerDisable} className='GetTickerBtn' onClick={()=>this.handleVideo('aap')} title="View News Tickers">Confirm</Button>
  //
  //
  //     console.log("Setting Value to :: ", this.TickerLimit);
  //
  //     this.setState((state, props) => {
  //       return {counter: 0 + props.step};
  //     });
  //
  // }

  handleVideoUpload=(e)=>
  {
    EventBus.publish("showLoadingg");
    console.log("Upload video clicked",e.target.files[0]);

    this.fileUpload(e.target.files[0]).then((response)=>{
      EventBus.publish("stopLoadingg");
    console.log("Video Upload Response :: ",response.data);
    })
  }

  fileUpload=(file)=>
  {
    console.log("Uploaded file :: ", file);
     // const urll = 'https://httpbin.org/post';
    const formData = new FormData();
    formData.append('filename',file)
    const config = {
        headers: {'content-type': 'multipart/form-data'},

    }
    console.log("Video sending options :: ", url + "uploadFile" , formData,config );
    return  post(url + "uploadFile" , formData,config)
  }


  render() {
    console.log("render");

    return (
      <div>

        {/*<Modal show={this.state.show} onHide={this.handleClose} className="modalContainer">
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body className="modalBody">
            <h6>Enter Value:</h6>
            <input type='number' className="TickerLimitField" onChange={this.handleChange}/>

          </Modal.Body>
          <Modal.Footer>

            {this.SetTickerBtn}

          </Modal.Footer>
        </Modal> */}
        <div className="loadingg"  hidden={!this.loadingg} >
        <img className="LoaderImage" src="/5.gif"/>
          <p className="videoLoadingText">

          Please wait...</p>
        </div>

         <label  className="uploadVideoBtn"> Upload Video
          <input type="file" onChange={(e)=>this.handleVideoUpload(e)} name="myFile" accept="video/mp4" multiple />
        </label>
      {this.HomeContent}
      </div>
    )
  }
}

export default Home;


// <Player ref="player1"
//   src="https://s3.amazonaws.com/codecademy-content/courses/React/react_video-slow.mp4"
// >
//   <ControlBar autoHide={true} />
// </Player>
