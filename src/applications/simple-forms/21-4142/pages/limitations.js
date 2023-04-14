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
          If you want to limit what we can request from the private medical
          provider(s), describe the limits here (for example, you want the
          doctor to release only treatment dates or certain types of
          disabilities). It may take us longer to get the private medical
          records if you limit consent.
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
