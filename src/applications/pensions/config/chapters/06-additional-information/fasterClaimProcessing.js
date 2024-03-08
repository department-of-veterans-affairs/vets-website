import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

const { noRapidProcessing } = fullSchemaPensions.properties;

const fullyDevelopedClaimsLinkText =
  'Learn more about fully developed claims (opens in new tab)';
const Description = (
  <>
    <p>
      If you’ve uploaded all your supporting documents, you may be able to get a
      faster decision on your claim. We call this the Fully Developed Claims
      (FDC) program.
    </p>
    <a
      rel="noopener noreferrer"
      target="_blank"
      href="https://www.va.gov/disability/how-to-file-claim/evidence-needed/fully-developed-claims/"
      aria-label={fullyDevelopedClaimsLinkText}
    >
      {fullyDevelopedClaimsLinkText}
    </a>
  </>
);

export const FdcWarning = (
  <div className="usa-alert usa-alert-info background-color-only">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Your application will be submitted as a fully developed claim.
      </div>
    </div>
  </div>
);

export const NoFDCWarning = (
  <div className="usa-alert usa-alert-info background-color-only">
    <div className="usa-alert-body">
      <div className="usa-alert-text">
        Your application doesn’t qualify for the Fully Developed Claim (FDC)
        program. We’ll review your claim through the standard claim process.
        Please turn in any information to support your claim as soon as you can
        to the address provided after you finish the application.
      </div>
    </div>
  </div>
);

export default {
  uiSchema: {
    ...titleUI('Faster claim processing', Description),
    noRapidProcessing: {
      'ui:title':
        'Do you want to use the Fully Developed Claims program to apply?',
      'ui:widget': 'yesNo',
      'ui:options': {
        yesNoReverse: true,
        labels: {
          Y:
            'Yes. I’ve uploaded all my supporting documents for my pension application.',
          N: 'No. I have other supporting documents to submit later.',
        },
      },
    },
    fdcWarning: {
      'ui:description': FdcWarning,
      'ui:options': {
        expandUnder: 'noRapidProcessing',
        expandUnderCondition: false,
      },
    },
    noFDCWarning: {
      'ui:description': NoFDCWarning,
      'ui:options': {
        expandUnder: 'noRapidProcessing',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['noRapidProcessing'],
    properties: {
      noRapidProcessing,
      fdcWarning: {
        type: 'object',
        properties: {},
      },
      noFDCWarning: {
        type: 'object',
        properties: {},
      },
    },
  },
};
