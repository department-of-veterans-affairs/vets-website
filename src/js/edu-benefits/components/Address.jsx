import React from 'react';
import _ from 'lodash';
import { set } from 'lodash/fp';

import ErrorableSelect from '../../common/components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../../common/components/form-elements/ErrorableTextInput';
import { isNotBlank, validateIfDirty, isValidUSZipCode, isValidCanPostalCode } from '../../common/utils/validations';
import { isBlankAddress } from '../utils/validations';
import { countries, states } from '../utils/options-for-select';

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
    let address = set(path, update, this.props.value);
    // if country is changing we should clear the state
    if (path === 'country') {
      address = set('state.value', '', address);
    }

    this.props.onUserInput(address);
  }

  validateAddressField(field) {
    if (this.props.required || !isBlankAddress(this.props.value)) {
      return validateIfDirty(field, isNotBlank);
    }

    return true;
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

  isMilitaryCity(city) {
    const lowerCity = city.toLowerCase().trim();

    return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
  }

  render() {
    let stateList = [];
    const selectedCountry = this.props.value.country.value;
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
      if (this.props.value.city.value && this.isMilitaryCity(this.props.value.city.value)) {
        stateList = stateList.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
      }
    }

    const stateProvince = _.hasIn(states, this.props.value.country.value)
      ? <ErrorableSelect errorMessage={this.validateAddressField(this.props.value.state) ? undefined : 'Please enter a valid state/province'}
          label={this.props.value.country.value === 'CAN' ? 'Province' : 'State'}
          name="state"
          autocomplete="address-level1"
          options={stateList}
          value={this.props.value.state}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('state', update);}}/>
      : <ErrorableTextInput label="State/Province"
          name="province"
          autocomplete="address-level1"
          field={this.props.value.state}
          required={false}
          onValueChange={(update) => {this.handleChange('state', update);}}/>;

    return (
      <div>
        <ErrorableSelect errorMessage={this.validateAddressField(this.props.value.country) ? undefined : 'Please enter a country'}
            label="Country"
            name="country"
            autocomplete="country"
            options={countries}
            value={this.props.value.country}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('country', update);}}/>
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.street) ? undefined : 'Please enter a street address'}
            label="Street"
            name="address"
            autocomplete="street-address"
            charMax={30}
            field={this.props.value.street}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('street', update);}}/>
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.city) ? undefined : 'Please enter a city'}
            label={<span>City <em>(or APO/FPO/DPO)</em></span>}
            name="city"
            autocomplete="address-level2"
            charMax={30}
            field={this.props.value.city}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('city', update);}}/>
        {stateProvince}
        <ErrorableTextInput errorMessage={this.validatePostalCode(this.props.value.postalCode) ? undefined : 'Please enter a valid Postal code'}
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
}

export default Address;
