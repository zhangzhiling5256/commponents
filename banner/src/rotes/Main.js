import React from "react";
import Banner from "../component/Banner"
import "../static/css/Banner.css";
import { getImgUrl } from "../api/axios.js";

export default class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state={
        imgAry:[]
    }
  };
 async componentWillMount() {
   await  getImgUrl().then((data)=>{
       let ary=data.data;
        this.setState({
          imgAry:ary
        })
     })
  };
  render() {
    return <Banner data={this.state.imgAry} interval={3000} step={1} speed={800} />
  }
}