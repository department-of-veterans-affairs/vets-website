import React from 'react';
import {
  titleUI,
  yesNoSchema,
  yesNoUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Your Veteran or service member status'),
  veteranStatus: yesNoUI({
    title:
      'Are you a Veteran or service member who has completed 3 years (36 months) of active duty service upon application?',
    errorMessages: {
      required: 'Please select an option',
    },
  }),
  'view:veteranStatusInfoAlert': {
    'ui:description': (
      <va-alert slim status="info">
        To qualify for the VET TEC 2.0 Program, you must be a Veteran who served
        at least 36 months of qualifying service upon application, or be a
        service member with 36 months of qualifying service upon submission and
        be within 180 days of discharge. You must also be under the age of 62 at
        the time of application.
      </va-alert>
    ),
    'ui:options': {
      hideIf: formData =>
        formData?.veteranStatus === true ||
        formData?.veteranStatus === undefined,
    },
  },
};
const schema = {
  type: 'object',
  properties: {
    veteranStatus: yesNoSchema,
    'view:veteranStatusInfoAlert': {
      type: 'object',
      properties: {},
    },
  },
  required: ['veteranStatus'],
};

export { uiSchema, schema };
