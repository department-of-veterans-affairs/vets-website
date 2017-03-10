import React from 'react';

class SystemDownView extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="small-12 columns">
          <div className="react-conatiner">
            <h3>{this.props.messageLine1}</h3>
            <h4>{this.props.messageLine2}</h4>
            <a href="/"><button>Go Back to Vets.gov</button></a>
          </div>
        </div>
      </div>
    );
  }
}

SystemDownView.propTypes = {
  messageLine1: React.PropTypes.string.isRequired,
  messageLine2: React.PropTypes.string,
};

export default SystemDownView;
