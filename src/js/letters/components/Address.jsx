import React from 'react';
import { set } from 'lodash/fp';

import { US_COUNTRY_NAME } from '../utils/constants';
import { isBlankAddress } from '../utils/helpers';

import ErrorableSelect from './ErrorableSelect';
import ErrorableTextInput from './ErrorableTextInput';
import {
  isNotBlank,
  validateIfDirty,
  isValidUSZipCode
} from '../../common/utils/validations';

/**
 * Input component for an address, adapted from
 * /src/js/common/components/questions/ to meet custom, non-ISO address
 * format requirements.
 */
class Address extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.validateAddressField = this.validateAddressField.bind(this);
    this.validatePostalCode = this.isValidPostalCode.bind(this);
  }

  handleChange(path, update) {
    let address = set(path, update, this.props.address);
    // Clear the state when country value changes
    if (path === 'countryName') {
      address = set('stateCode', '', address);
    }
    this.props.onUserInput(address);
  }

  // Primitive validation: requires the field value to be non-empty
  // only if at least one other element of the address object is
  // non-empty and the field has been dirtied.
  validateAddressField(field) {
    if (!isBlankAddress(this.props.address)) {
      return validateIfDirty(field, isNotBlank);
    }
    return true;
  }

  validatePostalCode(postalCodeField) {
    let isValid = true;
    if (!isBlankAddress(this.props.address)) {
      isValid = isValid && validateIfDirty(postalCodeField, isNotBlank);
    }
    if (this.props.address.countryName.value === US_COUNTRY_NAME && isNotBlank(postalCodeField.value)) {
      isValid = isValid && validateIfDirty(postalCodeField, isValidUSZipCode);
    }
    return isValid;
  }

  createStateOrProvinceComponent() {
    let label;
    let name;
    let options;
    let required;
    if (this.props.address.countryName.value === US_COUNTRY_NAME) {
      label = 'State';
      name = 'state';
      options = this.props.states;
      required = true;
    } else {
      label = 'State/province';
      name = 'province';
      required = false;
    }

    const errorMessage =
      (this.props.address.countryName.value === US_COUNTRY_NAME &&
       this.validateAddressField(this.props.address.stateCode)) ?
        'Please enter a valid state/province' : undefined;

    return (
      <ErrorableSelect
        errorMessage={errorMessage}
        label={label}
        name={name}
        autocomplete="address-level1"
        options={options}
        value={this.props.address.stateCode.value}
        required={required}
        onValueChange={(update) => {this.handleChange('stateCode', update);}}/>
    );
  }

  render() {
    // let stateList = [];
    // const selectedCountry = this.props.value.country;
    // if (states[selectedCountry]) {
    //   stateList = states[selectedCountry];
    //   if (this.props.value.city && this.isMilitaryCity(this.props.value.city)) {
    //     stateList = stateList.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
    //   }
    // }

    return (
      <div>
        {/* Country */}
        <ErrorableSelect errorMessage={this.validateAddressField(this.props.address.countryName) ? undefined : 'Please enter a country'}
          label="Country"
          name="country"
          autocomplete="country"
          options={this.props.countries}
          value={this.props.address.countryName.value}
          required
          onValueChange={(update) => {this.handleChange('countryName', update);}}/>
        {/* Address 1 */}
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.address.addressOne) ? undefined : 'Please enter a street address'}
          label="Street address"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.address.addressOne.value}
          required
          onValueChange={(update) => {this.handleChange('addressOne', update);}}/>
        {/* Address 2 */}
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.address.addressTwo}
          onValueChange={(update) => {this.handleChange('addressTwo', update);}}/>
        {/* Address 3 */}
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.address.addressThree}
          onValueChange={(update) => {this.handleChange('addressThree', update);}}/>
        {/* City */}
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.address.city) ? undefined : 'Please enter a city'}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          value={this.props.address.city}
          required
          onValueChange={(update) => {this.handleChange('city', update);}}/>
        {/* State or province */}
        {this.createStateOrProvinceComponent()}
        {/* Zip or postal code */}
        <ErrorableTextInput errorMessage={this.validatePostalCode(this.props.address.zipCode) ? undefined : 'Please enter a valid postal code'}
          additionalClass="usa-input-medium"
          label={this.props.value.country === US_COUNTRY_NAME ? 'Zip code' : 'Postal code'}
          name="postalCode"
          autocomplete="postal-code"
          value={this.props.address.zipCode.value}
          required
          onValueChange={(update) => {this.handleChange('zipCode', update);}}/>
      </div>
    );
  }
}

export default Address;
