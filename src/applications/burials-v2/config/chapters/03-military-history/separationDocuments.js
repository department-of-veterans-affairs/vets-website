import React from 'react';
import { yesNoUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('DD214 or other separation documents'),
    'ui:description': (
      <>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          You can choose one of these options:
        </p>
        <ul className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          <li>
            Upload a copy of the Veteran’s DD214 or other separation documents,{' '}
            <strong>or</strong>
          </li>
          <li>Answer questions about the Veteran’s military history</li>
        </ul>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          Uploading a copy can help us process your application faster. We’ll
          ask you to upload a copy later in this form.
        </p>
        <p className="vads-u-font-size--md vads-u-font-weight--normal vads-u-font-family--sans">
          If you don’t have a copy and need these documents to answer questions
          about military service history, you can request them and finish this
          form later.{' '}
        </p>
        <a
          href="/records/get-military-service-records/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Learn more about requesting military service records (opens in new tab)"
        >
          Learn more about requesting military service records (opens in new
          tab)
        </a>
      </>
    ),
    'view:separationDocuments': {
      ...yesNoUI({
        title:
          'Do you want to upload a copy of the Veteran’s DD214 or other separation documents?',
      }),
      'ui:options': {
        classNames: 'vads-u-margin-bottom--2',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['view:separationDocuments'],
    properties: {
      'view:separationDocuments': {
        type: 'boolean',
        properties: {},
      },
    },
  },
};
