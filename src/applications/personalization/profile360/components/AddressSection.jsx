import React from 'react';
import { kebabCase } from 'lodash';

import Modal from '@department-of-veterans-affairs/formation/Modal';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import { consolidateAddress, expandAddress, isEmptyAddress, formatAddress } from '../../../../platform/forms/address/helpers';

import Vet360ProfileField from '../containers/Vet360ProfileField';
import Address from './Address';
import LoadingButton from './LoadingButton';
import FormActionButtons from './FormActionButtons';

class EditAddressModal extends React.Component {
  componentDidMount() {
    let defaultFieldValue = {};
    if (this.props.addressData) {
      defaultFieldValue = consolidateAddress(this.props.addressData);
    }
    this.props.onChange(defaultFieldValue);
  }

  onInput = (field, value) => {
    const newFieldValue = {
      ...this.props.field.value,
      [field]: value
    };

    this.props.onChange(newFieldValue);
  }

  // Receives the field name as its first arg but that fails the linter
  onBlur = () => {}

  onSubmit = (event) => {
    event.preventDefault();
    // @todo Refactor this...
    this.props.onSubmit(expandAddress(this.props.field.value));
  }

  renderActionButtons() {
    return (
      <FormActionButtons onCancel={this.props.onCancel} onDelete={this.props.onDelete} title={this.props.title} deleteEnabled={!isEmptyAddress(this.props.addressData)}>
        <LoadingButton isLoading={this.props.isLoading}>Update</LoadingButton>
        <button type="button" className="usa-button-secondary" onClick={this.props.onCancel}>Cancel</button>
      </FormActionButtons>
    );
  }

  render() {
    return (
      <Modal id={kebabCase(this.props.title)} onClose={this.props.onCancel} visible>
        <h3>Edit {this.props.title}</h3>
        <AlertBox
          isVisible={!!this.props.error}
          status="error"
          content={<p>We’re sorry. We couldn’t update your address. Please try again.</p>}
          onCloseAlert={this.props.clearErrors}/>
        <form onSubmit={this.onSubmit}>
          {this.props.field && (
            <Address
              address={this.props.field.value}
              onInput={this.onInput}
              onBlur={this.onBlur}
              errorMessages={{}}
              states={this.props.addressConstants.states}
              countries={this.props.addressConstants.countries}/>
          )}
          {this.renderActionButtons()}
        </form>
      </Modal>
    );
  }
}

function AddressView({ address }) {
  const { street, cityStateZip, country } = formatAddress({
    addressOne: address.addressLine1,
    addressTwo: address.addressLine2,
    addressThree: address.addressLine3,
    type: address.addressType.toUpperCase(),
    ...address,
  });

  return (
    <div>
      {street}<br/>
      {cityStateZip}<br/>
      {country}
    </div>
  );
}

function isEmpty({ data: addressData }) {
  return isEmptyAddress(addressData);
}

function renderContent({ data: addressData }) {
  return <AddressView address={addressData}/>;
}

function renderEditModal({ title, data: addressData, addressConstants, onChange, field, transactionRequest, clearErrors, onSubmit, onCancel, onDelete }) {
  return (
    <EditAddressModal
      title={title}
      addressData={addressData}
      addressConstants={addressConstants}
      onChange={onChange}
      field={field}
      error={transactionRequest && transactionRequest.error}
      clearErrors={clearErrors}
      onSubmit={onSubmit}
      isLoading={transactionRequest && transactionRequest.isPending}
      onCancel={onCancel}
      onDelete={onDelete}/>
  );
}

export default function Vet360Address({ title, fieldName, analyticsSectionName, addressConstants }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      addressConstants={addressConstants}
      renderContent={renderContent}
      renderEditModal={renderEditModal}
      isEmpty={isEmpty}/>
  );
}
