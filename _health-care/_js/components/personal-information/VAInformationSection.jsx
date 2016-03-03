import React from 'react';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';

class VaInformationSection extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="small-12 columns">
          <h4>Veteran</h4>
          <p>
            Please review the following list and select all the responses that apply to you.
            This information will be used to determine which sections of the Application for
            Health Benefits you should complete.
          </p>

          <ErrorableCheckbox
              label="Are you VA Service Connected 50% to 100% Disabled?"
              checked={this.props.data.isVaServiceConnected}
              onValueChange={(update) => {this.props.onStateChange('isVaServiceConnected', update);}}/>

          <ErrorableCheckbox
              label="Are you compensable VA Service Connected 0% - 40%?"
              checked={this.props.data.compensableVaServiceConnected}
              onValueChange={(update) => {this.props.onStateChange('compensableVaServiceConnected', update);}}/>

          <ErrorableCheckbox
              label="Do you receive a VA pension?"
              checked={this.props.data.receivesVaPension}
              onValueChange={(update) => {this.props.onStateChange('receivesVaPension', update);}}/>
        </div>
      </div>
    );
  }
}

export default VaInformationSection;
