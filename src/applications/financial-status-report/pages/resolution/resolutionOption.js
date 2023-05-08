import React from 'react';
import ResolutionOptions from '../../components/ResolutionOptions';
import CustomResolutionOptionReview from '../../components/CustomResolutionOptionReview';
import { CurrentDebtTitle } from '../../components/CurrentDebtTitle';
import { validateResolutionOption } from '../../utils/validations';

export const uiSchema = {
  selectedDebtsAndCopays: {
    items: {
      'ui:title': CurrentDebtTitle,
      'ui:description': () => (
        <>
          Select relief option:{' '}
          <span className="required-text">(*Required)</span>
        </>
      ),
      'ui:validations': [validateResolutionOption],
      resolutionOption: {
        'ui:title': ' ',
        'ui:reviewField': CustomResolutionOptionReview,
        'ui:widget': ResolutionOptions,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebtsAndCopays: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          resolutionOption: {
            type: 'string',
          },
        },
      },
    },
  },
};
