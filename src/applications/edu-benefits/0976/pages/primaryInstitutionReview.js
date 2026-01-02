// @ts-check
import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { useSelector } from 'react-redux';
import { DetailsCard } from '../components/InstitutionCards';

function PrimaryInstitutionSummary() {
  const formData = useSelector(state => state.form.data);
  const { primaryInstitutionDetails } = formData;
  const isPresent = [
    primaryInstitutionDetails?.name,
    primaryInstitutionDetails?.type,
    primaryInstitutionDetails?.mailingAddress,
  ].every(Boolean);

  if (!isPresent) {
    return <div />;
  }

  return <DetailsCard details={primaryInstitutionDetails} />;
}

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Review your institution details',
      'Please review the information below carefully. ',
    ),
    'view:primaryInstitutionReview': {
      'ui:description': <PrimaryInstitutionSummary />,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:primaryInstitutionReview': {
        type: 'object',
        properties: {},
      },
    },
  },
};
