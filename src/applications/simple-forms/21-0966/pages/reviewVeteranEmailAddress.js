import React from 'react';
import {
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Email address'),
    reviewedVeteranEmail: emailToSendNotificationsUI(),
    'view:additionalInfo': {
      'ui:description': (
        <p className="vads-u-margin-top--4">
          You can also change this information in your VA.gov profile.
          <va-link
            href="/profile/contact-information"
            text="Update your VA.gov profile"
            external
          />
        </p>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      reviewedVeteranEmail: emailToSendNotificationsSchema,
      'view:additionalInfo': {
        type: 'object',
        properties: {},
      },
    },
    required: ['reviewedVeteranEmail'],
  },
};
