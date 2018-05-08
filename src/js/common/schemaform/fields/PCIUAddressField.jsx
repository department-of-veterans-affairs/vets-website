import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash/fp';

// TODO: add proptypes
// import PropTypes from 'prop-types';

import ErrorableSelect from '@department-of-veterans-affairs/jean-pants/ErrorableSelect';
import ErrorableTextInput from '@department-of-veterans-affairs/jean-pants/ErrorableTextInput';


import { focusElement } from '../../../../platform/utilities/ui';
import { pciuCountries, pciuStates, statesOnlyInPCIU, militaryStateCodes, militaryPostOfficeTypeCodes, isValidPCIUZipCode, isValidSpecialCharacter } from '../../../../platform/forms/address';

import {
  getAddressCountries,
  getAddressStates
} from './state/action';


/**
 * Input component for a PCIU address.
 *
 * Additional validation can be specified via ui:validations.
 */

class PCIUAddress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      states: pciuStates,
      countries: pciuCountries
    }
  }
  // TODO: is this used for navigating to errors etc??
  //componentWillMount() {
    //this.id = _.uniqueId('address-input-');
  //}

  componentDidMount() {
    if (!this.props.pciu.statesAvailable) {
      this.props.getAddressStates();
    }
    if (!this.props.pciu.countriesAvailable) {
      this.props.getAddressCountries();
    }
    focusElement('h5');
  }

  handleChange = ({ value }, title) => {
    const { militaryStateCode, militaryPostOfficeTypeCode, state } = this.props.formData;
    if (!value) {
      return this.props.onChange(_.unset(title, this.props.formData));
    }
    // Set military city and unset non military
    if (title === 'city' && militaryPostOfficeTypeCodes.includes(_.uppercase(value))) {
      this.setValue(value, 'militaryPostOfficeTypeCode');

      this.unsetNonMilitaryValues();
      return this.setType(value, 'militaryPostOfficeTypeCode');
      // Set military state and unset non military
    } else if (title === 'state' && militaryStateCodes.includes(value)) {
      this.setValue(value, 'militaryStateCode');
      this.unsetNonMilitaryValues();
      return this.setType(value, 'militaryStateCode');
      // Set state and unset military state
    } else if (title === 'state' && !militaryStateCodes.includes(value))  {
      this.setValue(value, title);
      this.unsetMilitaryValues();
      // Set city and unset military post office type code 
    } else if (militaryPostOfficeTypeCode && title === 'city' && !militaryPostOfficeTypeCodes.includes(value))  {
      this.setValue(value, title);
      this.unsetMilitaryValues();
      // Set all others
    } else {
      this.setValue(value, title);
      return this.setType(value, title);
    }
  }

  setValue = (value, title) => {
    this.props.onChange(_.set(title, value, this.props.formData));
  }

  setType = (value, title) => {
    // Avoid resetting previously set values
    const newData = _.set(title, value, this.props.formData);
    if (militaryPostOfficeTypeCodes.includes(_.uppercase(value)) || militaryStateCodes.includes(value)) {
      this.props.onChange(_.set('type', 'MILITARY', newData));
    }
    if (title === 'country' && value === 'USA') {
      this.props.onChange(_.set('type', 'DOMESTIC', newData));
    }
    if (title === 'country' && value !== 'USA') {
      this.props.onChange(_.set('type', 'INTERNATIONAL', newData));
    }
  }


  unsetNonMilitaryValues = () => {
    this.props.onChange(_.unset('city', this.props.formData));
    this.props.onChange(_.unset('state', this.props.formData));
    this.props.onChange(_.unset('country', this.props.formData));
  }

  unsetMilitaryValues = () => {
    this.props.onChange(_.unset('militaryStateCode', this.props.formData));
    this.props.onChange(_.unset('militaryPostOfficeTypeCode', this.props.formData));
  }

  render() {
    const {
      type, city, country, state, zipCode,
      addressLine1, addressLine2, addressLine3,
      militaryPostOfficeTypeCode, militaryStateCode
    } = this.props.formData;
    debugger;
    // TODO: replace with constants
    const viewCity = city || militaryPostOfficeTypeCode;
    const isMilitary = type === 'MILITARY';
    const isUSA = type === 'DOMESTIC';
    debugger;
    // TODO: remove viewCity from uischema
    const { errorSchema } = this.props;
    return (
      <div>
        {!isMilitary && <ErrorableSelect
          errorMessage={errorSchema.country.__errors[0]}
          label="Country"
          name="country"
          autocomplete="country"
          options={this.props.countries}
          value={{ value: country }}
          required={!isMilitary}
          onValueChange={(value) => this.handleChange(value, 'country')}
          onBlur={() => this.props.onBlur('country')}/>}
        <ErrorableTextInput
          errorMessage={errorSchema.addressLine1.__errors[0]}
          label="Street address"
          name="addressLine1"
          autocomplete="address-line1"
          charMax={35}
          field={{ value: addressLine1 }}
          required={true}
          onValueChange={(value) => this.handleChange(value, 'addressLine1')}
          onBlur={() => this.props.onBlur('addressLine1')}/>
        <ErrorableTextInput
          errorMessage={errorSchema.addressLine2.__errors[0]}
          label="Street address (optional)"
          name="addressLine2"
          autocomplete="address-line2"
          charMax={35}
          field={{ value: addressLine2 }}
          onValueChange={(value) => this.handleChange(value, 'addressLine2')}
          onBlur={() => this.props.onBlur('addressLine2')}/>
        <ErrorableTextInput
          errorMessage={errorSchema.addressLine3.__errors[0]}
          label="Street address (optional)"
          name="addressLine3"
          autocomplete="address-line3"
          charMax={35}
          field={{ value: addressLine3 }}
          onValueChange={(value) => this.handleChange(value, 'addressLine3')}
          onBlur={() => this.props.onBlur('addressLine3')}/>
        <ErrorableTextInput
          errorMessage={errorSchema.city.__errors[0]}
          label={<span>City <em>(or APO/FPO/DPO)</em></span>}
          name="city"
          autocomplete="address-level2"
          charMax={30}
          field={{ value: viewCity }}
          required
          onValueChange={(value) => this.handleChange(value, 'city')}
          onBlur={() => {
            if (city) {
              this.props.onBlur('city');
            }
            if (militaryPostOfficeTypeCode) {
              this.props.onBlur('militaryPostOfficeTypeCode');
            }
          }}/>
        {isMilitary && <ErrorableSelect
          errorMessage={errorSchema.militaryPostOfficeTypeCode.__errors[0]}
          label={<span>State <em>(or AA/AE/AP)</em></span>}
          name="militaryStateCode"
          autocomplete="address-level2"
          options={militaryStateCodes}
          value={{ value: militaryStateCode }}
          required={militaryPostOfficeTypeCode}
          onValueChange={(value) => this.handleChange(value, 'militaryStateCode')}
          onBlur={() => this.props.onBlur('militaryStateCode')}/>}
        {isUSA && <ErrorableSelect
          errorMessage={errorSchema.state.__errors[0]}
          label={<span>State <em>(or AA/AE/AP)</em></span>}
          name="state"
          autocomplete="address-level1"
          options={this.props.states}
          value={{ value: state }}
          required={isUSA}
          onValueChange={(value) => this.handleChange(value, 'state')}
          onBlur={() => this.props.onBlur('state')}/>}
        {isUSA && <ErrorableTextInput
          errorMessage={errorSchema.zipCode.__errors[0]}
          additionalClass="usa-input-medium"
          label={'ZIP code'}
          name="zipCode"
          autocomplete="postal-code"
          field={{ value: zipCode }}
          required={isUSA}
          onValueChange={(value) => this.handleChange(value, 'zipCode')}
          onBlur={() => this.props.onBlur('zipCode')}/>}
      </div>
    );
  }
}


function mapStateToProps(state) {
  const {
    countries,
     countriesAvailable,
      states,
      statesAvailable
  } = state.pciu;

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

export default connect(mapStateToDispatch, mapDispatchToProps)(PCIUAddress);

export  { PCIUAddress };
