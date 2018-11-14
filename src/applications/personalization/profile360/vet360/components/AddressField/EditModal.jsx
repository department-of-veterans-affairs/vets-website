import React from 'react';

import { FIELD_NAMES, ADDRESS_FORM_VALUES, USA } from '../../constants';

import Vet360EditModal from '../base/EditModal';

import CopyMailingAddress from '../../containers/CopyMailingAddress';
import AddressForm from './AddressForm';

export default class AddressEditModal extends React.Component {
  onBlur = field => {
    this.props.onChange(this.props.field.value, field);
  };

  onInput = (field, value) => {
    const newFieldValue = {
      ...this.props.field.value,
      [field]: value,
    };
    this.props.onChange(newFieldValue, field);
  };

  getInitialFormValues = () =>
    this.props.data || { countryName: USA.COUNTRY_NAME };

  copyMailingAddress = mailingAddress => {
    const newAddressValue = { ...this.props.field.value, ...mailingAddress };
    this.props.onChange(newAddressValue, null, true);
  };

  renderForm = () => (
    <div>
      {this.props.fieldName === FIELD_NAMES.RESIDENTIAL_ADDRESS && (
        <CopyMailingAddress
          convertNextValueToCleanData={this.props.convertNextValueToCleanData}
          copyMailingAddress={this.copyMailingAddress}
        />
      )}
      <AddressForm
        address={this.props.field.value}
        onInput={this.onInput}
        onBlur={this.onBlur}
        errorMessages={this.props.field.validations}
        states={ADDRESS_FORM_VALUES.STATES}
        countries={ADDRESS_FORM_VALUES.COUNTRIES}
      />
    </div>
  );

  render() {
    return (
      <Vet360EditModal
        getInitialFormValues={this.getInitialFormValues}
        onBlur={this.onBlur}
        onSubmit={this.onSubmit}
        render={this.renderForm}
        {...this.props}
      />
    );
  }
}
