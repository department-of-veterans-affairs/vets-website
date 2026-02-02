import React from 'react';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import {
  currentOrPastDateSchema,
  currentOrPastDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import VaDateField from 'platform/forms-system/src/js/web-component-fields/VaDateField';
import { wrapDateUiWithDl } from '../helpers/reviewHelpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Section III: Employment'),
    'ui:description': (
      <div>
        <VaAlert status="info" class="vads-u-margin-top--3" uswds visible>
          <h2 slot="headline">
            <b>What to expect:</b>
          </h2>
          <div className="vads-u-margin--0">
            <ul style={{ marginBottom: 0 }}>
              <li>When your disability began affecting your work</li>
              <li>Date you last worked full-time</li>
              <li>
                Employment details for the last 5 years you worked (employer
                names, addresses, dates, job duties)
              </li>
              <li>Your highest annual earnings and what year</li>
              <li>Current income information (if working)</li>
              <li>Whether you've tried to find work since becoming disabled</li>

              <li>Takes about 20-25 minutes (longest section)</li>
            </ul>
          </div>
        </VaAlert>
        <div className="vads-u-margin-top--5">
          <h2 style={{ marginTop: 0 }}>Employment Timeline</h2>
          <p>When did your disability affect your work?</p>
        </div>
      </div>
    ),
    disabilityDate: wrapDateUiWithDl({
      ...currentOrPastDateUI({
        title: 'Date your disability affected full-time employment',
        hint: 'For example: January 19 2022',
      }),
      'ui:webComponentField': VaDateField,
    }),

    lastWorkedDate: wrapDateUiWithDl({
      ...currentOrPastDateUI({
        title: 'Date you last worked full-time',
        hint: 'For example: January 19 2022',
      }),
      'ui:webComponentField': VaDateField,
    }),
    disabledWorkDate: wrapDateUiWithDl({
      ...currentOrPastDateUI({
        title: 'Date you became too disabled to work',
        hint: 'For example: January 19 2022',
      }),
      'ui:webComponentField': VaDateField,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      disabilityDate: currentOrPastDateSchema,
      lastWorkedDate: currentOrPastDateSchema,
      disabledWorkDate: currentOrPastDateSchema,
    },
    required: ['disabilityDate', 'lastWorkedDate', 'disabledWorkDate'],
  },
};
