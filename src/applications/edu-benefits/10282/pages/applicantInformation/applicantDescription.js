import React from 'react';

export const labels = {
  veteran: "I'm a Veteran",
  veteranSpouse: "I'm a Veteran's spouse",
  veteranChild: "I'm a Veteran's child",
  veteranCaregiver:
    "I'm a Veteran's caregiver (who isn't their spouse or child)",
  activeDuty: "I'm an active duty service member",
  nationalGuard: "I'm a member of the National Guard",
  reservist: "I'm a Reservist",
  reserve: "I'm a member of the Individual Ready Reserve",
};
const uiTitle = (
  <h3 className="vads-u-margin--0 vads-u-color--base">
    Which of these best describes you?
  </h3>
);

export const uiSchema = {
  veteranDesc: {
    'ui:title': uiTitle,
    'ui:widget': 'radio',
    'ui:errorMessages': {
      required: 'You must select one of the options',
    },
    'ui:options': {
      labels,
      hideOnReview: true,
    },
  },
};
export const schema = {
  type: 'object',
  required: ['veteranDesc'],
  properties: {
    veteranDesc: { type: 'string', enum: Object.keys(labels) },
  },
};
