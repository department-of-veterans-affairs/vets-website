// @ts-check
import React from 'react';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  uiSchema: {
    ...titleUI('What you’ll need to have prepared for your program'),
    'view:programIntro': {
      'ui:description': (
        <div>
          <p>
            To apply for the approval of a program in a foreign country, you
            will need to register at least one program in your application.
          </p>
          <ul>
            <li>The name of the degree program </li>
            <li>The total length of the program</li>
            <li>The number of weeks per term/semester</li>
            <li>Entry requirements, if any, for the program</li>
            <li>Number of credit hours</li>
          </ul>

          <p>
            If the program is a medical program you’ll need to have recent
            program graduate information available in addition to accreditation
            information.
          </p>
          <va-alert status="info" visible>
            <h2 slot="headline">
              Important information about your application
            </h2>
            <p>
              To get approval for a foreign program, your institution must
              submit at least one program for approval. You can still finish and
              submit your application, and we’ll let you know if your
              institution is eligible after we review it.
            </p>
          </va-alert>
        </div>
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:programIntro': { type: 'object', properties: {} },
    },
  },
};
