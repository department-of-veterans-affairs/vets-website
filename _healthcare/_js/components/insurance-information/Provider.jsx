import React from 'react';

import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isNotBlank, isValidInsurancePolicy } from '../../utils/validations';

class Provider extends React.Component {
  render() {
    let content;

    if (this.props.view === 'collapsed') {
      content = this.props.data.insuranceName;
    } else {
      content = (
        <div className="input-section">
          <ErrorableTextInput required
              errorMessage={isNotBlank(this.props.data.insuranceName) ? undefined : 'Please enter the insurer’s name'}
              label="Name"
              value={this.props.data.insuranceName}
              onValueChange={(update) => {this.props.onValueChange('insuranceName', update);}}/>

          <ErrorableTextInput required
              errorMessage={isNotBlank(this.props.data.insurancePolicyHolderName) ? undefined : 'Please enter the name of the policy holder'}
              label="Name of Policy Holder"
              value={this.props.data.insurancePolicyHolderName}
              onValueChange={(update) => {this.props.onValueChange('insurancePolicyHolderName', update);}}/>

          <p>Either the provider's policy number or group code is required.</p>

          <ErrorableTextInput required
              errorMessage={isValidInsurancePolicy(this.props.data.insurancePolicyNumber, this.props.data.insuranceGroupCode) ? undefined : 'Please enter the policy number or group code'}
              label="Policy Number"
              value={this.props.data.insurancePolicyNumber}
              onValueChange={(update) => {this.props.onValueChange('insurancePolicyNumber', update);}}/>

          <ErrorableTextInput required
              errorMessage={isValidInsurancePolicy(this.props.data.insurancePolicyNumber, this.props.data.insuranceGroupCode) ? undefined : 'Please enter the policy number or group code'}
              label="Group Code"
              value={this.props.data.insuranceGroupCode}
              onValueChange={(update) => {this.props.onValueChange('insuranceGroupCode', update);}}/>
        </div>
      );
    }

    return (
      <div>
        {content}
      </div>
    );
  }
}

Provider.propTypes = {
  data: React.PropTypes.object.isRequired,
  view: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired
};

export default Provider;
