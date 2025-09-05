import React from 'react';
import { useSelector } from 'react-redux';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
// Reuse (copy) the autosuggest definition & field from pre-need into this app:
//   src/applications/time-of-need/definitions/autosuggest.js
//   src/applications/time-of-need/components/AutosuggestField.jsx
import * as autosuggest from '../../definitions/autosuggest';
import { getCemeteries, isAuthorizedAgent } from '../../utils/helpers';

function DesiredCemeteryTitle() {
  const data = useSelector(state => state.form?.data || {});
  // Adjust wording if needed for your workflow
  return isAuthorizedAgent(data)
    ? 'Which VA national cemetery would the applicant prefer to be buried in?'
    : 'Which VA national cemetery would you prefer to be buried in?';
}

export const desiredCemeteryDynamicTitle = <DesiredCemeteryTitle />;

const noteId = 'desired-cemetery-note';

const link = (
  <p className="vads-u-margin-top--2">
    <a
      href="https://www.cem.va.gov/cem/cems/listcem.asp"
      target="_blank"
      rel="noopener noreferrer"
    >
      Find a VA national cemetery (opens in a new tab)
    </a>
  </p>
);

const note = (
  <div className="vads-u-margin-top--2" id={noteId}>
    <p className="vads-u-font-weight--bold vads-u-margin-bottom--1">
      Please note:
    </p>
    <p className="vads-u-margin--0">
      This doesn’t guarantee the deceased will be buried in your preferred
      cemetery, but we’ll try to fulfill your wishes. If space is unavailable,
      we’ll work to assign a gravesite in a cemetery with available space.
    </p>
  </div>
);

export default {
  uiSchema: {
    ...titleUI('Desired cemetery for burial of deceased'),
    // Autosuggest field (replaces simple text field)
    desiredCemetery: autosuggest.uiSchema(
      desiredCemeteryDynamicTitle,
      getCemeteries,
      {
        'ui:required': () => true,
        'ui:errorMessages': { required: 'Enter or select a desired cemetery' },
        'ui:options': {
          inputProps: {
            'aria-describedby': noteId,
          },
        },
      },
    ),
    'view:cemeteryHelp': {
      'ui:description': (
        <div>
          {link}
          {note}
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      // Match autosuggest.schema (string or object depending on your copied implementation)
      desiredCemetery: autosuggest.schema,
      'view:cemeteryHelp': {
        type: 'object',
        properties: {},
      },
    },
    required: ['desiredCemetery'],
  },
};
