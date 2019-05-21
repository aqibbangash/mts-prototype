import Main from "views/home/home.js";
import Screenshots from "views/screenshots/screenshots.js"
import Transcript from "views/transcripts/transcripts.js"
import Clip from "views/videoClip/videoClip.js"
var routes = [
  {
    path: "/main",
    name: "Home",
    icon: "tim-icons icon-chart-pie-36",
    component: Main,
    layout: "/home"
  },
  {
    path: "/tickers/:name/:timstamp",
    name: "hide",
    icon: "tim-icons icon-chart-pie-36",
    component: Screenshots,
    layout: "/home"
  },
  {
    path: "/view-transcripts/:name",
    name: "hide",
    icon: "tim-icons icon-chart-pie-36",
    component: Transcript,
    layout: "/home"
  },
  {
    path: "/clip-video",
    name: "hide",
    icon: "tim-icons icon-chart-pie-36",
    component: Clip,
    layout: "/home"
  },
];
export default routes;
