import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ErrorableSelect from './ErrorableSelect';
import ErrorableTextInput from './ErrorableTextInput';
import { ADDRESS_TYPES, STATE_CODE_TO_NAME } from '../utils/constants';
import { militaryStateNames } from '../utils/helpers';
import { isNotBlank, isBlankAddress, isValidUSZipCode } from '../../common/utils/validations';

/**
 * Input component for an address.
 *
 * No validation is provided through a currently stubbed isAddressValid function.
 */
class Address extends React.Component {
  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  isValidAddressField = (field) => {
    if (this.props.required || !isBlankAddress(this.props.address)) {
      return isNotBlank(field);
    }

    return true;
  }

  isValidPostalCode = (postalCodeField) => {
    let isValid = true;

    if (this.props.address.country === 'USA' && isNotBlank(postalCodeField)) {
      isValid = isValid && isValidUSZipCode(postalCodeField);
    }

    return isValid;
  }

  isMilitaryCity = (city) => {
    const lowerCity = city.toLowerCase().trim();

    return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
  }

  adjustStateNames(state, militaryStates) {
    // Reformat the state name data so that it can be
    // accepted by ErrorableSelect,
    // e.g., from this: `IL: 'Illinois'`
    // to this: `{ value: 'Illinois', label: 'IL' }`
    let statesList = [];

    // If the city is a military city, just add the military statesList to the list
    if (this.props.address.city && this.isMilitaryCity(this.props.address.city)) {
      statesList = militaryStates;
    } else {
      // Add statesList to list in the correct format
      _.mapKeys(state, (value, key) => {
        statesList.push({ label: value, value: key });
      });
      // Add military statesList to full state list
      militaryStates.forEach((militaryState) => {
        statesList.push(militaryState);
      });
      // Alphabetize the list
      statesList.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
    }

    return statesList;
  }

  render() {
    const errorMessages = this.props.errorMessages;

    // Our hard-coded list of countries has the value for the U.S. as
    // 'USA', but the value sent to us from EVSS is 'US'. This will cause
    // the field to not populate correctly.
    // This will be changed once we pull the real country list from the
    // address endpoint.
    let selectedCountry;
    if (this.props.address.country === undefined && this.props.address.type === ADDRESS_TYPES.military) {
      selectedCountry = 'USA';
    } else if (this.props.address.country === 'US') {
      selectedCountry = 'USA';
    } else {
      selectedCountry = this.props.address.country;
    }

    const adjustedStateNames = this.adjustStateNames(STATE_CODE_TO_NAME, militaryStateNames);

    return (
      <div>
        <ErrorableSelect errorMessage={errorMessages.country}
          label="Country"
          name="country"
          autocomplete="country"
          options={this.props.countries}
          value={selectedCountry}
          required={this.props.required}
          onValueChange={(update) => this.props.onInput('country', update)}/>
        <ErrorableTextInput errorMessage={errorMessages.addressOne}
          label="Street address"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.address.addressOne}
          required={this.props.required}
          onValueChange={(update) => this.props.onInput('addressOne', update)}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.address.addressTwo}
          onValueChange={(update) => this.props.onInput('addressTwo', update)}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.address.addressThree}
          onValueChange={(update) => this.props.onInput('addressThree', update)}/>
        <ErrorableTextInput errorMessage={errorMessages.city}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          value={this.props.address.city}
          required={this.props.required}
          onValueChange={(update) => this.props.onInput('city', update)}/>
        <ErrorableSelect errorMessage={errorMessages.state}
          label="State"
          name="state"
          autocomplete="address-level1"
          options={adjustedStateNames}
          value={this.props.address.state}
          required={this.props.required}
          onValueChange={(update) => this.props.onInput('state', update)}/>)

        {/* Hide the zip code for addresseses that aren't in the US */}
        {selectedCountry === 'USA' && <ErrorableTextInput errorMessage={errorMessages.zipCode}
          additionalClass="usa-input-medium"
          label={'Zip code'}
          name="postalCode"
          autocomplete="postal-code"
          value={this.props.address.zipCode}
          required={this.props.required}
          onValueChange={(update) => this.props.onInput('zipCode', update)}/>
        }
      </div>
    );
  }
}

const addressShape = PropTypes.shape({
  addressOne: PropTypes.string,
  addressTwo: PropTypes.string,
  addressThree: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  country: PropTypes.string,
  zipCode: PropTypes.string
});

Address.propTypes = {
  // value = address
  value: addressShape.isRequired,
  errorMessages: addressShape.isRequired,
};

export default Address;
