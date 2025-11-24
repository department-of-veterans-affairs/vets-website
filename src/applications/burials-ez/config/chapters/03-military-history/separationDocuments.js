import React from 'react';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { generateTitle } from '../../../utils/helpers';

export default {
  uiSchema: {
    'ui:title': generateTitle('DD214 or other separation documents'),
    'ui:description': (
      <>
        <p>You can choose one of these options:</p>
        <ul>
          <li>
            Upload a copy of the Veteran’s Certificate of Release or Discharge
            from Active Duty (DD214) or other separation documents,{' '}
            <strong>or</strong>
          </li>
          <li>Answer questions about the Veteran’s military history</li>
        </ul>
        <p aria-live="polite">
          Uploading a copy can help us process your application faster and
          you’ll skip certain questions about the deceased Veteran’s military
          service history.
        </p>
        <p>
          If you don’t have a copy and need these documents to answer questions
          about military service history, you can request them and finish this
          form later.{' '}
        </p>
        <va-link
          href="/records/get-military-service-records/"
          text="Learn more about requesting military service records"
          external
        />
      </>
    ),
    'view:separationDocuments': yesNoUI(
      'Do you want to upload a copy of the Veteran’s DD214 or other separation documents?',
    ),
  },
  schema: {
    type: 'object',
    required: ['view:separationDocuments'],
    properties: {
      'view:separationDocuments': yesNoSchema,
    },
  },
};
