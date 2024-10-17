import React from 'react';

const labels = {
  "I'm a Veteran": "I'm a Veteran",
  "I'm a Veteran's spouse": "I'm a Veteran's spouse",
  "I'm a Veteran's child": "I'm a Veteran's child",
  "I'm a Veteran's caregiver (who isn't their spouse or child)":
    "I'm a Veteran's caregiver (who isn't their spouse or child)",
  "I'm an active duty service member": "I'm an active duty service member",
  "I'm a member of the National Guard": "I'm a member of the National Guard",
  "I'm a Reservist": "I'm a Reservist",
  "I'm a member of the Individual Ready Reserve":
    "I'm a member of the Individual Ready Reserve",
};
const uiTitle = (
  <h3 className="vads-u-margin--0 " data-testid="veteran-description">
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
