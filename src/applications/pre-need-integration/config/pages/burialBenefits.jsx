import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import React from 'react';

import { isVeteran } from '../../utils/helpers';

const {
  hasCurrentlyBuried,
} = fullSchemaPreNeed.properties.application.properties;

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

export const uiSchema = {
  application: {
    'ui:title': ' ',
    hasCurrentlyBuried: {
      'ui:widget': 'radio',
      'ui:options': {
        updateSchema: formData => {
          let title = '';
          if (isVeteran(formData)) {
            title =
              'Is there anyone currently buried in a VA national cemetery under the applicant’s eligibility?';
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
        hasCurrentlyBuried,
      },
    },
  },
};
