import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { isTerminallyIll } = fullSchema.properties;

const TerminallyIllInfo = (
  <AdditionalInfo triggerText="Why does this matter?">
    We’ll help to get your claim processed faster if the evidence to support
    your claim shows that you’re terminally ill. Being terminally ill means
    you’re sick with an illness that can’t be cured and will likely result in
    death within a short period of time.
  </AdditionalInfo>
);

export const uiSchema = {
  'ui:title': 'High Priority claims',
  isTerminallyIll: {
    'ui:title': 'Are you terminally ill?',
    'ui:widget': 'yesNo',
  },
  'view:terminallyIllInfo': {
    'ui:description': TerminallyIllInfo,
  },
};

export const schema = {
  type: 'object',
  properties: {
    isTerminallyIll,
    'view:terminallyIllInfo': {
      type: 'object',
      properties: {},
    },
  },
};
