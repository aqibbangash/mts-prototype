import React, { Component } from 'react';
import ReactPlayer from 'react-player'
// import { Player, ControlBar } from 'video-react';
// import ReactJWPlayer from 'react-jw-player';
import { Button,Modal } from 'react-bootstrap';
import Screenshots from'./Screenshots.js'
import Transcript from'./Transcript.js'
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


  componentDidMount = () =>
  {
    this.TickerDisable=true;
    this.TickerLimit=''
    this.SetTickerBtn=''
    console.log("did mount ::");
    this.screenshotsList=''
    this.HomeContent=
    <div className="HomeStyle">

      <div className="videoGrid" >
        <div>
          <p className="videoTitle">ARY News</p>
        </div>
        <div className="videoStyle">
          <ReactPlayer
            width="99.9%"
            height="100%"
            url={url+"uploads/ary.mp4"}
            playing
            controls={true}
            volume={null}
            muted
            />
        </div>
        <div >
          <Button bsStyle="success" className='newsTickerBtn' onClick={()=>this.handleVideo('ary')}>Get Tickers</Button>
          <Button bsStyle="danger" className='transcriptionBtn' onClick={()=>this.handleTranscript('ary')} title="View Transcripts">View Transcripts</Button>
        </div>
      </div>


      <div className="videoGrid" >
        <div>
          <p className="videoTitle">BOL News</p>
        </div>
        <div className="videoStyle">
          <ReactPlayer
            width="99.9%"
            height="100%"
            url={url+"uploads/bol.mp4"}
            playing
            controls={true}
            volume={null}
            muted
            />
        </div>
        <div>
          <Button bsStyle="success" className='newsTickerBtn' onClick={()=>this.handleVideo('bol')}>Get Tickers</Button>
          <Button bsStyle="danger" className='transcriptionBtn' onClick={()=>this.handleTranscript('bol')} title="View Transcripts">View Transcripts</Button>
        </div>
      </div>

      <div className="videoGrid" >
        <div>
          <p className="videoTitle">AAP News</p>
        </div>
        <div className="videoStyle">
          <ReactPlayer
            id='ary'
            width="99.9%"
            height="100%"
            url={url+"uploads/aap.mp4"}
            playing
            controls={true}
            volume={null}
            muted
            />
        </div>
        <div>
          <Button bsStyle="success" className='newsTickerBtn' onClick={()=>this.handleVideo('aap')}>Get Tickers</Button>
          <Button bsStyle="danger" className='transcriptionBtn' onClick={()=>this.handleTranscript('aap')} title="View Transcripts">View Transcripts</Button>
        </div>
      </div>


    </div>
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

  handleTranscript=(n)=>
  {
    console.log("transcript button clicked ::", n );

    var options = {
      method: 'POST',
      url: url + 'createTranscription',
      headers: { },
      form:{
        videoName:n
      },
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
        console.log("Response :: ", body.transcription);

        this.HomeContent=<Transcript content={body.transcription} />

        this.setState((state, props) => {
          return {counter: 0 + props.step};
        });
      }
    });


  }

  handleVideo=(n)=>
  {
    console.log("video clicked ::", n);
    var timeStamp=''
    if(n=='ary')
    {
      timeStamp=15
    }
    else if(n=='bol')
    {
      timeStamp=30
    }
    else if(n=='ary')
    {
      timeStamp=40
    }

    var options = {
      method: 'POST',
      url: url + 'getvideos',
      headers: { },
      form:{
        videoName:n,
        timestamp : timeStamp
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
        console.log("Response body :: ", body);
        this.screenshotsList=body

        this.HomeContent=<Screenshots  screenshots={this.screenshotsList}/>
        // this.handleClose();
        this.setState((state, props) => {
          return {counter: 0 + props.step};
        });

      }
    });




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
