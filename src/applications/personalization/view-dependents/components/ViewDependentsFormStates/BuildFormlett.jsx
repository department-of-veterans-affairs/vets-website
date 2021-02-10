import React from 'react';
import ViewDependentsChildForm from './ViewDependentsChildForm.jsx';
import ViewDependentsSpouseForm from './ViewDependentsSpouseForm.jsx';

function buildFormlett(relationship) {
  let formlett = '';
  switch (relationship) {
    case 'Child':
      formlett = <ViewDependentsChildForm />;
      break;
    case 'Spouse':
      formlett = <ViewDependentsSpouseForm />;
      break;
    default:
  }

  return formlett;
}

export default buildFormlett;
