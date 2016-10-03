import React from 'react';
import _ from 'lodash';

import ErrorableSelect from '../form-elements/ErrorableSelect';
import ErrorableTextInput from '../form-elements/ErrorableTextInput';
import { isBlank, isNotBlank, validateIfDirty } from '../../utils/validations';
import { countries, states } from '../../utils/options-for-select';

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
  }

  componentWillMount() {
    this.id = _.uniqueId('address-input-');
  }

  // TODO: Look into if this is the best way to update address,
  // it is incredibly slow right now
  handleChange(path, update) {
    const address = {
      street: this.props.value.street,
      city: this.props.value.city,
      country: this.props.value.country,
      state: this.props.value.state,
      provinceCode: this.props.value.provinceCode,
      zipcode: this.props.value.zipcode,
      postalCode: this.props.value.postalCode
    };

    address[path] = update;

    this.props.onUserInput(address);
  }

  validateAddressField(field) {
    if (this.props.required) {
      return validateIfDirty(field, isNotBlank);
    }

    return validateIfDirty(field, isBlank) || validateIfDirty(field, isNotBlank);
  }

  render() {
    let stateList = [];
    const selectedCountry = this.props.value.country.value;
    if (states[selectedCountry]) {
      stateList = states[selectedCountry];
    } else {
      stateList.push('Foreign Country');
    }

    const commonForm = (
      <div>
        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.street) ? undefined : 'Please enter a valid street address'}
            label="Street"
            name="address"
            autocomplete="street-address"
            charMax={30}
            field={this.props.value.street}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('street', update);}}/>

        <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.city) ? undefined : 'Please enter a valid city'}
            label="City"
            name="city"
            autocomplete="address-level2"
            charMax={30}
            field={this.props.value.city}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('city', update);}}/>

        <ErrorableSelect errorMessage={this.validateAddressField(this.props.value.country) ? undefined : 'Please enter a valid country'}
            label="Country"
            name="country"
            autocomplete="country"
            options={countries}
            value={this.props.value.country}
            required={this.props.required}
            onValueChange={(update) => {this.handleChange('country', update);}}/>
      </div>
      );

    let secondaryForm = null;
    if (_.hasIn(states, this.props.value.country.value)) {
      secondaryForm = (
        <div>
          <ErrorableSelect errorMessage={this.validateAddressField(this.props.value.state) ? undefined : 'Please enter a valid state'}
              label="State/Province"
              name="state"
              autocomplete="address-level1"
              options={stateList}
              value={this.props.value.state}
              required={this.props.required}
              onValueChange={(update) => {this.handleChange('state', update);}}/>

          <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.zipcode) ? undefined : 'Please enter a valid ZIP code'}
              additionalClass="usa-input-medium"
              label="ZIP code"
              name="zip"
              autocomplete="postal-code"
              field={this.props.value.zipcode}
              required={this.props.required}
              onValueChange={(update) => {this.handleChange('zipcode', update);}}/>
        </div>
      );
    } else {
      secondaryForm = (
        <div>
          <ErrorableTextInput label="State/Province"
              name="province"
              autocomplete="address-level1"
              field={this.props.value.provinceCode}
              required={false}
              onValueChange={(update) => {this.handleChange('provinceCode', update);}}/>

          <ErrorableTextInput errorMessage={this.validateAddressField(this.props.value.postalCode) ? undefined : 'Please enter a valid Postal code'}
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

    return (
      <div>
        {commonForm}
        {secondaryForm}
      </div>
    );
  }
}

export default Address;
