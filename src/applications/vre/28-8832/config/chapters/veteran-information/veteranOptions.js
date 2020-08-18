import React from 'react';

export const schema = {
  type: 'object',
  properties: {
    appliedForVREBefore: {
      type: 'boolean',
    },
    appliedForEducationAssist: {
      type: 'boolean',
    },
    typeOfAssistance: {
      type: 'string',
      maxLength: 100,
    },
  },
};

const veteranOptionsDescription = (
  <p>
    <strong>Giving this information is optional.</strong> If you skip this page,
    and we don’t have this information in your record, we may ask you for this
    again when we process your application.
  </p>
);

export const uiSchema = {
  'ui:description': veteranOptionsDescription,
  appliedForVREBefore: {
    'ui:title':
      'Have you ever applied for Vocational Rehabilitation Benefits (Chapter 31)?',
    'ui:widget': 'yesNo',
  },
  appliedForEducationAssist: {
    'ui:title':
      'Have you ever applied Veterans’ education assistance based on your own service?',
    'ui:widget': 'yesNo',
  },
  typeOfAssistance: {
    'ui:title': 'What assistance did you recieve?',
    'ui:options': {
      expandUnder: 'appliedForEducationAssist',
      expandUnderCondition: true,
    },
  },
};
