import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ErrorableSelect from './ErrorableSelect';
import ErrorableTextInput from './ErrorableTextInput';
import { countries, states } from '../../common/utils/options-for-select';
import { addressTypes } from '../utils/constants';


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

  isMilitaryCity = (city) => {
    const lowerCity = city.toLowerCase().trim();

    return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
  }

  render() {
    const addressType = this.state.addressType;
    const errorMessages = this.props.errorMessages;

    // Depending on the type of address, the fields for state and city
    // are called different things. Set new variables for the name of
    // the appropriate city and state field, and use those below for
    // the field components.
    let cityField;
    let stateField;
    if (addressType === addressTypes.military) {
      // I think we'll only need to change this when we actually save the data
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
    if (this.props.value.country === undefined && addressType === addressTypes.military) {
      selectedCountry = 'USA';
    } else if (this.props.value.country === 'US') {
      selectedCountry = 'USA';
    } else {
      selectedCountry = this.props.value.country;
    }

    const isUSA = selectedCountry === 'USA';

    let stateList = [];
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
      if (this.props.value.city && this.isMilitaryCity(this.props.value.city)) {
        stateList = stateList.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
      }
    }

    const stateProvince = _.hasIn(states, selectedCountry)
      ? (<ErrorableSelect errorMessage={errorMessages[stateField]}
        label="State"
        name="state"
        autocomplete="address-level1"
        options={stateList}
        value={this.props.value[stateField]}
        required={this.props.required}
        onValueChange={(update) => this.props.onUserInput(stateField, update)}/>)
      : (<ErrorableTextInput label="State/province"
        name="province"
        autocomplete="address-level1"
        value={this.props.value[stateField]}
        required={false}
        onValueChange={(update) => this.props.onUserInput(stateField, update)}/>);

    return (
      <div>
        <ErrorableSelect errorMessage={errorMessages.country}
          label="Country"
          name="country"
          autocomplete="country"
          options={countries}
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
          value={this.props.value[cityField]}
          required={this.props.required}
          onValueChange={(update) => this.props.onUserInput(cityField, update)}/>
        {stateProvince}
        {/* Hide the zip code for addresseses that aren't in the US */}
        {isUSA && <ErrorableTextInput errorMessage={errorMessages.zipCode}
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
