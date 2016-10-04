import React from 'react';

class DisabilityBenefitsApp extends React.Component {

  render() {
    return (
      <div className="row">
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }

}

export default DisabilityBenefitsApp;
