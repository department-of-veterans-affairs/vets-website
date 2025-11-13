import React from 'react';
import {
  titleUI,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Choose your agreement type'),
  agreementType: radioUI({
    title: 'Please select an option below',
    labels: {
      newCommitment: 'New commitment',
      withdrawal: 'Withdrawal of commitment',
    },
    errorMessages: { required: 'Select an agreement type.' },
  }),
  'ui:description': (
    <>
      <p>
        <strong>
          If you want to update a previously submitted commitment,
        </strong>{' '}
        please select "New commitment" and complete the entire form. This will
        replace the existing information we have on file.
      </p>
      <p>
        <strong>If you’re submitting a withdrawal of commitment,</strong> you
        only need to enter your facility code and authorizing official’s
        information.
      </p>
    </>
  ),
};

const schema = {
  type: 'object',
  properties: {
    agreementType: {
      type: 'string',
      enum: ['newCommitment', 'withdrawal'],
    },
  },
  required: ['agreementType'],
};

const updateFormData = (oldData, formData) => {
  const prev = oldData?.agreementType;
  const curr = formData?.agreementType;

  if (prev !== curr) {
    return {
      agreementType: curr,
      authorizedOfficial: {},
      institutionDetails: {},
      newCommitment: {
        principlesOfExcellencePointOfContact: {},
        schoolCertifyingOfficial: {},
      },
      additionalLocations: [],
    };
  }

  return formData;
};

export { uiSchema, schema, updateFormData };
