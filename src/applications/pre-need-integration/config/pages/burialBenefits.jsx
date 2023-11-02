import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';
import React from 'react';

import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';

import { useSelector } from 'react-redux';
import {
  isVeteran,
  getCemeteries,
  desiredCemeteryNoteDescriptionVeteran,
  desiredCemeteryNoteDescriptionNonVeteran,
} from '../../utils/helpers';

const {
  hasCurrentlyBuried,
} = fullSchemaPreNeed.properties.application.properties;

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
    Find a VA national cemetery
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
    hasCurrentlyBuried: {
      'ui:widget': 'radio',
      'ui:options': {
        updateSchema: formData => {
          let title = '';
          if (isVeteran(formData)) {
            title =
              'Is there anyone currently buried in a VA national cemetery under your eligibility?';
          } else {
            title =
              'Is there anyone currently buried in a VA national cemetery under the sponsor’s eligibility?';
          }
          return { title };
        },
        labels: {
          1: 'Yes',
          2: 'No',
          3: 'I don’t know',
        },
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
        hasCurrentlyBuried,
      },
    },
  },
};
