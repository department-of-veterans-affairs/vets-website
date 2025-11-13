import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import * as autosuggest from '../../../definitions/autosuggest';
import { getCemeteries } from '../../../utils/helpers';

// Updated static content per new copy

const noteId = 'desired-cemetery-note';

const note = (
  <div className="vads-u-margin-top--2" id={noteId}>
    <p className="vads-u-font-weight--bold vads-u-margin-bottom--1">Note:</p>
    <p className="vads-u-margin--0">
      This doesn’t guarantee the Veteran will be buried in their preferred
      cemetery, but we’ll try to fulfill their wishes. If space is unavailable,
      we’ll work with the family to assign a gravesite in a cemetery with
      available space.
    </p>
  </div>
);

const link = (
  <p className="vads-u-margin-top--2">
    <a
      href="https://www.cem.va.gov/cem/cems/listcem.asp"
      target="_blank"
      rel="noopener noreferrer"
    >
      Find a cemetery (Opens in a new tab)
    </a>
  </p>
);

export default {
  uiSchema: {
    ...titleUI('National cemetery requested'),
    desiredCemetery: autosuggest.uiSchema(
      // Field label (matches line under heading)
      'Enter the name of the cemetery you are requesting for burial',
      getCemeteries,
      {
        'ui:required': () => true,
        'ui:errorMessages': {
          required: 'Enter the name of the cemetery',
        },
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
          {note}
          {link}
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    required: ['desiredCemetery'],
    properties: {
      desiredCemetery: autosuggest.schema,
      'view:cemeteryHelp': {
        type: 'object',
        properties: {},
      },
    },
  },
};
