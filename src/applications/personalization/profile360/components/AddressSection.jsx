import React from 'react';

import {
  isEmptyAddress,
  formatAddress
} from '../../../../platform/forms/address/helpers';

import Vet360ProfileField from '../containers/Vet360ProfileField';
import AddressEditModal from './AddressEditModal';

function AddressView({ data: address }) {
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

function isEmpty({ data: addressData } = {}) {
  return isEmptyAddress(addressData);
}

export default function Vet360Address({ title, fieldName, analyticsSectionName, addressConstants, deleteDisabled }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      addressConstants={addressConstants}
      deleteDisabled={deleteDisabled}
      isEmpty={isEmpty}
      Content={AddressView}
      EditModal={AddressEditModal}/>
  );
}
