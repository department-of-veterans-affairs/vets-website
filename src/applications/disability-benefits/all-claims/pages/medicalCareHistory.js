import React from 'react';
// import { PtsdNameTitle } from '../helpers';
// import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

const medicalCareDescription = (
  <div>
    <h5>Medical care</h5>
    <p>
      During the last 12 months, have you been under a doctor's care or
      hospitalized for these disabilities?
    </p>
  </div>
);
//
// const otherSourcesSecondaryHelp = (
//   <AdditionalInfo triggerText="Which option should I choose?">
//     <h5>If you need help getting private medical treatment records</h5>
//     <p>
//       You’ll need to authorize us to request your medical records from private
//       health care providers and counselors. You’ll have a chance to do this
//       later in the Supporting Evidence section of the application.
//     </p>
//     <h5>
//       If you need help getting statements from military or civilian authorities
//     </h5>
//     <p>
//       We can request reports from authorities who you’ve reported the event to.
//       We’ll need their name and contact information, if you have them, to
//       request relevant documents on your behalf.
//     </p>
//     <h5>If you don’t need help getting evidence for your claim</h5>
//     <p>
//       Choose this option if you don’t need our help gathering supporting
//       evidence or reports, or if you already have copies of your supporting
//       documents and can upload them directly.
//     </p>
//   </AdditionalInfo>
// );

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': medicalCareDescription,
  careQuestion: {
    'ui:title': ' ',
    'ui:widget': 'radio',
    'ui:options': {
      labels: {
        yes: 'Yes',
        no: 'No',
      },
    },
  },
  'view:careReceived': {
    'ui:options': {
      expandUnder: 'careQuestion',
      expandUnderCondition: 'yes',
    },
    medicalTreatment: {
      'view:doctorCare': {
        'ui:title': 'Yes, I‘ve been under doctor‘s care',
      },
      'view:hospitalization': {
        'ui:title': 'Yes, I‘ve been hospitalized',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    careQuestion: {
      type: 'string',
      enum: ['yes', 'no'],
    },
    'view:careReceived': {
      type: 'object',
      properties: {
        medicalTreatment: {
          type: 'object',
          properties: {
            'view:doctorCare': {
              type: 'boolean',
            },
            'view:hospitalization': {
              type: 'boolean',
            },
          },
        },
      },
    },
  },
};
