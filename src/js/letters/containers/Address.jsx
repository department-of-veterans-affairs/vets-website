import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { set } from 'lodash/fp';

import ErrorableSelect from '../components/ErrorableSelect';
import ErrorableTextInput from '../components/ErrorableTextInput';
import { isNotBlank, isBlankAddress, isValidUSZipCode } from '../../common/utils/validations';
import { countries, states } from '../../common/utils/options-for-select';
import { saveAddress } from '../actions/letters';

/**
 * Input component for an address.
 *
 * No validation is provided through a currently stubbed isAddressValid function.
 */
class Address extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: this.props.initialAddress,
    };

    this.handleChange = this.handleChange.bind(this);
    this.isValidAddressField = this.isValidAddressField.bind(this);
    this.isValidPostalCode = this.isValidPostalCode.bind(this);
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  handleChange(path, update) {
    this.setState(({address}) => {
      const newStateCode = (path === 'country'
        ? address.state
        : ''
      );
      return {
        address: {
          ...address,
          [path]: update,
          state: newStateCode,
      }};
    });
  }

  isValidAddressField(field) {
    if (this.props.required || !isBlankAddress(this.state.address)) {
      return isNotBlank(field);
    }

    return true;
  }

  isValidPostalCode(postalCodeField) {
    let isValid = true;

    if (this.state.address.country === 'USA' && isNotBlank(postalCodeField)) {
      isValid = isValid && isValidUSZipCode(postalCodeField);
    }

    return isValid;
  }

  isMilitaryCity(city) {
    const lowerCity = city.toLowerCase().trim();

    return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
  }

  render() {
    const addressType = this.state.address.type;

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
    if (this.state.address.country === undefined && addressType === 'MILITARY') {
      selectedCountry = 'USA';
    } else if (this.state.address.country === 'US') {
      selectedCountry = 'USA';
    } else {
      selectedCountry = this.state.address.country;
    }

    let stateList = [];
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
      if (this.state.address.city && this.isMilitaryCity(this.state.address.city)) {
        stateList = stateList.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
      }
    }

    const stateProvince = _.hasIn(states, selectedCountry)
      ? (<ErrorableSelect errorMessage={this.isValidAddressField(this.state.address[stateField]) ? undefined : 'Please enter a valid state/province'}
        label="State"
        name="state"
        autocomplete="address-level1"
        options={stateList}
        value={this.state.address[stateField]}
        required={this.props.required}
        onValueChange={(update) => {this.handleChange(stateField, update);}}/>)
      : (<ErrorableTextInput label="State/province"
        name="province"
        autocomplete="address-level1"
        value={this.state.address[stateField]}
        required={false}
        onValueChange={(update) => {this.handleChange(stateField, update);}}/>);

    return (
      <div>
        <ErrorableSelect errorMessage={this.isValidAddressField(selectedCountry) ? undefined : 'Please enter a country'}
          label="Country"
          name="country"
          autocomplete="country"
          options={countries}
          value={selectedCountry}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('country', update);}}/>
        <ErrorableTextInput errorMessage={this.isValidAddressField(this.state.address.addressOne) ? undefined : 'Please enter a street address'}
          label="Street address"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.state.address.addressOne}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('addressOne', update);}}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.state.address.addressTwo}
          onValueChange={(update) => {this.handleChange('addressTwo', update);}}/>
        <ErrorableTextInput
          label="Street address (optional)"
          name="address"
          autocomplete="street-address"
          charMax={30}
          value={this.state.address.addressThree}
          onValueChange={(update) => {this.handleChange('addressThree', update);}}/>
        <ErrorableTextInput errorMessage={this.isValidAddressField(this.state.address[cityField]) ? undefined : 'Please enter a city'}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          value={this.state.address[cityField]}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange(cityField, update);}}/>
        {stateProvince}
        <ErrorableTextInput errorMessage={this.isValidPostalCode(this.state.address.zipCode) ? undefined : 'Please enter a valid Postal code'}
          additionalClass="usa-input-medium"
          label={selectedCountry === 'USA' ? 'Zip code' : 'Postal code'}
          name="postalCode"
          autocomplete="postal-code"
          value={this.state.address.zipCode}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('zipCode', update);}}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ initialAddress: state.letters.address });

const mapDispatchToProps = { saveAddress };

export default connect(mapStateToProps, mapDispatchToProps)(Address);
