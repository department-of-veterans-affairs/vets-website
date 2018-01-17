import React from 'react';

class Docket extends React.Component {
  render() {
    const { ahead, ready } = this.props;

    // TODO: Assess how accessible this is
    return (
      <div className="docket-container">
        <span className="appeals-ahead">{ahead.toLocaleString()}</span>
        <p>Appeals ahead of you</p>
        <div className="docket-bar">
          <div className="completed" style={{ width: `${ahead / ready}%` }}/>
        </div>
      </div>
    );
  }
}

export default Docket;

