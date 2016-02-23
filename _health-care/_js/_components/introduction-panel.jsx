import React from 'react';

class IntroductionPanel extends React.Component {
  constructor() {
    super();
    this.onStateChange = this.onStateChange.bind(this);
  }

  onStateChange(subfield, update) {
    this.props.publishStateChange(['introduction', subfield], update);
  }

  render() {
    return (
      <div className="usa-form-width">
        <div className="row">
          <div className="small-12 columns">
            <h3>Apply online for health care with the 1010ez</h3>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <p>
              You are ready to begin applying for health care. Before you continue, 
              here is important information related to applying for VA health care benefits.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default IntroductionPanel;
