import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import './Transcript.css'

// var request = require("request");
// const url = "http://localhost:5000/"
//const url = "https://mts-prototype.herokuapp.com/"

class Transcript extends Component {

  constructor(props){
    super(props);
      this.state={
        value:this.props.content,
      }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
      console.log("Changing ",e.target.name," to ", e.target.value)
        this.setState({ value: e.target.value });

    }

    sendEmailTranscript=(e)=>
    {
      console.log("transcript email sent !", e);


      // var options = {
      //   method: 'GET',
      //   url: url + '/sendTranscriptEmail',
      //   headers: { },
      //   form:{
      //     sendTranscript:e
      //   }
      //   json: true
      // };
      // console.log("Options :: ", options);
      //
      // request(options, (error, response, body) =>
      // {
      //   if (error)
      //   {
      //     console.log("Error", error);
      //   }
      //   else
      //   {
      //     console.log("Response", response);
      //
      //   }
      // })

    }

    onPrint=(e)=>
    {
      console.log("print clicked :: ",e)
      var w
        w=window.open();
        w.document.write(e);
        w.print();
        w.close();
    }

  render() {
    console.log("render");

    return (
      <div className="transcriptBody">
      <FormGroup >
        <FormControl
          className="transcriptContent"
          style={{height:"600px"}}
          componentClass="textarea"
          name="transcriptContent"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </FormGroup>
      <div className="ShareBtnDiv">

        <Button bsStyle='primary' onClick={()=>this.onPrint(this.state.value)} className="printBtn">Print</Button>

          <WhatsappShareButton
             url={this.state.value}

             className="WhatsappShareButton">
               <WhatsappIcon size={32} round />
               <p className="whatsAppTitle">Share via WhatsApp</p>

           </WhatsappShareButton>

           <Button className="EmailShareButton" onClick={()=>this.sendEmailTranscript(this.state.value)}> <img className="DownloadBtnLogo" src='./email.png' /> Share via E-Mail</Button>

     </div>
      </div>
    )
  }
}

export default Transcript;
