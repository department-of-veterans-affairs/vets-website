import React from 'react';

import Vet360ProfileField from '../../containers/ProfileField';

import PhoneEditModal from './EditModal';
import PhoneView from './View';

export default function Vet360Phone({ title, fieldName, analyticsSectionName }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      Content={PhoneView}
      EditModal={PhoneEditModal}/>
  );
}
