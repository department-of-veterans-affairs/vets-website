import React from 'react';

import {
  FIELD_NAMES,
  ADDRESS_FORM_VALUES
} from '../constants/vet360';

import {
  consolidateAddress,
  expandAddress
} from '../../../../platform/forms/address/helpers';

import Vet360EditModal from './Vet360EditModal';

import CopyMailingAddress from '../containers/CopyMailingAddress';
import Address from './Address';

export default class AddressEditModal extends React.Component {
  onBlur = (field) => {
    this.props.onChange(this.props.field.value, field);
  }

  onInput = (field, value) => {
    const newFieldValue = {
      ...this.props.field.value,
      [field]: value
    };
    this.props.onChange(newFieldValue, field);
  }

  onSubmit = () => {
    this.props.onSubmit(expandAddress(this.props.field.value));
  }

  getInitialFormValues = () => {
    if (this.props.data) {
      return consolidateAddress(this.props.data);
    }
    return {
      countryName: 'United States',
    };
  }

  copyMailingAddress = (mailingAddress) => {
    const newAddressValue = { ...this.props.field.value, ...mailingAddress };
    this.props.onChange(newAddressValue, null, true);
  }

  renderForm = () => {
    return (
      <div>
        {this.props.fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS && <CopyMailingAddress copyMailingAddress={this.copyMailingAddress}/>}
        <Address
          address={this.props.field.value}
          onInput={this.onInput}
          onBlur={this.onBlur}
          errorMessages={this.props.field.validations}
          states={ADDRESS_FORM_VALUES.STATES}
          countries={ADDRESS_FORM_VALUES.COUNTRIES}/>
      </div>
    );
  }

  render() {
    return (
      <Vet360EditModal
        getInitialFormValues={this.getInitialFormValues}
        onBlur={this.onBlur}
        onSubmit={this.onSubmit}
        render={this.renderForm}
        {...this.props}/>
    );
  }
}
