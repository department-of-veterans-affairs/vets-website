import React from 'react';
import _ from 'lodash';
import { set } from 'lodash/fp';

import ErrorableSelect from '../components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../components/form-elements/ErrorableTextInput';
import { isNotBlank, isBlankAddress, validateIfDirty, isValidUSZipCode, isValidCanPostalCode } from '../utils/validations';
import { countries, states } from '../utils/options-for-select';

/**
 * Input component for an address.
 *
 * No validation is provided through a currently stubbed isAddressValid function.
 */
class Address extends React.Component {
  constructor(props) {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.validateAddressField = this.validateAddressField.bind(this);
    this.validatePostalCode = this.validatePostalCode.bind(this);
    this.state = { value: props.formData, touched: { street: false, city: false, state: false, country: false, postalCode: false } };
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  handleBlur(field) {
    const newState = _.set(['touched', field], true, this.state);
    this.setState(newState, () => {
      if (newState.touched.street && newState.touched.city && newState.touched.state && newState.touched.country && newState.touched.postalCode) {
        this.props.onBlur(this.props.id, newState.value);
      }
    });
  }

  // TODO: Look into if this is the best way to update address,
  // it is incredibly slow right now
  handleChange(path, update) {
    let address = set(path, update, this.props.value);
    // if country is changing we should clear the state
    if (path === 'country') {
      address = set('state.value', '', address);
    }

    this.props.onChange(address);
  }

  validateAddressField(field) {
    if (this.props.required || !isBlankAddress(this.props.value)) {
      return validateIfDirty(field, isNotBlank);
    }

    return true;
  }

  validatePostalCode(postalCodeField) {
    let isValid = true;

    if (this.props.required || !isBlankAddress(this.props.formData)) {
      isValid = isValid && validateIfDirty(postalCodeField, isNotBlank);
    }

    if (this.props.formData.country === 'USA' && isNotBlank(postalCodeField.value)) {
      isValid = isValid && validateIfDirty(postalCodeField, isValidUSZipCode);
    }

    if (this.props.formData.country === 'CAN' && isNotBlank(postalCodeField.value)) {
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
    debugger;
    const selectedCountry = this.props.formData.country;
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
      if (this.props.formData.city && this.isMilitaryCity(this.props.formData.city)) {
        stateList = stateList.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
      }
    }

    const stateProvince = _.hasIn(states, this.props.formData.country)
      ? <ErrorableSelect errorMessage={this.validateAddressField(this.props.formData.state) ? undefined : 'Please enter a valid state/province'}
          label={this.props.formData.country === 'CAN' ? 'Province' : 'State'}
          name="state"
          autocomplete="address-level1"
          options={stateList}
          value={this.props.formData.state}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('state', update);}}/>
      : <ErrorableTextInput label="State/province"
          name="province"
          autocomplete="address-level1"
          field={{value: this.props.formData.state, dirty: true}}
          required={false}
          onValueChange={(update) => {this.handleChange('state', update);}}/>;

    return (
      <div>
        <ErrorableSelect errorMessage={this.validateAddressField(this.props.formData.country) ? undefined : 'Please enter a country'}
            label="Country"
            name="country"
            autocomplete="country"
            options={countries}
            value={this.props.formData.country}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('country', update);}}/>
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.formData.street) ? undefined : 'Please enter a street address'}
            label="Street"
            name="address"
            autocomplete="street-address"
            charMax={30}
            field={this.props.formData.street}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('street', update);}}/>
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.formData.city) ? undefined : 'Please enter a city'}
            label={<span>City <em>(or APO/FPO/DPO)</em></span>}
            name="city"
            autocomplete="address-level2"
            charMax={30}
            field={this.props.formData.city}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('city', update);}}/>
        {stateProvince}
        <ErrorableTextInput errorMessage={this.validatePostalCode(this.props.formData.postalCode) ? undefined : 'Please enter a valid Postal code'}
            additionalClass="usa-input-medium"
            label={this.props.formData.country === 'USA' ? 'Zip code' : 'Postal code'}
            name="postalCode"
            autocomplete="postal-code"
            field={this.props.formData.postalCode}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('postalCode', update);}}/>
      </div>
    );
  }
}

export default Address;
