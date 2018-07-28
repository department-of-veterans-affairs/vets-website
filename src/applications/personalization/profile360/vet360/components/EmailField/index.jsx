import React from 'react';

import Vet360ProfileField from '../../containers/ProfileField';
import EmailEditModal from './EditModal';

import EmailView from './View';

export default function Vet360Email({ title = 'Email address', fieldName = 'email', analyticsSectionName = 'email' }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      Content={EmailView}
      EditModal={EmailEditModal}/>
  );
}
