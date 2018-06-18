import React from 'react';

import Vet360ProfileField from '../containers/Vet360ProfileField';
import EmailEditModal from './EmailEditModal';

function EmailView({ data: emailData }) {
  return <span>{emailData.emailAddress}</span>;
}

export default function Vet360Email({ title = 'email address', fieldName = 'email', analyticsSectionName = 'email' }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      analyticsSectionName={analyticsSectionName}
      Content={EmailView}
      EditModal={EmailEditModal}/>
  );
}
