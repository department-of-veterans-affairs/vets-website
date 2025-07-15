import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import React from 'react';

import { isVeteran, isAuthorizedAgent } from '../../utils/helpers';

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

export function uiSchema(ariaLabel) {
  return {
    application: {
      'ui:title': ' ',
      hasCurrentlyBuried: {
        'ui:widget': 'radio',
        'ui:options': {
          updateSchema: formData => {
            let title = '';
            // Veteran Flow
            if (isVeteran(formData) && !isAuthorizedAgent(formData)) {
              title =
                'Is there anyone currently buried in a VA national cemetery under your eligibility?';
            }
            // Preparer Flow
            else if (isVeteran(formData) && isAuthorizedAgent(formData)) {
              title =
                'Is there anyone currently buried in a VA national cemetery under the applicant’s eligibility?';
            }
            // Sponsor Flow
            else {
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
    'ui:options': {
      itemName: ariaLabel,
    },
  };
}
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
