import React from 'react';
// import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const DocumentUploadInfo = (
  <>
    <p>
      Based on your answer, you’ll need to provide supporting documents to help
      us understand your marital status. We’ll ask you to upload these documents
      on the next screen.
    </p>
  </>
);

export default {
  title: 'How did you get married',
  path: 'marriage-type',
  // depends: formData => formData?.maritalStatus !== 'NEVER_MARRIED',
  uiSchema: {
    // ...titleUI('How did you get married?'),
    marriageType: {
      'ui:title': 'How did you get married?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          RELIGIOUS_CEREMONY:
            'In a religious ceremony with a clergyperson who signed my marriage',
          CIVIL_CEREMONY:
            'In a civil ceremony with an officiant who signed my marriage certificate',
          COMMON_LAW: 'By common Law',
          PROXY: 'By proxy',
          OTHER: 'Some other way',
        },
      },
    },
    otherMarriageType: {
      'ui:title':
        "Since the way you got married isn't listed, please explain it here.",
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        expandUnder: 'marriageType',
        expandUnderCondition: 'OTHER',
      },
    },
    'view:documentUploadInfo': {
      'ui:description': DocumentUploadInfo,
      'ui:options': {
        expandUnder: 'marriageType',
        expandUnderCondition: 'OTHER',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['marriageType'],
    properties: {
      marriageType: {
        type: 'string',
        enum: [
          'RELIGIOUS_CEREMONY',
          'CIVIL_CEREMONY',
          'COMMON_LAW',
          'PROXY',
          'OTHER',
        ],
      },
      otherMarriageType: { type: 'string' },
      'view:documentUploadInfo': {
        type: 'object',
        properties: {},
      },
    },
  },
};
