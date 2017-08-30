import React from 'react';
import _ from 'lodash';
import { set } from 'lodash/fp';

import ErrorableSelect from './ErrorableSelect';
import ErrorableTextInput from './ErrorableTextInput';
import { isNotBlank, isBlankAddress, isValidUSZipCode, isValidCanPostalCode } from '../../common/utils/validations';
import { countries, states } from '../../common/utils/options-for-select';

/**
 * Input component for an address.
 *
 * No validation is provided through a currently stubbed isAddressValid function.
 */
class Address extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.isValidAddressField = this.isValidAddressField.bind(this);
    this.isValidPostalCode = this.isValidPostalCode.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  // TODO: Look into if this is the best way to update address,
  // it is incredibly slow right now
  handleChange(path, update) {
    let address = set(path, update, this.props.value);
    // if country is changing we should clear the state
    if (path === 'country') {
      address = set('state', '', address);
    }

    this.props.onUserInput(address);
  }

  isValidAddressField(field) {
    if (this.props.required || !isBlankAddress(this.props.value)) {
      return isNotBlank(field);
    }

    return true;
  }

  isValidPostalCode(postalCodeField) {
    let isValid = true;

    if (this.props.required || !isBlankAddress(this.props.value)) {
      isValid = isValid && isNotBlank(postalCodeField);
    }

    if (this.props.value.country === 'USA' && isNotBlank(postalCodeField)) {
      isValid = isValid && isValidUSZipCode(postalCodeField);
    }

    if (this.props.value.country === 'CAN' && isNotBlank(postalCodeField)) {
      isValid = isValid && isValidCanPostalCode(postalCodeField);
    }

    return isValid;
  }

  isMilitaryCity(city) {
    const lowerCity = city.toLowerCase().trim();

    return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
  }

  render() {
    let stateList = [];
    const selectedCountry = this.props.value.country === 'US' ? 'USA' : this.props.value.country;
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
      if (this.props.value.city && this.isMilitaryCity(this.props.value.city)) {
        stateList = stateList.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
      }
    }

    const stateProvince = _.hasIn(states, this.props.value.country === 'US' ? 'USA' : this.props.value.country)
      ? (<ErrorableSelect errorMessage={this.isValidAddressField(this.props.value.state) ? undefined : 'Please enter a valid state/province'}
        label={this.props.value.country === 'CAN' ? 'Province' : 'State'}
        name="state"
        autocomplete="address-level1"
        options={stateList}
        value={this.props.value.state}
        required={this.props.required}
        onValueChange={(update) => {this.handleChange('state', update);}}/>)
      : (<ErrorableTextInput label="State/province"
        name="province"
        autocomplete="address-level1"
        value={this.props.value.state}
        required={false}
        onValueChange={(update) => {this.handleChange('state', update);}}/>);

    return (
      <div>
        <ErrorableSelect errorMessage={this.isValidAddressField(this.props.value.country) ? undefined : 'Please enter a country'}
          label="Country"
          name="country"
          autocomplete="country"
          options={countries}
          value={this.props.value.country === 'US' ? 'USA' : this.props.value.country }
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('country', update);}}/>
        <ErrorableTextInput errorMessage={this.isValidAddressField(this.props.value.addressLine1) ? undefined : 'Please enter a street address'}
          label="Street address"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.value.addressLine1}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('addressLine1', update);}}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.value.addressLine2}
          onValueChange={(update) => {this.handleChange('addressLine2', update);}}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.value.addressLine3}
          onValueChange={(update) => {this.handleChange('addressLine3', update);}}/>
        <ErrorableTextInput errorMessage={this.isValidAddressField(this.props.value.city) ? undefined : 'Please enter a city'}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          value={this.props.value.city}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('city', update);}}/>
        {stateProvince}
        <ErrorableTextInput errorMessage={this.isValidPostalCode(this.props.value.zipCode) ? undefined : 'Please enter a valid Postal code'}
          additionalClass="usa-input-medium"
          label={this.props.value.country === 'USA' ? 'Zip code' : 'Postal code'}
          name="postalCode"
          autocomplete="postal-code"
          value={this.props.value.zipCode}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('zipCode', update);}}/>
      </div>
    );
  }
}

export default Address;
