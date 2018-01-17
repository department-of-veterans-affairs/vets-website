import React from 'react';

class Docket extends React.Component {
  render() {
    const { ahead, total } = this.props;

    // TODO: Assess how accessible this is
    return (
      <div className="docket-container">
        <span className="appeals-ahead">{ahead.toLocaleString()}</span>
        <p>Appeals ahead of you</p>
        <div>
          <div className="docket-bar">
            <div className="completed" style={{ width: `${(ahead / total) * 100}%` }}/>
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

