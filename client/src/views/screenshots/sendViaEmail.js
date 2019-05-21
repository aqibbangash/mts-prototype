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


class SendViaEmail extends React.Component {

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

    if(this.state.email=='' || this.state.email==undefined || this.state.subject=='' || this.state.subject==undefined || this.state.body=='' || this.state.body==undefined )
    {
      console.log("ture", this.state);
      this.setState({isDisabled:true})
    }
    else {
      console.log("false");
      this.setState({isDisabled:false})
    }
  }



render() {
    return (
      <div className="content">
      <div className="emailModal">
        <div className="EmailModalBody">
          <p className="emailLabel">Send via Email</p>
          <FormGroup className="EmailField">

            <Input
              type="email"
              name='email'
              placeholder="Enter Email"
              onChange={(value)=>this.handleChange(value)}
            />
          </FormGroup>

          <FormGroup className="EmailField">

            <Input
              type="text"
              name='subject'
              placeholder="Subject"
              onChange={(value)=>this.handleChange(value)}
            />
          </FormGroup>

          <FormGroup className="EmailBody">

            <Input
              style={{height:"100px"}}
              type="textarea"
              placeholder="Body"
              name='body'
              onChange={(value)=>this.handleChange(value)}
            />
          </FormGroup>

          <Button bsStyle="success" onClick={this.sendEmail} className="EmailSendBtn" disabled={this.state.isDisabled}>Send</Button>
        </div>
      </div>
      </div>
    );
  }
}

export default SendViaEmail;
