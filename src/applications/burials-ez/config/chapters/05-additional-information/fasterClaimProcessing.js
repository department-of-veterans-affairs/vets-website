import React from 'react';
import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AltReviewRowView } from '../../../components/ReviewRowView';
import { fasterClaimLabels } from '../../../utils/labels';

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
        Submit any additional information or documents to support your claim as
        soon as you can after you submit your application. We’ll tell you how to
        submit additional supporting documents at the end of this application.
      </div>
    </div>
  </div>
);

export default {
  uiSchema: {
    ...titleUI('Faster claim processing'),
    'ui:description': (
      <p>
        If you've uploaded all your supporting documents, you may be able to get
        a faster decision on your claim. We call this the Fully Developed Claims
        (FDC) program.
      </p>
    ),
    processOption: {
      ...yesNoUI({
        title:
          'Do you want to use the Fully Developed Claims program to apply?',
        labels: fasterClaimLabels,
        required: () => true,
      }),
      'ui:reviewField': AltReviewRowView,
    },
    fdcWarning: {
      'ui:description': FdcWarning,
      'ui:options': {
        expandUnder: 'processOption',
        expandUnderCondition: true,
      },
    },
    noFDCWarning: {
      'ui:description': NoFDCWarning,
      'ui:options': {
        expandUnder: 'processOption',
        expandUnderCondition: false,
      },
    },
  },

  schema: {
    type: 'object',
    properties: {
      processOption: yesNoSchema,
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
