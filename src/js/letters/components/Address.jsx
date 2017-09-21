import React from 'react';
import _ from 'lodash';

import ErrorableSelect from './ErrorableSelect';
import ErrorableTextInput from './ErrorableTextInput';
import { isNotBlank, isBlankAddress, isValidUSZipCode } from '../../common/utils/validations';
import { countries, states } from '../../common/utils/options-for-select';

/**
 * Input component for an address.
 *
 * No validation is provided through a currently stubbed isAddressValid function.
 */
class Address extends React.Component {
  constructor() {
    super();

    this.isValidAddressField = this.isValidAddressField.bind(this);
    this.isValidPostalCode = this.isValidPostalCode.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  isValidAddressField(field) {
    if (this.props.required || !isBlankAddress(this.props.address)) {
      return isNotBlank(field);
    }

    return true;
  }

  isValidPostalCode(postalCodeField) {
    let isValid = true;

    if (this.props.address.country === 'USA' && isNotBlank(postalCodeField)) {
      isValid = isValid && isValidUSZipCode(postalCodeField);
    }

    return isValid;
  }

  isMilitaryCity(city) {
    const lowerCity = city.toLowerCase().trim();

    return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
  }

  render() {
    const addressType = this.props.address.type;

    // Depending on the type of address, the fields for state and city
    // are called different things. Set new variables for the name of
    // the appropriate city and state field, and use those below for
    // the field components.
    let cityField;
    let stateField;
    if (addressType === 'MILITARY') {
      cityField = 'militaryPostOfficeTypeCode';
      stateField = 'militaryStateCode';
    } else {
      cityField = 'city';
      stateField = 'state';
    }

    // Our hard-coded list of countries has the value for the U.S. as
    // 'USA', but the value sent to us from EVSS is 'US'. This will cause
    // the field to not populate correctly.
    // This will be changed once we pull the real country list from the
    // address endpoint.
    let selectedCountry;
    if (this.props.address.country === undefined && addressType === 'MILITARY') {
      selectedCountry = 'USA';
    } else if (this.props.address.country === 'US') {
      selectedCountry = 'USA';
    } else {
      selectedCountry = this.props.address.country;
    }

    let stateList = [];
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
      if (this.props.address.city && this.isMilitaryCity(this.props.address.city)) {
        stateList = stateList.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
      }
    }
    const stateProvince = _.hasIn(states, selectedCountry)
      ? (<ErrorableSelect errorMessage={this.isValidAddressField(this.props.address[stateField]) ? undefined : 'Please enter a valid state/province'}
        label="State"
        name="state"
        autocomplete="address-level1"
        options={stateList}
        value={this.props.address[stateField]}
        required={this.props.required}
        onValueChange={(update) => {this.props.onInput(stateField, update);}}/>)
      : (<ErrorableTextInput label="State/province"
        name="province"
        autocomplete="address-level1"
        value={this.props.address[stateField]}
        required={false}
        onValueChange={(update) => {this.props.onInput(stateField, update);}}/>);

    return (
      <div>
        <ErrorableSelect errorMessage={this.isValidAddressField(selectedCountry) ? undefined : 'Please enter a country'}
          label="Country"
          name="country"
          autocomplete="country"
          options={countries}
          value={selectedCountry}
          required={this.props.required}
          onValueChange={(update) => {this.props.onInput('country', update);}}/>
        <ErrorableTextInput errorMessage={this.isValidAddressField(this.props.address.addressOne) ? undefined : 'Please enter a street address'}
          label="Street address"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.address.addressOne}
          required={this.props.required}
          onValueChange={(update) => {this.props.onInput('addressOne', update);}}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.address.addressTwo}
          onValueChange={(update) => {this.props.onInput('addressTwo', update);}}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.address.addressThree}
          onValueChange={(update) => {this.props.onInput('addressThree', update);}}/>
        <ErrorableTextInput errorMessage={this.isValidAddressField(this.props.address[cityField]) ? undefined : 'Please enter a city'}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          value={this.props.address[cityField]}
          required={this.props.required}
          onValueChange={(update) => {this.props.onInput(cityField, update);}}/>
        {stateProvince}
        <ErrorableTextInput errorMessage={this.isValidPostalCode(this.props.address.zipCode) ? undefined : 'Please enter a valid Postal code'}
          additionalClass="usa-input-medium"
          label={selectedCountry === 'USA' ? 'Zip code' : 'Postal code'}
          name="postalCode"
          autocomplete="postal-code"
          value={this.props.address.zipCode}
          required={this.props.required}
          onValueChange={(update) => {this.props.onInput('zipCode', update);}}/>
      </div>
    );
  }
}

export default Address;
