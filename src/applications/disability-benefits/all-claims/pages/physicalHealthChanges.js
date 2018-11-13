import React from 'react';

const physicalDescriptionChanges = (
  <div>
    <h5>Changes in Behavior or Activities: Physical health</h5>
    <p>
      Now we're going to ask you questions about changes in your physical,
      mental, professional and social behavior as a result of the event or
      events. You may have experienced some of these or none of them. There's
      space at the end of these questions for you to add comments or describe
      other changes in behavior you'd like us to know.
    </p>
    <p>
      Please identify any changes in your physical health as a result of the
      event(s).
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': physicalDescriptionChanges,
  physicalChanges: {
    'view:increasedVisits': {
      'ui:title':
        'Increased visits to a medical or counseling clinic or dispensary, even without a specific diagnosis or specific ailment',
    },
    'view:pregnancyTests': {
      'ui:title': 'Pregnancy tests around the time of the incident',
    },
    'view:hivTests': {
      'ui:title': 'Tests for HIV or sexually transmitted diseases',
    },
    'view:weightChanges': {
      'ui:title': 'Extreme weight loss or gain',
    },
    'view:lethargy': {
      'ui:title': 'Lethargy',
    },
    'view:other': {
      'ui:title': 'Other',
    },
    'view:noneApply': {
      'ui:title': 'None of these apply to me',
    },
  },
  otherExplanation: {
    'ui:title': 'Please specify',
    'ui:options': {
      expandUnder: 'physicalChanges',
      expandUnderCondition: physicalChanges =>
        physicalChanges['view:other'] === true,
    },
  },
};

export const schema = {
  type: 'object',

  properties: {
    physicalChanges: {
      type: 'object',
      properties: {
        'view:increasedVisits': {
          type: 'boolean',
        },
        'view:pregnancyTests': {
          type: 'boolean',
        },
        'view:hivTests': {
          type: 'boolean',
        },
        'view:weightChanges': {
          type: 'boolean',
        },
        'view:lethargy': {
          type: 'boolean',
        },
        'view:other': {
          type: 'boolean',
        },
        'view:noneApply': {
          type: 'boolean',
        },
      },
    },
    otherExplanation: {
      type: 'string',
    },
  },
};
