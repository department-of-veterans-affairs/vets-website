import React from 'react';
import _ from 'lodash';

import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import { isBlank, isNotBlank, isValidUSZipCode, isValidCanPostalCode, isBlankAddress, validateIfDirty } from '../../common/utils/validations';
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
    this.validateAddressField = this.validateAddressField.bind(this);
    this.validatePostalCode = this.validatePostalCode.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  // TODO: Look into if this is the best way to update address,
  // it is incredibly slow right now
  handleChange(path, update) {
    const address = {
      street: this.props.value.street,
      street2: this.props.value.street2,
      street3: this.props.value.street3,
      city: this.props.value.city,
      country: this.props.value.country,
      state: this.props.value.state,
      provinceCode: this.props.value.provinceCode,
      zipcode: this.props.value.zipcode,
      postalCode: this.props.value.postalCode
    };

    address[path] = update;

    this.props.onUserInput(address);
  }

  validateAddressField(field) {
    if (this.props.required) {
      return validateIfDirty(field, isNotBlank);
    }

    return validateIfDirty(field, isBlank) || validateIfDirty(field, isNotBlank);
  }

  validatePostalCode(postalCodeField) {
    let isValid = true;

    if (this.props.required || !isBlankAddress(this.props.value)) {
      isValid = isValid && validateIfDirty(postalCodeField, isNotBlank);
    }

    if (this.props.value.country.value === 'USA' && isNotBlank(postalCodeField.value)) {
      isValid = isValid && validateIfDirty(postalCodeField, isValidUSZipCode);
    }

    if (this.props.value.country.value === 'CAN' && isNotBlank(postalCodeField.value)) {
      isValid = isValid && validateIfDirty(postalCodeField, isValidCanPostalCode);
    }

    return isValid;
  }

  render() {
    let stateList = [];
    const selectedCountry = this.props.value.country.value;
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
    } else {
      stateList.push('Foreign Country');
    }

    const commonForm = (
      <div>
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.street) ? undefined : 'Please enter a valid street address'}
            label="Street"
            name="address"
            autocomplete="address-line1"
            charMax={30}
            field={this.props.value.street}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('street', update);}}/>

        <ErrorableTextInput
            label="Line 2"
            name="address2"
            autocomplete="address-line2"
            charMax={30}
            field={this.props.value.street2}
            onValueChange={(update) => {this.handleChange('street2', update);}}/>

        <ErrorableTextInput
            label="Line 3"
            name="address3"
            charMax={30}
            field={this.props.value.street3}
            onValueChange={(update) => {this.handleChange('street3', update);}}/>

        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.city) ? undefined : 'Please enter a valid city'}
            label="City"
            name="city"
            autocomplete="address-level2"
            charMax={30}
            field={this.props.value.city}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('city', update);}}/>

        <ErrorableSelect errorMessage={this.validateAddressField(this.props.value.country) ? undefined : 'Please enter a valid country'}
            label="Country"
            name="country"
            autocomplete="country"
            options={countries}
            value={this.props.value.country}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('country', update);}}/>
      </div>
      );

    let secondaryForm = null;
    if (_.hasIn(states, this.props.value.country.value)) {
      secondaryForm = (
        <div>
          <ErrorableSelect errorMessage={this.validateAddressField(this.props.value.state) ? undefined : 'Please enter a valid state'}
              label="State/Province"
              name="state"
              autocomplete="address-level1"
              options={stateList}
              value={this.props.value.state}
              required={this.props.required}
              onValueChange={(update) => {this.handleChange('state', update);}}/>

          <ErrorableTextInput errorMessage={this.validatePostalCode(this.props.value.zipcode) ? undefined : 'Please enter a valid ZIP code'}
              additionalClass="usa-input-medium"
              label="ZIP code"
              name="zip"
              autocomplete="postal-code"
              field={this.props.value.zipcode}
              required={this.props.required}
              onValueChange={(update) => {this.handleChange('zipcode', update);}}/>
        </div>
      );
    } else {
      secondaryForm = (
        <div>
          <ErrorableTextInput label="State/Province"
              name="province"
              autocomplete="address-level1"
              field={this.props.value.provinceCode}
              required={false}
              onValueChange={(update) => {this.handleChange('provinceCode', update);}}/>

          <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.postalCode) ? undefined : 'Please enter a valid Postal code'}
              additionalClass="usa-input-medium"
              label="Postal code"
              name="postalCode"
              autocomplete="postal-code"
              field={this.props.value.postalCode}
              required={this.props.required}
              onValueChange={(update) => {this.handleChange('postalCode', update);}}/>
        </div>
      );
    }

    return (
      <div>
        {commonForm}
        {secondaryForm}
      </div>
    );
  }
}

export default Address;
