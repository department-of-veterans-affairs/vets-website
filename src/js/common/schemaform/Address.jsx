import React from 'react';
import _ from 'lodash';
import { set } from 'lodash/fp';

import ErrorableSelect from '../components/form-elements/ErrorableSelect';
import ErrorableTextInput from '../components/form-elements/ErrorableTextInput';
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

  handleChange(path, update) {
    let newState = _.set(this.state, ['value', path], update);
    newState = _.set(newState, ['touched', path], true);
    
    // if country is changing we should clear the state
    if (path === 'country') {
      newState = _.set(newState, ['value', 'state'], '');
    }

    this.props.onChange(newState.value);
  }

  isMilitaryCity(city) {
    const lowerCity = city.toLowerCase().trim();

    return lowerCity === 'apo' || lowerCity === 'fpo' || lowerCity === 'dpo';
  }

  render() {
    let stateList = [];
    const selectedCountry = this.props.formData.country.value || this.props.formData.country;
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
      if (this.props.formData.city && this.isMilitaryCity(this.props.formData.city)) {
        stateList = stateList.filter(state => state.value === 'AE' || state.value === 'AP' || state.value === 'AA');
      }
    }

    const stateProvince = _.hasIn(states, selectedCountry)
      ? <ErrorableSelect
          label={selectedCountry === 'CAN' ? 'Province' : 'State'}
          name="state"
          autocomplete="address-level1"
          options={stateList}
          value={{dirty: false, value: this.props.formData.state}}
          required={this.props.required}
          onValueChange={(update) => {this.handleChange('state', update);}}/>
      : <ErrorableTextInput label="State/province"
          name="province"
          autocomplete="address-level1"
          field={{value: this.props.formData.state, dirty: false}}
          required={false}
          onValueChange={(update) => {this.handleChange('state', update);}}/>;

    return (
      <div>
        <ErrorableSelect
            label="Country"
            name="country"
            autocomplete="country"
            options={countries}
            value={{dirty: false, value: selectedCountry}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('country', update);}}/>
        <ErrorableTextInput
            label="Street"
            name="address"
            autocomplete="street-address"
            charMax={30}
            field={{dirty: false, value: this.props.formData.street}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('street', update);}}/>
        <ErrorableTextInput
            label="Line 2"
            name="address2"
            autocomplete="street-address2"
            charMax={30}
            field={{dirty: false, value: this.props.formData.street2}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('street', update);}}/>
        <ErrorableTextInput
            label={<span>City <em>(or APO/FPO/DPO)</em></span>}
            name="city"
            autocomplete="address-level2"
            charMax={30}
            field={{dirty: false, value: this.props.formData.city}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('city', update);}}/>
        {stateProvince}
        <ErrorableTextInput
            additionalClass="usa-input-medium"
            label={this.props.formData.country === 'USA' ? 'Zip code' : 'Postal code'}
            name="postalCode"
            autocomplete="postal-code"
            field={{dirty: false, value: this.props.formData.postalCode}}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('postalCode', update);}}/>
      </div>
    );
  }
}

export default Address;
