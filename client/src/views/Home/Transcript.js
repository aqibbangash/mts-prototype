import React, { Component } from 'react';
import { FormGroup, FormControl, Button,ControlLabel } from 'react-bootstrap';
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
        WhatsAppValue:''
      }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
      console.log("Changing ",e.target.name," to ", e.target.value)


        if(e.target.name =='transcriptContent' )
        {
          this.setState({ value: e.target.value });
        }
        else if (e.target.name =='WhatsAppNumber')
        {
          this.setState({ WhatsAppValue: e.target.value });
        }

    }

    componentDidMount()
    {
        this.TranscriptBottom=<div className="transcriptBody">
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

          <Button bsStyle='primary' onClick={()=>this.onPrint(this.state.value)} className="printBtn"><img className="DownloadBtnLogo" src='./printer.png' />Print</Button>
          <Button bsStyle="success" className='WhatsappBtn' onClick={this.handleWhatsapp} ><img className="DownloadBtnLogo" src='./whatsapp.png' />Share via WhatsApp</Button>
            {/*<WhatsappShareButton
               url={this.state.value}

               className="WhatsappShareButton">
                 <WhatsappIcon size={32} round />
                 <p className="whatsAppTitle">Share via WhatsApp</p>

             </WhatsappShareButton> */}

             <EmailShareButton
              className="EmailShareButton"
              body={this.state.value}>
                <EmailIcon size={32} round /> Share via E-Mail
             </EmailShareButton>

       </div>
   </div>

   this.setState((state, props) => {
     return {counter: 0 + props.step};
   });
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

    handleWhatsapp=()=>
    {
      console.log("WhatsApp clicked :: ");
      this.TranscriptBottom=
      <div className="WhatsAppBody">
        <div className="WhatsAppFormDiv">
          <FormGroup >
            <ControlLabel className="whatsAppTitle">Enter whatsApp Number</ControlLabel>
            <FormControl
              className="WhatsAppNumberField"
              type="text"
              name="WhatsAppNumber"
              onChange={this.handleChange}
            />
          </FormGroup>
          <Button bsStyle="primary" onClick={this.handleWhatsappSend} className="whatsAppSendbtn">Send</Button>
        </div>
      </div>

      this.setState((state, props) => {
        return {counter: 0 + props.step};
      });
    }

    handleWhatsappSend=()=>
    {
      console.log("Number :: ", this.state.WhatsAppValue);
      console.log("sent!!");
      var WPUrl='https://web.whatsapp.com/send?phone='+this.state.WhatsAppValue+'&text='+this.state.value;
      window.open(
        WPUrl,
        '_blank'
      );
      this.componentDidMount();
    }

  render() {
    console.log("render");

    return (
      <div style={{width:"100%", height:"100%"}}>
        {this.TranscriptBottom}
      </div>
    )
  }
}

export default Transcript;
