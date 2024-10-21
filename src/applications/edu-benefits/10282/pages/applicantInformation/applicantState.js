import React from 'react';
import { VaSelectField } from 'platform/forms-system/src/js/web-component-fields';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import constants from 'vets-json-schema/dist/constants.json';

const { state } = fullSchema10282.definitions;

export const uiSchema = {
  'ui:title': (
    <h3
      className="vads-u-margin--0 vads-u-color--base"
      data-testid="state-title"
    >
      What state do you live in?
    </h3>
  ),

  state: {
    'ui:title': 'State',
    'ui:webComponentField': VaSelectField,
    'ui:errorMessages': {
      required: 'You must select a state',
    },
  },
};
export const schema = {
  type: 'object',
  required: ['state'],
  properties: {
    state: {
      ...state,
      enum: constants.states.USA.map(st => st.label),
    },
  },
};
