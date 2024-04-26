import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { AltReviewRowView } from '../../../components/ReviewRowView';
import { fasterClaimLabels } from '../../../utils/labels';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Faster claim processing'),
    'ui:description': (
      <>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          If you've uploaded all your supporting documents, you may be able to
          get a faster decision on your claim. We call this the Fully Developed
          Claims (FDC) program.
        </p>
      </>
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
  },

  schema: {
    type: 'object',
    properties: {
      processOption: yesNoSchema,
    },
  },
};
