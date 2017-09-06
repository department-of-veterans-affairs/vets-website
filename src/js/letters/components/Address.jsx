import React from 'react';
import PropTypes from 'prop-types';
import { set } from 'lodash/fp';

import {
  isBlankAddress,
  isMilitaryCity,
  isUSA
} from '../utils/helpers';

import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../../common/components/form-elements//ErrorableTextInput';
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
    this.validatePostalCode = this.validatePostalCode.bind(this);
  }

  handleChange(path, update) {
    let address = set(path, update, this.props.address);
    // If the country value is changing, clear the state value
    if (path === 'countryName') {
      address = set('stateCode.value', '', address);
    }
    this.props.onUserInput(address);
  }

  // Primitive validation: if the field has been dirtied and at least
  // one other element of the address object is non-empty, require the
  // field value to be non-empty; otherwise pass.
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
    // Only US postal codes have backend validation requirements. 
    if (isUSA(this.props.address.countryName.value) && isNotBlank(postalCodeField.value)) {
      isValid = isValid && validateIfDirty(postalCodeField, isValidUSZipCode);
    }
    return isValid;
  }

  createStateOrProvinceComponent() {
    const errorMessage =
      (isUSA(this.props.address.countryName.value) &&
       this.validateAddressField(this.props.address.stateCode)) ?
        'Please enter a valid state/province' : undefined;
    if (isUSA(this.props.address.countryName.value)) {
      return (
        <ErrorableSelect
          errorMessage={errorMessage}
          label="State"
          name="state"
          autocomplete="state"
          options={this.props.states}
          value={this.props.address.stateCode}
          required
          onValueChange={(update) => {this.handleChange('stateCode', update);}}/>
      );
    }
    // For international addresses, is there no state/province field?
    // Swagger says this must be an enum for domestic state codes
    return (
      <ErrorableTextInput
        errorMessage={errorMessage}
        label="State/province"
        name="province"
        field={this.props.address.stateCode}
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
          value={this.props.address.countryName}
          required
          onValueChange={(update) => {this.handleChange('countryName', update);}}/>
        {/* Address 1 */}
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.address.addressOne) ? undefined : 'Please enter a street address'}
          label="Street address"
          name="address"
          autocomplete="street-address"
          charMax={20}
          field={this.props.address.addressOne}
          required
          onValueChange={(update) => {this.handleChange('addressOne', update);}}/>
        {/* Address 2 */}
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={20}
          field={this.props.address.addressTwo}
          onValueChange={(update) => {this.handleChange('addressTwo', update);}}/>
        {/* Address 3 */}
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={20}
          field={this.props.address.addressThree}
          onValueChange={(update) => {this.handleChange('addressThree', update);}}/>
        {/* City */}
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.address.city) ? undefined : 'Please enter a city'}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={20}
          field={this.props.address.city}
          required
          onValueChange={(update) => {this.handleChange('city', update);}}/>
        {/* State or province */}
        {this.createStateOrProvinceComponent()}
        {/* Zip or postal code */}
        <ErrorableTextInput errorMessage={this.validatePostalCode(this.props.address.zipCode) ? undefined : 'Please enter a valid postal code'}
          additionalClass="usa-input-medium"
          label={isUSA(this.props.address.countryName.value) ? 'Zip code' : 'Postal code'}
          name="postalCode"
          autocomplete="postal-code"
          field={this.props.address.zipCode}
          required={isUSA(this.props.address.countryName.value) || isMilitaryCity(this.props.address.city.value)}
          onValueChange={(update) => {this.handleChange('zipCode', update);}}/>
      </div>
    );
  }
}

Address.propTypes = {
  address: PropTypes.object.isRequired,
  countries: PropTypes.array.isRequired,
  states: PropTypes.array.isRequired,
  onUserInput: PropTypes.func,
  required: PropTypes.bool
};

export default Address;
