import React from 'react';

import DateInput from './date-input';

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
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h3>Introduction</h3>
          </div>
        </div>

        <div className="row">
          <div className="small-12 columns">
            <h3>Happy Date</h3>
            <DateInput date={this.props.applicationData.introduction.happyDate}
              onUserInput={(update) => {this.onStateChange('happyDate', update);}}/>
          </div>
        </div>
        
        <div className="row">
          <div className="small-12 columns">
            <h3>Sad Date</h3>
            <DateInput date={this.props.applicationData.introduction.sadDate}
              onUserInput={(update) => {this.onStateChange('sadDate', update);}}/>
          </div>
        </div>
      </div>
    )
  }
}

export default IntroductionPanel;
