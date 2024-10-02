import React from 'react';
import { serviceStatus } from '../../schemaImports';

export const schema = serviceStatus;

schema.properties.identity.enumNames = [
  <>
    I’m a Veteran, or previously <strong>activated</strong> member of the
    National Guard or Reserves
  </>,
  'I’m an active-duty service member',
  <>
    I’m a <strong>current</strong> member of the National Guard or Reserves{' '}
    <strong>and</strong> was never activated
  </>,
  <>
    I’m a <strong>discharged</strong> member of the National Guard{' '}
    <strong>and</strong> was never activated
  </>,
  <>
    I’m a <strong>discharged</strong> member of the Reserves{' '}
    <strong>and</strong> was never activated
  </>,
];

export const uiSchema = {
  identity: {
    'ui:title': 'Which of these describes you?',
    'ui:widget': 'radio',
  },
};
