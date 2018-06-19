import React from 'react';

import { isEmptyAddress, formatAddress } from '../../../../platform/forms/address/helpers';

import Vet360ProfileField from '../containers/Vet360ProfileField';
import AddressEditModal from './AddressEditModal';

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
    <AddressEditModal
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
