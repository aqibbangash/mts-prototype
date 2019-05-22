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


class Main extends React.Component {

  componentDidMount(){
  }

  constructor(){
    super()
    this.state={
      views:<Videos/>,
    loadingg:false
    }

    EventBus.on("showLoading", this.showLoading.bind(this));
    EventBus.on("stopLoading", this.stopLoading.bind(this));

  }

  showLoading(msg){
    this.setState({loadingg:true})
    this.setState((state, props) => {
    return {counter: state.counter + props.step};
    })

  }

  stopLoading(msg){
    this.setState({loadingg:false})
    if (msg != undefined)
    {alert(msg)}

    this.setState((state, props) => {
    return {counter: state.counter + props.step};
    })
  }



render() {
    return (
      <div className="content">
        <div className="loadingg"  hidden={!this.state.loadingg} >
          <img className="LoaderImage" src="/5.gif"/>
          <p className="videoLoadingText">

          Please wait...</p>
        </div>
        {this.state.views}
      </div>
    );
  }
}

export default Main;
