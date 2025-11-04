import React from 'react';
import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns/titlePattern';

const EvidenceRequestBanner = () => {
  return React.createElement(
    'va-alert',
    { status: 'warning', uswds: true },
    React.createElement(
      'h3',
      { slot: 'headline' },
      'We need your help to finish reviewing your application',
    ),
    React.createElement(
      'p',
      null,
      'We need you to provide more evidence (supporting documents) to verify eligibility for a VA Medal of Honor medallion.',
    ),
    React.createElement(
      'p',
      null,
      'You can do this in the supporting documents page at the end of this form. You must upload discharge papers showing Medal of Honor eligibility in order to receive one.',
    ),
  );
};

const TypeDescription = () => {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p',
      null,
      'The Veteran may be eligible for a bronze medallion or a Medal of Honor medallion.',
    ),
    React.createElement(
      'a',
      {
        href: 'https://www.cem.va.gov/hmm/types.asp#Medallions',
        target: '_blank',
        rel: 'noopener noreferrer',
      },
      'Learn more about the types of medallions (opens in a new tab)',
    ),
  );
};

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Type of medallion'),
    'ui:description': TypeDescription,
    typeOfMedallionRadio: radioUI({
      title: 'What type of medallion are you applying for?',
      labels: {
        bronze: 'Bronze',
        medalOfHonor: 'Medal of Honor',
      },
      required: () => true,
      errorMessages: {
        required: 'Please select a response',
      },
    }),
    'view:medalOfHonorBanner': {
      'ui:description': formData =>
        formData.typeOfMedallionRadio === 'medalOfHonor'
          ? React.createElement(EvidenceRequestBanner)
          : null,
    },
  },
  schema: {
    type: 'object',
    properties: {
      typeOfMedallionRadio: radioSchema(['bronze', 'medalOfHonor']),
      'view:medalOfHonorBanner': {
        type: 'object',
        properties: {},
      },
    },
  },
};
