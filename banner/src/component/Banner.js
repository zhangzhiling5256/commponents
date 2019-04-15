import React from "react";
import PropTypes from "prop-types";


export default class Banner extends React.Component {
  constructor(props) {
    super(props)
    let { step, speed } = this.props;
    this.state = {
      step,
      speed
    }
  };
  //自动轮播
  componentDidMount() {
    //把定时器挂载到实例上，方便以后清除定时器
    this.autoTimer = setInterval(this.autoMove, this.props.interval)
  };

  //边界判断处理
  componentWillUpdate(nextProps, nextState) {
    //右边界判断的原理：如果最新修改的step索引大于最大索引，说明此时已经时末尾了，不能在向后走了，我们让其立即回到无动画索引为1的位置。
    if (nextState.step > this.cloneData.length - 1) {
      this.setState({
        step: 1,
        speed: 0
      });
    }

    //左边界判断处理：如果当前最新修改的索引已经小于0，说明不能继续向前走路了，我们让其立即回推到倒数第二张。
    if (nextState.step < 0) {
      this.setState({
        step: this.cloneData.length - 2,
        speed: 0
      })
    }
  };

  //边界处理完后的操作
  componentDidUpdate() {
    //边界判断处理完成后，会立即回到第一张，但得让其急速走第二张。
    let { step, speed } = this.state;
    if (step == 1 && speed == 0) {
      this.setState({
        step: step + 1,
        speed: this.props.speed
      })
    }

    if (step === this.cloneData.length - 2 && speed === 0) {
      this.setState({
        step: step - 1,
        speed: this.props.speed
      })
    }
  };

  //轮播的处理
  render() {
    let { data } = this.props;

    //克隆数据
    let cloneData = data.slice(0);
    cloneData.push(data[0]);
    cloneData.unshift(data[data.length - 1]);
    this.cloneData = cloneData; //挂载到实例上

    if (data.length === 0) return "";

    let { step, speed } = this.state;
    let wrapperStyle = {
      width: cloneData.length * 1000 + "px",
      left: -step * 1000 + "px",
      transiton: `all ${speed}ms linear`
    }
    return <main className="container"
      onMouseEnter={this.movePause}
      onMouseLeave={this.movePalave}
      onClick={this.handleClick}
    >
      <ul className="wrapper" style={wrapperStyle}>
        {cloneData.map((item, index) => {
          return <li key={index}><img src={item.imgUrl} alt={item.title} /></li>
        })}
      </ul>
      <ul className="foucs">
        {data.map((item, index) => {
          let tempIndex = step - 1;
          step === 0 ? tempIndex = data.length - 1 : null; //如果页面显示的第一张图片，那焦点将会是最后一个。
          step === (cloneData.length - 1) ? tempIndex = 0 : null;//如果页面显示的是最后一张图片，那焦点将是第一个。
          return <li key={index} className={tempIndex === index ? "active" : ""}></li>
        })}
      </ul>
      <a href="javascript:;" className="arrow arrowLeft">《</a>
      <a href="javascript:;" className="arrow arrowRight"> 》</a>
    </main>
  };

  autoMove = () => {
    this.setState({
      step: this.state.step + 1
    })
  };
  //鼠标划入幕布，自动轮播停止
  movePause = () => {
    clearInterval(this.autoTimer);
  }

  //鼠标移出幕布。自动轮播开始
  movePalave = () => {
    this.autoTimer = setInterval(this.autoMove, this.props.interval)
  }

  //事件委托点击切换
  handleClick = ev => {
    let target = ev.target,
      tarTag = target.tagName,
      tarClass = target.className;
    //左右切换按钮
    if (tarTag === "A" && /(^| +)arrow( +|$)/.test(tarClass)) {

      if (tarClass.indexOf("arrowRight") >= 0) {
        this.autoMove();
        return;
      };
      this.setState({
        step: this.state.step - 1
      });
      return;
    }
  }
}