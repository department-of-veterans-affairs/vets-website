import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash/fp';

import ErrorableSelect from '@department-of-veterans-affairs/jean-pants/ErrorableSelect';
import ErrorableTextInput from '@department-of-veterans-affairs/jean-pants/ErrorableTextInput';

import { focusElement } from '../../../../platform/utilities/ui';
import {
  militaryStateCodes,
  militaryPostOfficeTypeCodes,
  ADDRESS_TYPES
} from '../../../../platform/forms/address';

const { domestic, international, military } = ADDRESS_TYPES;

import { getAddressCountries, getAddressStates } from './state/action';

/**
 * Input component for a PCIU address.
 *
 * Additional validation can be specified via ui:validations.
 */

class PCIUAddressField extends React.Component {
  componentDidMount() {
    if (!this.props.statesAvailable) {
      this.props.getAddressStates();
    }
    if (!this.props.countriesAvailable) {
      this.props.getAddressCountries();
    }
    focusElement('h5');
  }

  componentDidUpdate() {
    // conditionally set required fields based on whether a type has been set
    const { type } = this.props.formData;
    if (type === 'DOMESTIC') {
      this.props.schema.required = [
        'country',
        'addressLine1',
        'city',
        'state',
        'zipCode'
      ];
    } else if (type === 'MILITARY') {
      this.props.schema.required = [
        'addressLine1',
        'militaryStateCode',
        'militaryPostOfficeTypeCode'
      ];
    } else {
      this.props.schema.required = ['country', 'addressLine1', 'city'];
    }
  }

  setValue = (value, title) => {
    this.props.onChange(_.set(title, value, this.props.formData));
  };

  setType = (value, title) => {
    let newData = _.set(title, value, this.props.formData);
    if (
      militaryPostOfficeTypeCodes.includes(_.uppercase(value)) ||
      militaryStateCodes.includes(value)
    ) {
      newData = _.set('type', military, newData);
      newData = this.unsetNonMilitaryValues(newData);
    } else if ((title === 'country' && value === 'USA') || title === 'state') {
      newData = _.set('type', domestic, newData);
      newData = this.unsetMilitaryValues(newData);
    } else if (title === 'country' && value !== 'USA') {
      newData = _.set('type', international, newData);
      newData = this.unsetMilitaryValues(newData);
    } else if (title === 'city' && newData.type === 'MILITARY') {
      newData = _.set('type', international, newData);
      newData = this.unsetMilitaryValues(newData);
    }
    this.props.onChange(newData);
  };

  handleChange = ({ value }, title) => {
    const { militaryPostOfficeTypeCode } = this.props.formData;

    if (!value) {
      return this.props.onChange(_.unset(title, this.props.formData));
    }

    if (
      title === 'city' &&
      militaryPostOfficeTypeCodes.includes(_.uppercase(value))
    ) {
      return this.setType(value, 'militaryPostOfficeTypeCode');
      // Set military state and unset non military
    } else if (
      title === 'militaryStateCode' ||
      (title === 'state' && militaryStateCodes.includes(value))
    ) {
      return this.setType(value, 'militaryStateCode');
      // Set state and unset military state
    } else if (title === 'state' && !militaryStateCodes.includes(value)) {
      return this.setType(value, title);
      // Set city and unset military post office type code
    } else if (
      militaryPostOfficeTypeCode &&
      title === 'city' &&
      !militaryPostOfficeTypeCodes.includes(value)
    ) {
      return this.setType(value, title);
      // Set all others
    }
    return this.setType(value, title);
  };

  unsetNonMilitaryValues = formData => {
    let newData = _.unset('city', formData);
    newData = _.unset('state', newData);
    newData = _.unset('country', newData);
    newData = _.unset('zipCode', newData);
    return newData;
  };

  unsetMilitaryValues = formData => {
    let newData = _.unset('militaryStateCode', formData);
    newData = _.unset('militaryPostOfficeTypeCode', newData);
    return newData;
  };

