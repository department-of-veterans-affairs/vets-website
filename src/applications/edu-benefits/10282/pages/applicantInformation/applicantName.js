import React from 'react';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import createApplicantInformationPage from 'platform/forms/pages/applicantInformation';

const yourName = (
  <h3
    className="vads-u-margin-top--neg2p5 full-name vads-u-color--base"
    data-testid="full-name"
  >
    Your name
  </h3>
);
const uiSchema = {
  veteranFullName: {
    'ui:title': yourName,
    first: {
      'ui:title': 'First name',
      'ui:errorMessages': {
        required: 'Please enter a first name',
      },
    },
    middle: {
      'ui:title': 'Middle name',
    },
    last: {
      'ui:title': 'Last name',
      'ui:errorMessages': {
        required: 'Please enter a last name',
      },
    },
    suffix: {
      'ui:options': {
        classNames: 'hidden',
        hideOnReviewIfFalse: true,
      },
    },
  },
};
const applicantInformationField = () => {
  return {
    ...createApplicantInformationPage(fullSchema10282, {
      isVeteran: true,
      fields: ['veteranFullName'],
      required: ['veteranFullName'],
    }),
    uiSchema: {
      ...uiSchema,
    },
  };
};
export { uiSchema, applicantInformationField };
