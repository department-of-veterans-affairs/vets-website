import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ErrorableSelect from './ErrorableSelect';
import ErrorableTextInput from './ErrorableTextInput';
import { addressTypes, STATE_CODE_TO_NAME } from '../utils/constants';
import { militaryStateNames } from '../utils/helpers';
import { isNotBlank, isBlankAddress, isValidUSZipCode } from '../../common/utils/validations';

/**
 * Input component for an address.
 *
 * No validation is provided through a currently stubbed isAddressValid function.
 */
class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressType: props.value.type
    };
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  handleChange(path, update) {
    let address = _.set(path, update, this.props.value);
    // if country is changing we should clear the state
    if (path === 'country') {
      address = _.set('state', '', address);
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
    if (this.props.value.city && this.isMilitaryCity(this.props.value.city)) {
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
    const addressType = this.state.addressType;

    // Our hard-coded list of countries has the value for the U.S. as
    // 'USA', but the value sent to us from EVSS is 'US'. This will cause
    // the field to not populate correctly.
    // This will be changed once we pull the real country list from the
    // address endpoint.
    let selectedCountry;
    if (this.props.value.country === undefined && addressType === addressTypes.military) {
      selectedCountry = 'USA';
    } else if (this.props.value.country === 'US') {
      selectedCountry = 'USA';
    } else {
      selectedCountry = this.props.value.country;
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
          onValueChange={(update) => this.props.onUserInput('country', update)}/>
        <ErrorableTextInput errorMessage={errorMessages.addressOne}
          label="Street address"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.value.addressOne}
          required={this.props.required}
          onValueChange={(update) => this.props.onUserInput('addressOne', update)}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.value.addressTwo}
          onValueChange={(update) => this.props.onUserInput('addressTwo', update)}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.props.value.addressThree}
          onValueChange={(update) => this.props.onUserInput('addressThree', update)}/>
        <ErrorableTextInput errorMessage={errorMessages.city}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          value={this.props.value.city}
          required={this.props.required}
          onValueChange={(update) => this.props.onUserInput('city', update)}/>
        <ErrorableSelect errorMessage={errorMessages.state}
          label="State"
          name="state"
          autocomplete="address-level1"
          options={adjustedStateNames}
          value={this.props.value.state}
          required={this.props.required}
          onValueChange={(update) => this.props.onUserInput('state', update)}/>)

        {/* Hide the zip code for addresseses that aren't in the US */}
        {selectedCountry === 'USA' && <ErrorableTextInput errorMessage={errorMessages.zipCode}
          additionalClass="usa-input-medium"
          label={'Zip code'}
          name="postalCode"
          autocomplete="postal-code"
          value={this.props.value.zipCode}
          required={this.props.required}
          onValueChange={(update) => this.props.onUserInput('zipCode', update)}/>
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
