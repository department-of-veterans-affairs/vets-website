import React from 'react';
import {
  textUI,
  textSchema,
  phoneUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutoSaveNotice from '../../components/AutoSaveNotice';

export default {
  uiSchema: {
    // Auto-save notice before heading
    'ui:description': (
      <>
        <AutoSaveNotice />
        <h3 className="vads-u-margin-top--0">Funeral home details</h3>
      </>
    ),

    funeralHomeName: {
      ...textUI({
        title: 'Funeral home name',
        errorMessages: { required: 'Enter the funeral home name' },
      }),
      'ui:required': () => true,
    },

    primaryPhoneNumber: phoneUI({
      title: 'Primary phone number',
      errorMessages: {
        required: 'Enter the primary phone number',
        pattern: 'Enter a valid U.S. phone number',
      },
      required: () => true,
    }),

    faxNumber: phoneUI({
      title: 'Fax number',
      errorMessages: {
        required: 'Enter the fax number',
        pattern: 'Enter a valid U.S. fax number',
      },
      required: () => true,
    }),

    lastDateOfContact: currentOrPastDateUI({
      title: 'Last date of contact',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Enter the last date of contact',
      },
    }),

    'view:lastContactHelp': {
      'ui:description': (
        <va-additional-info trigger="What does “date of last contact” mean?">
          <p className="vads-u-margin--0">
            Date of last contact is the date in which the preparer last had
            contact with the funeral home.
          </p>
        </va-additional-info>
      ),
    },
  },

  schema: {
    type: 'object',
    properties: {
      funeralHomeName: textSchema,
      primaryPhoneNumber: {
        type: 'string',
        pattern: '^(?:\\+?1)?\\d{10}$',
        title: 'Primary phone number',
      },
      faxNumber: {
        type: 'string',
        pattern: '^(?:\\+?1)?\\d{10}$',
        title: 'Fax number',
      },
      lastDateOfContact: currentOrPastDateSchema,
      'view:lastContactHelp': {
        type: 'object',
        properties: {},
      },
    },
    required: [
      'funeralHomeName',
      'primaryPhoneNumber',
      'faxNumber',
      'lastDateOfContact',
    ],
  },
};
