import React from 'react';

import {
  isEmptyAddress
} from '../../../../../../platform/forms/address/helpers';

import Vet360ProfileField from '../../containers/Vet360ProfileField';

import AddressEditModal from './EditModal';
import AddressView from './View';

function isEmpty({ data: addressData } = {}) {
  return isEmptyAddress(addressData);
}

export default function Vet360Address({ title, fieldName, analyticsSectionName, deleteDisabled }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      deleteDisabled={deleteDisabled}
      isEmpty={isEmpty}
      Content={AddressView}
      EditModal={AddressEditModal}/>
  );
}
