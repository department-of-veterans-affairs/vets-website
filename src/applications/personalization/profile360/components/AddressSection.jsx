import React from 'react';

import { kebabCase, toLower } from 'lodash';

import HeadingWithEdit from './HeadingWithEdit';
import Modal from '@department-of-veterans-affairs/formation/Modal';
import Address from './Address';
import LoadingButton from './LoadingButton';
import Transaction from './Transaction';
import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';
import { consolidateAddress, expandAddress, isEmptyAddress, formatAddress } from '../../../../platform/forms/address/helpers';

class EditAddressModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      deleteInitiated: false,
    };
  }

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
    const cancelDeleteAction = () => {
      this.setState({ deleteInitiated: false });
    };

    const confirmDeleteAction = (e) => {
      e.preventDefault();
    };

    const alertContent = (
      <div>
        <h3>Are you sure?</h3>
        <p>This will delete your {toLower(this.props.title)} across many VA records. You can always come back to your profile later if you'd like to add this information back in.</p>
        <div>
          <LoadingButton isLoading={this.props.isLoading} onClick={confirmDeleteAction}>Confirm</LoadingButton>
          <button type="button" className="usa-button-secondary" onClick={cancelDeleteAction}>Cancel</button>
        </div>
      </div>
    );

    if (this.state.deleteInitiated) {
      return (
        <AlertBox
          isVisible
          status="warning"
          content={alertContent}/>
      );
    }

    return (
      <div>
        <LoadingButton isLoading={this.props.isLoading}>Update</LoadingButton>
        <button type="button" className="usa-button-secondary" onClick={this.props.onCancel}>Cancel</button>
        <div className="right">
          <button className="usa-button-secondary button-link"
            onClick={() => this.setState({ deleteInitiated: true })}>
            <i className="fa fa-trash"></i> <span>Delete</span>
          </button>
        </div>
      </div>
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

export default function AddressSection({ addressData, addressConstants, transaction, getTransactionStatus, title, field, clearErrors, isEditing, onChange, onEdit, onAdd,  onCancel, onSubmit }) {
  let content = null;
  let modal = null;

  if (transaction && !transaction.isPending && !transaction.isFailed) {
    content = <Transaction transaction={transaction} getTransactionStatus={getTransactionStatus} fieldType="address"/>;
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
        title={title}
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
