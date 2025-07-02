import React from 'react';

import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI("Confirm your institution's classification"),
  isProprietaryProfit: yesNoUI({
    title: 'Is your institution a proprietary profit school?',
    required: () => true,
    description: () => (
      <div className="vads-u-margin-top--1">
        <va-additional-info trigger="What is a proprietary profit school?">
          <p>
            A proprietary profit school is a privately owned, profit-driven
            institution that offers educational programs and training.
          </p>
        </va-additional-info>
      </div>
    ),
    errorMessages: {
      required: 'Please make a selection',
    },
  }),
};

const schema = {
  type: 'object',
  properties: {
    isProprietaryProfit: yesNoSchema,
  },
  required: ['isProprietaryProfit'],
};

export { schema, uiSchema };
