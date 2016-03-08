import React from 'react';

import ErrorableCheckbox from '../form-elements/ErrorableCheckbox';
import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { countries, states } from '../../utils/options-for-select';

import Phone from '../questions/Phone';

class InsuranceInformationSection extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="small-12 columns">
            <h4>Coverage Information </h4>
            <ErrorableCheckbox
                label="Are you covered by health insurance? (Including coverage through a spouse or another person)"
                checked={this.props.data.isCoveredByHealthInsurance}
                onValueChange={(update) => {this.props.onStateChange('isCoveredByHealthInsurance', update);}}/>
            <ErrorableTextInput
                label="Name"
                value={this.props.data.insuranceName}
                onValueChange={(update) => {this.props.onStateChange('insuranceName', update);}}/>
            <ErrorableTextInput
                label="Address"
                value={this.props.data.insuranceAddress}
                onValueChange={(update) => {this.props.onStateChange('insuranceAddress', update);}}/>
            <ErrorableTextInput
                label="City"
                value={this.props.data.insuranceCity}
                onValueChange={(update) => {this.props.onStateChange('insuranceCity', update);}}/>
            <ErrorableSelect
                label="Country"
                options={countries}
                value={this.props.data.insuranceCountry}
                onUserInput={(update) => {this.props.onStateChange('insuranceCountry', update);}}/>
            <ErrorableSelect
                label="State"
                options={states}
                value={this.props.data.insuranceState}
                onUserInput={(update) => {this.props.onStateChange('insuranceState', update);}}/>
            <ErrorableTextInput
                label="Zipcode"
                value={this.props.data.insuranceZipcode}
                onValueChange={(update) => {this.props.onStateChange('insuranceZipcode', update);}}/>
            <Phone label="Phone"
                value={this.props.data.insurancePhone}
                onValueChange={(update) => {this.props.onStateChange('insurancePhone', update);}}/>
            <ErrorableTextInput
                label="Name of Policy Holder"
                value={this.props.data.insurancePolicyHolderName}
                onValueChange={(update) => {this.props.onStateChange('insurancePolicyHolderName', update);}}/>
            <ErrorableTextInput
                label="Policy Number"
                value={this.props.data.insurancePolicyNumber}
                onValueChange={(update) => {this.props.onStateChange('insurancePolicyNumber', update);}}/>
            <ErrorableTextInput
                label="Group Code"
                value={this.props.data.insuranceGroupCode}
                onValueChange={(update) => {this.props.onStateChange('insuranceGroupCode', update);}}/>
          </div>
        </div>
      </div>
    );
  }
}

export default InsuranceInformationSection;
