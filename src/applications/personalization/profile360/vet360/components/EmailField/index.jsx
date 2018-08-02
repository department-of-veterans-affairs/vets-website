import React from 'react';

import {
  API_ROUTES
} from '../../constants';

import { isValidEmail } from '../../../../../../platform/forms/validations';

import Vet360ProfileField from '../../containers/ProfileField';
import EmailEditModal from './EditModal';

import EmailView from './View';

function cleanEditedData(value) {
  const {
    id,
    emailAddress,
  } = value;

  return {
    id,
    emailAddress,
  };
}

function validateEditedData({ emailAddress: email }) {
  return {
    emailAddress: email && isValidEmail(email) ? '' : 'Please enter your email address again, following a standard format like name@domain.com.'
  };
}

export default function Vet360Email({ title = 'Email address', fieldName = 'email' }) {
  return (
    <Vet360ProfileField
      title={title}
      fieldName={fieldName}
      apiRoute={API_ROUTES.EMAILS}
      cleanEditedData={cleanEditedData}
      validateEditedData={validateEditedData}
      Content={EmailView}
      EditModal={EmailEditModal}/>
  );
}
