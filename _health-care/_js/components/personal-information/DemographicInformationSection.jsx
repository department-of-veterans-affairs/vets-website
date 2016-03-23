import React from 'react';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';

class DemographicInformationSection extends React.Component {
  render() {
    return (
      <div>
        <h4>Demographic Information</h4>

        <div className="input-section">
          <ErrorableCheckbox
              label="Are you Spanish, Hispanic, or Lantino?"
              checked={this.props.data.isSpanishHispanicLatino}
              onValueChange={(update) => {this.props.onStateChange('isSpanishHispanicLatino', update);}}/>
        </div>

        <div className="input-section">
          <h4>What is your race?</h4>
          <span className="usa-form-hint">You may check more than one.</span>
          <ErrorableCheckbox
              label="American Indian or Alaksan Native"
              checked={this.props.data.isAmericanIndianOrAlaskanNative}
              onValueChange={(update) => {this.props.onStateChange('isAmericanIndianOrAlaskanNative', update);}}/>

          <ErrorableCheckbox
              label="Black or African American"
              checked={this.props.data.isBlackOrAfricanAmerican}
              onValueChange={(update) => {this.props.onStateChange('isBlackOrAfricanAmerican', update);}}/>

          <ErrorableCheckbox
              label="Native Hawaiian or Other Pacific Islander"
              checked={this.props.data.isNativeHawaiianOrOtherPacificIslander}
              onValueChange={(update) => {this.props.onStateChange('isNativeHawaiianOrOtherPacificIslander', update);}}/>

          <ErrorableCheckbox
              label="Asian"
              checked={this.props.data.isAsian}
              onValueChange={(update) => {this.props.onStateChange('isAsian', update);}}/>

          <ErrorableCheckbox
              label="White"
              checked={this.props.data.isWhite}
              onValueChange={(update) => {this.props.onStateChange('isWhite', update);}}/>
        </div>
      </div>
    );
  }
}

export default DemographicInformationSection;

