import {
  OptOutTitle,
  OptOutDescription,
  OptOutCheckboxDescription,
} from '../content/OptOutOfOldAppeals';

import OptOutCheckboxWidget from '../components/OptOutCheckboxWidget';
import { errorMessages } from '../constants';
import { optInCheckboxRequired } from '../validations';

const optOutOfOldAppeals = {
  uiSchema: {
    'ui:title': OptOutTitle,
    'ui:description': OptOutDescription,
    legacyOptInApproved: {
      'ui:title': ' ', // Hidden using CSS
      // form "should" be using the ErrorableCheckbox by default, but it
      // seems to be using the regular checkbox component; so use a widget
      'ui:widget': OptOutCheckboxWidget,
      'ui:validations': [optInCheckboxRequired],
      'ui:errorMessages': {
        required: errorMessages.optOutCheckbox,
      },
      'ui:required': () => true,
    },
    'view:OptIndetails': {
      'ui:title': '',
      'ui:description': OptOutCheckboxDescription,
    },
  },

  schema: {
    type: 'object',
    properties: {
      legacyOptInApproved: {
        type: 'boolean',
      },
      'view:OptIndetails': {
        type: 'object',
        properties: {},
      },
    },
  },
};

export default optOutOfOldAppeals;
