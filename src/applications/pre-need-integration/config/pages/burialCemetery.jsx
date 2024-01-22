import React from 'react';

import { useSelector } from 'react-redux';
import * as autosuggest from '../../definitions/autosuggest';

import { getCemeteries, isAuthorizedAgent } from '../../utils/helpers';

function DesiredCemeteryTitle() {
  const data = useSelector(state => state.form.data || {});
  return !isAuthorizedAgent(data)
    ? 'Which VA national cemetery would you prefer to be buried in?'
    : 'Which VA national cemetery would the applicant prefer to be buried in?';
}

export const desiredCemeteryTitleWrapper = <DesiredCemeteryTitle />;

export const uiSchema = {
  application: {
    claimant: {
      desiredCemetery: autosuggest.uiSchema(
        desiredCemeteryTitleWrapper,
        getCemeteries,
        {
          'ui:options': {
            inputProps: {
              'aria-describedby': 'burial-cemetary-note',
            },
          },
        },
      ),
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      required: ['hasCurrentlyBuried'],
      properties: {
        claimant: {
          type: 'object',
          properties: {
            desiredCemetery: autosuggest.schema,
            'view:desiredCemeteryNote': {
              type: 'object',
              properties: {},
            },
          },
        },
      },
    },
  },
};
