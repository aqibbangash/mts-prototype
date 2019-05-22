import React from "react";
import  { Redirect, Link } from 'react-router-dom'
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
  Label,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Fade,
  InputGroup
} from "reactstrap";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ReactPlayer from 'react-player';
import moment from "moment"
import ReactCompareImage from 'react-compare-image';
import "../Style.css"

var request = require('request');
const url = "http://localhost:5000"

class DetectLogo extends React.Component {
  constructor(){
    super()
    this.state = {
      response:''
    };
  }

  componentDidMount(){

  }

  detectLogo=()=>{
    console.log("detecting logo");
  EventBus.publish("showLoading");

  var options = {
    method: 'POST',
    url: url + '/checkLogoChange',
    headers: { },
    form:{
      videoName:this.props.match.params.name,
    },
    json: true
  };
  console.log("Options :: ", options);

  request(options, (error, response, body) =>
  {

    EventBus.publish("stopLoading");
    if (error)
    {
      console.log("Error", error);
    }
    else
    {
      console.log("Response", response)
      var logoChange=[]
      var changeDate=''
      body.result.forEach((i,idx,x)=>{
        changeDate=moment(i.changeDate).format('MMMM Do YYYY, h:mm:ss a')
        i.changeDate=changeDate
        if(i.status!='no logo change detected')
        {
          logoChange.push(<div>
            <div>
              <p className="logochangeDate">Logo changed on <b>{i.changeDate}</b></p>
            </div>
            <div style={{display:"flex", justifyCenter:"center", flexDirection:"row"}}>
              <div className="leftImage">
                <img
                  src={url+i['before']}
                  alt={url+i['before']}
                />
              </div>
              <div className="rightImage">
                <img
                  src={url+i['after']}
                  alt={url+i['after']}
                />
              </div>
            </div>
            <div className="row">
              <div className="comparisonImg">
                <ReactCompareImage
                  leftImage={url+i['before']}
                  rightImage={url+i['after']}
                  leftImageLabel="Before"
                  rightImageLabel="After"
                />
              </div>
            </div>
            <hr/>
          </div>)
        }
        else {
          logoChange.push("No change detected")
        }
      })
      console.log("array :: ", logoChange);
      this.setState({response:logoChange})
    }
  })
  }

  componentWillMount(){
      this.detectLogo()
  }




render() {
  var {response}=this.state
  return (
      <div className="content">
        <div className="row">
          <h3>{this.props.match.params.name}</h3>
        </div>

          {this.state.response}

      </div>
    );
  }
}

export default DetectLogo;
