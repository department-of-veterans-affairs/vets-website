import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash/fp';

import ErrorableSelect from '@department-of-veterans-affairs/jean-pants/ErrorableSelect';
import ErrorableTextInput from '@department-of-veterans-affairs/jean-pants/ErrorableTextInput';

import { focusElement } from '../../../../platform/utilities/ui';
import {
  pciuCountries,
  pciuStates,
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
    // TODO: remove ui:validations
    const { type } = this.props.formData;
    if (type === 'DOMESTIC') {
      this.props.schema.required = ['country', 'addressLine1', 'city', 'state', 'zipCode'];
    } else if (type === 'MILITARY') {
      this.props.schema.required = ['addressLine1', 'militaryStateCode', 'militaryPostOfficeTypeCode'];
    } else {
      this.props.schema.required = ['country', 'addressLine1'];
    }
    console.log('updating');
    debugger;
  }

  setValue = (value, title) => {
    this.props.onChange(_.set(title, value, this.props.formData));
  };

  setType = (value, title) => {
    // Avoid resetting previously set values
    const newData = _.set(title, value, this.props.formData);
    if (
      militaryPostOfficeTypeCodes.includes(_.uppercase(value)) ||
      militaryStateCodes.includes(value)
    ) {
      this.props.onChange(_.set('type', military, newData));
    }
    if (
      title === 'city' &&
      !militaryPostOfficeTypeCodes.includes(_.uppercase(value))
    ) {
      this.props.onChange(_.unset('type', newData));
    }
    if (title === 'country' && value === 'USA') {
      this.props.onChange(_.set('type', domestic, newData));
    }
    if (title === 'country' && value !== 'USA') {
      this.props.onChange(_.set('type', international, newData));
    }
  };

  handleChange = ({ value }, title) => {
    const { militaryPostOfficeTypeCode } = this.props.formData;
    if (!value) {
      return this.props.onChange(_.unset(title, this.props.formData));
    }
    // Set military city and unset non military
    // Is set value needed here?
    if (
      title === 'city' &&
      !militaryPostOfficeTypeCodes.includes(_.uppercase(value))
    ) {
      this.setValue(value, title);
      this.unsetMilitaryValues();
      return this.setType(value, title);
    } else if (
      title === 'city' &&
      militaryPostOfficeTypeCodes.includes(_.uppercase(value))
    ) {
      this.setValue(value, 'militaryPostOfficeTypeCode');

      this.unsetNonMilitaryValues();
      return this.setType(value, 'militaryPostOfficeTypeCode');
      // Set military state and unset non military
    } else if (title === 'state' && militaryStateCodes.includes(value)) {
      this.setValue(value, 'militaryStateCode');
      this.unsetNonMilitaryValues();
      return this.setType(value, 'militaryStateCode');
      // Set state and unset military state
    } else if (title === 'state' && !militaryStateCodes.includes(value)) {
      this.setValue(value, title);
      this.unsetMilitaryValues();
      // Set city and unset military post office type code
    } else if (
      militaryPostOfficeTypeCode &&
      title === 'city' &&
      !militaryPostOfficeTypeCodes.includes(value)
    ) {
      this.setValue(value, title);
      this.unsetMilitaryValues();
      // Set all others
    } else {
      this.setValue(value, title);
      return this.setType(value, title);
    }
  };

  unsetNonMilitaryValues = () => {
    this.props.onChange(_.unset('city', this.props.formData));
    this.props.onChange(_.unset('state', this.props.formData));
    this.props.onChange(_.unset('country', this.props.formData));
  };

  unsetMilitaryValues = () => {
    this.props.onChange(_.unset('militaryStateCode', this.props.formData));
    this.props.onChange(
      _.unset('militaryPostOfficeTypeCode', this.props.formData)
    );
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
    const isUSA = type === domestic;

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
          errorMessage={
            errorSchema.city.__errors[0] ||
            errorSchema.militaryPostOfficeTypeCode.__errors[0]
          }
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
            required={militaryPostOfficeTypeCode}
            onValueChange={value =>
              this.handleChange(value, 'militaryStateCode')
            }
            onBlur={() => this.props.onBlur('militaryStateCode')}/>
        )}
        {isUSA && (
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
            required={isUSA}
            onValueChange={value => this.handleChange(value, 'state')}
            onBlur={() => this.props.onBlur('state')}/>
        )}
        {isUSA && (
          <ErrorableTextInput
            errorMessage={errorSchema.zipCode.__errors[0]}
            additionalClass="usa-input-medium"
            label={'ZIP code'}
            name="zipCode"
            autocomplete="postal-code"
            field={{ value: zipCode }}
            required={isUSA}
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
