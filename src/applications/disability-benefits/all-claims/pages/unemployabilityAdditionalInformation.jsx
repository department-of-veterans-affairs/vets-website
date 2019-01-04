import React from 'react';
import { unemployabilityTitle } from '../content/unemployabilityFormIntro';

const additionalInformationDescription = (
  <div>
    <h4>Additional Information</h4>
    <p>
      If there is any other information you would like to provide as part of
      your claim, please add it here.
    </p>
    <p>
      It‘s important to tell us why your service-connected disability is the
      reason you‘re no longer able to work. Providing specific examples will
      help us understand your claim.
    </p>
    <p>
      If you‘ve left one or more jobs because of your service-connected
      disabilities, please note that.
    </p>
  </div>
);

export const uiSchema = {
  'ui:title': unemployabilityTitle,
  'ui:description': additionalInformationDescription,
  unemployability: {
    remarks: {
      'ui:title': ' ',
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        maxLength: 3200,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    unemployability: {
      type: 'object',
      properties: {
        remarks: {
          type: 'string',
        },
      },
    },
  },
};
