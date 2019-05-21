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


class Clip extends React.Component {

  componentDidMount(){
  }

  constructor(){
    super()
    this.state={
      views:<Videos/>
    }
  }



render() {
    return (
      <div className="content">
        VideoClip
      </div>
    );
  }
}

export default Clip;
