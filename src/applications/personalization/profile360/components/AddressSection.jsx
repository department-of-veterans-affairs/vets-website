import React from 'react';

import { kebabCase } from 'lodash';

import HeadingWithEdit from './HeadingWithEdit';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import Address from './Address';
import LoadingButton from './LoadingButton';
import Transaction from './Transaction';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import { fieldFailureMessage } from './LoadFail';
import { consolidateAddress, expandAddress, isEmptyAddress, formatAddress } from '../../../../platform/forms/address/helpers';

class EditAddressModal extends React.Component {

  componentDidMount() {
    const defaultFieldValue = { address: {} };
    if (this.props.addressData) {
      defaultFieldValue.address = consolidateAddress(this.props.addressData);
    }
    this.props.onChange(defaultFieldValue);
  }

  onInput = (field, value) => {
    const newFieldValue = {
      address: {
        ...this.props.field.value.address,
        [field]: value
      }
    };
    this.props.onChange(newFieldValue);
  }

  // Receives the field name as its first arg but that fails the linter
  onBlur = () => {}

  onSubmit = (event) => {
    event.preventDefault();
    // @todo Refactor this...
    this.props.onSubmit(expandAddress(this.props.field.value.address));
  }

  render() {
    return (
      <Modal id={kebabCase(this.props.title)} onClose={this.props.onCancel} visible>
        <h3>{this.props.title}</h3>
        <AlertBox
          isVisible={!!this.props.error}
          status="error"
          content={<p>We’re sorry. We couldn’t update your address. Please try again.</p>}
          onCloseAlert={this.props.clearErrors}/>
        <form onSubmit={this.onSubmit}>
          {this.props.field && (
            <Address
              address={this.props.field.value.address}
              onInput={this.onInput}
              onBlur={this.onBlur}
              errorMessages={{}}
              states={this.props.addressConstants.states}
              countries={this.props.addressConstants.countries}/>
          )}
          <LoadingButton isLoading={this.props.isLoading}>Update</LoadingButton>
          <button type="button" className="usa-button-secondary" onClick={this.props.onCancel}>Cancel</button>
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

export default function AddressSection({ addressData, addressConstants, transaction, getTransactionStatus, title, field, clearErrors, isEditing, onChange, onEdit, onAdd,  onCancel, onSubmit }) {
  let content = null;
  let modal = null;

  if (transaction && !transaction.isPending && !transaction.isFailed) {
    content = <Transaction transaction={transaction} getTransactionStatus={getTransactionStatus} fieldType="address"/>;
  } else if (!addressData) {
    content = fieldFailureMessage;
  } else {
    if (!isEmptyAddress(addressData)) {
      content = <AddressView address={addressData}/>;
    } else {
      content = (
        <button
          type="button"
          onClick={onAdd}
          className="va-button-link va-profile-btn">Please add your {title.toLowerCase()}</button>
      );
    }
  }

  if (isEditing) {
    modal = (
      <EditAddressModal
        title="Edit address"
        addressData={addressData}
        addressConstants={addressConstants}
        onChange={onChange}
        field={field}
        error={transaction && transaction.error}
        clearErrors={clearErrors}
        onSubmit={onSubmit}
        isLoading={transaction && transaction.isPending}
        onCancel={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit
        onEditClick={!isEmptyAddress(addressData) && onEdit}>{title}
      </HeadingWithEdit>
      {content}
    </div>
  );
}
