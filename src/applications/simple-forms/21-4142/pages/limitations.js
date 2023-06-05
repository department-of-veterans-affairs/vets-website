import React from 'react';
import fullSchema from 'vets-json-schema/dist/21-4142-schema.json';
import { schemaFields } from '../definitions/constants';

/** @type {PageSchema} */
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
          providers, describe the limits here. For example, you may want the
          provider to release only treatment dates or certain types of
          disabilities. If you limit consent, it may take us longer to get the
          private medical records.
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
