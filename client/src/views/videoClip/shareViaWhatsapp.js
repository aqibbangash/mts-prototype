import React from "react";
import  { Redirect } from 'react-router-dom'
import EventBus from 'eventing-bus';
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
  Label
} from "reactstrap";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import Videos from "../Videos/Videos.js"
import "../Style.css"

var request = require('request');
const url = "http://localhost:5000"


class ShareViaWhatsapp extends React.Component {

  componentDidMount(){
  }

  constructor(){
    super()
    this.state={
      isDisabled:true
    }
  }

  sendEmail=()=>
  {
    console.log("email sent !");
    EventBus.publish("showLoading");

    var imageFullName= this.props.imageName.split('/');
    var imageName=imageFullName[1].split('.')
    console.log("Image Name :: ", imageName[0]);

    var options = {
      method: 'GET',
      url: url + '/sendemail/'+this.state.email+"/"+this.state.subject+"/"+this.state.body+"/"+imageName[0],
      headers: { },
      json: true
    };
    console.log("Options :: ", options);

    request(options, (error, response, body) =>
    {
      if (error)
      {
        console.log("Error", error);
      }
      else
      {
        console.log("Response", response);
        EventBus.publish("stopLoading");
        // this.componentDidMount();
      }
    })

  }

  handleChange=(e)=>{
    this.setState({[e.target.name]:e.target.value})
    console.log("nam e:: ", e.target.name , ":: value :: ", e.target.value);

  }

  handleWhatsappSend=()=>
  {
    console.log("Number :: ", this.state.WhatsAppValue);
    console.log("sent!!");
    var WPUrl='https://web.whatsapp.com/send?phone='+this.state.WhatsAppValue+'&text='+url+"/"+this.props.imageName;
    window.open(
      WPUrl,
      '_blank'
    );

    window.location.href=("/")
  }

render() {
    return (
      <div className="content">
        <div className="WhatsAppBody">
          <div className="WhatsAppFormDiv" style={{width:"30%"}}>
            <FormGroup >
              <label className="whatsAppTitle">Enter whatsApp Number</label>
              <Input
                className="WhatsAppNumberField"
                type="text"
                name="WhatsAppValue"
                onChange={this.handleChange}
              />
            </FormGroup>
            <Button onClick={this.handleWhatsappSend} className="whatsAppSendbtn">Send</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ShareViaWhatsapp;
