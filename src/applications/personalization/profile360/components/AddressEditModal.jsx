import React from 'react';

import {
  consolidateAddress,
  expandAddress
} from '../../../../platform/forms/address/helpers';

import Vet360EditModal from './Vet360EditModal';
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
    this.props.onChange(newFieldValue);
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

  renderForm = () => {
    return (
      <Address
        address={this.props.field.value}
        onInput={this.onInput}
        onBlur={this.onBlur}
        errorMessages={this.props.field.validations}
        states={this.props.addressConstants.states}
        countries={this.props.addressConstants.countries}/>
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
