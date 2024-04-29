import React from 'react';
import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const layOrWitnessHandoffPage = {
  uiSchema: {
    ...titleUI(
      "There's a better way to submit your statement to us",
      undefined,
      1,
      'vads-u-color--black',
    ),
    'view:layOrWitnessContent': {
      'ui:description': (
        <div>
          <p>
            Based on your answer, you should submit your statement with VA Form
            21-10210, Lay/Witness Statement.
          </p>
          <h2>What to know before you submit a lay or witness statement</h2>
          <ul>
            <li>
              You can submit a statement to support your own VA claim or someone
              else’s VA claim. People also sometimes call this a “buddy
              statement.”
            </li>
            <li>
              To submit a statement to support someone else’s claim, you’ll need
              to give us information like their date of birth, Social Security
              number, VA file number (if available), and contact information.
            </li>
            <li>
              Each statement needs its own form. If you want to submit more than
              one statement, use a new form for each statement.
            </li>
          </ul>
          <div
            className="usa-button-primary"
            style={{
              padding: '10px',
            }}
          >
            <a
              className="vads-c-action-link--white"
              href="/supporting-forms-for-claims/lay-witness-statement-form-21-10210/introduction"
            >
              Start your statement
            </a>
          </div>
          <va-omb-info
            res-burden={10}
            omb-number="2900-0881"
            exp-date="06/30/2024"
            style={{
              margin: '10px 0',
            }}
          />
          <div
            style={{
              margin: '10px 0',
            }}
          >
            If you’d like to use VA Form 21-4138 for your statement without
            selecting an answer here, you can{' '}
            <a href="/supporting-forms-for-claims/support-statement-21-4138/name-and-date-of-birth">
              go to VA Form 21-4138 now.
            </a>
          </div>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:layOrWitnessContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};
