import React, { Component } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Fade,
  InputGroup
} from "reactstrap";
import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon
} from 'react-share';
import EventBus from 'eventing-bus';
import './Transcript.css'


var request = require("request");
const url = "http://localhost:5000"
//const url = "https://mts-prototype.herokuapp.com/"

class Transcript extends Component {

  constructor(props){
    super(props);
      this.state={
        WhatsAppValue:'',
        content:"",
        whatsappSend:false
      }
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount(){
      this.viewTranscripts()
    }

    viewTranscripts=(n)=>
    {
      EventBus.publish("showLoading");
      console.log("transcript button clicked ::", n );
      // var url="/home/view-transcripts/"+this.props.match.params.name
      var options = {
        method: 'POST',
        url: url + '/createTranscription',
        headers: { },
        form:{
          videoName:this.props.match.params.name
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
          EventBus.publish("stopLoading");
          this.setState({content:body.transcription})
          EventBus.publish("HomeScreenView", this.HomeContent);
          this.setState((state, props) => {
            return {counter: 0 + props.step};
          });
        }
      });


    }

    handleChange(e) {
      console.log("Changing ",e.target.name," to ", e.target.value)


        if(e.target.name =='transcriptContent' )
        {
          this.setState({ content: e.target.value });
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
          <Input
            className="transcriptContent"
            style={{height:"600px"}}
            type="textarea"
            name="transcriptContent"
            value={this.state.content}
            onChange={this.handleChange}
          />
        </FormGroup>
        <div className="ShareBtnDiv">

          <Button bsStyle='primary' onClick={()=>this.onPrint(this.state.content)} className="printBtn"><img className="DownloadBtnLogo" src='./printer.png' />Print</Button>
          <Button bsStyle="success" className='WhatsappBtn' onClick={this.handleWhatsapp} ><img className="DownloadBtnLogo" src='./whatsapp.png' />Share via WhatsApp</Button>

         <EmailShareButton
          className="EmailShareButton"
          body={this.state.content}
          >
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



    handleWhatsappSend=()=>
    {
      console.log("Number :: ", this.state.WhatsAppValue);
      console.log("sent!!");
      var WPUrl='https://web.whatsapp.com/send?phone='+this.state.WhatsAppValue+'&text='+this.state.content;
      window.open(
        WPUrl,
        '_blank'
      );
    }

    handleWhatsapp=()=>
    {
      console.log("WhatsApp clicked :: ");
      this.setState({whatsappSend:true})
    }


  render() {
    console.log("render");

    if(this.state.whatsappSend){
      return(

        <div className="content">
          <div className="WhatsAppBody">
            <div className="WhatsAppFormDiv" style={{width:"50%", padding:"3%"}}>
              <FormGroup >
                <label className="whatsAppTitle">Enter whatsApp Number</label>
                <Input
                  className="WhatsAppNumberField"
                  type="text"
                  name="WhatsAppNumber"
                  onChange={this.handleChange}
                />
              </FormGroup>
              <Button onClick={this.handleWhatsappSend} className="VideosDropOptions">Send</Button>
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="content">
          <div className="transcriptBody">
          <FormGroup >
            <Input
              className="transcriptContent"
              style={{height:"600px"}}
              type="textarea"
              name="transcriptContent"
              value={this.state.content}
              onChange={this.handleChange}
            />
          </FormGroup>
          <div className="ShareBtnDiv">

            <Button
              onClick={()=>this.onPrint(this.state.content)}
              className="sharebtn">
              <img className="DownloadBtnLogo" src='/printer.png'
            />
              Print
            </Button>
            <Button
              className='whatsappsharebtn'
              onClick={this.handleWhatsapp} >
              <img className="DownloadBtnLogo" src='/whatsapp.png'
            />
              Share via WhatsApp
            </Button>

             <EmailShareButton
              className="EmailShareButton"
              body={this.state.content}>
              <img className="DownloadBtnLogo" src='/email.png'/> Share via E-Mail
             </EmailShareButton>

         </div>
       </div>
        </div>
      )
    }


  }
}

export default Transcript;
