import React from 'react';
import ViewDependentsChildForm from './ViewDependentsChildForm.jsx';
import ViewDependentsSpouseForm from './ViewDependentsSpouseForm.jsx';
import ViewDependentsParentForm from './ViewDependentsParentForm.jsx';

function buildFormlett(relationship) {
  let formlett = '';
  switch (relationship) {
    case 'Child':
      formlett = <ViewDependentsChildForm />;
      break;
    case 'Spouse':
      formlett = <ViewDependentsSpouseForm />;
      break;
    case 'Parent':
      formlett = <ViewDependentsParentForm />;
      break;
    default:
  }

  return formlett;
}

export default buildFormlett;
