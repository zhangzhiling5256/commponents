import React from "react";

let box = {
      width: "16px",
      height: "16px",
      borderRadius: "50%",
      border:"1px solid #1890ff",
      display:"flex",
      justifyContent:"center",
      alignItems:"center"
}

export default class Radio extends React.Component {
      constructor() {
            super()
            this.state={
                  flag:false,
                  background:""
            }
      };
      render() {
           return (<div style={box} onClick={this.onHide}>
                  <div style={{width:"10px",height:"10px",background:`${this.state.background}`,borderRadius:"50%"}}></div>
            </div>)
      }
     onHide=()=>{
        this.setState({
              flag:true,
              background:"#1890ff"
        })
       this.onShow();
     }
     onShow=()=>{
      if(this.state.flag){
        this.setState({
              flag:false,
              background:""
        })
      }
     }
}
