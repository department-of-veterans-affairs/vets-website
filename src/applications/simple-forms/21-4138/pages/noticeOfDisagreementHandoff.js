import React from 'react';
import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export const noticeOfDisagreementHandoffPage = {
  uiSchema: {
    ...titleUI(
      "There's a better way for you to ask for a decision review",
      undefined,
      1,
      'vads-u-color--black',
    ),
    'view:layOrWitnessContent': {
      'ui:description': (
        <div>
          <p>
            Since it’s been more than 1 year since we made a decision, you
            should file a <strong>Supplemental claim.</strong>
          </p>
          <p>
            We can help you gather any new evidence you identify (such as
            medical records) to support your claim.
          </p>
          <p>
            A reviewer will decide if this new evidence changes the decision.
          </p>
          <div
            className="usa-button-primary"
            style={{
              padding: '12px',
            }}
          >
            <a
              className="vads-c-action-link--white"
              href="/decision-reviews/supplemental-claim/file-supplemental-claim-form-20-0995/start"
            >
              File a Supplemental Claim online
            </a>
          </div>
          <div
            style={{
              margin: '10px 0',
            }}
          >
            <a
              href="/decision-reviews/supplemental-claim/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more about supplemental claims (opens in new tab)
            </a>
          </div>
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
