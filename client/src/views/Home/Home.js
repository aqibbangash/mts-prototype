import React, { Component } from 'react';
import ReactPlayer from 'react-player'
// import { Player, ControlBar } from 'video-react';
// import ReactJWPlayer from 'react-jw-player';
// import { Button } from 'react-bootstrap';
import Screenshots from'./Screenshots.js'
import './Home.css'

// const url = "http://localhost:5000/"

class Home extends Component {

  // constructor()
  // {
  //   super();
  // }

  componentDidMount = () =>
  {
    console.log("did mount ::");
    this.HomeContent=
    <div className="HomeStyle">

      <div className="videoGrid" >
        <div style={{height:"10%"}}>
          <p>Ary news</p>
        </div>
        <div className="videoStyle" onClick={this.handleVideo}>
          <ReactPlayer width="100%" height="100%"  url={"http://localhost:3000/uploads/file.mov"} playing controls={true}/>
        </div>
        <div style={{height:"10%"}}>
          <p>Click on video to view </p>
        </div>
      </div>



    </div>
     this.setState((state, props) => {
       return {counter: 0 + props.step};
     });
   }

   handleVideo=()=>
   {
     console.log("video clicked ::");
     // console.log("screenshots folder :: ", {"http://localhost:3000/screenshots"});
     // var screenshotsPath="http://localhost:3000/"
     // var screenshotsList=[]
     // screenshotsPath.forEach(function(i,idx,x){
     //   screenshotsList[idx]={i['screenshots']}
     // })
     // console.log("screenshots List :: ", screenshotsList);

     
     // fetch(
     //   url + 'api/category-list', {
     //       method: 'get',
     //       headers: new Headers({
     //         "Content-Type": "application/json"
     //       })
     //
     //     }
     // )
     // .then(
     //
     //   (res) => {
     //     console.log("Response ::", res)
     //   }
     // )

     this.HomeContent=<Screenshots />

       this.setState((state, props) => {
         return {counter: 0 + props.step};
       });
   }


  render() {
    console.log("render");

    return (
      <div>
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
