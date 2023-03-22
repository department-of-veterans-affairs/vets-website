import React from 'react';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { schemaFields } from '../definitions/constants';

export default {
  uiSchema: {
    [schemaFields.limitedConsent]: {
      'ui:title': (
        <h3 className="vads-u-color--gray-dark vads-u-margin-top--0">
          Do you want to limit the information we can request?
        </h3>
      ),
      'ui:description': (
        <p>
          If you want to limit what we can request from your private medical
          provider(s), describe the limits here (for example, you want your
          doctor to release only treatment dates or certain types of
          disability), it may take us longer to get your private medical
          recordsif you limit consent.
        </p>
      ),
      'ui:widget': 'textarea',
    },
  },
  schema: {
    type: 'object',
    properties: {
      [schemaFields.limitedConsent]:
        fullSchema.properties[schemaFields.limitedConsent],
    },
  },
};
