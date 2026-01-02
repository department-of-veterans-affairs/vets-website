// @ts-check
import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { useSelector } from 'react-redux';
import { INSTITUTION_TYPES } from '../constants';
import FacilityCodeAdditionalInfo from '../components/FacilityCodeAdditionalInfo';

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

  const {
    street,
    street2,
    street3,
    city,
    state,
    postalCode,
  } = primaryInstitutionDetails.mailingAddress;

  return (
    <div>
      <h3>{primaryInstitutionDetails.name}</h3>
      <p className="vads-u-margin-bottom--0">{street}</p>
      {street2 && <p className="vads-u-margin-y--0">{street2}</p>}
      {street3 && <p className="vads-u-margin-y--0">{street3}</p>}
      <p className="vads-u-margin-top--0">
        {city}, {state} {postalCode}
      </p>
      <FacilityCodeAdditionalInfo />
      <p>
        <strong>The institution is classified as:</strong>
      </p>
      <p>{INSTITUTION_TYPES[primaryInstitutionDetails.type] || 'Other'}</p>
    </div>
  );
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
