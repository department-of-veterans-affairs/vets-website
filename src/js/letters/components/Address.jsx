import React from 'react';
import _ from 'lodash';
import { set } from 'lodash/fp';

import ErrorableSelect from './ErrorableSelect';
import ErrorableTextInput from './ErrorableTextInput';
import { STATE_CODE_TO_NAME } from '../utils/constants';
import { militaryStateNames } from '../utils/helpers';
import { isNotBlank, isBlankAddress, isValidUSZipCode } from '../../common/utils/validations';

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

  handleChange(path, update) {
    let address = set(path, update, this.props.value);
    // if country is changing we should clear the state
    if (path === 'country') {
      address = set('state', '', address);
      address = set('militaryStateCode', '', address);
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

    if (this.props.value.country === 'USA' && isNotBlank(postalCodeField)) {
      isValid = isValid && isValidUSZipCode(postalCodeField);
    }

    return isValid;
  }

  isMilitaryCity(city) {
    const lowerCity = city.toLowerCase().trim();

    return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
  }

  adjustStateNames(stateList, militaryStates, city) {
    // Reformat the state name data so that it can be
    // accepted by ErrorableSelect,
    // e.g., from this: `IL: 'Illinois'`
    // to this: `{ value: 'Illinois', label: 'IL' }`
    let states = [];
    _.mapKeys(stateList, (value, key) => {
      states.push({ label: value, value: key });
    });
    // Add military states to full state list
    militaryStates.forEach((militaryState) => {
      states.push(militaryState);
    });
    // Alphabetize the list
    states.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });
    // Filter state list if military city is entered
    if (this.props.value[city] && this.isMilitaryCity(this.props.value[city])) {
      states = states.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
    }

    return states;
  }

  render() {
    const addressType = this.props.value.type;

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
    if (this.props.value.country === undefined && addressType === 'MILITARY') {
      selectedCountry = 'USA';
    } else if (this.props.value.country === 'US') {
      selectedCountry = 'USA';
    } else {
      selectedCountry = this.props.value.country;
    }

    const adjustedStateNames = this.adjustStateNames(STATE_CODE_TO_NAME, militaryStateNames, cityField);

    const stateProvince = selectedCountry === 'USA'
      ? (<ErrorableSelect errorMessage={this.isValidAddressField(this.props.value[stateField]) ? undefined : 'Please enter a valid state/province'}
        label="State"
        name="state"
        autocomplete="address-level1"
        options={adjustedStateNames}
        value={this.props.value[stateField]}
        required={this.props.required}
        onValueChange={(update) => {this.handleChange(stateField, update);}}/>)
      : (<ErrorableTextInput label="State/province"
        name="province"
        autocomplete="address-level1"
        value={this.props.value[stateField]}
        required={false}
        onValueChange={(update) => {this.handleChange(stateField, update);}}/>);

    return (
      <div>
        <ErrorableSelect errorMessage={this.isValidAddressField(selectedCountry) ? undefined : 'Please enter a country'}
          label="Country"
          name="country"
          autocomplete="country"
          options={this.props.countries}
          value={selectedCountry}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('country', update);}}/>
        <ErrorableTextInput errorMessage={this.isValidAddressField(this.props.value.addressOne) ? undefined : 'Please enter a street address'}
          label="Street address"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.value.addressOne}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('addressOne', update);}}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.value.addressTwo}
          onValueChange={(update) => {this.handleChange('addressTwo', update);}}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.value.addressThree}
          onValueChange={(update) => {this.handleChange('addressThree', update);}}/>
        <ErrorableTextInput errorMessage={this.isValidAddressField(this.props.value[cityField]) ? undefined : 'Please enter a city'}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          value={this.props.value[cityField]}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange(cityField, update);}}/>
        {stateProvince}
        <ErrorableTextInput errorMessage={this.isValidPostalCode(this.props.value.zipCode) ? undefined : 'Please enter a valid Postal code'}
          additionalClass="usa-input-medium"
          label={selectedCountry === 'USA' ? 'Zip code' : 'Postal code'}
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
