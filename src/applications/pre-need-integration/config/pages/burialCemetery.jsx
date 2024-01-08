import React from 'react';

import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';

import { useSelector } from 'react-redux';
import {
  isVeteran,
  getCemeteries,
  desiredCemeteryNoteDescriptionVeteran,
  desiredCemeteryNoteDescriptionNonVeteran,
} from '../../utils/helpers';

function DesiredCemeteryNoteDescription() {
  const data = useSelector(state => state.form.data || {});
  return isVeteran(data)
    ? desiredCemeteryNoteDescriptionVeteran
    : desiredCemeteryNoteDescriptionNonVeteran;
}

function DesiredCemeteryTitle() {
  const data = useSelector(state => state.form.data || {});
  return isVeteran(data)
    ? 'Which VA national cemetery would you prefer to be buried in?'
    : 'Which VA national cemetery would the applicant prefer to be buried in?';
}

export const desiredCemeteryNoteTitleWrapper = (
  <a
    href="https://www.va.gov/find-locations/"
    rel="noreferrer"
    target="_blank"
    className="desiredCemeteryNoteTitle"
  >
    Find a VA national cemetery (opens in a new tab)
  </a>
);

function DesiredCemeteryNoteTitle() {
  return desiredCemeteryNoteTitleWrapper;
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
      'view:desiredCemeteryNote': {
        'ui:title': DesiredCemeteryNoteTitle,
        'ui:description': DesiredCemeteryNoteDescription,
      },
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
