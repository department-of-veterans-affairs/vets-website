import React from 'react';
import ViewDependentsChildForm from './ViewDependentsChildForm';
import ViewDependentsSpouseForm from './ViewDependentsSpouseForm';

function buildFormlett(relationship) {
  let formlett = null;
  switch (relationship) {
    case 'Child':
      formlett = <ViewDependentsChildForm />;
      break;
    case 'Spouse':
      formlett = <ViewDependentsSpouseForm />;
      break;
    default:
  }

  return <div>{formlett}</div>;
}

export default buildFormlett;
