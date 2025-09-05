import React from 'react';
import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../components/AutoSaveNotice';

export default {
  uiSchema: {
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">Your details</h3>
        <p className="vads-u-margin-top--1">
          Since you’re filling out this application, you’ll need to provide your
          details in case we need to contact you.
        </p>
      </>
    ),
    firstName: {
      ...textUI({
        title: 'Your first name',
        errorMessages: { required: 'Enter your first name' },
      }),
      'ui:required': () => true,
    },
    lastName: {
      ...textUI({
        title: 'Your last name',
        errorMessages: { required: 'Enter your last name' },
      }),
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      firstName: textSchema,
      lastName: textSchema,
    },
    required: ['firstName', 'lastName'],
  },
};
