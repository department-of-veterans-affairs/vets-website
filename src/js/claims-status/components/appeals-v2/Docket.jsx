import React from 'react';

class Docket extends React.Component {
  render() {
    const { ahead, total } = this.props;
    // const { ahead, total } = { ahead: 0, total: 100 };
    const completedWidth = { width: `${((total - ahead) / total) * 100}%` };

    // TODO: Assess how accessible this is
    return (
      <div className="docket-container">
        <span className="appeals-ahead">{ahead.toLocaleString()}</span>
        <p>Appeals ahead of you</p>
        <div className="marker-container">
          <div className="marker-spacer" style={completedWidth}/>
          <div className="marker">
            <p>You are here</p>
            <img src="/img/Docket-line-pin.svg" alt=""/>
          </div>
        </div>
        <div>
          <div className="docket-bar">
            <div className="completed" style={completedWidth}/>
          </div>
          <div className="end-of-docket"/>
        </div>
        <div className="front-of-docket-text"><p>Front of docket line</p></div>
        <p><strong>{total.toLocaleString()}</strong> total appeals on the docket</p>
      </div>
    );
  }
}

export default Docket;

