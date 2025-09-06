import React from 'react';
import {
  yesNoSchema,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../components/AutoSaveNotice';

const servedUnderAnotherNameUI = {
  ...yesNoUI({
    title: 'Did the deceased serve under another name?',
    required: true,
    errorMessages: {
      required: 'Please select Yes or No',
    },
  }),
  'ui:required': () => true,
};

export default {
  uiSchema: {
    'ui:description': <AutoSaveNotice />,
    servedUnderAnotherName: servedUnderAnotherNameUI,
  },
  schema: {
    type: 'object',
    properties: {
      servedUnderAnotherName: yesNoSchema,
    },
    required: ['servedUnderAnotherName'],
  },
};
