import React from 'react';
import _ from 'lodash';

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

  adjustStateNames(stateList, militaryStates) {
    // Reformat the state name data so that it can be
    // accepted by ErrorableSelect,
    // e.g., from this: `IL: 'Illinois'`
    // to this: `{ value: 'Illinois', label: 'IL' }`
    let states = [];
    // If the city is a military city, just add the military states to the list

    if (this.props.address.city && this.isMilitaryCity(this.props.address.city)) {
      states = militaryStates;
    } else {
      // Add states to list in the correct format
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
    }

    return states;
  }

  render() {
    const addressType = this.props.address.type;

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

    const adjustedStateNames = this.adjustStateNames(STATE_CODE_TO_NAME, militaryStateNames);

    const stateProvince = selectedCountry === 'USA'
      ? (<ErrorableSelect errorMessage={this.isValidAddressField(this.props.address.state) ? undefined : 'Please enter a valid state/province'}
        label="State"
        name="state"
        autocomplete="address-level1"
        options={adjustedStateNames}
        value={this.props.address.state}
        required={this.props.required}
        onValueChange={(update) => this.props.onInput('state', update)}/>)
      : (<ErrorableTextInput label="State/province"
        name="province"
        autocomplete="address-level1"
        value={this.props.address.state}
        required={false}
        onValueChange={(update) => this.props.onInput('state', update)}/>);

    return (
      <div>
        <ErrorableSelect errorMessage={this.isValidAddressField(selectedCountry) ? undefined : 'Please enter a country'}
          label="Country"
          name="country"
          autocomplete="country"
          options={this.props.countries}
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
        <ErrorableTextInput errorMessage={this.isValidAddressField(this.props.address.city) ? undefined : 'Please enter a city'}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          value={this.props.address.city}
          required={this.props.required}
          onValueChange={(update) => {this.props.onInput('city', update);}}/>
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
