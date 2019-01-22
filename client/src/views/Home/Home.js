import React, { Component } from 'react';
import ReactPlayer from 'react-player'
import { Button,Modal } from 'react-bootstrap';
import EventBus from 'eventing-bus';
import Videos from'./Videos.js'
import './Home.css'

var request = require("request");
  const url = "http://localhost:5000/"
// const url = "https://mts-prototype.herokuapp.com/"

class Home extends Component {

  // constructor(props, context) {
  //   super(props, context);
  //
  //   this.handleShow = this.handleShow.bind(this);
  //   this.handleClose = this.handleClose.bind(this);
  //   this.handleChange = this.handleChange.bind(this);
  //
  //   this.state = {
  //     show: false
  //   };
  // }

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
    console.log("home view screen recieved");
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
