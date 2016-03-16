import React from 'react';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { countries, states } from '../../utils/options-for-select';

import Phone from '../questions/Phone';

class Provider extends React.Component {
  render() {
    return (
      <div>
        <ErrorableTextInput
            label="Name"
            value={this.props.data.insuranceName}
            onValueChange={(update) => {this.props.onValueChange('insuranceName', update);}}/>
        <ErrorableTextInput
            label="Address"
            value={this.props.data.insuranceAddress}
            onValueChange={(update) => {this.props.onValueChange('insuranceAddress', update);}}/>
        <ErrorableTextInput
            label="City"
            value={this.props.data.insuranceCity}
            onValueChange={(update) => {this.props.onValueChange('insuranceCity', update);}}/>
        <ErrorableSelect
            label="Country"
            options={countries}
            value={this.props.data.insuranceCountry}
            onValueChange={(update) => {this.props.onValueChange('insuranceCountry', update);}}/>
        <ErrorableSelect
            label="State"
            options={states}
            value={this.props.data.insuranceState}
            onValueChange={(update) => {this.props.onValueChange('insuranceState', update);}}/>
        <ErrorableTextInput
            label="Zipcode"
            value={this.props.data.insuranceZipcode}
            onValueChange={(update) => {this.props.onValueChange('insuranceZipcode', update);}}/>
        <Phone label="Phone"
            value={this.props.data.insurancePhone}
            onValueChange={(update) => {this.props.onValueChange('insurancePhone', update);}}/>
        <ErrorableTextInput
            label="Name of Policy Holder"
            value={this.props.data.insurancePolicyHolderName}
            onValueChange={(update) => {this.props.onValueChange('insurancePolicyHolderName', update);}}/>
        <ErrorableTextInput
            label="Policy Number"
            value={this.props.data.insurancePolicyNumber}
            onValueChange={(update) => {this.props.onValueChange('insurancePolicyNumber', update);}}/>
        <ErrorableTextInput
            label="Group Code"
            value={this.props.data.insuranceGroupCode}
            onValueChange={(update) => {this.props.onValueChange('insuranceGroupCode', update);}}/>
      </div>
    );
  }
}

Provider.propTypes = {
  data: React.PropTypes.object.isRequired,
  onValueChange: React.PropTypes.func.isRequired
};

export default Provider;
