import React from 'react';
import {
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { allowanceLabels } from '../../../utils/labels';
import { generateHelpText, generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('Type of burial allowance'),
    burialAllowanceRequested: {
      ...checkboxGroupUI({
        title: 'What type of burial allowance are you claiming?',
        required: true,
        labels: allowanceLabels,
      }),
      'ui:description': (
        <div className="vads-u-margin-top--0p5">
          {generateHelpText('Check any that apply to you')}
        </div>
      ),
      'ui:options': {
        classNames: 'vads-u-margin-top--0 vads-u-margin-bottom--2',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['burialAllowanceRequested'],
    properties: {
      burialAllowanceRequested: {
        ...checkboxGroupSchema(['service', 'nonService', 'unclaimed']),
      },
    },
  },
};
