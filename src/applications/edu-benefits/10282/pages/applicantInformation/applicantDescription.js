import React from 'react';

const labels = {
  veteran: "I'm a Veteran",
  veteranSpouse: "I'm a Veteran's Spouse",
  veteranChild: "I'm a Veteran's Child",
  veteranCaregiver:
    "I'm a Veteran's Caregiver (who isn't their spouse or child)",
  activeDuty: "I'm an active duty service member",
  nationalGuard: "I'm a member of the National Guard",
  reservist: "I'm a Reservist",
  reserve: "I'm a member of the Individual ready reserve",
};
const uiTitle = (
  <h3 className="vads-u-margin--0">Which of these best describes you?</h3>
);
export const uiSchema = {
  veteranDesc: {
    'ui:title': uiTitle,
    'ui:widget': 'radio',
    'ui:options': {
      labels,
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