  render() {
    const { formData, errorSchema } = this.props;
    const {
      type,
      city,
      country,
      state,
      zipCode,
      addressLine1,
      addressLine2,
      addressLine3,
      militaryPostOfficeTypeCode,
      militaryStateCode
    } = formData;

    const viewCity = city || militaryPostOfficeTypeCode;
    const isMilitary = !!(type === military);
    const isDomestic = type === domestic;
    const viewCityError = isMilitary ? errorSchema.militaryPostOfficeTypeCode.__errors[0] : errorSchema.city.__errors[0];

    return (
      <div>
        {!isMilitary && (
          <ErrorableSelect
            errorMessage={errorSchema.country.__errors[0]}
            label="Country"
            name="country"
            autocomplete="country"
            options={this.props.countries}
            value={{ value: country }}
            required={!isMilitary}
            onValueChange={value => this.handleChange(value, 'country')}
            onBlur={() => this.props.onBlur('country')}/>
        )}
        <ErrorableTextInput
          errorMessage={errorSchema.addressLine1.__errors[0]}
          label="Street address"
          name="addressLine1"
          autocomplete="address-line1"
          charMax={35}
          field={{ value: addressLine1 }}
          required
          onValueChange={value => this.handleChange(value, 'addressLine1')}
          onBlur={() => this.props.onBlur('addressLine1')}/>
        <ErrorableTextInput
          errorMessage={errorSchema.addressLine2.__errors[0]}
          label="Street address (optional)"
          name="addressLine2"
          autocomplete="address-line2"
          charMax={35}
          field={{ value: addressLine2 }}
          onValueChange={value => this.handleChange(value, 'addressLine2')}
          onBlur={() => this.props.onBlur('addressLine2')}/>
        <ErrorableTextInput
          errorMessage={errorSchema.addressLine3.__errors[0]}
          label="Street address (optional)"
          name="addressLine3"
          autocomplete="address-line3"
          charMax={35}
          field={{ value: addressLine3 }}
          onValueChange={value => this.handleChange(value, 'addressLine3')}
          onBlur={() => this.props.onBlur('addressLine3')}/>
        <ErrorableTextInput
          errorMessage={viewCityError}
          label={
            <span>
              City <em>(or APO/FPO/DPO)</em>
            </span>
          }
          name="city"
          autocomplete="address-level2"
          charMax={30}
          field={{ value: viewCity }}
          required
          onValueChange={value => this.handleChange(value, 'city')}
          onBlur={() => {
            if (city) {
              this.props.onBlur('city');
            }
            if (militaryPostOfficeTypeCode) {
              this.props.onBlur('militaryPostOfficeTypeCode');
            }
          }}/>
        {isMilitary && (
          <ErrorableSelect
            errorMessage={errorSchema.militaryStateCode.__errors[0]}
            label={
              <span>
                State <em>(or AA/AE/AP)</em>
              </span>
            }
            name="militaryStateCode"
            autocomplete="address-level2"
            options={militaryStateCodes}
            value={{ value: militaryStateCode }}
            required={isMilitary}
            onValueChange={value =>
              this.handleChange(value, 'militaryStateCode')
            }
            onBlur={() => this.props.onBlur('militaryStateCode')}/>
        )}
        {isDomestic && (
          <ErrorableSelect
            errorMessage={errorSchema.state.__errors[0]}
            label={
              <span>
                State <em>(or AA/AE/AP)</em>
              </span>
            }
            name="state"
            autocomplete="address-level1"
            options={this.props.states}
            value={{ value: state }}
            required={isDomestic}
            onValueChange={value => this.handleChange(value, 'state')}
            onBlur={() => this.props.onBlur('state')}/>
        )}
        {isDomestic && (
          <ErrorableTextInput
            errorMessage={errorSchema.zipCode.__errors[0]}
            additionalClass="usa-input-medium"
            label={'ZIP code'}
            name="zipCode"
            autocomplete="postal-code"
            field={{ value: zipCode }}
            required={isDomestic}
            onValueChange={value => this.handleChange(value, 'zipCode')}
            onBlur={() => this.props.onBlur('zipCode')}/>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { countries, countriesAvailable, states, statesAvailable } = state.pciu;

  return {
    countries,
    countriesAvailable,
    states,
    statesAvailable
  };
}

const mapDispatchToProps = {
  getAddressCountries,
  getAddressStates
};

PCIUAddressField.propTypes = {
  countries: PropTypes.array.isRequired,
  countriesAvailable: PropTypes.bool.isRequired,
  states: PropTypes.array.isRequired,
  statesAvailable: PropTypes.bool.isRequired,
  getAddressCountries: PropTypes.func.isRequired,
  getAddressStates: PropTypes.func.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  errorSchema: PropTypes.object,
  requiredSchema: PropTypes.object,
  idSchema: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  formData: PropTypes.object,
  disabled: PropTypes.bool,
  readonly: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(PCIUAddressField);

export { PCIUAddressField };
