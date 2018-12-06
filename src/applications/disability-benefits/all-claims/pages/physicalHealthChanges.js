import React from 'react';

import { PtsdNameTitle } from '../content/ptsdClassification';

const physicalDescriptionChanges = (
  <div>
    <h5>Changes in Behavior or Activities: Physical health</h5>
    <p>
      Now we‘re going to ask you questions about changes in your physical,
      mental, professional and social behavior as a result of the event or
      events. You may have experienced some of these or none of them. There‘s
      space at the end of these questions for you to add comments or describe
      other changes in behavior you‘d like us to know.
    </p>
    <p>
      Please identify any changes in your physical health as a result of the
      event(s).
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ({ formData }) => (
    <PtsdNameTitle formData={formData} formType="781a" />
  ),
  'ui:description': physicalDescriptionChanges,
  physicalChanges: {
    increasedVisits: {
      'ui:title':
        'Increased visits to a medical or counseling clinic or dispensary, even without a specific diagnosis or specific ailment',
    },
    pregnancyTests: {
      'ui:title': 'Pregnancy tests around the time of the incident',
    },
    hivTests: {
      'ui:title': 'Tests for HIV or sexually transmitted diseases',
    },
    weightChanges: {
      'ui:title': 'Extreme weight loss or gain',
    },
    lethargy: {
      'ui:title': 'Lethargy',
    },
    other: {
      'ui:title': 'Other',
    },
    otherExplanation: {
      'ui:title': ' ',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 32000,
        expandUnder: 'other',
      },
    },
    noneApply: {
      'ui:title': 'None of these apply to me',
    },
  },
};

export const schema = {
  type: 'object',

  properties: {
    physicalChanges: {
      type: 'object',
      properties: {
        increasedVisits: {
          type: 'boolean',
        },
        pregnancyTests: {
          type: 'boolean',
        },
        hivTests: {
          type: 'boolean',
        },
        weightChanges: {
          type: 'boolean',
        },
        lethargy: {
          type: 'boolean',
        },
        other: {
          type: 'boolean',
        },
        otherExplanation: {
          type: 'string',
        },
        noneApply: {
          type: 'boolean',
        },
      },
    },
  },
};
