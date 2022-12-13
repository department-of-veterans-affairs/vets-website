import {
  authorizationLabel,
  authorizationInfo,
  reviewField,
} from '../content/evidencePrivateRecordsAuthorization';

import { errorMessages } from '../constants';

export default {
  uiSchema: {
    'ui:title': ' ',
    'ui:options': {
      forceDivWrapper: true,
    },
    'view:evidencePrivateAuth': {
      'ui:description': authorizationInfo,
    },
    privacyAgreementAccepted: {
      'ui:title': authorizationLabel,
      'ui:widget': 'checkbox',
      'ui:options': {
        forceDivWrapper: true,
        showFieldLabel: false,
      },
      'ui:reviewField': reviewField,
      'ui:errorMessages': {
        required: errorMessages.evidence.authorizationRequiredError,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['privacyAgreementAccepted'],
    properties: {
      'view:evidencePrivateAuth': {
        type: 'object',
        properties: {},
      },
      privacyAgreementAccepted: {
        type: 'boolean',
        enum: [true],
      },
    },
  },
};
