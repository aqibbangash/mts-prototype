import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import "./navbarStyle.css"
// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Input,
  InputGroup,
  NavbarBrand,
  Navbar,
  NavLink,
  Nav,
  Container,
  Modal
} from "reactstrap";
import axios, { post } from 'axios'
import EventBus from 'eventing-bus';

const url = "http://localhost:5000/"

class AdminNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      modalSearch: false,
      color: "navbar-transparent"
    };
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateColor);
  }
  // function that adds color white/transparent to the navbar on resize (this is for the collapse)
  updateColor = () => {
    if (window.innerWidth < 993 && this.state.collapseOpen) {
      this.setState({
        color: "bg-white"
      });
    } else {
      this.setState({
        color: "navbar-transparent"
      });
    }
  };

  handleVideoUpload=(e)=>{
    console.log("Video uploading");
    console.log("Upload video clicked",e.target.files[0]);
    EventBus.publish("showLoading");
    this.fileUpload(e.target.files[0]).then((response)=>{
      EventBus.publish("stopLoading");
    console.log("Video Upload Response :: ",response.data);
    })
  }

  fileUpload=(file)=>
  {
    console.log("Uploaded file :: ", file);
     // const urll = 'https://httpbin.org/post';
    const formData = new FormData();
    formData.append('filename',file)
    const config = {
        headers: {'content-type': 'multipart/form-data'},
    }
    console.log("Video sending options :: ", url + "uploadFile" , formData,config );
    return  post(url + "uploadFile" , formData,config)
  }


  // this function opens and closes the collapse on small devices
  toggleCollapse = () => {
    if (this.state.collapseOpen) {
      this.setState({
        color: "navbar-transparent"
      });
    } else {
      this.setState({
        color: "bg-white"
      });
    }
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // this function is to open the Search modal
  toggleModalSearch = () => {
    this.setState({
      modalSearch: !this.state.modalSearch
    });
  };
  render() {
    return (
      <div>
        <Navbar
          className={classNames("navbar-absolute", this.state.color)}
          expand="lg"
        >
          <Container fluid>
            <div className="navbar-wrapper">
              <div
                className={classNames("navbar-toggle d-inline", {
                  toggled: this.props.sidebarOpened
                })}
              >
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={this.props.toggleSidebar}
                >
                  <span className="navbar-toggler-bar bar1" />
                  <span className="navbar-toggler-bar bar2" />
                  <span className="navbar-toggler-bar bar3" />
                </button>
              </div>
              <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
                {this.props.brandText}
              </NavbarBrand>
            </div>
            <button
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navigation"
              data-toggle="collapse"
              id="navigation"
              type="button"
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
              <span className="navbar-toggler-bar navbar-kebab" />
            </button>
            <Collapse navbar isOpen={this.state.collapseOpen}>
              <Nav className="ml-auto" navbar>
                {/*<InputGroup className="search-bar">
                  <Button
                    color="link"
                    data-target="#searchModal"
                    data-toggle="modal"
                    id="search-button"
                    onClick={this.toggleModalSearch}
                  >
                  search
                    <span className="d-lg-none d-md-block"></span>
                  </Button>
                </InputGroup>*/}

                <InputGroup className="search-bar" style={{display:"flex", alignItems:"center"}}>
                  <label  className="uploadVideoBtn"> Upload Video
                   <input
                     type="file"
                     onChange={(e)=>this.handleVideoUpload(e)}
                     name="myFile"
                     accept="video/mp4"
                     multiple
                     style={{display:"none"}}
                     />
                 </label>

                </InputGroup>

                <li className="separator d-lg-none" />
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
        <Modal
          modalClassName="modal-search"
          isOpen={this.state.modalSearch}
          toggle={this.toggleModalSearch}
        >
          <div className="modal-header">
            <Input id="inlineFormInputGroup" placeholder="SEARCH" type="text" />
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={this.toggleModalSearch}
            >
              <i className="tim-icons icon-simple-remove" />
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AdminNavbar;
