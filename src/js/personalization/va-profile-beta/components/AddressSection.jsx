import React from 'react';
import HeadingWithEdit from './HeadingWithEdit';
import Modal from '@department-of-veterans-affairs/jean-pants/Modal';
import Address from '../../../letters/components/Address';
import LoadingButton from './LoadingButton';
import AlertBox from '@department-of-veterans-affairs/jean-pants/AlertBox';
import { fieldFailureMessage } from './LoadFail';
import { ADDRESS_TYPES, consolidateAddress, expandAddress, getStateName, isEmptyAddress } from '../utils';

class EditAddressModal extends React.Component {

  componentDidMount() {
    const defaultFieldValue = { address: {} };
    if (this.props.addressResponseData) {
      defaultFieldValue.address = consolidateAddress(this.props.addressResponseData.address);
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
      <Modal id="profile-address-modal" onClose={this.props.onCancel} visible>
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
          <LoadingButton isLoading={this.props.isLoading}>Save Address</LoadingButton>
        </form>
      </Modal>
    );
  }
}

function AddressView({ address }) {
  const street = [
    address.addressOne,
    address.addressTwo ? `, ${address.addressTwo}` : '',
    address.addressThree ? ` ${address.addressThree}` : ''
  ].join('');

  const country = address.type === ADDRESS_TYPES.international ? address.countryName : '';
  let cityStateZip = '';

  switch (address.type) {
    case ADDRESS_TYPES.domestic:
      cityStateZip = `${address.city}, ${getStateName(address.state)} ${address.zipCode}`;
      break;
    case ADDRESS_TYPES.military:
      cityStateZip = `${address.militaryPostOfficeTypeCode}, ${address.militaryStateCode} ${address.zipCode}`;
      break;
    case ADDRESS_TYPES.international:
    default:
      cityStateZip = address.city;
  }

  return (
    <div>
      {street}<br/>
      {cityStateZip}<br/>
      {country}
    </div>
  );
}

export default function AddressSection({ addressResponseData, addressConstants, title, field, error, clearErrors, isEditing, isLoading, onChange, onEdit, onCancel, onSubmit }) {
  let content = null;
  let modal = null;

  if (addressResponseData) {
    if (addressResponseData.address && !isEmptyAddress(addressResponseData.address)) {
      const { address } = addressResponseData;
      content = <AddressView address={address}/>;
    } else {
      content = <button type="button" onClick={onEdit} className="usa-button-secondary">Add</button>;
    }
  } else {
    content = fieldFailureMessage;
  }

  if (isEditing) {
    modal = (
      <EditAddressModal
        title="Edit mailing address"
        addressResponseData={addressResponseData}
        addressConstants={addressConstants}
        onChange={onChange}
        field={field}
        error={error}
        clearErrors={clearErrors}
        onSubmit={onSubmit}
        isLoading={isLoading}
        onCancel={onCancel}/>
    );
  }

  return (
    <div>
      {modal}
      <HeadingWithEdit
        onEditClick={addressResponseData && addressResponseData.controlInformation.canUpdate && onEdit}>{title}
      </HeadingWithEdit>
      {content}
    </div>
  );
}
